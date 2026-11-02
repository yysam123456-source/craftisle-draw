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
          "Free online whiteboard tool powered by Excalidraw. Create hand-drawn diagrams, flowcharts, and collaborative boards.",
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
          "Browser-based whiteboard and diagram editor built on Excalidraw. Infinite canvas, hand-drawn style, real-time collaboration and PNG/SVG export.",
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
          "Real-time collaboration via share link",
          "Export to PNG and SVG",
          "Free to use, no credit card required",
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
