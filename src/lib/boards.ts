import { prisma } from "./db"

function genId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let id = ""
  for (let i = 0; i < 25; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

export async function getBoard(id: string, userId: string): Promise<any> {
  return await prisma.boards.findFirst({
    where: { id, user_id: userId },
  })
}

export async function getPublicBoard(id: string): Promise<any> {
  return await prisma.boards.findFirst({
    where: { id, is_public: true },
  })
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
      console.log(`[resolveUserId] Found user by email: ${byEmail.id} (${userInfo.email})`)
      return byEmail.id
    }
    const created = await prisma.users.create({
      data: {
        email: userInfo.email,
        name: userInfo.name ?? undefined,
        image: userInfo.image ?? undefined,
      },
    })
    console.log(`[resolveUserId] Auto-created user: ${created.id} (${userInfo.email})`)
    return created.id
  }

  console.warn(`[resolveUserId] Cannot resolve userId "${userId}" — no email provided. Letting DB error surface.`)
  return userId
}

export async function createBoard(
  userId: string,
  title?: string,
  userInfo?: { email?: string | null; name?: string | null; image?: string | null }
): Promise<any> {
  const resolvedUserId = await resolveUserId(userId, userInfo)

  return await prisma.boards.create({
    data: {
      id: genId(),
      title: title ?? "Untitled Board",
      user_id: resolvedUserId,
      elements: [],
      app_state: {},
      updated_at: new Date(),
    },
  })
}

export async function updateBoard(
  id: string,
  userId: string,
  data: { elements?: any[]; appState?: any; title?: string; isPublic?: boolean }
): Promise<any> {
  const board = await prisma.boards.findFirst({ where: { id, user_id: userId } })
  if (!board) return null

  return await prisma.boards.update({
    where: { id },
    data: {
      ...(data.elements !== undefined && { elements: data.elements }),
      ...(data.appState !== undefined && { app_state: data.appState }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.isPublic !== undefined && { is_public: data.isPublic }),
      updated_at: new Date(),
    },
  })
}

export async function deleteBoard(id: string, userId: string): Promise<boolean> {
  const board = await prisma.boards.findFirst({ where: { id, user_id: userId } })
  if (!board) return false

  await prisma.boards.delete({ where: { id } })
  return true
}

export async function getUserBoards(userId: string): Promise<any[]> {
  return await prisma.boards.findMany({
    where: { user_id: userId },
    orderBy: { updated_at: "desc" },
  })
}
