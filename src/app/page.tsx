import type { Metadata } from "next"
import { Suspense } from "react"
import BoardList from "@/components/BoardList"
import { auth } from "@/auth"

export const metadata: Metadata = {
  title: "Free Online Whiteboard | Craftisle Draw",
  description:
    "Create hand-drawn diagrams, flowcharts, and collaborative boards with Craftisle Draw. Free online whiteboard tool powered by Excalidraw. No signup required for testing.",
}

export default async function HomePage() {
  let session = null
  try {
    session = await auth()
  } catch {
    // JWT validation failed (e.g. cross-subdomain cookie mismatch)
    // Silently show logged-out state
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Boards</h1>
        <p className="mt-2 text-gray-600">
          Create and manage your whiteboards. 
          <a href="/board/new" className="text-blue-600 hover:underline">Create a new board</a> or 
          <a href="https://craftisle.com" className="text-blue-600 hover:underline">learn more about Craftisle</a>.
        </p>
      </header>

      {session?.user ? (
        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <BoardList userId={session.user.id!} />
        </Suspense>
      ) : (
        <div className="text-center py-24 text-gray-500">
          <p className="text-xl mb-4">Please sign in to view your boards</p>
          <a href="/api/auth/signin" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </div>
      )}
    </div>
  )
}
