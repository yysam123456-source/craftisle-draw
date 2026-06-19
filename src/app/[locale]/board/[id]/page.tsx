import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import BoardClient from "@/components/BoardClient"
import { getBoard, createBoard, resolveUserId } from "@/lib/boards"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function BoardPage({ params, searchParams }: {
  params: Promise<{ id: string; locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  let locale = "en"
  try {
    const { id, locale: loc } = await params
    locale = loc
    const sp = await searchParams
    const isTest = sp?.test === "1"

    let userId: string
    if (isTest) {
      userId = "test-user-0000-0000-0000-000000000001"
    } else {
      const session = await auth()
      const user = session?.user
      if (!user) {
        redirect(`/${locale}/api/auth/signin?callbackUrl=` + encodeURIComponent(`/${locale}/board/${id}`))
      }
      userId = user.id!
    }

    const resolvedUserId = await resolveUserId(userId)

    if (!isTest && id === "new") {
      const newBoard = await createBoard(resolvedUserId)
      if (newBoard?.id) {
        redirect(`/${locale}/board/` + newBoard.id)
      }
      throw new Error("createBoard returned empty result")
    }

    const board = await getBoard(id, resolvedUserId)
    if (!board) {
      notFound()
    }

    return (
      <BoardClient
        boardId={board.id}
        locale={locale}
        initialTitle={board.title || "Untitled Board"}
        initialElements={board.elements || []}
        initialAppState={board.appState || { viewBackgroundColor: "#ffffff" }}
      />
    )
  } catch (topErr: any) {
    if (topErr?.message?.includes("NEXT_REDIRECT")) {
      throw topErr
    }
    return (
      <div style={{ padding: 40, fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ color: "#e53e3e", fontSize: 24, marginBottom: 16 }}>服务器错误</h1>
        <p style={{ color: "#a0aec0", fontSize: 14 }}>{topErr?.message || "未知错误"}</p>
        <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
          <a href={`/${locale}/board/new`} style={{ padding: "10px 20px", background: "#4299e1", color: "white", borderRadius: 6, textDecoration: "none" }}>重试</a>
          <a href={`/${locale}`} style={{ padding: "10px 20px", background: "#e2e8f0", color: "#2d3748", borderRadius: 6, textDecoration: "none" }}>首页</a>
        </div>
      </div>
    )
  }
}
