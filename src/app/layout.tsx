import type { Metadata, Viewport } from "next"
import { headers } from "next/headers"
import { locales, defaultLocale } from "@/i18n/request"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { AdLoader } from "@/components/AdLoader"
import { AdSenseLoader } from "@/components/AdSenseLoader"

export const metadata: Metadata = {
  title: {
    default: "Craftisle Draw — Free Online Excalidraw Whiteboard",
    template: "%s | Craftisle Draw",
  },
  // 🔴 文案必须对得上运行时：本站没有实时协作层（Excalidraw 的 collaboration
  //    需要独立后端），且创建/保存画板需要登录。原先的 "Real-time collaboration"
  //    "No signup required for testing" 都是可被当场证伪的声明。
  description:
    "A free whiteboard in the browser, built on Excalidraw. Sketch hand-drawn diagrams, flowcharts and notes on an infinite canvas, save boards to your account, and export to PNG, SVG or JSON. A finished board can be shared as a read-only link.",
  keywords: [
    "online whiteboard",
    "excalidraw",
    "free whiteboard",
    "online diagram tool",
    "flowchart maker",
    "mind map tool",
    "digital whiteboard",
    "hand drawn diagram tool online",
    "whiteboard export png svg",
    "online canvas for drawing",
    "whiteboard for teaching",
    "free diagram tool online",
    "excalidraw alternative",
    "browser whiteboard app",
  ],
  authors: [{ name: "Craftisle" }],
  creator: "Craftisle",
  publisher: "Craftisle",
  metadataBase: new URL("https://draw.craftisle.com"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  applicationName: "Craftisle Draw",
  openGraph: {
    title: "Craftisle Draw — Free Online Whiteboard",
    description:
      "Free whiteboard in the browser, built on Excalidraw: hand-drawn diagrams, flowcharts and notes on an infinite canvas, with PNG, SVG and JSON export.",
    url: "https://draw.craftisle.com",
    siteName: "Craftisle Draw",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Craftisle Draw - Online Whiteboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Craftisle Draw — Free Online Whiteboard",
    description:
      "Free whiteboard in the browser, built on Excalidraw: hand-drawn diagrams, flowcharts and notes on an infinite canvas, with PNG, SVG and JSON export.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    ...(process.env.GOOGLE_SITE_VERIFICATION && process.env.GOOGLE_SITE_VERIFICATION !== "PLACEHOLDER_VERIFICATION_CODE"
      ? { "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.BING_SITE_VERIFICATION && process.env.BING_SITE_VERIFICATION !== "BING_VERIFICATION_CODE"
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : {}),
  },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION && process.env.GOOGLE_SITE_VERIFICATION !== "PLACEHOLDER_VERIFICATION_CODE"
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Craftisle Draw",
      description:
        "Free whiteboard in the browser, built on Excalidraw: hand-drawn diagrams, flowcharts and notes on an infinite canvas, with PNG, SVG and JSON export.",
      url: "https://draw.craftisle.com",
      applicationCategory: "Productivity",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      screenshot: "https://draw.craftisle.com/og-image.png",
      featureList: [
        "Infinite canvas",
        "Hand-drawn style",
        "Excalidraw element library",
        "Export to PNG, SVG and JSON",
        "Read-only board sharing",
        "Boards saved to your account",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://craftisle.com/#organization",
      name: "Craftisle",
      url: "https://draw.craftisle.com",
      logo: "https://draw.craftisle.com/logo.png",
      sameAs: [
        "https://craftisle.com",
        "https://twitter.com/craftisle",
        "https://github.com/craftisle",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        url: "https://craftisle.com/contact",
      },
    },
    {
      "@type": "WebSite",
      url: "https://draw.craftisle.com",
      name: "Craftisle Draw",
      description:
        "Free whiteboard in the browser, built on Excalidraw: hand-drawn diagrams, flowcharts and notes on an infinite canvas, with PNG, SVG and JSON export.",
      publisher: {
        "@id": "https://craftisle.com/#organization",
      },
      // NOTE: the previous potentialAction (SearchAction -> /search?q=...) was
      // removed: draw.craftisle.com has no /search route, so the target was a
      // dead URL, and Google retired the sitelinks search box in late 2024.
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://draw.craftisle.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Create Board",
          item: "https://draw.craftisle.com/board/new",
        },
      ],
    },
  ],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

/**
 * 🔴 2026-11-05（DEBT-48）：`<html lang>` 必须与页面实际语言一致。
 * 原先写死 "en"，16 个语种（ja/ko/ar/...）的 title 已本地化却全部谎报英语。
 *
 * 为什么不用「把 [locale]/layout.tsx 提升为根布局」那套（pdfcraft DEBT-47 的做法）：
 * draw 的根布局有 222 行且内含 JSON-LD、manifest、msapplication、广告组件，
 * 搬迁还要处理根级 error/not-found 的多根布局分组，风险高得多。
 *
 * 实际可用的是 next-intl 自己的官方契约：middleware 把解析出的 locale 写进
 * 请求头 `X-NEXT-INTL-LOCALE`（HEADER_LOCALE_NAME），并通过
 * `NextResponse.next({ request: { headers } })` 透传给下游；next-intl 的
 * `getLocale()` 也是读这个头。所以根布局用 headers() 即可**服务端**拿到真实
 * locale，零结构改动、零客户端脚本、SSR 原始 HTML 就是对的。
 *
 * 白名单校验：值不在 locales 里就退回 defaultLocale —— 既符合「宁可漏报
 * 不可错报」，也避免外部请求头注入任意 lang。
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const requestHeaders = await headers()
  const raw = requestHeaders.get("X-NEXT-INTL-LOCALE")
  const lang = raw && (locales as readonly string[]).includes(raw) ? raw : defaultLocale
  return (
    <html lang={lang}>
      <head>
        {/* Monetag site verification */}
        <meta name="monetag" content="95c89403a193eef38bbc05e97d7c067c" />
        {/*
          JSON-LD must be an inline server-rendered script tag.
          Previously this used next/script strategy="beforeInteractive", which
          Next only honours inside the root layout's <head> for external scripts;
          the inline payload ended up injected at hydration time, so a raw HTML
          fetch of the page contained no structured data at all.
        */}
        <script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Craftisle Draw" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="font-sans">
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID !== 'G-XXXXXXXX' && (
          <GoogleAnalytics />
        )}
        {children}
        {/* Dynamic ad loading via centralized config */}
        <AdLoader />
        <AdSenseLoader />
      </body>
    </html>
  )
}
