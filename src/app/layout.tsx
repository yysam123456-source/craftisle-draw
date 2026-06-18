import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { SessionProvider } from "next-auth/react"
import Script from "next/script"
import GoogleAnalytics from "@/components/GoogleAnalytics"

export const dynamic = "force-dynamic"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Craftisle Draw — Free Online Whiteboard & Collaborative Drawing Tool",
    template: "%s | Craftisle Draw",
  },
  description:
    "Free online whiteboard tool powered by Excalidraw. Create hand-drawn diagrams, flowcharts, and collaborative boards. No signup required for testing. Real-time collaboration, infinite canvas, and export to PNG/SVG.",
  keywords: [
    "online whiteboard",
    "collaborative drawing",
    "excalidraw",
    "free whiteboard",
    "online diagram tool",
    "flowchart maker",
    "mind map tool",
    "digital whiteboard",
    "virtual whiteboard",
    "team collaboration tool",
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
      "Free online whiteboard tool powered by Excalidraw. Create hand-drawn diagrams, flowcharts, and collaborative boards.",
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
      "Free online whiteboard tool powered by Excalidraw. Create hand-drawn diagrams, flowcharts, and collaborative boards.",
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
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "PLACEHOLDER_VERIFICATION_CODE",
    "msvalidate.01": process.env.BING_SITE_VERIFICATION || "BING_VERIFICATION_CODE",
    "yandex-verification": process.env.YANDEX_SITE_VERIFICATION || "YANDEX_VERIFICATION_CODE",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "PLACEHOLDER_VERIFICATION_CODE",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Craftisle Draw",
      description:
        "Free online whiteboard tool powered by Excalidraw. Create hand-drawn diagrams, flowcharts, and collaborative boards.",
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
        "Real-time collaboration",
        "Export to PNG/SVG",
        "No signup required for testing",
      ],
    },
    {
      "@type": "Organization",
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
        "Free online whiteboard tool powered by Excalidraw. Create hand-drawn diagrams, flowcharts, and collaborative boards.",
      publisher: {
        "@type": "Organization",
        name: "Craftisle",
        logo: "https://draw.craftisle.com/logo.png",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://draw.craftisle.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Apple meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Craftisle Draw" />
        
        {/* Windows meta tags */}
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded">
          Skip to main content
        </a>
        <SessionProvider>
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID !== 'G-XXXXXXXX' && (
            <GoogleAnalytics />
          )}
          <Navbar />
          <main id="main-content" className="min-h-screen bg-gray-50">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Craftisle Draw</h3>
                  <p className="text-sm text-gray-300">
                    Free online whiteboard tool powered by Excalidraw. Create hand-drawn diagrams, flowcharts, and collaborative boards.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
                    <li><a href="/board/new" className="text-gray-300 hover:text-white">Create New Board</a></li>
                    <li><a href="https://craftisle.com" className="text-gray-300 hover:text-white" rel="noopener noreferrer" target="_blank">Craftisle</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Legal</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                    <li><a href="/terms" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                © 2026 Craftisle. All rights reserved.
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}
