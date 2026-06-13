"use client"

import { useEffect, useState } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [info, setInfo] = useState("")

  useEffect(() => {
    console.error("Global error boundary caught:", error)
    fetch("/api/debug-error", {
      method: "POST",
      body: JSON.stringify({
        message: error?.message,
        stack: error?.stack?.substring(0, 2000),
        digest: error?.digest,
        url: typeof window !== "undefined" ? window.location.href : "",
      }),
    }).catch(() => {})
  }, [error])

  return (
    <div style={{ padding: 40, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ color: "#e53e3e" }}>白板加载出错</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        服务器渲染时发生错误，请尝试刷新页面。
      </p>
      <div style={{ background: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 20, marginBottom: 20 }}>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>错误详情：</p>
        <pre style={{ background: "#1a202c", color: "#68d391", padding: 16, borderRadius: 6, overflow: "auto", fontSize: 13, lineHeight: 1.5 }}>
          {error?.message || "未知错误"}
          {"\n"}
          {error?.digest && `Digest: ${error.digest}`}
          {"\n"}
          {error?.stack?.substring(0, 800)}
        </pre>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => reset()}
          style={{ padding: "10px 20px", background: "#4299e1", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          重试
        </button>
        <a
          href="/"
          style={{ padding: "10px 20px", background: "#e2e8f0", color: "#2d3748", border: "none", borderRadius: 6, textDecoration: "none" }}
        >
          返回首页
        </a>
      </div>
    </div>
  )
}
