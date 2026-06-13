import Link from "next/link"

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Board Not Found</h2>
      <p className="text-gray-600 mb-6">
        The board you are looking for does not exist or you don not have access.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  )
}
