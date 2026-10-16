import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { createBoard, getUserBoards, resolveUserId } from "@/lib/boards"

export async function GET() {
  let session = null
  try {
    session = await auth()
  } catch (e) {
    // 🔴 不再静默吞掉：JWT 校验失败与「DB 挂了」必须可区分，
    // 否则两者都表现为 401，看起来像「请重新登录」，实际是故障。
    console.error("[api/boards] auth() failed:", e)
  }
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Resolve to DB user ID (handles Google sub → cuid mapping)
  const userInfo: { email?: string; name?: string; image?: string } = {}
  if (session.user.email) userInfo.email = session.user.email
  if (session.user.name) userInfo.name = session.user.name
  if (session.user.image) userInfo.image = session.user.image

  // 🔴 2026-10-16：这里原先没有任何 try/catch，任一 Prisma 异常直接冒成 500，
  // 而前端只显示「Failed to load boards (500)」，真实原因（缺列/连不上/迁移未跑）
  // 在响应体里一个字都看不到。改为显式捕获 + 回传原因。
  try {
    const resolvedUserId = await resolveUserId(session.user.id, userInfo)
    const boards = await getUserBoards(resolvedUserId)
    return NextResponse.json(boards)
  } catch (e: any) {
    console.error("[api/boards] GET failed:", e)
    return NextResponse.json(
      {
        error: "Failed to load boards",
        detail: String(e?.message ?? e),
        code: e?.code ?? null,
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  let session = null
  try {
    session = await auth()
  } catch {
    // JWT validation failed
  }
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title } = await req.json().catch(() => ({}))
  const userInfo: { email?: string; name?: string; image?: string } = {}
  if (session.user.email) userInfo.email = session.user.email
  if (session.user.name) userInfo.name = session.user.name
  if (session.user.image) userInfo.image = session.user.image

  const board = await createBoard(session.user.id, title, userInfo)

  return NextResponse.json(board, { status: 201 })
}
