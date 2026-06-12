import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import ExcalidrawEditor from "@/components/ExcalidrawEditorWrapper"
import { getBoard } from "@/lib/boards"

export const dynamic = "force-dynamic"

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let session = null
  try {
    session = await auth()
  } catch {
    // JWT validation failed (cross-subdomain cookie mismatch)
    // Redirect to signin with callbackUrl so the user comes back here
  }
  const user = session?.user
  if (!user) {
    const callbackUrl = encodeURIComponent("/board/" + id)
    return redirect("/api/auth/signin?callbackUrl=" + callbackUrl)
  }

  const userId = user!.id!
  const board = await getBoard(id, userId)
  if (!board) notFound()

  return (
    <ExcalidrawEditor
      boardId={id}
      initialData={{
        elements: board.elements as any[],
        appState: board.appState as any,
      }}
      readOnly={false}
      onSave={async (elements, appState) => {
        await fetch(`/api/boards/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ elements, appState }),
        })
      }}
    />
  )
}
