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

export async function createBoard(userId: string, title?: string): Promise<Board> {
  return await prisma.board.create({
    data: {
      title: title ?? "未命名白板",
      userId,
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
