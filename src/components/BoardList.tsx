"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Board {
  id: string
  title: string
  updatedAt: string
  createdAt: string
  isPublic: boolean
}

export default function BoardList({ userId }: { userId: string }) {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [shareMenuId, setShareMenuId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/boards")
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load boards (${res.status})`)
        return res.json()
      })
      .then(data => {
        setBoards(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [userId])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this board?")) return
    await fetch(`/api/boards/${id}`, { method: "DELETE" })
    setBoards(boards.filter(b => b.id !== id))
  }

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) return
    await fetch(`/api/boards/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: renameValue.trim() }),
    })
    setBoards(boards.map(b => b.id === id ? { ...b, title: renameValue.trim() } : b))
    setRenamingId(null)
    setRenameValue("")
  }

  const handleTogglePublic = async (id: string, current: boolean) => {
    await fetch(`/api/boards/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !current }),
    })
    setBoards(boards.map(b => b.id === id ? { ...b, isPublic: !current } : b))
    setShareMenuId(null)
  }

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/share/${id}`
    navigator.clipboard.writeText(url)
    alert("Link copied to clipboard!")
    setShareMenuId(null)
  }

  const handleNew = () => {
    router.push("/board/new")
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>

  if (error) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">Failed to load boards</p>
        <p className="text-sm text-gray-400 mb-4">{error}</p>
        <a href="/api/auth/signin" className="text-blue-600 hover:underline">
          Try signing in again
        </a>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={handleNew}
        className="mb-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
      >
        + New Board
      </button>

      {boards.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg mb-2">No boards yet</p>
          <p className="text-sm">Click the button above to create your first board</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map(board => (
            <div
              key={board.id}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-white relative group"
            >
              {/* Share menu popup */}
              {shareMenuId === board.id && (
                <div className="absolute top-2 right-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64">
                  <p className="text-sm font-semibold mb-3">Share Settings</p>
                  <label className="flex items-center gap-2 text-sm mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={board.isPublic}
                      onChange={() => handleTogglePublic(board.id, board.isPublic)}
                      className="rounded"
                    />
                    Public (anyone with the link can view)
                  </label>
                  {board.isPublic && (
                    <button
                      onClick={() => handleCopyLink(board.id)}
                      className="w-full text-sm bg-blue-50 text-blue-700 py-1.5 rounded hover:bg-blue-100 transition"
                    >
                      Copy Share Link
                    </button>
                  )}
                  <button
                    onClick={() => setShareMenuId(null)}
                    className="w-full text-xs text-gray-400 mt-2 hover:underline"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Clickable area -> open board */}
              <div
                onClick={() => router.push(`/board/${board.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    router.push(`/board/${board.id}`)
                  }
                }}
                className="cursor-pointer"
              >
                {renamingId === board.id ? (
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleRename(board.id) }}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="mb-2"
                  >
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRename(board.id)}
                      className="w-full px-2 py-1 border border-blue-400 rounded text-sm"
                    />
                  </form>
                ) : (
                  <h3
                    className="font-semibold text-gray-900 mb-2 truncate hover:text-blue-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      setRenamingId(board.id)
                      setRenameValue(board.title)
                    }}
                  >
                    {board.title}
                  </h3>
                )}
                <p className="text-xs text-gray-400 mb-3">
                  Updated {new Date(board.updatedAt).toLocaleDateString("en-US")}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {board.isPublic && (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      Public
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShareMenuId(shareMenuId === board.id ? null : board.id)
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Share
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setRenamingId(board.id)
                    setRenameValue(board.title)
                  }}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(board.id)
                  }}
                  className="text-xs text-red-500 hover:underline ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
