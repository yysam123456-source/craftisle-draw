import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Use Cases | Craftisle Draw - Free Online Whiteboard",
  description: "Discover how to use Craftisle Draw for teaching, team collaboration, brainstorming, flowcharts, mind maps, and more. Free online whiteboard for every scenario.",
  keywords: [
    "online whiteboard for teaching",
    "whiteboard for remote teams",
    "brainstorming tool online",
    "flowchart maker online",
    "mind map tool online",
    "agile retrospective whiteboard",
    "design thinking whiteboard",
    "whiteboard for workshops",
    "visual collaboration tool",
    "online whiteboard for meetings",
  ],
}

const useCases = [
  {
    title: "Teaching & Education",
    description: "Use Craftisle Draw as a free online whiteboard for teaching. Create interactive lessons, explain concepts with hand-drawn diagrams, and share whiteboards with students. No signup required for testing.",
    icon: "🎓",
    keywords: ["online whiteboard for teaching", "free whiteboard for teachers", "whiteboard for students"],
  },
  {
    title: "Remote Team Collaboration",
    description: "Real-time collaborative whiteboard for remote teams. Brainstorm, plan sprints, and collaborate visually with your team. Supports unlimited collaborators on a free whiteboard.",
    icon: "👥",
    keywords: ["collaborative whiteboard real time", "virtual whiteboard for remote teams", "whiteboard app for remote work"],
  },
  {
    title: "Brainstorming & Ideation",
    description: "Free brainstorming tool online. Generate ideas with your team on an infinite canvas. Use sticky notes, draw connections, and export your brainstorming session to PNG or SVG.",
    icon: "💡",
    keywords: ["brainstorming tool online free", "ideation whiteboard", "creative collaboration tool"],
  },
  {
    title: "Flowcharts & Process Diagrams",
    description: "Create flowcharts online for free. Use our flowchart maker to visualize processes, workflows, and algorithms. Hand-drawn style makes your diagrams look unique and approachable.",
    icon: "🔄",
    keywords: ["flowchart maker online free", "process diagram tool", "workflow visualizer"],
  },
  {
    title: "Mind Mapping",
    description: "Free mind map tool online. Organize your thoughts, plan projects, and visualize concepts with mind maps. Unlimited canvas size lets you expand your ideas freely.",
    icon: "🧠",
    keywords: ["mind map online free", "mind mapping tool", "concept map maker"],
  },
  {
    title: "Agile & Scrum",
    description: "Online whiteboard for agile teams. Run retrospectives, plan sprints, and visualize user stories. Perfect whiteboard for agile teams and Scrum masters.",
    icon: "🚀",
    keywords: ["whiteboard for agile teams", "online retrospective whiteboard", "scrum whiteboard online"],
  },
  {
    title: "Design Thinking Workshops",
    description: "Facilitate design thinking workshops with our free online whiteboard. Create empathy maps, user journey maps, and prototypes. Collaborative whiteboard for design thinking sessions.",
    icon: "🎨",
    keywords: ["whiteboard for design thinking", "design thinking workshop tool", "empathy map whiteboard"],
  },
  {
    title: "Meetings & Presentations",
    description: "Interactive whiteboard for online meetings. Present ideas, annotate in real-time, and keep meeting participants engaged. Free whiteboard for online meetings and presentations.",
    icon: "📊",
    keywords: ["whiteboard for online meetings", "interactive whiteboard online", "whiteboard for presentations"],
  },
]

export default function UseCasesPage() {
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
            <div className="flex flex-wrap gap-2">
              {useCase.keywords.map((keyword, idx) => (
                <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Why Choose Craftisle Draw?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="text-3xl mb-2">✨</div>
            <h3 className="font-semibold text-gray-900 mb-2">Hand-Drawn Style</h3>
            <p className="text-sm text-gray-600">
              Unique hand-drawn style makes your diagrams look approachable and friendly. 
              Powered by Excalidraw, the best hand-drawn diagram tool.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-Time Collaboration</h3>
            <p className="text-sm text-gray-600">
              Collaborate with your team in real-time. See changes instantly, 
              chat with collaborators, and work together seamlessly.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📤</div>
            <h3 className="font-semibold text-gray-900 mb-2">Export to PNG/SVG</h3>
            <p className="text-sm text-gray-600">
              Export your whiteboards to PNG or SVG format. Share your work 
              on social media, include in presentations, or print for offline use.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
            <p className="text-sm text-gray-600">
              Your data stays private. Choose who can access your whiteboards. 
              No tracking, no ads, just a clean whiteboard experience.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">No Signup Required</h3>
            <p className="text-sm text-gray-600">
              Try Craftisle Draw without creating an account. Test all features 
              for free, no credit card, no email required.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">♾️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Infinite Canvas</h3>
            <p className="text-sm text-gray-600">
              Never run out of space. Our infinite canvas lets you expand 
              your ideas as much as you need. Zoom in/out freely.
            </p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Drawing?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of users who trust Craftisle Draw for their visual collaboration needs.
        </p>
        <Link
          href="/board/new"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Create Free Whiteboard
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          No signup required • Free forever • Real-time collaboration
        </p>
      </section>

      {/* FAQ Section with FAQPage structured data */}
      <section className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <details className="bg-white rounded-lg p-6 shadow-sm">
            <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
              Is Craftisle Draw really free?
            </summary>
            <p className="mt-4 text-gray-600">
              Yes, Craftisle Draw is completely free to use. No hidden fees, no premium plans, no credit card required. 
              We believe in providing a high-quality whiteboard tool that's accessible to everyone.
            </p>
          </details>
          <details className="bg-white rounded-lg p-6 shadow-sm">
            <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
              Do I need to create an account?
            </summary>
            <p className="mt-4 text-gray-600">
              No, you can use Craftisle Draw without creating an account. However, creating a free account 
              allows you to save your whiteboards, access them from any device, and collaborate with others.
            </p>
          </details>
          <details className="bg-white rounded-lg p-6 shadow-sm">
            <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
              Can I collaborate with my team in real-time?
            </summary>
            <p className="mt-4 text-gray-600">
              Yes, Craftisle Draw supports real-time collaboration. Share your whiteboard with a simple link, 
              and your team can join and collaborate instantly. No special software required.
            </p>
          </details>
          <details className="bg-white rounded-lg p-6 shadow-sm">
            <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
              Can I export my whiteboard?
            </summary>
            <p className="mt-4 text-gray-600">
              Yes, you can export your whiteboard to PNG or SVG format. This makes it easy to share your work 
              on social media, include in presentations, or print for offline use.
            </p>
          </details>
          <details className="bg-white rounded-lg p-6 shadow-sm">
            <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
              Is my data safe?
            </summary>
            <p className="mt-4 text-gray-600">
              Yes, we take data security seriously. Your whiteboards are stored securely, and you have full control 
              over who can access them. We never share your data with third parties.
            </p>
          </details>
        </div>
      </section>
    </div>
  )
}
