import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

/**
 * 🔴 临时诊断端点（2026-10-16 加入，用于定位 draw 子站 boards 500）。
 *
 * 背景：`/api/boards` 与 `/share/[id]` 在已登录/查库路径上返回 500，
 * 但前端只显示「Failed to load boards (500)」，真实 Prisma 错误不可见。
 * 本端点用「逐项拆开试」的方式，判断到底是：
 *   ① DB 连不上  ② users 表不可用  ③ boards 表缺列（如 thumbnail）
 *
 * 🔴 安全：只回传列名与错误码/消息，**不回显任何业务数据**（无 board 内容、无用户信息）。
 * 🔴 这是临时端点，定位完成后应删除。
 */
export const dynamic = "force-dynamic"

export async function GET() {
  const out: Record<string, unknown> = {}

  // ① 数据库连通性
  try {
    const r = await prisma.$queryRawUnsafe("SELECT 1 as ok")
    out.dbPing = { ok: true, result: r }
  } catch (e: any) {
    out.dbPing = { ok: false, error: String(e?.message ?? e), code: e?.code ?? null }
    // 连不上就不用往下试了
    return NextResponse.json(out, { status: 200 })
  }

  // ② users 表（登录路径已在用，能通说明会话同步没问题）
  try {
    const rows = await prisma.$queryRawUnsafe<Array<{ n: number }>>(
      "SELECT count(*)::int as n FROM users"
    )
    out.usersTable = { ok: true, rowCount: rows[0]?.n ?? null }
  } catch (e: any) {
    out.usersTable = { ok: false, error: String(e?.message ?? e), code: e?.code ?? null }
  }

  // ③ boards 表实际有哪些列（只看列名，不看数据）
  try {
    const cols = await prisma.$queryRawUnsafe<Array<{ column_name: string }>>(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'boards' ORDER BY ordinal_position"
    )
    out.boardsColumns = cols.map((c) => c.column_name)
  } catch (e: any) {
    out.boardsColumns = { error: String(e?.message ?? e), code: e?.code ?? null }
  }

  // ③b 🔴 关键判定：当前库里到底有哪些表？
  // 若「有其它表但没有 users/boards」⇒ DATABASE_URL 指到了**错误的库**
  // 若「一张表都没有」⇒ 是个**空库**（Neon 免费实例被回收 / 指到了新建实例）
  try {
    const t = await prisma.$queryRawUnsafe<Array<{ table_name: string }>>(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    )
    out.allPublicTables = t.map((x) => x.table_name)
  } catch (e: any) {
    out.allPublicTables = { error: String(e?.message ?? e), code: e?.code ?? null }
  }

  // ③c 当前连接指向哪个库/主机（只回显 host 与库名，**不回显密码**）
  try {
    const cur = await prisma.$queryRawUnsafe<Array<{ db: string; host: string; ver: string }>>(
      "SELECT current_database() as db, inet_server_addr()::text as host, version() as ver"
    )
    out.target = cur[0]
      ? { database: cur[0].db, host: cur[0].host, version: String(cur[0].ver).split(" ")[0] }
      : null
  } catch (e: any) {
    out.target = { error: String(e?.message ?? e), code: e?.code ?? null }
  }

  // ③d 🔴 决定性证据：共享库里是否真存在用户数据？
  // 若 User 表有数据 ⇒ draw 本就应复用它（改 schema 大小写去迁就，而不是建新表）
  // 只回显**行数**，不回显任何邮箱/姓名等个人数据。
  try {
    const c = await prisma.$queryRawUnsafe<Array<{ n: number }>>(
      'SELECT count(*)::int as n FROM "User"'
    )
    out.userTableRowCount = c[0]?.n ?? null
  } catch (e: any) {
    out.userTableRowCount = { error: String(e?.message ?? e), code: e?.code ?? null }
  }

  // ④ 源码期望的列（直接查一次，暴露真实 Prisma 报错）
  try {
    await prisma.boards.findMany({ take: 1 })
    out.boardsFindMany = { ok: true }
  } catch (e: any) {
    out.boardsFindMany = {
      ok: false,
      error: String(e?.message ?? e),
      code: e?.code ?? null,
      meta: e?.meta ?? null,
    }
  }

  return NextResponse.json(out, { status: 200 })
}