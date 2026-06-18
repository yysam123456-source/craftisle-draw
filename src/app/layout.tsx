import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { SessionProvider } from "next-auth/react"
import Script from "next/script"

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
    "google-site-verification": "PLACEHOLDER_VERIFICATION_CODE",
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
      sameAs: ["https://craftisle.com"],
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
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
