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

interface LibrariesModalProps {
  open: boolean
  onClose: () => void
}

export default function LibrariesModal({ open, onClose }: LibrariesModalProps) {
  const [libraries, setLibraries] = useState<LibraryItem[]>([])
  const [importing, setImporting] = useState<string | null>(null)
  const [doneMsg, setDoneMsg] = useState("")
  const [importedSet, setImportedSet] = useState<Set<string>>(new Set())

  // Load manifest + read our own imported-set from localStorage
  useEffect(() => {
    if (!open) return
    setDoneMsg("")
    try {
      const raw = localStorage.getItem("craftisle-imported-libs")
      if (raw) setImportedSet(new Set(JSON.parse(raw)))
    } catch {}

    fetch("/libraries/manifest.json")
      .then(res => res.json())
      .then((data: Manifest) => setLibraries(data.libraries || []))
      .catch(() => setLibraries([]))
  }, [open])

  const handleImport = useCallback(async (lib: LibraryItem) => {
    setImporting(lib.file)
    setDoneMsg("")
    try {
      // 1. Fetch + parse the .excalidrawlib file
      const res = await fetch(`/libraries/${lib.file}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      // Real .excalidrawlib format: { type, version, source, libraryItems: [{id, status, elements, created, name}] }
      let rawItems: any[] = []
      if (data?.libraryItems && Array.isArray(data.libraryItems)) {
        rawItems = data.libraryItems
      } else if (data?.library && Array.isArray(data.library)) {
        rawItems = data.library
      }

      if (rawItems.length === 0) {
        setDoneMsg(`⚠️ "${lib.name}" contains no items.`)
        setImporting(null)
        return
      }

      // Count actual element groups
      const itemCount = rawItems.reduce((sum, item) => sum + (Array.isArray(item.elements) ? 1 : 0), 0)

      // 2. Store the file name in our own localStorage key
      const raw = localStorage.getItem("craftisle-imported-libs")
      const imported: string[] = raw ? JSON.parse(raw) : []
      if (!imported.includes(lib.file)) {
        imported.push(lib.file)
        localStorage.setItem("craftisle-imported-libs", JSON.stringify(imported))
      }

      setImportedSet(new Set(imported))

      // 3. Notify ExcalidrawEditor to re-inject libraries via API (no page refresh needed!)
      window.dispatchEvent(new Event("craftisle-library-changed"))

      setDoneMsg(`✅ "${lib.name}" imported! ${itemCount} items. Check the Library panel on the right — items should appear immediately.`)
    } catch (err: any) {
      setDoneMsg(`❌ Import failed: ${err?.message || "Unknown error"}`)
    } finally {
      setImporting(null)
    }
  }, [])

  if (!open) return null

  const categories = [...new Set(libraries.map(l => l.category))]

  const categoryLabels: Record<string, string> = {
    architecture: "Architecture",
    cloud: "Cloud",
    diagram: "Diagrams",
    ui: "UI Kit",
    flowchart: "Flowcharts",
    template: "Templates",
    shape: "Shapes",
    figure: "Figures",
    icon: "Icons",
    chart: "Charts",
    network: "Network",
    database: "Database",
    engineering: "Engineering",
    science: "Science",
    education: "Education",
    fun: "Fun",
    general: "General",
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
          <h2 style={{ margin: 0, fontSize: 20 }}>Public Libraries</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>&times;</button>
        </div>

        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
          Community libraries from Excalidraw Community. Click Import to add to your Library panel.
        </p>

        {doneMsg && (
          <div style={{
            padding: "8px 12px",
            borderRadius: 8,
            marginBottom: 16,
            background: doneMsg.startsWith("\u2705") ? "#ecfdf5" : doneMsg.startsWith("\u26A0\uFE0F") ? "#fefce8" : "#fef2f2",
            color: doneMsg.startsWith("\u2705") ? "#166534" : doneMsg.startsWith("\u26A0\uFE0F") ? "#92400e" : "#991b1b",
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
              {libraries.filter(l => l.category === cat).map(lib => {
                const isImported = importedSet.has(lib.file)
                return (
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
                        background: isImported
                          ? "#d1d5db"
                          : importing === lib.file
                          ? "#93c5fd"
                          : "#2563eb",
                        color: isImported ? "#6b7280" : "#fff",
                        fontSize: 13,
                        cursor: isImported ? "default" : importing !== null ? "default" : "pointer",
                      }}
                    >
                      {isImported ? "Imported" : importing === lib.file ? "Importing..." : "Import"}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
