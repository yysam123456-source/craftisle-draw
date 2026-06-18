import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ExcalidrawEditor from "@/components/ExcalidrawEditorWrapper"
import { getPublicBoard } from "@/lib/boards"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const board = await getPublicBoard(id)

  if (!board) {
    return {
      title: "Board Not Found | Craftisle Draw",
    }
  }

  const title = board.title || "Untitled Board"
  const description = `View "${title}" on Craftisle Draw - Free online whiteboard tool powered by Excalidraw.`

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Craftisle Draw`,
      description,
      url: `https://draw.craftisle.com/share/${id}`,
      siteName: "Craftisle Draw",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Craftisle Draw`,
      description,
    },
  }
}

export const dynamic = "force-dynamic"

export default async function SharePage({ params }: Props) {
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
