import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

/**
 * 🔴 临时只读探针（2026-10-16）：在改 schema 前，实测共享库的真实列结构。
 *
 * 🔴 严格只读：只 SELECT information_schema 与列名/类型/可空性，
 * **不 SELECT 任何业务数据，不回显邮箱/姓名**。
 * 🔴 目的：主站 schema 与实际库可能已漂移（draw 这次就是吃了这个亏），
 *    改 draw schema 前必须以真实列为准，否则又是第二次错配。
 */
export const dynamic = "force-dynamic"

export async function GET() {
  const out: Record<string, unknown> = {}

  // 逐表拿真实列
  for (const t of ["User", "Account", "Session", "VerificationToken"]) {
    try {
      const cols = await prisma.$queryRawUnsafe<
        Array<{ column_name: string; data_type: string; is_nullable: string }>
      >(
        `SELECT column_name, data_type, is_nullable
         FROM information_schema.columns
         WHERE table_schema='public' AND table_name = '${t}'
         ORDER BY ordinal_position`
      )
      out[t] = cols.map((c) => ({
        col: c.column_name,
        type: c.data_type,
        nullable: c.is_nullable,
      }))
    } catch (e: any) {
      out[t] = { error: String(e?.message ?? e), code: e?.code ?? null }
    }
  }

  // Role 枚举实际有哪些值（判断 draw 写 "USER" 是否合法）
  try {
    const roles = await prisma.$queryRawUnsafe<Array<{ enumlabel: string }>>(
      "SELECT enumlabel FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid WHERE t.typname = 'Role' ORDER BY e.enumsortorder"
    )
    out.roleEnum = roles.map((r) => r.enumlabel)
  } catch (e: any) {
    out.roleEnum = { error: String(e?.message ?? e), code: e?.code ?? null }
  }

  // 主站 Account 的唯一约束名（draw 若要 @@map 到同表需知道实际约束）
  try {
    const cons = await prisma.$queryRawUnsafe<Array<{ conname: string }>>(
      `SELECT conname FROM pg_constraint
       WHERE conrelid = '"Account"'::regclass AND contype IN ('u','p')
       ORDER BY conname`
    )
    out.accountConstraints = cons.map((c) => c.conname)
  } catch (e: any) {
    out.accountConstraints = { error: String(e?.message ?? e), code: e?.code ?? null }
  }

  return NextResponse.json(out, { status: 200 })
}