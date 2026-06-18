import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Not Found | Craftisle Draw",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Craftisle Draw
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md">
            Sorry, we couldn't find the page you're looking for. 
            The board may have been deleted or the URL might be incorrect.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/board/new"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Create New Board
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          © 2026 Craftisle. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
