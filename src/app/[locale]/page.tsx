import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import BoardList from "@/components/BoardList";
import { auth } from "@/auth";
import Script from "next/script";

// Hub-level structured data linking this sub-site to the craftisle.com organization
const hubJsonLd = {
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
      "@id": "https://draw.craftisle.com/#website",
      url: "https://draw.craftisle.com",
      name: "Craftisle Draw",
      publisher: { "@id": "https://craftisle.com/#organization" },
    },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(', '),
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
      
      {/* JSON-LD for FAQ */}
      <Script
        id="faq-json-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* JSON-LD linking this sub-site to the Craftisle organization hub */}
      <Script
        id="hub-json-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubJsonLd) }}
      />
    </div>
  );
}
