import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { createBoard } from "@/lib/boards"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/api/auth/signin", "http://localhost:3000"))
  }

  const board = await createBoard(session.user.id)
  return NextResponse.redirect(new URL(`/board/${board.id}`, "http://localhost:3000"))
}
