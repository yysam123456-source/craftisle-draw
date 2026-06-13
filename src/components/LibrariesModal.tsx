"use client"

import { useState, useEffect, useCallback } from "react"

interface LibraryItem {
  file: string
  name: string
  desc: string
  category: string
}

interface Manifest {
  version: number
  libraries: LibraryItem[]
}

export default function LibrariesModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [libraries, setLibraries] = useState<LibraryItem[]>([])
  const [importing, setImporting] = useState<string | null>(null)
  const [doneMsg, setDoneMsg] = useState("")

  useEffect(() => {
    if (!open) return
    fetch("/libraries/manifest.json")
      .then(res => res.json())
      .then((data: Manifest) => setLibraries(data.libraries || []))
      .catch(() => setLibraries([]))
  }, [open])

  const handleImport = useCallback(async (lib: LibraryItem) => {
    setImporting(lib.file)
    setDoneMsg("")
    try {
      const res = await fetch(`/libraries/${lib.file}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const items = await res.json()
      if (!Array.isArray(items)) throw new Error("Invalid library format")

      // Read existing library from localStorage
      const key = "excalidraw-library"
      let store: any[] = []
      try {
        const raw = localStorage.getItem(key)
        if (raw) store = JSON.parse(raw)
      } catch {}

      // Check if already imported (by file name)
      const existingIdx = store.findIndex(
        (entry: any) => entry._craftisleSource === lib.file
      )
      const entry = {
        id: existingIdx >= 0 ? store[existingIdx].id : crypto.randomUUID(),
        name: lib.name,
        items,
        created: existingIdx >= 0 ? store[existingIdx].created : Date.now(),
        _craftisleSource: lib.file,
      }
      if (existingIdx >= 0) {
        store[existingIdx] = entry
      } else {
        store.push(entry)
      }

      localStorage.setItem(key, JSON.stringify(store))
      setDoneMsg(`✅ 「${lib.name}」已导入，在左侧 Library 面板查看`)
    } catch (err: any) {
      setDoneMsg(`❌ 导入失败: ${err?.message || err}`)
    } finally {
      setImporting(null)
    }
  }, [])

  if (!open) return null

  const categories = [...new Set(libraries.map(l => l.category))]

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "90vw",
          maxWidth: 720,
          maxHeight: "80vh",
          overflow: "auto",
          padding: 24,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>📚 公共素材库</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>

        {doneMsg && (
          <div style={{
            padding: "8px 12px",
            borderRadius: 8,
            marginBottom: 16,
            background: doneMsg.startsWith("✅") ? "#ecfdf5" : "#fef2f2",
            color: doneMsg.startsWith("✅") ? "#166534" : "#991b1b",
            fontSize: 13,
          }}>
            {doneMsg}
          </div>
        )}

        {categories.map(cat => (
          <div key={cat} style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              {cat === "architecture" ? "🏗️ 架构图" :
               cat === "diagram" ? "📊 图表" :
               cat === "ui" ? "📱 UI 组件" :
               cat === "flowchart" ? "🔀 流程图" :
               cat === "template" ? "📋 模板" :
               cat === "shape" ? "🔷 形状" :
               cat === "figure" ? "🧑 人物" :
               cat === "general" ? "📌 通用" : cat}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {libraries.filter(l => l.category === cat).map(lib => (
                <div key={lib.file} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{lib.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>{lib.desc}</div>
                  </div>
                  <button
                    disabled={importing !== null}
                    onClick={() => handleImport(lib)}
                    style={{
                      width: "100%",
                      padding: "6px 0",
                      borderRadius: 6,
                      border: "none",
                      background: importing === lib.file ? "#d1d5db" : "#2563eb",
                      color: "#fff",
                      fontSize: 13,
                      cursor: importing !== null ? "default" : "pointer",
                    }}
                  >
                    {importing === lib.file ? "导入中..." : "导入到我的素材库"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
          素材来源：<a href="https://libraries.excalidraw.com" target="_blank" rel="noreferrer">Excalidraw 社区</a>（MIT 协议）
        </p>
      </div>
    </div>
  )
}
