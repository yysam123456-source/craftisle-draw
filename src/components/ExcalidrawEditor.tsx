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
  onSave?: (elements: any[], appState: any) => void
}

/**
 * Custom styles injected once to:
 * 1. Hide Help dialog links (Documentation, Blog, Submit, YouTube)
 * 2. Force toolbar to always remain visible during operations
 */
function injectExcalidrawStyles() {
  if (typeof document === "undefined") return
  const styleId = "craftisle-excalidraw-overrides"
  if (document.getElementById(styleId)) return
  const style = document.createElement("style")
  style.id = styleId
  style.textContent = `
    /* Hide Help section external links (Documentation, Blog, Submit, YouTube) */
    .HelpDialog__links,
    .help-dialog .link-list,
    .excalidraw-wrapper a[href*="docs.excalidraw"],
    .excalidraw-wrapper a[href*="blog.excalidraw"],
    .excalidraw-wrapper a[href*="github.com/issues"],
    .excalidraw-wrapper a[href*="youtube.com"] {
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

  // Inject custom styles on mount
  useEffect(() => {
    injectExcalidrawStyles()
  }, [])

  // Initialize API ref
  const onExcalidrawAPIReady = useCallback((api: any) => {
    excalidrawRef.current = api
  }, [])

  // Debounced auto-save
  const debouncedSave = useCallback(
    (elements: any[], appState: any) => {
      if (!onSave) return
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        onSave([...elements], { ...appState })
      }, 3000)
    },
    [onSave]
  )

  // Listen for canvas changes
  const onChange = useCallback(
    (elements: readonly any[], appState: any, files: any) => {
      debouncedSave([...elements], { ...appState })
    },
    [debouncedSave]
  )

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
        <div className="absolute top-4 right-4 z-50">
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
