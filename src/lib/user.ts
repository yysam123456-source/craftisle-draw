import { prisma } from "./db"

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  })
}
