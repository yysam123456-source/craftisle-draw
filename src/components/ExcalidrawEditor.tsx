"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Excalidraw,
} from "@excalidraw/excalidraw"
import "@excalidraw/excalidraw/index.css"

interface ExcalidrawEditorProps {
  boardId: string
  initialData?: {
    elements?: any[]
    appState?: any
  }
  readOnly?: boolean
  onSave?: (elements: any[], appState: any, opts?: { thumbnail?: string }) => void
}

/**
 * Custom styles injected once to:
 * 1. Hide ALL external/branding links (GitHub, X/Twitter, Docs, Blog, YouTube, etc.)
 * 2. Force toolbar to always remain visible during operations
 */
function injectExcalidrawStyles() {
  if (typeof document === "undefined") return
  const styleId = "craftisle-excalidraw-overrides"
  if (document.getElementById(styleId)) return
  const style = document.createElement("style")
  style.id = styleId
  style.textContent = `
    /* Hide ALL external/branding links in Excalidraw UI */
    .excalidraw-wrapper a[href*="github.com"],
    .excalidraw-wrapper a[href*="x.com"],
    .excalidraw-wrapper a[href*="twitter.com"],
    .excalidraw-wrapper a[href*="youtube.com"],
    .excalidraw-wrapper a[href*="docs.excalidraw"],
    .excalidraw-wrapper a[href*="blog.excalidraw"],
    .HelpDialog__links,
    .help-dialog .link-list,
    .help-dialog .external-links,
    [class*="HelpDialog"] a:not([class*="button"]):not([role="button"]) {
      display: none !important;
    }

    /* Force fixed toolbar (tools + shapes row) to never hide or fade */
    .excalidraw-toolbar,
    .FixedSideContainer__toolbar {
      opacity: 1 !important;
      pointer-events: auto !important;
      visibility: visible !important;
      transition: none !important;
    }

    /* Prevent toolbar from fading during drag/resize/draw operations */
    .is-dragging .excalidraw-toolbar,
    .is-resizing .excalidraw-toolbar,
    .is-drawing .excalidraw-toolbar,
    .is-binding-elements .excalidraw-toolbar {
      opacity: 1 !important;
      visibility: visible !important;
    }
  `
  document.head.appendChild(style)
}

export default function ExcalidrawEditor({
  boardId,
  initialData,
  readOnly = false,
  onSave,
}: ExcalidrawEditorProps) {
  const excalidrawRef = useRef<any>(null)
  const saveTimerRef = useRef<any>(null)
  const [exporting, setExporting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  // Inject custom styles on mount
  useEffect(() => {
    injectExcalidrawStyles()
  }, [])

  // Initialize API ref
  const onExcalidrawAPIReady = useCallback((api: any) => {
    excalidrawRef.current = api
    // Expose API to window for debugging
    if (typeof window !== "undefined") (window as any).__excalidrawAPI = api
  }, [])

  // Generate thumbnail: export PNG → resize to 200x150 → base64
  const generateThumbnail = useCallback(async (): Promise<string | null> => {
    if (!excalidrawRef.current) {
      console.error("[thumb] no excalidrawRef")
      return null
    }
    try {
      console.log("[thumb] starting exportToBlob...")
      const blob: Blob = await excalidrawRef.current.exportToBlob({
        elements: excalidrawRef.current.getSceneElements(),
        appState: excalidrawRef.current.getAppState(),
        files: excalidrawRef.current.getFiles(),
        exportPadding: 8,
      })
      console.log("[thumb] exportToBlob success, blob size:", blob.size)
      // Resize to 200x150 using Canvas
      const img = new Image()
      const url = URL.createObjectURL(blob)
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = (e) => reject(e)
        img.src = url
      })
      URL.revokeObjectURL(url)
      const canvas = document.createElement("canvas")
      canvas.width = 200
      canvas.height = 150
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0, 200, 150)
      const resizedBlob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) resolve(blob)
            else reject(new Error("Canvas toBlob returned null"))
          },
          "image/jpeg",
          0.6
        )
      })
      console.log("[thumb] resized blob size:", resizedBlob.size)
      // Convert to base64
      const reader = new FileReader()
      const base64: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(resizedBlob)
      })
      console.log("[thumb] base64 generated, length:", base64.length)
      return base64
    } catch (err) {
      console.error("[thumb] generation failed:", err)
      return null
    }
  }, [])

  // Debounced auto-save with status feedback
  const debouncedSave = useCallback(
    (elements: any[], appState: any) => {
      if (!onSave) return
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      setSaveStatus("saving")
      saveTimerRef.current = setTimeout(async () => {
        try {
          // Generate thumbnail in background
          const thumbnail = await generateThumbnail()
          await onSave([...elements], { ...appState }, { thumbnail: thumbnail ?? undefined })
          setSaveStatus("saved")
          setTimeout(() => setSaveStatus("idle"), 2000)
        } catch (err) {
          console.error("Auto-save failed:", err)
          setSaveStatus("error")
          setTimeout(() => setSaveStatus("idle"), 3000)
        }
      }, 2000)
    },
    [onSave, generateThumbnail]
  )

  // Listen for canvas changes
  const onChange = useCallback(
    (elements: readonly any[], appState: any, files: any) => {
      debouncedSave([...elements], { ...appState })
    },
    [debouncedSave]
  )

  // Export handler: PNG / SVG / JSON
  useEffect(() => {
    const handler = (e: any) => {
      const { format, boardId } = e.detail
      if (!excalidrawRef.current) return
      if (format === "png") {
        exportPNG()
      } else if (format === "svg") {
        exportSVG()
      } else if (format === "json") {
        exportJSON(boardId)
      }
    }
    window.addEventListener("craftisle-export", handler as any)
    return () => window.removeEventListener("craftisle-export", handler as any)
  }, [exporting])

  // Export as SVG (client-side)
  const exportSVG = useCallback(async () => {
    if (!excalidrawRef.current) return
    try {
      const blob: Blob = await excalidrawRef.current.exportToBlob({
        elements: excalidrawRef.current.getSceneElements(),
        appState: excalidrawRef.current.getAppState(),
        files: excalidrawRef.current.getFiles(),
        mimeType: "image/svg+xml",
        exportPadding: 16,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `board-${boardId}.svg`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("SVG export failed:", err)
    }
  }, [boardId])

  // Export as JSON (raw data)
  const exportJSON = useCallback((boardId: string) => {
    if (!excalidrawRef.current) return
    const data = {
      elements: excalidrawRef.current.getSceneElements(),
      appState: excalidrawRef.current.getAppState(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `board-${boardId}.excalidraw`
    a.click()
    URL.revokeObjectURL(url)
  }, [boardId])

  // Export as PNG (client-side)
  const exportPNG = useCallback(async () => {
    if (!excalidrawRef.current || exporting) return
    setExporting(true)
    try {
      const blob: Blob = await excalidrawRef.current.exportToBlob({
        elements: excalidrawRef.current.getSceneElements(),
        appState: excalidrawRef.current.getAppState(),
        files: excalidrawRef.current.getFiles(),
        exportPadding: 16,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `board-${boardId}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export failed:", err)
    } finally {
      setExporting(false)
    }
  }, [boardId, exporting])

  return (
    <div className="w-full h-screen flex flex-col relative">
      {!readOnly && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
          {/* Auto-save status indicator */}
          {saveStatus !== "idle" && (
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${
                saveStatus === "saving"
                  ? "bg-yellow-100 text-yellow-700"
                  : saveStatus === "saved"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {saveStatus === "saving" && "Saving..."}
              {saveStatus === "saved" && "Saved"}
              {saveStatus === "error" && "Save failed"}
            </span>
          )}
          <button
            onClick={exportPNG}
            disabled={exporting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Export PNG"}
          </button>
        </div>
      )}
      <div className="flex-1 min-h-0">
        <Excalidraw
          excalidrawAPI={onExcalidrawAPIReady}
          initialData={initialData}
          onChange={readOnly ? undefined : onChange}
          viewModeEnabled={readOnly}
          zenModeEnabled={false}
          gridModeEnabled={true}
          theme="light"
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: true,
              clearCanvas: true,
              export: { saveFileToDisk: true },
              loadScene: false,
              saveToActiveFile: false,
              toggleTheme: null,
              saveAsImage: false,
            },
            tools: {
              image: true,
            },
          }}
        />
      </div>
    </div>
  )
}
