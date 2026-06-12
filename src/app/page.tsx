import type { Metadata } from "next"
import { Suspense } from "react"
import BoardList from "@/components/BoardList"
import { auth } from "@/auth"

export const metadata: Metadata = {
  title: "My Boards",
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Boards</h1>

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
