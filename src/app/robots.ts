import { MetadataRoute } from "next"

// AI 爬虫逐条具名声明（GEO）：通配符组已经放开，但具名组的价值在于
// ① 服务端日志能区分是哪家引擎在抓 ② 将来收紧 `*` 时不会连带掐掉生成式引擎。
//
// 🔴 robots 分组语义：命中专属组即**忽略** `*` 组。
//    所以 disallow 必须在每个具名组里重复一遍——只写在 `*` 里的话，
//    加了具名组反而会让这些爬虫获准访问 /api/ 和 /board/。
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot", // ChatGPT Search 收录/退出的管理 bot（11-04 八站审计补齐）
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
]

const ALLOW = ["/", "/share/"]
const DISALLOW = ["/api/", "/board/", "/test-board"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ALLOW,
        disallow: DISALLOW,
      },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: ALLOW,
        disallow: DISALLOW,
      })),
    ],
    sitemap: "https://draw.craftisle.com/sitemap.xml",
  }
}
