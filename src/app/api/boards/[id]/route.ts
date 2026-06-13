import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getBoard, updateBoard, deleteBoard, resolveUserId } from "@/lib/boards"

// Clean appState: remove runtime-only fields that break Excalidraw
function cleanAppState(appState: any): any {
  if (!appState || typeof appState !== "object") return appState
  const { collaborators, activeTool, editingElement, editingLinearElement, selectedElementIds, selectedGroupIds, ...rest } = appState
  return rest
}

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

  // Clean appState before returning to client
  if (board.appState && typeof board.appState === "object") {
    (board as any).appState = cleanAppState(board.appState)
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
  // Clean appState before saving
  const cleanData: any = {}
  if (data.elements !== undefined) cleanData.elements = data.elements
  if (data.appState !== undefined) cleanData.appState = cleanAppState(data.appState)
  if (data.title !== undefined) cleanData.title = data.title
  if (data.isPublic !== undefined) cleanData.isPublic = data.isPublic
  if (data.thumbnail !== undefined) cleanData.thumbnail = data.thumbnail

  const board = await updateBoard(id, resolvedUserId, cleanData)

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
