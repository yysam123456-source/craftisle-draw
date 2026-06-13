import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import ExcalidrawEditor from "@/components/ExcalidrawEditorWrapper"
import { getBoard, createBoard, resolveUserId } from "@/lib/boards"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

const TEST_USER_ID = "test-user-0000-0000-0000-000000000001"

interface BoardPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BoardPage({ params, searchParams }: BoardPageProps) {
  // ── Top-level try/catch: NEVER throw on server component ──
  try {
    const { id } = await params
    const sp = await searchParams
    const isTest = sp?.test === "1"
    const isDebug = sp?.debug === "1"

    // ---- Auth ----
    let userId: string
    if (isTest) {
      userId = TEST_USER_ID
    } else {
      const session = await auth().catch(() => null)
      const user = session?.user
      if (!user) {
        if (isDebug) {
          return <DebugAuthPage id={id} />
        }
        redirect(
          "/api/auth/signin?callbackUrl=" + encodeURIComponent("/board/" + id)
        )
      }
      userId = user.id!
    }

    // ---- Resolve user ID (handle Google sub vs DB cuid) ----
    let resolvedUserId: string
    try {
      resolvedUserId = await resolveUserId(userId)
    } catch (resolveErr: any) {
      // resolveUserId failed — show detailed error
      return (
        <ErrorDisplay
          title="用户验证失败"
          message={resolveErr?.message || String(resolveErr)}
          details={`userId: ${userId}\n\nStack: ${resolveErr?.stack?.substring(0, 500) || "N/A"}`}
        />
      )
    }

    // ---- Handle /board/new ----
    if (!isTest && id === "new") {
      try {
        const newBoard = await createBoard(resolvedUserId)
        if (newBoard?.id) {
          redirect("/board/" + newBoard.id)
        }
        throw new Error("createBoard returned empty result")
      } catch (createErr: any) {
        if (createErr?.message?.includes("NEXT_REDIRECT")) throw createErr
        return (
          <ErrorDisplay
            title="创建白板失败"
            message={createErr?.message || String(createErr)}
            details={`resolvedUserId: ${resolvedUserId}\n\nStack: ${createErr?.stack?.substring(0, 500) || "N/A"}`}
          />
        )
      }
    }

    // ---- Load board data ----
    let board: any = null
    let boardError: string | null = null

    if (isTest) {
      try {
        let b = await getBoard(id, TEST_USER_ID)
        if (!b) b = await createBoard(TEST_USER_ID)
        if (!b) throw new Error("createBoard returned null")
        board = b
      } catch (dbErr: any) {
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
      try {
        board = await getBoard(id, resolvedUserId)
        if (!board) {
          boardError = `白板 "${id}" 不存在，或你没有访问权限。`
        }
      } catch (loadErr: any) {
        if (loadErr?.message?.includes("NEXT_REDIRECT")) throw loadErr
        boardError = loadErr?.message || String(loadErr)
      }
    }

    // ---- Render ----
    if (boardError) {
      return (
        <ErrorDisplay
          title="加载白板失败"
          message={boardError}
          details={`board id: ${id}\nresolvedUserId: ${resolvedUserId}`}
        />
      )
    }

    if (!board) {
      return (
        <ErrorDisplay
          title="白板数据为空"
          message="board 对象为 null，无法渲染白板。"
          details={`id: ${id}\nresolvedUserId: ${resolvedUserId}\nisTest: ${isTest}`}
        />
      )
    }

    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <ExcalidrawEditor
          boardId={board.id}
          initialElements={board.elements || []}
          initialAppState={board.appState || { viewBackgroundColor: "#ffffff" }}
        />
      </div>
    )
  } catch (topLevelErr: any) {
    // ── Catch ALL server component errors ──
    if (topLevelErr?.message?.includes("NEXT_REDIRECT")) {
      throw topLevelErr  // let Next.js handle redirect
    }
    return (
      <ErrorDisplay
        title="服务器渲染错误（顶层捕获）"
        message={topLevelErr?.message || String(topLevelErr)}
        details={
          `Type: ${topLevelErr?.constructor?.name || "unknown"}\n\n` +
          `Stack:\n${topLevelErr?.stack?.substring(0, 1000) || "N/A"}\n\n` +
          `Digest: ${topLevelErr?.digest || "N/A"}`
        }
      />
    )
  }
}

// ── Inline error UI (no client JS needed) ──
function ErrorDisplay({
  title,
  message,
  details,
}: {
  title: string
  message: string
  details?: string
}) {
  return (
    <div style={{ padding: 40, fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ color: "#e53e3e", fontSize: 24, marginBottom: 16 }}>
        {title}
      </h1>
      <div style={{ background: "#1a202c", color: "#68d391", padding: 20, borderRadius: 8, overflow: "auto", fontSize: 13, lineHeight: 1.6, fontFamily: "monospace", whiteSpace: "pre-wrap", marginBottom: 20 }}>
        {message}
        {details && (
          <>
            {"\n\n────────── 详情 ──────────\n"}
            {details}
          </>
        )}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <a
          href="/board/new"
          style={{ padding: "10px 20px", background: "#4299e1", color: "white", border: "none", borderRadius: 6, textDecoration: "none", fontSize: 14 }}
        >
          新建白板
        </a>
        <a
          href="/"
          style={{ padding: "10px 20px", background: "#e2e8f0", color: "#2d3748", border: "none", borderRadius: 6, textDecoration: "none", fontSize: 14 }}
        >
          返回首页
        </a>
      </div>
    </div>
  )
}

function DebugAuthPage({ id }: { id: string }) {
  return (
    <div style={{ padding: 40 }}>
      <h1>调试模式</h1>
      <p>未登录或 session 无效。</p>
      <p>Board ID: {id}</p>
      <a href="/api/auth/signin">登录</a>
    </div>
  )
}
