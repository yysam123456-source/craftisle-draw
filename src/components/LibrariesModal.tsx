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
    setDoneMsg("")
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
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = lib.file
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDoneMsg(
        `✅ "${lib.name}" downloaded! ` +
        `In Excalidraw, open the Library panel (📚 icon on the left) → click "Import to library" → select the downloaded file.`
      )
    } catch (err: any) {
      setDoneMsg(`❌ Download failed: ${err?.message || "Unknown error"}`)
    } finally {
      setImporting(null)
    }
  }, [])

  if (!open) return null

  const categories = [...new Set(libraries.map(l => l.category))]

  const categoryLabels: Record<string, string> = {
    architecture: "🏗️ Architecture",
    cloud: "☁️ Cloud",
    diagram: "📊 Diagrams",
    ui: "📱 UI Kit",
    flowchart: "🔀 Flowcharts",
    template: "📋 Templates",
    shape: "🔷 Shapes",
    figure: "🧑 Figures",
    icon: "�icons",
    chart: "📈 Charts",
    network: "🌐 Network",
    database: "🗄️ Database",
    engineering: "⚙️ Engineering",
    science: "🔬 Science",
    education: "🎓 Education",
    fun: "🎨 Fun",
    general: "📌 General",
  }

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
          <h2 style={{ margin: 0, fontSize: 20 }}>📚 Public Libraries</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>

        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
          Import community libraries from <a href="https://libraries.excalidraw.com" target="_blank" rel="noreferrer">Excalidraw Community</a>. Click "Import" to add to your Library panel.
        </p>

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

        {categories.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: 14 }}>Loading libraries...</p>
        )}

        {categories.map(cat => (
          <div key={cat} style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>
              {categoryLabels[cat] || cat}
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
                    {importing === lib.file ? "Importing..." : "Import to My Library"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
