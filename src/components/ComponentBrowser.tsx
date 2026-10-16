"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useTranslations } from "next-intl"
import { exportToSvg, convertToExcalidrawElements } from "@excalidraw/excalidraw"

/**
 * 组件浏览器（画布内）—— 解决「导入的库多了就找不到组件」。
 *
 * 🔴 为什么需要它（实测依据，不是主观判断）：
 *  - 站内 199 个库共 **3049 个组件**（icon 665 / cloud 606 / ui 305 …）
 *  - Excalidraw 0.18.1 **原生 library 面板不支持分类**：生产包
 *    dist/prod/index.js 里 "categories" 出现 **0 次** ⇒ 无法按类筛选
 *  - 其中 **927 个组件（30%）连 name 都没有** ⇒ 原生搜索框也搜不到
 *  - 现有注入逻辑是 `updateLibrary({ merge: true })`，**只增不减**，
 *    没有移除库的入口
 *
 * 本面板提供：按库分组 + 名称搜索（含模糊/多关键词）+ 缩略图 + 点击插入画布。
 * 只显示**已导入**的库（localStorage: craftisle-imported-libs），量小、加载快。
 */

interface LibraryItem {
  file: string
  name: string
  desc: string
  category: string
}

/** 归一化后的单个组件（两种源格式统一成这一种） */
interface ComponentEntry {
  /** 稳定 key：file#index */
  key: string
  /** 所属库文件名 */
  file: string
  /** 所属库显示名 */
  libName: string
  /** 所属分类 */
  category: string
  /** 组件名（可能为空 —— 原生搜索框搜不到的就是这批） */
  name: string
  /** 原始元素数组，插入画布时用 */
  elements: any[]
}

interface Props {
  open: boolean
  onClose: () => void
  /** 由父级（ExcalidrawEditor）透传的 excalidraw api */
  api: any
  /** 导入库变化时自增，用于触发重新加载 */
  refreshKey: number
}

const CATEGORY_LABELS: Record<string, string> = {
  architecture: "Architecture", cloud: "Cloud", diagram: "Diagrams",
  ui: "UI Kit", flowchart: "Flowcharts", template: "Templates",
  shape: "Shapes", figure: "Figures", icon: "Icons",
  chart: "Charts", network: "Network", database: "Database",
  engineering: "Engineering", science: "Science", education: "Education",
  fun: "Fun", general: "General",
}

/** 单个组件的缩略图。用 Excalidraw 官方 exportToSvg 渲染，保证与画布一致。 */
function Thumb({ entry }: { entry: ComponentEntry }) {
  const [svg, setSvg] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    // 组件多时错峰渲染，避免一次性跑几千次 exportToSvg 卡住主线程
    const timer = setTimeout(async () => {
      try {
        const els = convertToExcalidrawElements(entry.elements as any)
        if (!els.length) throw new Error("no elements")
        const out = await exportToSvg({
          elements: els,
          appState: { viewBackgroundColor: "#ffffff", exportWithDarkMode: false } as any,
          files: null as any,
        })
        if (cancelled) return
        const markup = (out as any)?.svg ?? ""
        if (!markup) throw new Error("empty svg")
        // 只保留内联样式，去掉可能带外部引用的部分
        const cleaned = markup
          .replace(/<style[\s\S]*?<\/style>/g, "")
          .replace(/font-family:\s*["'][^"']*["']/g, "font-family: sans-serif")
        setSvg(cleaned)
      } catch {
        if (!cancelled) setFailed(true)
      }
    }, 0)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [entry])

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 px-1 text-center">
        {entry.name || "—"}
      </div>
    )
  }
  if (!svg) {
    return <div className="w-full h-full bg-gray-50 animate-pulse rounded" />
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default function ComponentBrowser({ open, onClose, api, refreshKey }: Props) {
  const t = useTranslations("board")
  const [entries, setEntries] = useState<ComponentEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [activeLib, setActiveLib] = useState<string>("all")
  const [inserting, setInserting] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // 加载已导入库的全部组件
  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)

    ;(async () => {
      try {
        const raw = localStorage.getItem("craftisle-imported-libs")
        const files: string[] = raw ? JSON.parse(raw) : []
        if (!files.length) {
          if (!cancelled) { setEntries([]); setLoading(false) }
          return
        }

        // manifest 用来拿到库名/分类（展示用）
        let meta: Record<string, LibraryItem> = {}
        try {
          const mf = await fetch("/libraries/manifest.json").then(r => r.json())
          for (const l of mf?.libraries ?? []) meta[l.file] = l
        } catch { /* manifest 缺失不致命，用文件名兜底 */ }

        const out: ComponentEntry[] = []
        let failedLibs = 0
        for (const file of files) {
          try {
            const res = await fetch(`/libraries/${file}`)
            if (!res.ok) { failedLibs++; continue }
            // 🔴 system-design.excalidrawlib 实测 JSON 解析就会失败 ⇒ 必须单库 try/catch 隔离
            const data = await res.json()
            const info = meta[file]
            const libName = info?.name ?? file.replace(/\.excalidrawlib$/, "")
            const category = info?.category ?? "general"

            // 🔴 两种源格式都要处理（实测 128 个用 libraryItems、70 个用 library）
            let rawItems: any[] = []
            if (Array.isArray(data?.libraryItems)) {
              rawItems = data.libraryItems
            } else if (Array.isArray(data?.library)) {
              rawItems = data.library
            }

            rawItems.forEach((it: any, idx: number) => {
              const els = Array.isArray(it) ? it : it?.elements
              if (!Array.isArray(els) || els.length === 0) return
              out.push({
                key: `${file}#${idx}`,
                file,
                libName,
                category,
                // 🔴 927/3049 个组件没有 name ⇒ 回退到「库名 + 序号」，
                // 否则它们在任何搜索框里都搜不到（这正是「找不到」的一部分原因）
                name: (typeof it === "object" && it?.name ? String(it.name).trim() : "") || `${libName} ${idx + 1}`,
                elements: els,
              })
            })
          } catch { failedLibs++ /* 单个库失败不影响其它 */ }
        }
        if (failedLibs > 0) {
          console.warn(`[lib] ${failedLibs} 个库加载失败，已跳过`)
        }
        if (!cancelled) setEntries(out)
      } catch {
        if (!cancelled) setEntries([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [open, refreshKey])

  // 打开时自动聚焦搜索框
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50)
  }, [open])

  // 搜索：多关键词 AND，容忍大小写与顺序
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = entries
    if (activeLib !== "all") list = list.filter(e => e.file === activeLib)
    if (!q) return list
    const terms = q.split(/\s+/).filter(Boolean)
    return list.filter(e => {
      const hay = `${e.name} ${e.libName} ${e.category}`.toLowerCase()
      return terms.every(term => hay.includes(term))
    })
  }, [entries, query, activeLib])

  // 已导入的库列表（带组件数）
  const libList = useMemo(() => {
    const m = new Map<string, { file: string; name: string; category: string; count: number }>()
    for (const e of entries) {
      const cur = m.get(e.file)
      if (cur) cur.count++
      else m.set(e.file, { file: e.file, name: e.libName, category: e.category, count: 1 })
    }
    return [...m.values()].sort((a, b) => b.count - a.count)
  }, [entries])

  /** 把组件元素插入画布视口中心 */
  const handleInsert = useCallback(async (entry: ComponentEntry) => {
    if (!api) return
    setInserting(entry.key)
    try {
      const els = convertToExcalidrawElements(entry.elements as any)
      if (!els.length) return

      // 归一化坐标到原点，再按包围盒平移到画布中心
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      for (const el of els) {
        const x = (el as any).x ?? 0
        const y = (el as any).y ?? 0
        const w = (el as any).width ?? 0
        const h = (el as any).height ?? 0
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x + w)
        maxY = Math.max(maxY, y + h)
      }
      const w = maxX - minX
      const h = maxY - minY

      // 视口中心（scene 坐标）
      const state = api.getAppState?.()
      const zoom = state?.zoom?.value ?? 1
      const cx = ((state?.scrollX ?? 0) + (state?.width ?? 800) / 2 / zoom) + minX - w / 2
      const cy = ((state?.scrollY ?? 0) + (state?.height ?? 600) / 2 / zoom) + minY - h / 2

      const placed = els.map((el: any) => ({
        ...el,
        x: (el.x ?? 0) - minX + cx,
        y: (el.y ?? 0) - minY + cy,
      }))

      api.updateScene?.({
        elements: [...(api.getSceneElements?.() ?? []), ...placed],
      })
      api.refresh?.()
    } catch (e) {
      console.error("[lib] insert failed:", e)
    } finally {
      setInserting(null)
    }
  }, [api])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100001] bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{t("componentBrowser")}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {loading
                ? t("loadingLibraries")
                : `${filtered.length} / ${entries.length} ${t("componentsCount")} · ${libList.length} ${t("librariesCount")}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none px-2"
            aria-label="close"
          >
            &times;
          </button>
        </div>

        {/* 搜索 + 库筛选 */}
        <div className="px-5 py-3 border-b border-gray-200 space-y-3">
          <div className="relative">
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t("searchComponents")}
              className="w-full px-3 py-2 pr-9 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="clear"
              >
                &times;
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            <button
              onClick={() => setActiveLib("all")}
              className={`px-2.5 py-1 text-xs rounded-full border ${
                activeLib === "all"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {t("allLibraries")} ({entries.length})
            </button>
            {libList.map(l => (
              <button
                key={l.file}
                onClick={() => setActiveLib(l.file)}
                className={`px-2.5 py-1 text-xs rounded-full border ${
                  activeLib === l.file
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {l.name} ({l.count})
              </button>
            ))}
          </div>
        </div>

        {/* 组件网格 */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
          {loading ? (
            <p className="text-center text-gray-400 py-12 text-sm">{t("loadingLibraries")}</p>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">{t("noLibrariesImported")}</p>
              <p className="text-gray-400 text-xs mt-1">{t("librariesDesc")}</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-12 text-sm">
              {t("noComponentsFound")}：{query}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filtered.map(e => (
                <button
                  key={e.key}
                  onClick={() => handleInsert(e)}
                  disabled={inserting !== null}
                  className="group bg-white border border-gray-200 rounded-lg p-2 hover:border-blue-400 hover:shadow-md transition disabled:opacity-50 text-left"
                  title={`${e.name} · ${e.libName}`}
                >
                  <div className="h-20 mb-1.5 pointer-events-none">
                    <Thumb entry={e} />
                  </div>
                  <div className="text-[11px] font-medium text-gray-800 truncate leading-tight">
                    {inserting === e.key ? "…" : e.name}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {e.libName}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}