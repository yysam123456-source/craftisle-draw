import { prisma } from "./db"
import type { Board } from "@prisma/client"

export async function getBoard(id: string, userId: string): Promise<Board | null> {
  return await prisma.board.findFirst({
    where: { id, userId },
  })
}

export async function getPublicBoard(id: string): Promise<Board | null> {
  return await prisma.board.findFirst({
    where: { id, isPublic: true },
  })
}

/**
 * Ensure a user record exists in the database.
 * Returns the actual database user ID (cuid).
 * If the given userId doesn't match any user, creates one and returns the new ID.
 */
export async function resolveUserId(
  userId: string,
  userInfo?: { email?: string; name?: string; image?: string }
): Promise<string> {
  // Check if userId already exists as a valid user
  const existing = await prisma.users.findUnique({ where: { id: userId } })
  if (existing) return userId

  // User doesn't exist — need to create or find by email
  if (userInfo?.email) {
    // Try finding by email (user may have been created with different ID)
    const byEmail = await prisma.users.findUnique({ where: { email: userInfo.email } })
    if (byEmail) return byEmail.id

    // Create new user record with email
    const created = await prisma.users.create({
      data: {
        email: userInfo.email,
        name: userInfo.name,
        image: userInfo.image,
      },
    })
    console.warn("[boards] Auto-created user record:", created.id, created.email)
    return created.id
  }

  // No email available — create minimal user record
  // This handles edge cases where session has no email
  const created = await prisma.users.create({
    data: {
      name: userInfo?.name ?? "Unknown User",
    },
  })
  console.warn("[boards] Auto-created minimal user record:", created.id)
  return created.id
}

export async function createBoard(
  userId: string,
  title?: string,
  userInfo?: { email?: string; name?: string; image?: string }
): Promise<Board> {
  // Ensure the user exists in DB before creating board (prevents FK constraint error)
  const resolvedUserId = await resolveUserId(userId, userInfo)

  return await prisma.board.create({
    data: {
      title: title ?? "Untitled Board",
      userId: resolvedUserId,
      elements: [],
      appState: {},
    },
  })
}

export async function updateBoard(
  id: string,
  userId: string,
  data: { elements?: any[]; appState?: any; title?: string; isPublic?: boolean }
): Promise<Board | null> {
  const board = await prisma.board.findFirst({ where: { id, userId } })
  if (!board) return null

  return await prisma.board.update({
    where: { id },
    data: {
      ...(data.elements !== undefined && { elements: data.elements }),
      ...(data.appState !== undefined && { appState: data.appState }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      updatedAt: new Date(),
    },
  })
}

export async function deleteBoard(id: string, userId: string): Promise<boolean> {
  const board = await prisma.board.findFirst({ where: { id, userId } })
  if (!board) return false

  await prisma.board.delete({ where: { id } })
  return true
}

export async function getUserBoards(userId: string): Promise<Board[]> {
  return await prisma.board.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  })
}
