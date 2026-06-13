// Clean collaborators field from all boards' appState
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Use snake_case field names (Prisma Client uses DB column names)
  const boards = await prisma.boards.findMany({
    select: { id: true, app_state: true }
  })

  let cleaned = 0
  for (const board of boards) {
    if (board.app_state && typeof board.app_state === 'object' && board.app_state.collaborators !== undefined) {
      const { collaborators, ...rest } = board.app_state
      await prisma.boards.update({
        where: { id: board.id },
        data: { app_state: rest }
      })
      cleaned++
      console.log(`Cleaned board ${board.id}`)
    }
  }

  console.log(`Done! Cleaned ${cleaned} board(s).`)
}

main().finally(() => prisma.$disconnect())
