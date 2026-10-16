import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

/**
 * 🔴 临时一次性端点（2026-10-16）：在共享库创建 draw 自己的 boards 表。
 *
 * 🔴 安全约束（刻意收窄）：
 *  - 只执行 CREATE TABLE / CREATE INDEX **IF NOT EXISTS** ⇒ 幂等，且**绝不 DROP/ALTER**
 *    任何已有对象，不会碰到主站的 17 张表。
 *  - 只 CREATE boards 这一张 draw 独有表 + 一个索引。
 *  - 不读写任何业务数据，不回显用户数据。
 *  - 带 POST + 一次性令牌，避免被搜索引擎或爬虫误触。
 *
 * 建表后应删除本端点。
 */
export const dynamic = "force-dynamic"

const TOKEN = "craftisle-draw-bootstrap-2026-10-16"

export async function POST(req: Request) {
  // 校验一次性令牌
  const url = new URL(req.url)
  const got = url.searchParams.get("token") ?? req.headers.get("x-bootstrap-token") ?? ""
  if (got !== TOKEN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const steps: Array<{ name: string; ok: boolean; error?: string }> = []

  // 1) boards 表（draw 独有）。列名/类型按 prisma/schema.prisma 的 boards 模型。
  //    Prisma 在 postgres 上：String->text、Json->jsonb、DateTime->timestamp(3)
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "boards" (
        "id"         TEXT NOT NULL,
        "title"      TEXT NOT NULL DEFAULT 'Untitled Board',
        "elements"   JSONB NOT NULL,
        "app_state"  JSONB,
        "thumbnail"  TEXT,
        "is_public"  BOOLEAN NOT NULL DEFAULT false,
        "user_id"    TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "boards_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "boards_user_id_fkey" FOREIGN KEY ("user_id")
          REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `)
    steps.push({ name: "CREATE TABLE boards", ok: true })
  } catch (e: any) {
    steps.push({ name: "CREATE TABLE boards", ok: false, error: String(e?.message ?? e) })
  }

  // 2) 索引（按 schema 的 @@index([user_id])）
  try {
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS "boards_user_id_idx" ON "boards"("user_id")`
    )
    steps.push({ name: "CREATE INDEX boards_user_id_idx", ok: true })
  } catch (e: any) {
    steps.push({ name: "CREATE INDEX boards_user_id_idx", ok: false, error: String(e?.message ?? e) })
  }

  // 3) 回读校验：表是否真存在 + 列是否齐全
  let verify: Record<string, unknown> = {}
  try {
    const cols = await prisma.$queryRawUnsafe<Array<{ column_name: string }>>(
      `SELECT column_name FROM information_schema.columns
       WHERE table_schema='public' AND table_name='boards' ORDER BY ordinal_position`
    )
    verify.boardsColumns = cols.map((c) => c.column_name)
  } catch (e: any) {
    verify.boardsColumns = { error: String(e?.message ?? e) }
  }

  // 4) 用真实 Prisma client 跑一次查询（这才是真正的验收：模型与表是否对得上）
  try {
    await prisma.boards.findMany({ take: 1 })
    verify.prismaBoardsFindMany = "ok"
  } catch (e: any) {
    verify.prismaBoardsFindMany = { error: String(e?.message ?? e), code: e?.code ?? null }
  }
  try {
    await prisma.users.findMany({ take: 1 })
    verify.prismaUsersFindMany = "ok"
  } catch (e: any) {
    verify.prismaUsersFindMany = { error: String(e?.message ?? e), code: e?.code ?? null }
  }

  return NextResponse.json({ steps, verify }, { status: 200 })
}