import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import BoardList from "@/components/BoardList";
import { auth } from "@/auth";
import { locales } from "@/i18n/request";

const SITE = "https://draw.craftisle.com";

/**
 * Structured data for the homepage.
 *
 * Two rules were broken before:
 *  1. nothing labelled this sub-site as a WebSite with its own @id, and
 *  2. the SoftwareApplication node was missing entirely on the page itself.
 * Both are declared here (plus the hub Organization reference) and rendered as
 * an inline <script type="application/ld+json"> so that the markup is present
 * in the server response, not only after hydration.
 */
function buildHomeJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://craftisle.com/#organization",
        name: "Craftisle",
        url: "https://craftisle.com",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: "Craftisle Draw",
        description:
          "Free whiteboard in the browser, built on Excalidraw: hand-drawn diagrams, flowcharts and notes on an infinite canvas, with PNG, SVG and JSON export.",
        inLanguage: locale,
        publisher: { "@id": "https://craftisle.com/#organization" },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE}/#software`,
        name: "Craftisle Draw",
        alternateName: "Craftisle Draw — Online Whiteboard",
        applicationCategory: "DesignApplication",
        applicationSubCategory: "Online whiteboard & diagram tool",
        operatingSystem: "Any (web browser)",
        browserRequirements: "Requires a modern browser with HTML canvas support",
        url: `${SITE}/${locale}`,
        description:
          "Browser-based whiteboard and diagram editor built on Excalidraw. Infinite canvas, hand-drawn style, boards saved to your account, read-only sharing and PNG, SVG or JSON export.",
        isPartOf: { "@id": `${SITE}/#website` },
        publisher: { "@id": "https://craftisle.com/#organization" },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        featureList: [
          "Infinite canvas with zoom and pan",
          "Hand-drawn (Excalidraw) visual style",
          "Read-only board sharing via link",
          "Export to PNG, SVG and JSON",
          "Free to use",
        ],
        screenshot: `${SITE}/og-image.png`,
      },
    ],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(', '),
    metadataBase: new URL(SITE),
    alternates: {
      // Self-referencing canonical for the localized homepage. This was absent,
      // so the localized home pages had no canonical signal at all.
      canonical: `${SITE}/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${SITE}/${l}`])),
        "x-default": `${SITE}/en`,
      },
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  let session = null;
  try {
    session = await auth();
  } catch {
    // JWT validation failed (e.g. cross-subdomain cookie mismatch)
    // Silently show logged-out state
  }

  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  
  const faqs = [
    {
      question: t('faq.free'),
      answer: t('faq.freeAnswer'),
    },
    {
      question: t('faq.collaborate'),
      answer: t('faq.collaborateAnswer'),
    },
    {
      question: t('faq.export'),
      answer: t('faq.exportAnswer'),
    },
    {
      question: t('faq.account'),
      answer: t('faq.accountAnswer'),
    },
    {
      question: t('faq.secure'),
      answer: t('faq.secureAnswer'),
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-gray-600">
          {t('description')}{' '}
          <a href={`/${locale}/board/new`} className="text-blue-600 hover:underline">{tNav('newBoard')}</a> {t('or')}{' '}
          <a href="https://craftisle.com" className="text-blue-600 hover:underline" rel="noopener noreferrer" target="_blank">{t('learnMore')}</a>.
        </p>
      </header>
      
      {session?.user ? (
        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <BoardList userId={session.user.id!} />
        </Suspense>
      ) : (
        <div className="text-center py-24 text-gray-500">
          <p className="text-xl mb-4">{t('pleaseSignIn')}</p>
          <a href="/api/auth/signin" className="text-blue-600 hover:underline">
            {tNav('signIn')}
          </a>
        </div>
      )}
      
      {/* SEO/GEO: 服务端渲染的说明正文。只做 en —— 其余 15 个 locale 没有对应译文，
          塞英文会造成双语混杂，补 16 种译文属于内容侧另一件事。
          这段进的是首字节 HTML，不执行 JS 的爬虫能读到（原来全页仅 188 词）。 */}
      {locale === 'en' && (
        <section className="mt-16 pt-16 border-t border-gray-200" aria-labelledby="about-draw-heading">
          <h2 id="about-draw-heading" className="text-2xl font-bold text-gray-900 mb-6">What Craftisle Draw is</h2>
          <p className="text-gray-600 mb-4">
            Craftisle Draw is a whiteboard for sketching diagrams, flowcharts and notes in a browser tab. It is
            built on Excalidraw 0.18.1, so the drawing model, the element types and the hand-drawn rendering
            style are the ones Excalidraw users already know.
          </p>
          <p className="text-gray-600 mb-4">
            Boards are stored in an account rather than only on the device, so a diagram is still there when
            you come back on another machine.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">What you can do on the canvas</h2>
          <ul className="text-gray-600 mb-4 list-disc pl-6 space-y-2">
            <li>Draw rectangles, ellipses, diamonds and arrows, and connect them with binding arrows that follow a shape when it moves.</li>
            <li>Sketch freehand with the freedraw tool, then keep the hand-drawn look or switch to a clean scheme.</li>
            <li>Type text anywhere, add sticky notes, and drop in images from your device.</li>
            <li>Export the board as PNG, SVG or a JSON scene file you can keep and re-import later.</li>
            <li>Share a board by link so somebody else can open it, read-only, without an account.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">How it works</h2>
          <p className="text-gray-600 mb-4">
            Opening a board loads its scene into the canvas; every change is saved back to the board while you
            work. Export renders the shapes in the browser, which is why a PNG or SVG comes out matching what
            is on screen. A shared link serves the board in a read-only view.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">What it does not do</h2>
          <p className="text-gray-600 mb-4">
            There is no real-time co-editing: two people cannot draw on the same board at once, and no live
            cursor or presence is shown. Creating or saving a board requires signing in, the share link is
            read-only rather than editable, and there is no version history or comment thread — a shared link
            shows the board as it stood when it was shared.
          </p>
        </section>
      )}

      {/* FAQ Section */}
      <section className="mt-16 pt-16 border-t border-gray-200" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-8">{t('faqTitle')}</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details key={index} className="p-4 bg-gray-50 rounded-lg" name="faq">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
                {faq.question}
              </summary>
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
      
      {/* JSON-LD: FAQ + WebSite + SoftwareApplication, server-rendered inline */}
      <script
        id="faq-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* JSON-LD linking this sub-site to the Craftisle organization hub */}
      <script
        id="hub-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeJsonLd(locale)) }}
      />
    </div>
  );
}
