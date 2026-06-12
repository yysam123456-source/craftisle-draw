import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import ExcalidrawEditor from "@/components/ExcalidrawEditorWrapper"
import { getBoard, createBoard } from "@/lib/boards"

export const dynamic = "force-dynamic"

// Test mode: hardcoded test user ID (bypasses Google OAuth)
const TEST_USER_ID = "test-user-0000-0000-0000-000000000001"

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ test?: string }>
}) {
  const { id } = await params
  const { test } = await searchParams
  const isTest = test === "1"

  // In test mode, skip auth and use test user
  let userId: string
  if (isTest) {
    userId = TEST_USER_ID
  } else {
    let session = null
    try {
      session = await auth()
    } catch {
      // JWT validation failed
    }
    const user = session?.user
    if (!user) {
      const callbackUrl = encodeURIComponent("/board/" + id)
      return redirect("/api/auth/signin?callbackUrl=" + callbackUrl)
    }
    userId = user!.id!
  }

  let board = await getBoard(id, userId)
  if (!board) {
    if (isTest) {
      // Auto-create a test board (title defaults to "Untitled Board")
      board = await createBoard(userId)
    }
    if (!board) notFound()
  }

  const boardId = board.id  // always use the actual board ID
  const isTestMode = isTest

  return (
    <ExcalidrawEditor
      boardId={boardId}
      initialData={{
        elements: board.elements as any[],
        appState: board.appState as any,
      }}
      readOnly={false}
      onSave={
        isTestMode
          ? undefined  // disable auto-save in test mode
          : async (elements: any[], appState: any) => {
              await fetch(`/api/boards/${boardId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ elements, appState }),
              })
            }
      }
    />
  )
}
