import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getBoard, updateBoard, deleteBoard, resolveUserId } from "@/lib/boards"

async function getResolvedUserId(session: any) {
  const userInfo: { email?: string; name?: string; image?: string } = {}
  if (session.user.email) userInfo.email = session.user.email
  if (session.user.name) userInfo.name = session.user.name
  if (session.user.image) userInfo.image = session.user.image
  return await resolveUserId(session.user.id, userInfo)
}

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

  const resolvedUserId = await getResolvedUserId(session)
  const board = await getBoard(id, resolvedUserId)
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

  const resolvedUserId = await getResolvedUserId(session)
  const data = await req.json().catch(() => ({}))
  const board = await updateBoard(id, resolvedUserId, {
    elements: data.elements,
    appState: data.appState,
    title: data.title,
    isPublic: data.isPublic,
    thumbnail: data.thumbnail,
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

  const resolvedUserId = await getResolvedUserId(session)
  const ok = await deleteBoard(id, resolvedUserId)
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
