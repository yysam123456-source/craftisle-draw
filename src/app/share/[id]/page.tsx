import { notFound } from "next/navigation"
import ExcalidrawEditor from "@/components/ExcalidrawEditorWrapper"
import { getPublicBoard } from "@/lib/boards"

export const dynamic = "force-dynamic"

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const board = await getPublicBoard(id)

  if (!board) notFound()

  return (
    <div className="h-screen">
      <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
        <span>Read-only preview</span>
        <a href="/" className="text-blue-600 hover:underline ml-auto">
          Back to Home
        </a>
      </div>
      <ExcalidrawEditor
        boardId={id}
        initialData={{
          elements: board.elements as any[],
          appState: board.appState as any,
        }}
        readOnly={true}
      />
    </div>
  )
}
