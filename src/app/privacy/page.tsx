import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Craftisle Draw",
  description: "Privacy Policy for Craftisle Draw - Free Online Whiteboard Tool",
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <p>Last updated: June 18, 2026</p>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>
            Craftisle Draw is a free online whiteboard tool. We collect minimal information necessary to provide our service:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> If you sign in with Google OAuth, we receive your name, email, and profile picture.</li>
            <li><strong>Board Data:</strong> Whiteboard content (elements, app state) is stored in our database when you save a board.</li>
            <li><strong>Usage Data:</strong> We may collect anonymous usage statistics to improve our service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To allow you to create and manage whiteboards</li>
            <li>To enable collaboration features</li>
            <li>To improve our service based on usage patterns</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Data Storage and Security</h2>
          <p>
            Your whiteboard data is stored securely in our database. We use industry-standard security measures to protect your data. 
            However, no method of transmission over the Internet is 100% secure, so we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Sharing Your Information</h2>
          <p>
            We do not sell your personal information. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>When you make a board public or share it with others</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Cookies</h2>
          <p>
            We use cookies to maintain your session and remember your preferences. You can control cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Third-Party Services</h2>
          <p>
            We use the following third-party services:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Google OAuth:</strong> For authentication (if you choose to sign in)</li>
            <li><strong>Vercel:</strong> For hosting and deployment</li>
            <li><strong>Prisma/PostgreSQL:</strong> For data storage</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your data</li>
            <li>Delete your account and all associated data</li>
            <li>Export your whiteboards</li>
            <li>Object to data processing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            <a href="mailto:privacy@craftisle.com" className="text-blue-600 hover:underline">privacy@craftisle.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>
      </div>
    </div>
  )
}
