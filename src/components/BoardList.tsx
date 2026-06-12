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
  const router = useRouter()

  useEffect(() => {
    fetch("/api/boards")
      .then(res => res.json())
      .then(data => {
        setBoards(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [userId])

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除此白板？")) return
    await fetch(`/api/boards/${id}`, { method: "DELETE" })
    setBoards(boards.filter(b => b.id !== id))
  }

  const handleNew = async () => {
    const res = await fetch("/api/boards", { method: "POST" })
    const board = await res.json()
    router.push(`/board/${board.id}`)
  }

  if (loading) return <div className="text-center py-12 text-gray-500">加载中...</div>

  return (
    <div>
      <button
        onClick={handleNew}
        className="mb-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
      >
        + 新建白板
      </button>

      {boards.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg mb-2">还没有白板</p>
          <p className="text-sm">点击上方按钮创建你的第一个白板</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map(board => (
            <div
              key={board.id}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-white group"
            >
              <a href={`/board/${board.id}`} className="block">
                <h3 className="font-semibold text-gray-900 mb-2 truncate">
                  {board.title}
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  更新于 {new Date(board.updatedAt).toLocaleDateString("zh-CN")}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {board.isPublic && (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      公开
                    </span>
                  )}
                </div>
              </a>
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition">
                <a
                  href={`/share/${board.id}`}
                  target="_blank"
                  className="text-xs text-blue-600 hover:underline"
                >
                  分享
                </a>
                <button
                  onClick={() => handleDelete(board.id)}
                  className="text-xs text-red-500 hover:underline ml-auto"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
