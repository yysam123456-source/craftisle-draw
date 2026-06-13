"use client"

import { useState, useCallback, useEffect } from "react"
import ExcalidrawEditor from "@/components/ExcalidrawEditor"
import { useRouter } from "next/navigation"

interface BoardClientProps {
  boardId: string
  initialElements?: any[]
  initialAppState?: any
  initialTitle?: string
  readOnly?: boolean
}

export default function BoardClient({
  boardId,
  initialElements = [],
  initialAppState = {},
  initialTitle = "Untitled Board",
  readOnly = false,
}: BoardClientProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitleValue, setEditTitleValue] = useState("")
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  // Fetch current board info (for isPublic)
  useEffect(() => {
    if (readOnly) return
    fetch(`/api/boards/${boardId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.isPublic !== undefined) setIsPublic(data.isPublic)
        if (data?.title && data.title !== initialTitle) setTitle(data.title)
      })
      .catch(() => {})
  }, [boardId, readOnly])

  const handleSave = useCallback(
    async (elements: any[], appState: any, opts?: { thumbnail?: string; title?: string }) => {
      const titleToSave = opts?.title !== undefined ? opts.title : title
      setSaveStatus("saving")
      try {
        const res = await fetch(`/api/boards/${boardId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            elements,
            appState,
            ...(opts?.title !== undefined && { title: opts.title }),
            ...(opts?.thumbnail !== undefined && { thumbnail: opts.thumbnail }),
          }),
        })
        if (!res.ok) throw new Error(`Save failed (${res.status})`)
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
        return res.json()
      } catch (err) {
        console.error("Auto-save failed:", err)
        setSaveStatus("error")
        setTimeout(() => setSaveStatus("idle"), 3000)
      }
    },
    [boardId, title]
  )

  const handleTitleSave = async () => {
    const newTitle = editTitleValue.trim() || "Untitled Board"
    setTitle(newTitle)
    setIsEditingTitle(false)
    // Save title to backend (pass as opts.title)
    handleSave([] as any[], {} as any, { title: newTitle })
  }

  const handleTogglePublic = async () => {
    const newVal = !isPublic
    setIsPublic(newVal)
    try {
      await fetch(`/api/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: newVal }),
      })
    } catch (err) {
      setIsPublic(!newVal)
      console.error("Share setting failed:", err)
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/share/${boardId}`
    navigator.clipboard.writeText(url)
    alert("Share link copied to clipboard!")
    setShowShareMenu(false)
  }

  const handleExport = (format: "png" | "svg" | "json") => {
    // Dispatch custom event to ExcalidrawEditor
    window.dispatchEvent(
      new CustomEvent("craftisle-export", { detail: { format, boardId } })
    )
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }} className="flex flex-col">
      {/* Top bar */}
      <div className="h-12 border-b border-gray-200 flex items-center px-4 bg-white shrink-0 z-50">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="text-gray-500 hover:text-gray-800 mr-3"
          title="Back to My Boards"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 10H5M5 10L10 15M5 10L10 5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Title */}
        <div className="flex-1 flex items-center">
          {isEditingTitle ? (
            <form
              onSubmit={(e) => { e.preventDefault(); handleTitleSave() }}
              className="flex items-center gap-2"
            >
              <input
                autoFocus
                value={editTitleValue}
                onChange={(e) => setEditTitleValue(e.target.value)}
                onBlur={handleTitleSave}
                className="text-sm font-semibold border border-blue-400 rounded px-2 py-0.5 w-64"
              />
            </form>
          ) : (
            <button
              onClick={() => {
                setEditTitleValue(title)
                setIsEditingTitle(true)
              }}
              className="text-sm font-semibold text-gray-800 hover:text-blue-600 truncate max-w-xs"
            >
              {title}
            </button>
          )}
        </div>

        {/* Save status */}
        {saveStatus !== "idle" && (
          <span
            className={`text-xs px-2 py-0.5 rounded font-medium mr-3 ${
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

        {/* Share button */}
        <div className="relative mr-2">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Share
          </button>
          {showShareMenu && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
              <p className="text-sm font-semibold mb-3">Share Settings</p>
              <label className="flex items-center gap-2 text-sm mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={handleTogglePublic}
                  className="rounded"
                />
                Public (anyone with the link can view)
              </label>
              {isPublic && (
                <button
                  onClick={handleCopyLink}
                  className="w-full text-sm bg-blue-50 text-blue-700 py-1.5 rounded hover:bg-blue-100 transition mb-2"
                >
                  Copy Share Link
                </button>
              )}
              <a
                href={`/share/${boardId}`}
                target="_blank"
                className="block text-center text-sm text-blue-600 hover:underline mb-2"
              >
                Open share page
              </a>
              <button
                onClick={() => setShowShareMenu(false)}
                className="w-full text-xs text-gray-400 hover:underline"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Export dropdown */}
        <div className="relative mr-2">
          <ExportDropdown boardId={boardId} />
        </div>
      </div>

        {/* Excalidraw editor */}
      <div className="flex-1 min-h-0">
        <ExcalidrawEditor
          boardId={boardId}
          initialData={{
            elements: initialElements,
            appState: initialAppState,
          }}
          readOnly={readOnly}
          onSave={(elements, appState, opts) => handleSave(elements, appState, opts)}
        />
      </div>
    </div>
  )
}

function ExportDropdown({ boardId }: { boardId: string }) {
  const [open, setOpen] = useState(false)

  const handleExport = (format: "png" | "svg" | "json") => {
    setOpen(false)
    window.dispatchEvent(
      new CustomEvent("craftisle-export", { detail: { format, boardId } })
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Export ▾
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={() => handleExport("png")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            📄 Export as PNG
          </button>
          <button
            onClick={() => handleExport("svg")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            📐 Export as SVG
          </button>
          <button
            onClick={() => handleExport("json")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            📦 Export as JSON
          </button>
        </div>
      )}
    </div>
  )
}
