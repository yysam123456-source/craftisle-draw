import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import ExcalidrawEditor from "@/components/ExcalidrawEditorWrapper"
import { getBoard, createBoard, resolveUserId } from "@/lib/boards"

export const dynamic = "force-dynamic"

const TEST_USER_ID = "test-user-0000-0000-0000-000000000001"

export default async function BoardPage({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const steps: string[] = []
  const log = (msg: string) => { steps.push(new Date().toISOString() + " " + msg) }

  try {
    log("START")
    const { id } = await params
    log("id: " + id)
    const sp = await searchParams
    const isTest = sp?.test === "1"
    log("isTest: " + isTest)

    let userId: string
    if (isTest) {
      userId = TEST_USER_ID
      log("test mode, userId: " + userId)
    } else {
      log("calling auth()")
      const session = await auth().catch((e: any) => {
        log("auth FAILED: " + (e?.message || String(e)))
        return null
      })
      log("auth result: hasSession=" + !!session + " hasUser=" + !!session?.user)
      const user = session?.user
      if (!user) {
        log("No user, redirecting to signin")
        redirect("/api/auth/signin?callbackUrl=" + encodeURIComponent("/board/" + id))
      }
      userId = user.id!
      log("userId from session: " + userId)
    }

    log("calling resolveUserId(" + userId + ")")
    const resolvedUserId = await resolveUserId(userId).catch((e: any) => {
      log("resolveUserId FAILED: " + (e?.message || String(e)))
      throw e
    })
    log("resolvedUserId: " + resolvedUserId)

    if (!isTest && id === "new") {
      log("Creating new board for userId: " + resolvedUserId)
      const newBoard = await createBoard(resolvedUserId).catch((e: any) => {
        log("createBoard FAILED: " + (e?.message || String(e)))
        throw e
      })
      log("newBoard created: " + (newBoard?.id || "null"))
      if (newBoard?.id) {
        log("Redirecting to /board/" + newBoard.id)
        redirect("/board/" + newBoard.id)
      }
      throw new Error("createBoard returned empty result")
    }

    log("Loading board: " + id + " for user: " + resolvedUserId)
    const board = await getBoard(id, resolvedUserId).catch((e: any) => {
      log("getBoard FAILED: " + (e?.message || String(e)))
      throw e
    })
    log("board loaded: " + (board ? "yes (id=" + board.id + ")" : "NO"))
    if (!board) {
      log("Board not found, showing error")
      return <ErrorDisplay title="白板不存在" message={`Board "${id}" 不存在或无权访问。`} details={steps.join("\n")} />
    }

    log("RENDERING ExcalidrawEditor for board: " + board.id)
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
    log("TOP-LEVEL CATCH: " + (topErr?.message || String(topErr)))
    if (topErr?.message?.includes("NEXT_REDIRECT")) {
      log("Re-throwing redirect")
      throw topErr
    }
    return (
      <div style={{ padding: 40, fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ color: "#e53e3e", fontSize: 24, marginBottom: 16 }}>服务器错误</h1>
        <pre style={{ background: "#1a202c", color: "#68d391", padding: 20, borderRadius: 8, overflow: "auto", fontSize: 13, lineHeight: 1.6, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
          {topErr?.message || String(topErr)}
          {"\n\n调试日志:\n"}
          {steps.join("\n")}
        </pre>
        <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
          <a href="/board/new" style={{ padding: "10px 20px", background: "#4299e1", color: "white", borderRadius: 6, textDecoration: "none" }}>重试</a>
          <a href="/" style={{ padding: "10px 20px", background: "#e2e8f0", color: "#2d3748", borderRadius: 6, textDecoration: "none" }}>首页</a>
        </div>
      </div>
    )
  }
}

function ErrorDisplay({ title, message, details }: { title: string; message: string; details?: string }) {
  return (
    <div style={{ padding: 40, fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ color: "#e53e3e", fontSize: 24, marginBottom: 16 }}>{title}</h1>
      <pre style={{ background: "#1a202c", color: "#68d391", padding: 20, borderRadius: 8, overflow: "auto", fontSize: 13, lineHeight: 1.6, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        {message}
        {details && (
          <>
            {"\n\n────────── 详情 ──────────\n"}
            {details}
          </>
        )}
      </pre>
      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <a href="/board/new" style={{ padding: "10px 20px", background: "#4299e1", color: "white", borderRadius: 6, textDecoration: "none" }}>新建白板</a>
        <a href="/" style={{ padding: "10px 20px", background: "#e2e8f0", color: "#2d3748", borderRadius: 6, textDecoration: "none" }}>返回首页</a>
      </div>
    </div>
  )
}
