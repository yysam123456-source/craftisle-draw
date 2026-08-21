import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'useCases' })

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://draw.craftisle.com/${locale}/use-cases`,
    },
  }
}

const useCaseItems = [
  { key: "teaching", icon: "🎓" },
  { key: "remoteTeams", icon: "👥" },
  { key: "brainstorming", icon: "💡" },
  { key: "flowchart", icon: "🔀" },
  { key: "mindMap", icon: "🧠" },
  { key: "agile", icon: "🏃" },
  { key: "designThinking", icon: "🎨" },
  { key: "meetings", icon: "📊" },
]

export default async function UseCasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'useCases' })
  const tHome = await getTranslations({ locale, namespace: 'home' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const faqs = [
    {
      question: tHome('faq.free'),
      answer: tHome('faq.freeAnswer'),
    },
    {
      question: tHome('faq.collaborate'),
      answer: tHome('faq.collaborateAnswer'),
    },
    {
      question: tHome('faq.export'),
      answer: tHome('faq.exportAnswer'),
    },
    {
      question: tHome('faq.account'),
      answer: tHome('faq.accountAnswer'),
    },
    {
      question: tHome('faq.secure'),
      answer: tHome('faq.secureAnswer'),
    },
  ]

  const pageUrl = `https://draw.craftisle.com/${locale}/use-cases`

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: t('title'),
    description: t('description'),
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "Craftisle Draw",
      url: "https://draw.craftisle.com",
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tNav('home'),
        item: `https://draw.craftisle.com/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t('title'),
        item: pageUrl,
      },
    ],
  }

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
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb (silo: home -> use-cases) */}
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link href={`/${locale}`} className="hover:text-blue-600">
              {tNav('home')}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-700 font-medium">{t('h1')}</li>
        </ol>
      </nav>

      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('h1')}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('description')}</p>
      </header>

      {/* Intro guide */}
      <section className="max-w-3xl mx-auto mb-14 text-gray-700 leading-relaxed">
        <p className="mb-8">{t('intro')}</p>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('howToTitle')}</h2>
        <ol className="space-y-5">
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              1
            </span>
            <div>
              <p className="font-semibold text-gray-900">{t('howToStep1')}</p>
              <p className="text-gray-600">{t('howToStep1Desc')}</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              2
            </span>
            <div>
              <p className="font-semibold text-gray-900">{t('howToStep2')}</p>
              <p className="text-gray-600">{t('howToStep2Desc')}</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              3
            </span>
            <div>
              <p className="font-semibold text-gray-900">{t('howToStep3')}</p>
              <p className="text-gray-600">{t('howToStep3Desc')}</p>
            </div>
          </li>
        </ol>
      </section>

      {/* Use cases grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {useCaseItems.map((useCase) => (
          <div
            key={useCase.key}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">{useCase.icon}</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              {t(useCase.key)}
            </h2>
            <p className="text-gray-600 mb-4">{t(`${useCase.key}Desc`)}</p>
          </div>
        ))}
      </div>

      {/* CTA -> whiteboard entry (silo: use-cases -> board/new) */}
      <section className="text-center mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Drawing?
        </h2>
        <p className="text-gray-600 mb-6">
          Pick a use case above and open a free board — no signup required.
        </p>
        <Link
          href={`/${locale}/board/new`}
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Create Free Whiteboard
        </Link>
      </section>

      {/* FAQ */}
      <section
        className="mt-16 pt-16 border-t border-gray-200"
        aria-labelledby="uc-faq-heading"
      >
        <h2 id="uc-faq-heading" className="text-2xl font-bold text-gray-900 mb-8">
          {tHome('faqTitle')}
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details key={index} className="p-4 bg-gray-50 rounded-lg">
              <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
                {faq.question}
              </summary>
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* JSON-LD: WebPage + BreadcrumbList + FAQPage */}
      <Script
        id="use-cases-json-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([webPageSchema, breadcrumbSchema, faqSchema]),
        }}
      />
    </div>
  )
}
