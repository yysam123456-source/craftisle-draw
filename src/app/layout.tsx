import type { Metadata, Viewport } from "next"
import Script from "next/script"
import GoogleAnalytics from "@/components/GoogleAnalytics"

export const metadata: Metadata = {
  title: {
    default: "Craftisle Draw — Free Online Whiteboard & Collaborative Drawing Tool",
    template: "%s | Craftisle Draw",
  },
  description:
    "Free online whiteboard tool powered by Excalidraw. Create hand-drawn diagrams, flowcharts, and collaborative boards. No signup required for testing. Real-time collaboration, infinite canvas, and export to PNG/SVG. Perfect for teaching, brainstorming, and team collaboration.",
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
    "free online whiteboard no sign up",
    "online whiteboard for teaching",
    "collaborative whiteboard real time free",
    "hand drawn diagram tool online",
    "flowchart maker online free",
    "mind map online free",
    "virtual whiteboard for remote teams",
    "sketch board online free",
    "brainstorming tool online free",
    "draw diagrams online free no download",
    "excalidraw alternative free",
    "online drawing board for teams",
    "free digital whiteboard",
    "interactive whiteboard online",
    "whiteboard for online meetings",
    "online whiteboard with drawing tools",
    "free whiteboard for teachers",
    "real time collaborative whiteboard",
    "whiteboard app for remote work",
    "online canvas for drawing",
    "free diagram tool online",
    "whiteboard software free online",
    "create whiteboard online free",
    "shared whiteboard online free",
    "whiteboard for agile teams",
    "online retrospective whiteboard",
    "free whiteboard for students",
    "best free online whiteboard",
    "whiteboard tool for presentations",
    "online whiteboard no registration",
    "free whiteboard unlimited collaborators",
    "whiteboard with templates free",
    "online whiteboard export png svg",
    "hand drawn style whiteboard",
    "whiteboard for design thinking",
    "visual collaboration tool free",
    "online whiteboard for workshops",
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
      </body>
    </html>
  )
}
