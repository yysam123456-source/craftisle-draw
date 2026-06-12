import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { SessionProvider } from "next-auth/react"

export const dynamic = "force-dynamic"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Craftisle Draw — 在线白板",
  description: "基于 Excalidraw 的在线手绘白板工具",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}
