"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Excalidraw,
  exportToBlob,
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
    .excalidraw-wrapper a[href*="discord.gg"],
    .excalidraw-wrapper a[href*="discord.com"],
    .HelpDialog__links,
    .help-dialog .link-list,
    .help-dialog .external-links,
    [class*="HelpDialog"] a:not([class*="button"]):not([role="button"]),
    /* Hide entire "Excalidraw links" section in hamburger menu */
    .dropdown-menu [class*="links"],
    .layer-ui__wrapper .dropdown-menu > :has(> a[href*="github"]),
    /* Hide Help dialog link sections */
    .Modal__content [class*="link"]:not([class*="button"]),
    .dialog__links {
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

    /* Keep Excalidraw inside its container, don't overflow into top bar */
    .excalidraw-wrapper,
    .excalidraw-container {
      position: relative !important;
      height: 100% !important;
      overflow: hidden !important;
    }

    /* Ensure layer-ui doesn't escape bounds */
    .layer-ui__wrapper {
      position: absolute !important;
      z-index: 1 !important;
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

  // Generate thumbnail: export PNG → resize to 240x180 → base64
  const generateThumbnail = useCallback(async (): Promise<string | null> => {
    if (!excalidrawRef.current) {
      console.error("[thumb] no excalidrawRef")
      return null
    }
    try {
      const elements = excalidrawRef.current.getSceneElements()
      // Don't generate thumbnail if canvas is empty
      if (!elements || elements.length === 0) {
        console.log("[thumb] no elements, skipping")
        return null
      }
      const appState = excalidrawRef.current.getAppState()
      const files = excalidrawRef.current.getFiles()
      console.log("[thumb] starting exportToBlob, elements:", elements.length)

      // exportToBlob is a standalone import from @excalidraw/excalidraw, NOT an API method
      let blob: Blob | null = null
      try {
        blob = await exportToBlob({
          elements,
          appState,
          files,
          exportPadding: 20,
          dimensions: { width: 800, height: 600 },
        })
      } catch (dimErr: any) {
        console.warn("[thumb] dimensions export failed, trying auto:", dimErr?.message || dimErr)
        try {
          blob = await exportToBlob({
            elements,
            appState,
            files,
            exportPadding: 20,
          })
        } catch (autoErr: any) {
          console.error("[thumb] auto export also failed:", autoErr?.message || autoErr)
          return null
        }
      }

      if (!blob) {
        console.warn("[thumb] blob is null")
        return null
      }

      console.log("[thumb] exportToBlob success, blob size:", blob.size, "type:", blob.type)

      // Resize to 240x180 using Canvas
      const img = new Image()
      const url = URL.createObjectURL(blob)
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = (e) => reject(e)
        img.src = url
      })
      URL.revokeObjectURL(url)

      if (img.width === 0 || img.height === 0) {
        console.warn("[thumb] image has zero dimensions")
        return null
      }

      const canvas = document.createElement("canvas")
      canvas.width = 240
      canvas.height = 180
      const ctx = canvas.getContext("2d")
      // Fill white background
      ctx!.fillStyle = "#ffffff"
      ctx!.fillRect(0, 0, 240, 180)
      // Draw image centered with contain fit
      const scale = Math.min(240 / img.width, 180 / img.height)
      const w = img.width * scale
      const h = img.height * scale
      const x = (240 - w) / 2
      const y = (180 - h) / 2
      ctx!.drawImage(img, x, y, w, h)

      const resizedBlob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b: Blob | null) => b ? resolve(b) : reject(new Error("toBlob returned null")),
          "image/jpeg",
          0.7,
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
      console.log("[thumb] done, base64 length:", base64.length)
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
      const blob: Blob = await exportToBlob({
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
      const blob: Blob = await exportToBlob({
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
    <div className="w-full h-full flex flex-col relative overflow-hidden">
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
