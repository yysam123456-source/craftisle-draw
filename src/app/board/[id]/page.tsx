import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import ExcalidrawEditor from "@/components/ExcalidrawEditorWrapper"
import { getBoard, createBoard, resolveUserId } from "@/lib/boards"

const TEST_USER_ID = "test-user-0000-0000-0000-000000000001"

export default async function BoardPage({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  console.error("[BoardPage] START, NODE_ENV:", process.env.NODE_ENV)
  try {
    const { id } = await params
    console.error("[BoardPage] id:", id)
    const sp = await searchParams
    const isTest = sp?.test === "1"
    console.error("[BoardPage] isTest:", isTest)

    let userId: string
    if (isTest) {
      userId = TEST_USER_ID
      console.error("[BoardPage] test mode, userId:", userId)
    } else {
      console.error("[BoardPage] calling auth()...")
      const session = await auth().catch((e: any) => {
        console.error("[BoardPage] auth() failed:", e?.message, e?.stack?.substring(0,300))
        return null
      })
      console.error("[BoardPage] auth() result - has session:", !!session, "has user:", !!session?.user)
      const user = session?.user
      if (!user) {
        console.error("[BoardPage] No user, redirecting to signin")
        redirect("/api/auth/signin?callbackUrl=" + encodeURIComponent("/board/" + id))
      }
      userId = user.id!
      const userInfo = user.email ? { email: user.email, name: user.name, image: user.image } : undefined
      console.error("[BoardPage] userId from session:", userId, "email:", user.email)
    }

    console.error("[BoardPage] calling resolveUserId with:", userId, "userInfo:", userInfo || "(none)")
    const resolvedUserId = await resolveUserId(userId, userInfo).catch((e: any) => {
      console.error("[BoardPage] resolveUserId FAILED:", e?.message, e?.stack?.substring(0,500))
      throw e
    })
    console.error("[BoardPage] resolvedUserId:", resolvedUserId)

    if (!isTest && id === "new") {
      console.error("[BoardPage] /board/new: calling createBoard...")
      const newBoard = await createBoard(resolvedUserId, undefined, userInfo).catch((e: any) => {
        console.error("[BoardPage] createBoard FAILED:", e?.message, e?.stack?.substring(0,500))
        throw e
      })
      console.error("[BoardPage] newBoard:", newBoard?.id)
      if (newBoard?.id) {
        console.error("[BoardPage] redirecting to:", "/board/" + newBoard.id)
        redirect("/board/" + newBoard.id)
      }
      throw new Error("createBoard returned empty result")
    }

    let board: any = null
    let boardError: string | null = null

    if (isTest) {
      console.error("[BoardPage] test mode: loading board", id)
      try {
        let b = await getBoard(id, TEST_USER_ID)
        if (!b) b = await createBoard(TEST_USER_ID)
        if (!b) throw new Error("createBoard returned null")
        board = b
      } catch (dbErr: any) {
        console.error("[BoardPage] test mode DB error:", dbErr?.message)
        board = {
          id,
          elements: [],
          appState: { viewBackgroundColor: "#ffffff" },
          title: "Test Board (Mock)",
          userId: TEST_USER_ID,
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
    } else {
      console.error("[BoardPage] loading board:", id, "for user:", resolvedUserId)
      try {
        board = await getBoard(id, resolvedUserId)
        console.error("[BoardPage] getBoard result:", !!board)
        if (!board) {
          boardError = `Board "${id}" not found.`
        }
      } catch (loadErr: any) {
        console.error("[BoardPage] getBoard FAILED:", loadErr?.message, loadErr?.stack?.substring(0,500))
        if (loadErr?.message?.includes("NEXT_REDIRECT")) throw loadErr
        boardError = loadErr?.message || String(loadErr)
      }
    }

    if (boardError) {
      console.error("[BoardPage] boardError:", boardError)
      return (
        <div style={{ padding: 40, fontFamily: "system-ui, sans-serif" }}>
          <h1 style={{ color: "#e53e3e" }}>加载失败</h1>
          <pre style={{ background: "#1a202c", color: "#68d391", padding: 16, borderRadius: 8, fontSize: 13, whiteSpace: "pre-wrap" }}>
            {boardError}
          </pre>
        </div>
      )
    }

    if (!board) {
      console.error("[BoardPage] board is null, showing error")
      return (
        <div style={{ padding: 40 }}>
          <h1>board is null</h1>
          <p>id: {id}</p>
        </div>
      )
    }

    console.error("[BoardPage] RENDERING ExcalidrawEditor for board:", board.id)
    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <ExcalidrawEditor
          boardId={board.id}
          initialElements={board.elements || []}
          initialAppState={board.appState || { viewBackgroundColor: "#ffffff" }}
        />
      </div>
    )
  } catch (topErr: any) {
    console.error("[BoardPage] TOP-LEVEL CATCH:", topErr?.message, topErr?.stack?.substring(0,1000))
    if (topErr?.message?.includes("NEXT_REDIRECT")) {
      console.error("[BoardPage] re-throwing redirect")
      throw topErr
    }
    return (
      <div style={{ padding: 40, fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ color: "#e53e3e", fontSize: 24, marginBottom: 16 }}>服务器错误</h1>
        <pre style={{ background: "#1a202c", color: "#68d391", padding: 20, borderRadius: 8, overflow: "auto", fontSize: 13, lineHeight: 1.6, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
          {topErr?.message || String(topErr)}
          {"\n\nStack:\n"}
          {(topErr?.stack || "N/A").substring(0, 2000)}
        </pre>
        <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
          <a href="/board/new" style={{ padding: "10px 20px", background: "#4299e1", color: "white", borderRadius: 6, textDecoration: "none" }}>重试</a>
          <a href="/" style={{ padding: "10px 20px", background: "#e2e8f0", color: "#2d3748", borderRadius: 6, textDecoration: "none" }}>首页</a>
        </div>
      </div>
    )
  }
}
