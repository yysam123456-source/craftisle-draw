import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getBoard, updateBoard, deleteBoard } from "@/lib/boards"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  let session = null
  try {
    session = await auth()
  } catch {
    // JWT validation failed
  }
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const board = await getBoard(id, session.user.id)
  if (!board) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(board)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  let session = null
  try {
    session = await auth()
  } catch {
    // JWT validation failed
  }
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json().catch(() => ({}))
  const board = await updateBoard(id, session.user.id, {
    elements: data.elements,
    appState: data.appState,
    title: data.title,
    isPublic: data.isPublic,
  })

  if (!board) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(board)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  let session = null
  try {
    session = await auth()
  } catch {
    // JWT validation failed
  }
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const ok = await deleteBoard(id, session.user.id)
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
