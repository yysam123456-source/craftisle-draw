import type { Metadata } from "next"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'useCases' })
  
  return {
    title: t('title'),
    description: t('description'),
  }
}

const useCases = [
  {
    title: "Teaching & Education",
    description: "Use Craftisle Draw as a free online whiteboard for teaching. Create interactive lessons, explain concepts with hand-drawn diagrams, and share whiteboards with students. No signup required for testing.",
    icon: "🎓",
    keywords: ["online whiteboard for teaching", "free whiteboard for teachers", "whiteboard for students"],
  },
  // ... rest of the use cases
]

export default function UseCasesPage({ params }: { params: { locale: string } }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Use Cases for Craftisle Draw
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover how our free online whiteboard can help you collaborate, create, and communicate more effectively. 
          No signup required to get started.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {useCases.map((useCase, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">{useCase.icon}</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              {useCase.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {useCase.description}
            </p>
          </div>
        ))}
      </div>

      <section className="text-center mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Drawing?
        </h2>
        <Link
          href={`/${params.locale}/board/new`}
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Create Free Whiteboard
        </Link>
      </section>
    </div>
  )
}
