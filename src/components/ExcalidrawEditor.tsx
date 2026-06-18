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
 * Remove Excalidraw branding/external links from the DOM.
 * Runs repeatedly via MutationObserver + setInterval belt-and-suspenders.
 */
function setupLinkRemover() {
  if (typeof document === "undefined") return

  const REMOVE_SELECTORS = [
    // Direct link elements by text content
    'a[href*="github.com"]',
    'a[href*="x.com"]',
    'a[href*="twitter.com"]',
    'a[href*="youtube.com"]',
    'a[href*="docs.excalidraw"]',
    'a[href*="blog.excalidraw"]',
    'a[href*="discord.gg"]',
    'a[href*="discord.com"]',
  ]

  function removeLinks() {
    // 1. Remove all external link <a> tags within Excalidraw
    for (const sel of REMOVE_SELECTORS) {
      document.querySelectorAll(`.excalidraw-wrapper ${sel}`).forEach(el => {
        el.remove()
      })
    }

    // 2. Find and remove the entire "Excalidraw links" section
    // It appears as an h3 "Excalidraw links" followed by sibling divs with GitHub/Follow/Discord
    const allH3 = document.querySelectorAll('.excalidraw-wrapper h3')
    for (const h3 of allH3) {
      if (h3.textContent && h3.textContent.includes('Excalidraw')) {
        // Remove the heading itself
        h3.remove()
      }
    }

    // 3. Also catch "Follow us", "Discord chat" text - remove their parent containers
    const wrapper = document.querySelector('.excalidraw-wrapper')
    if (wrapper) {
      walker: for (const el of wrapper.querySelectorAll('*')) {
        const text = el.textContent?.trim() || ''
        if ((text === 'Follow us' || text === 'Discord chat' || text === 'GitHub') &&
            el.children.length === 0) {
          // Walk up to find the clickable row container and remove it
          let parent = el.parentElement
          for (let i = 0; i < 5 && parent; i++) {
            // Look for a container that looks like a menu item row
            if (parent.tagName === 'DIV' || parent.tagName === 'A') {
              const pt = parent.textContent?.trim() || ''
              if ((pt.includes('GitHub') || pt.includes('Follow us') || pt.includes('Discord')) &&
                  !pt.includes('Save to') && !pt.includes('Find on') &&
                  !pt.includes('Help') && !pt.includes('Reset')) {
                parent.remove()
                continue walker
              }
            }
            parent = parent.parentElement
          }
        }
      }
    }

    // 4. Clean up orphaned "Canvas background" heading separators if needed
    // (no-op — keep Canvas background)
  }

  // Run immediately
  removeLinks()

  // Run on every DOM change (menu open/close renders new elements)
  const observer = new MutationObserver(() => {
    removeLinks()
  })
  const target = document.querySelector('.excalidraw-wrapper')
  if (target) {
    observer.observe(target, { childList: true, subtree: true })
  }

  // Belt-and-suspenders: run every 500ms for first 10 seconds (catches lazy-rendered menus)
  let ticks = 0
  const interval = setInterval(() => {
    removeLinks()
    ticks++
    if (ticks > 20) clearInterval(interval)
  }, 500)

  return () => {
    observer.disconnect()
    clearInterval(interval)
  }
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

  // Remove Excalidraw branding links via JS DOM removal
  useEffect(() => {
    const cleanup = setupLinkRemover()
    return cleanup
  }, [])

  // Initialize API ref
  const onExcalidrawAPIReady = useCallback((api: any) => {
    excalidrawRef.current = api
    if (typeof window !== "undefined") (window as any).__excalidrawAPI = api
  }, [])

  // ── Load & inject libraries from our own localStorage key ──
  const injectLibraries = useCallback(async (api: any) => {
    try {
      const raw = localStorage.getItem("craftisle-imported-libs")
      if (!raw) return
      const files: string[] = JSON.parse(raw)
      if (!files || files.length === 0) return

      const allItems: any[][] = []
      for (const file of files) {
        try {
          const res = await fetch(`/libraries/${file}`)
          if (!res.ok) continue
          const data = await res.json()
          const items = data?.libraryItems
          if (Array.isArray(items)) {
            for (const item of items) {
              if (item?.elements && Array.isArray(item.elements)) {
                allItems.push(item.elements)
              }
            }
          } else if (data?.library && Array.isArray(data.library)) {
            allItems.push(...data.library)
          }
        } catch { /* skip */ }
      }

      if (allItems.length > 0 && api?.updateLibrary) {
        console.log(`[lib] Injecting ${allItems.length} library items into Excalidraw via updateLibrary()`)
        await api.updateLibrary({
          libraryItems: allItems,
          merge: true,
          defaultStatus: "published",
          openLibraryMenu: true,
        })
      }
    } catch (err) {
      console.error("[lib] Failed to inject libraries:", err)
    }
  }, [])

  // When API is ready, inject libraries
  useEffect(() => {
    if (excalidrawRef.current) {
      injectLibraries(excalidrawRef.current)
    }
  }, [excalidrawRef.current, injectLibraries])

  // Also listen for custom event when user imports new lib without refresh
  useEffect(() => {
    const handler = () => {
      if (excalidrawRef.current) {
        injectLibraries(excalidrawRef.current)
      }
    }
    window.addEventListener("craftisle-library-changed", handler)
    return () => window.removeEventListener("craftisle-library-changed", handler)
  }, [excalidrawRef.current, injectLibraries])

  // Generate thumbnail: export PNG → resize to 240x180 → base64
  const generateThumbnail = useCallback(async (): Promise<string | null> => {
    if (!excalidrawRef.current) {
      console.error("[thumb] no excalidrawRef")
      return null
    }
    try {
      const elements = excalidrawRef.current.getSceneElements()
      if (!elements || elements.length === 0) {
        console.log("[thumb] no elements, skipping")
        return null
      }
      const appState = excalidrawRef.current.getAppState()
      const files = excalidrawRef.current.getFiles()
      console.log("[thumb] starting exportToBlob, elements:", elements.length)

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
      ctx!.fillStyle = "#ffffff"
      ctx!.fillRect(0, 0, 240, 180)
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

      const reader = new FileReader()
      const base64: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(resizedBlob)
      })
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
      const { format, boardId: bid } = e.detail
      if (!excalidrawRef.current) return
      if (format === "png") exportPNG()
      else if (format === "svg") exportSVG()
      else if (format === "json") exportJSON(bid)
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
  const exportJSON = useCallback((bid: string) => {
    if (!excalidrawRef.current) return
    const data = {
      elements: excalidrawRef.current.getSceneElements(),
      appState: excalidrawRef.current.getAppState(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `board-${bid}.excalidraw`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

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
    <div className="w-full h-full flex flex-col">
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
