import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Craftisle Draw",
  description: "Terms of Service for Craftisle Draw - Free Online Whiteboard Tool",
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <p>Last updated: June 18, 2026</p>

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
            <li>Distribute malware or harmful code</li>
            <li>Harass, abuse, or harm others</li>
            <li>Interfere with the operation of the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Intellectual Property</h2>
          <p>
            You retain all rights to the content you create using the Service. We do not claim ownership of your whiteboards. 
            However, by making a board "public" or "shared", you grant us the right to display that content to the intended recipients.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            In no event shall Craftisle or its operators be liable for any indirect, incidental, special, consequential, or punitive damages, 
            or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other 
            intangible losses resulting from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an "as is" and "as available" basis. We disclaim all warranties, express or implied, 
            including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, 
            without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, 
            or for any other reason.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting 
            the new Terms on this page. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            <a href="mailto:legal@craftisle.com" className="text-blue-600 hover:underline">legal@craftisle.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Craftisle operates, 
            without regard to its conflict of law provisions.
          </p>
        </section>
      </div>
    </div>
  )
}
