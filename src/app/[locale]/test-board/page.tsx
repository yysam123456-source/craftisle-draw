"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { useEffect } from "react"

// Fetch worker blob before loading Excalidraw
function WorkerLoader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    fetch("/api/excalidraw-worker")
      .then((res) => res.text())
      .then((code) => {
        const blob = new Blob([code], { type: "text/javascript" })
        ;(window as any).__EXCALIDRAW_WORKER_BLOB_URL__ = URL.createObjectURL(blob)
        console.log("[test] Worker blob URL set:", (window as any).__EXCALIDRAW_WORKER_BLOB_URL__)
        setReady(true)
      })
      .catch((err) => {
        console.error("[test] Failed to load worker:", err)
        setReady(true)
      })
  }, [])

  if (!ready) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading worker...</div>
  }
  return <>{children}</>
}

const Editor = dynamic(() => import("@/components/ExcalidrawEditor"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
      Loading editor...
    </div>
  ),
})

export default function TestBoardPage() {
  return (
    <WorkerLoader>
      <Editor
        boardId="test"
        initialData={{
          elements: [],
          appState: {},
        }}
        readOnly={false}
      />
    </WorkerLoader>
  )
}
