import type { Metadata } from "next"
import { Suspense } from "react"
import BoardList from "@/components/BoardList"
import { auth } from "@/auth"

export const metadata: Metadata = {
  title: "我的白板",
}

export default async function HomePage() {
  const session = await auth()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">我的白板</h1>
        {session?.user && (
          <a
            href="/board/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + 新建白板
          </a>
        )}
      </div>

      {session?.user ? (
        <Suspense fallback={<div className="text-center py-12">加载中...</div>}>
          <BoardList userId={session.user.id!} />
        </Suspense>
      ) : (
        <div className="text-center py-24 text-gray-500">
          <p className="text-xl mb-4">请先登录以查看你的白板</p>
          <a href="/login" className="text-blue-600 hover:underline">
            前往登录
          </a>
        </div>
      )}
    </div>
  )
}
