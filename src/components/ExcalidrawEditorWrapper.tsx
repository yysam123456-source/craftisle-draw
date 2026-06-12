"use client"

import dynamic from "next/dynamic"

const ExcalidrawEditor = dynamic(
  () => import("@/components/ExcalidrawEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading board editor...</p>
      </div>
    ),
  }
)

export default ExcalidrawEditor
