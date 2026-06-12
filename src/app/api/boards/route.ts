import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { createBoard, getUserBoards } from "@/lib/boards"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const boards = await getUserBoards(session.user.id)
  return NextResponse.json(boards)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title } = await req.json().catch(() => ({}))
  const board = await createBoard(session.user.id, title)

  return NextResponse.json(board, { status: 201 })
}
