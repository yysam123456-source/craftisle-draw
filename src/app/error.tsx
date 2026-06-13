"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[GlobalError]", error)
  }, [error])

  return (
    <div className="h-screen flex flex-col items-center justify-center p-8 bg-red-50">
      <h1 className="text-2xl font-bold text-red-700 mb-4">Application Error</h1>
      <p className="text-sm text-red-500 mb-6">Something went wrong while loading this page.</p>
      <div className="bg-white border border-red-200 rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Error Details</h2>
        <p className="text-sm font-mono text-red-600 mb-2">{error.name}: {error.message}</p>
        {error.digest && (
          <p className="text-xs text-gray-500 mb-2">Digest: {error.digest}</p>
        )}
        <details className="mt-4">
          <summary className="text-sm text-gray-600 cursor-pointer">Stack trace</summary>
          <pre className="mt-2 text-xs text-gray-500 overflow-auto max-h-64 p-2 bg-gray-50 rounded">
            {error.stack}
          </pre>
        </details>
      </div>
      <button
        onClick={reset}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Try again
      </button>
    </div>
  )
}
