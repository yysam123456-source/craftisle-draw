"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

/**
 * Loads the Excalidraw subset worker from our API route,
 * creates a Blob URL to bypass Cloudflare's CSP restriction,
 * then dynamically imports the Excalidraw editor.
 */
function useWorkerBlobUrl() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // If the blob URL was already set (e.g. by a previous render), skip
    if (typeof window !== "undefined" && (window as any).__EXCALIDRAW_WORKER_BLOB_URL__) {
      setReady(true)
      return
    }

    let cancelled = false

    fetch("/api/excalidraw-worker")
      .then((res) => res.text())
      .then((code) => {
        if (cancelled) return
        const blob = new Blob([code], { type: "text/javascript" })
        const blobUrl = URL.createObjectURL(blob)
        ;(window as any).__EXCALIDRAW_WORKER_BLOB_URL__ = blobUrl
        setReady(true)
      })
      .catch((err) => {
        console.error("Failed to load Excalidraw worker:", err)
        if (!cancelled) setReady(true) // continue without worker (font subsetting won't work)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return ready
}

const ExcalidrawEditor = dynamic(
  () => import("@/components/ExcalidrawEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading board editor...</p>
      </div>
    ),
  }
)

export default function ExcalidrawEditorWrapper(props: any) {
  const workerReady = useWorkerBlobUrl()

  if (!workerReady) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Initializing editor...</p>
      </div>
    )
  }

  return <ExcalidrawEditor {...props} />
}
