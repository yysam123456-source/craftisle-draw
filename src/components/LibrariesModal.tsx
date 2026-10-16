"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"

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
  locale?: string
  /** 🔴 已导入库变化时通知父级（用于刷新画布里的 library） */
  onImportedChange?: () => void
}

export default function LibrariesModal({ open, onClose, locale = "en", onImportedChange }: LibrariesModalProps) {
  const t = useTranslations("board")
  const [libraries, setLibraries] = useState<LibraryItem[]>([])
  const [importing, setImporting] = useState<string | null>(null)
  const [doneMsg, setDoneMsg] = useState("")
  const [importedSet, setImportedSet] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState("")
  const [loaded, setLoaded] = useState(false)

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
      .finally(() => setLoaded(true))
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
        setDoneMsg(`⚠️ "${lib.name}" ${t("importNoItems")}`)
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
      onImportedChange?.()

      setDoneMsg(`✅ "${lib.name}" ${t("importSuccess")}`)
    } catch (err: any) {
      setDoneMsg(`❌ ${t("importFailed")} ${err?.message || "Unknown error"}`)
    } finally {
      setImporting(null)
    }
  }, [t, onImportedChange])

  /**
   * 🔴 移除已导入的库。
   * 原先**只能加不能减** ⇒ 库越导越多，画布越来越乱，且没有任何清理入口。
   */
  const handleRemove = useCallback(
    (lib: LibraryItem) => {
      const raw = localStorage.getItem("craftisle-imported-libs")
      const imported: string[] = raw ? JSON.parse(raw) : []
      const next = imported.filter(f => f !== lib.file)
      localStorage.setItem("craftisle-imported-libs", JSON.stringify(next))
      setImportedSet(new Set(next))
      window.dispatchEvent(new Event("craftisle-library-changed"))
      onImportedChange?.()
      setDoneMsg(`🗑 "${lib.name}" ${t("removeSuccess")}`)
    },
    [t, onImportedChange]
  )

  if (!open) return null

  const categories = [...new Set(libraries.map(l => l.category))]

  // 🔴 199 个库无搜索框同样找不到东西 —— 这里也补上（与画布内的组件浏览器是两回事：
  //    这个搜的是 PUBLIC 库目录，那个搜的是已添加的组件）
  const q = search.trim().toLowerCase()
  const terms = q.split(/\s+/).filter(Boolean)
  const visibleLibs = q
    ? libraries.filter(l => {
        const hay = `${l.name} ${l.desc} ${l.category}`.toLowerCase()
        return terms.every(term => hay.includes(term))
      })
    : libraries
  const visibleCats = [...new Set(visibleLibs.map(l => l.category))]

  // Get translated category label
  const getCategoryLabel = (cat: string): string => {
    // Try to get from translations first
    const key = `categories.${cat}` as any
    try {
      const translated = t(key)
      if (translated && translated !== key && translated !== cat) return translated
    } catch {}
    // Fallback to English defaults
    const fallbacks: Record<string, string> = {
      architecture: "Architecture", cloud: "Cloud", diagram: "Diagrams",
      ui: "UI Kit", flowchart: "Flowcharts", template: "Templates",
      shape: "Shapes", figure: "Figures", icon: "Icons",
      chart: "Charts", network: "Network", database: "Database",
      engineering: "Engineering", science: "Science", education: "Education",
      fun: "Fun", general: "General",
    }
    return fallbacks[cat] || cat
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
          <h2 style={{ margin: 0, fontSize: 20 }}>{t("publicLibraries")}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>&times;</button>
        </div>

        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
          {t("librariesDesc")}
        </p>

        {/* 🔴 199 个库没有搜索框同样无从下手 */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t("searchLibraries")}
          style={{
            width: "100%", padding: "8px 12px", marginBottom: 12, fontSize: 14,
            border: "1px solid #d1d5db", borderRadius: 8, outline: "none", boxSizing: "border-box",
          }}
        />
        {q && (
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>
            {visibleLibs.length} / {libraries.length}
          </p>
        )}

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

        {visibleCats.length === 0 && loaded && (
          <p style={{ color: "#9ca3af", fontSize: 14 }}>
            {libraries.length === 0 ? "组件库清单加载失败" : "没有匹配的库"}
          </p>
        )}

        {visibleCats.map(cat => (
          <div key={cat} style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>
              {getCategoryLabel(cat)}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {visibleLibs.filter(l => l.category === cat).map(lib => {
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
                      {isImported ? t("imported") : importing === lib.file ? t("importing") : t("import")}
                    </button>
                    {/* 🔴 已导入的库可移除 —— 原先只能加不能减 */}
                    {isImported && (
                      <button
                        onClick={() => handleRemove(lib)}
                        style={{
                          width: "100%",
                          marginTop: 6,
                          padding: "4px 0",
                          borderRadius: 6,
                          border: "1px solid #fecaca",
                          background: "#fff",
                          color: "#dc2626",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        {t("remove")}
                      </button>
                    )}
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
