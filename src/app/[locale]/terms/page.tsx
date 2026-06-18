import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'terms' })
  
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 18, 2026</p>
      
      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <p>This is the English version of our Terms of Service. For translations in other languages, please use the language switcher in the navigation.</p>
        
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Craftisle Draw ("the Service"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
          <p>
            Craftisle Draw is a free online whiteboard tool that allows users to create hand-drawn diagrams, flowcharts, 
            and collaborative boards. The Service is provided "as is" and "as available" without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
          <p>
            You may use the Service without creating an account (for testing). However, to save and manage your whiteboards, 
            you need to sign in with Google OAuth. You are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintaining the confidentiality of your account</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Upload illegal, harmful, or offensive content</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit malware or harmful code</li>
            <li>Interfere with the Service's operation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h2>
          <p>
            Craftisle Draw shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
            or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, 
            use, goodwill, or other intangible losses resulting from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
            <br />
            <a href="mailto:legal@craftisle.com" className="text-blue-600 hover:underline">legal@craftisle.com</a>
          </p>
        </section>
      </div>
    </div>
  )
}
