'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { isMonetagEnabled } from '@/lib/config/ads';

/**
 * Client component that dynamically loads Monetag Vignette Banner
 * based on centralized config (craftisle-configs).
 */
export function AdLoader() {
  const [enabled, setEnabled] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    isMonetagEnabled().then(setEnabled);
  }, []);

  if (!enabled) return null;

  return (
    <Script
      id="monetag-vignette"
      src="/monetag-vignette.js"
      strategy="afterInteractive"
      onLoad={() => setScriptLoaded(true)}
    />
  );
}
