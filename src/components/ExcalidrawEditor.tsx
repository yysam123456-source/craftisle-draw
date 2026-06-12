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

export default function ExcalidrawEditor({
  boardId,
  initialData,
  readOnly = false,
  onSave,
}: ExcalidrawEditorProps) {
  const excalidrawRef = useRef<any>(null)
  const saveTimerRef = useRef<any>(null)

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
        onSave(elements, appState)
      }, 3000)
    },
    [onSave]
  )

  // Listen for canvas changes
  const onChange = useCallback(
    (elements: readonly any[], appState: any) => {
      debouncedSave([...elements], { ...appState })
    },
    [debouncedSave]
  )

  // Export as PNG (client-side)
  const exportPNG = useCallback(() => {
    if (!excalidrawRef.current) return null
    return excalidrawRef.current.exportToBlob({
      elements: excalidrawRef.current.getSceneElements(),
      appState: excalidrawRef.current.getAppState(),
      files: excalidrawRef.current.getFiles(),
      exportPadding: 16,
    })
  }, [])

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-1 min-h-0">
        <Excalidraw
          excalidrawAPI={onExcalidrawAPIReady}
          initialData={initialData}
          onChange={readOnly ? undefined : onChange}
          viewModeEnabled={readOnly}
          zenModeEnabled={false}
          gridModeEnabled={true}
          theme="light"
        />
      </div>
    </div>
  )
}
