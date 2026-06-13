"use client"

import { useCallback } from "react"
import ExcalidrawEditor from "@/components/ExcalidrawEditorWrapper"

interface BoardClientProps {
  boardId: string
  initialElements?: any[]
  initialAppState?: any
  readOnly?: boolean
}

export default function BoardClient({
  boardId,
  initialElements = [],
  initialAppState = {},
  readOnly = false,
}: BoardClientProps) {
  const handleSave = useCallback(
    async (elements: any[], appState: any) => {
      const res = await fetch(`/api/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elements, appState }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(err.error || `Save failed (${res.status})`)
      }
      return res.json()
    },
    [boardId]
  )

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ExcalidrawEditor
        boardId={boardId}
        initialData={{
          elements: initialElements,
          appState: initialAppState,
        }}
        readOnly={readOnly}
        onSave={handleSave}
      />
    </div>
  )
}
