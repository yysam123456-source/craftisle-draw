'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

type WindowWithGtag = Window & {
  dataLayer: any[]
  gtag: (...args: any[]) => void
}

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()

  useEffect(() => {
    if (!measurementId) return

    const w = window as unknown as WindowWithGtag

    // Load Google Analytics script
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    script.async = true
    document.head.appendChild(script)

    w.dataLayer = w.dataLayer || []
    function gtag(...args: any[]) {
      w.dataLayer.push(arguments)
    }
    w.gtag = gtag
    gtag('js', new Date())
    gtag('config', measurementId)

    return () => {
      try { document.head.removeChild(script) } catch {}
    }
  }, [measurementId])

  // Track page views on route change
  useEffect(() => {
    const w = window as unknown as WindowWithGtag
    if (pathname && w.gtag) {
      w.gtag('config', measurementId, {
        page_path: pathname,
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [pathname, measurementId])

  return null
}
