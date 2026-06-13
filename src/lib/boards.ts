import { prisma } from "./db"

function genId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let id = ""
  for (let i = 0; i < 25; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

export async function getBoard(id: string, userId: string): Promise<any> {
  const board = await prisma.boards.findFirst({
    where: { id, user_id: userId },
  })
  if (!board) return null
  return mapBoard(board)
}

export async function getPublicBoard(id: string): Promise<any> {
  const board = await prisma.boards.findFirst({
    where: { id, is_public: true },
  })
  if (!board) return null
  return mapBoard(board)
}

// Map snake_case (Prisma) to camelCase (frontend)
function mapBoard(b: any) {
  return {
    id: b.id,
    title: b.title,
    elements: b.elements,
    appState: b.app_state,
    thumbnail: b.thumbnail,
    userId: b.user_id,
    isPublic: b.is_public,
    updatedAt: b.updated_at,
    createdAt: b.created_at,
  }
}

export async function resolveUserId(
  userId: string,
  userInfo?: { email?: string | null; name?: string | null; image?: string | null }
): Promise<string> {
  const existing = await prisma.users.findUnique({ where: { id: userId } })
  if (existing) return existing.id

  if (userInfo?.email) {
    const byEmail = await prisma.users.findUnique({ where: { email: userInfo.email } })
    if (byEmail) {
      return byEmail.id
    }
    const created = await prisma.users.create({
      data: {
        email: userInfo.email,
        name: userInfo.name ?? undefined,
        image: userInfo.image ?? undefined,
      },
    })
    return created.id
  }

  return userId
}

export async function createBoard(
  userId: string,
  title?: string,
  userInfo?: { email?: string | null; name?: string | null; image?: string | null }
): Promise<any> {
  const resolvedUserId = await resolveUserId(userId, userInfo)

  const board = await prisma.boards.create({
    data: {
      id: genId(),
      title: title ?? "Untitled Board",
      user_id: resolvedUserId,
      elements: [],
      app_state: {},
      updated_at: new Date(),
    },
  })
  return mapBoard(board)
}

export async function updateBoard(
  id: string,
  userId: string,
  data: { elements?: any[]; appState?: any; title?: string; isPublic?: boolean; thumbnail?: string }
): Promise<any> {
  const board = await prisma.boards.findFirst({ where: { id, user_id: userId } })
  if (!board) return null

  const updated = await prisma.boards.update({
    where: { id },
    data: {
      ...(data.elements !== undefined && { elements: data.elements }),
      ...(data.appState !== undefined && { app_state: data.appState }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.isPublic !== undefined && { is_public: data.isPublic }),
      ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
      updated_at: new Date(),
    },
  })
  return mapBoard(updated)
}

export async function deleteBoard(id: string, userId: string): Promise<boolean> {
  const board = await prisma.boards.findFirst({ where: { id, user_id: userId } })
  if (!board) return false

  await prisma.boards.delete({ where: { id } })
  return true
}

export async function getUserBoards(userId: string): Promise<any[]> {
  const boards = await prisma.boards.findMany({
    where: { user_id: userId },
    orderBy: { updated_at: "desc" },
  })
  // Map snake_case (Prisma) to camelCase (frontend)
  return boards.map(b => mapBoard(b))
}
