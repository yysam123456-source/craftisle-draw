import type { Metadata } from "next"
import { Suspense } from "react"
import BoardList from "@/components/BoardList"
import { auth } from "@/auth"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Free Online Whiteboard | Craftisle Draw",
  description:
    "Create hand-drawn diagrams, flowcharts, and collaborative boards with Craftisle Draw. Free online whiteboard tool powered by Excalidraw. No signup required for testing.",
}

export default async function HomePage() {
  let session = null
  try {
    session = await auth()
  } catch {
    // JWT validation failed (e.g. cross-subdomain cookie mismatch)
    // Silently show logged-out state
  }

  const faqs = [
    {
      question: "Is Craftisle Draw free to use?",
      answer: "Yes, Craftisle Draw is completely free to use. No signup required for testing.",
    },
    {
      question: "Can I collaborate with others in real-time?",
      answer: "Yes, you can share your board with others and collaborate in real-time.",
    },
    {
      question: "Can I export my drawings?",
      answer: "Yes, you can export your drawings as PNG or SVG files.",
    },
    {
      question: "Do I need to create an account?",
      answer: "No, you can test the tool without creating an account. However, creating an account allows you to save and manage your boards.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes, your data is stored securely. You can also make your boards private or public.",
    },
  ]

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Boards</h1>
        <p className="mt-2 text-gray-600">
          Create and manage your whiteboards. 
          <a href="/board/new" className="text-blue-600 hover:underline">Create a new board</a> or 
          <a href="https://craftisle.com" className="text-blue-600 hover:underline" rel="noopener noreferrer" target="_blank">learn more about Craftisle</a>.
        </p>
      </header>

      {session?.user ? (
        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <BoardList userId={session.user.id!} />
        </Suspense>
      ) : (
        <div className="text-center py-24 text-gray-500">
          <p className="text-xl mb-4">Please sign in to view your boards</p>
          <a href="/api/auth/signin" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </div>
      )}

      {/* FAQ Section */}
      <section className="mt-16 pt-16 border-t border-gray-200" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
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
    </div>
  )
}
