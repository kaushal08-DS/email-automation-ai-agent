import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Email Automation AI",
  description:
    "Privacy Policy for Email Automation AI explaining how user and Google account data is accessed, used, stored, protected, and deleted.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-10">
        {/* Header */}
        <header className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300"
          >
            ← Back to Email Automation AI
          </Link>

          <div className="mt-8">
            <div className="mb-4 inline-flex items-center rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-sm text-blue-300">
              Privacy Policy
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Privacy Policy
            </h1>

            <p className="mt-4 text-slate-400">
              Last updated: September 20, 2026
            </p>
          </div>
        </header>

        <div className="space-y-10 leading-7 text-slate-300">
          {/* Introduction */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              1. Introduction
            </h2>

            <p>
              Email Automation AI is an email automation platform that helps
              users organize, analyze, draft, and send emails using automation
              and artificial intelligence features.
            </p>

            <p className="mt-4">
              This Privacy Policy explains how Email Automation AI collects,
              accesses, uses, stores, protects, and deletes information when
              you use our application.
            </p>

            <p className="mt-4">
              By using Email Automation AI, you acknowledge that you have read
              and understood this Privacy Policy.
            </p>
          </section>

          {/* Information collected */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              2. Information We Collect
            </h2>

            <p>
              Depending on how you use the application, we may process the
              following categories of information:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                <strong className="text-white">Account information:</strong>{" "}
                name, email address, profile information, and Google account
                identifier.
              </li>

              <li>
                <strong className="text-white">Authentication information:</strong>{" "}
                information required to maintain your authenticated session.
              </li>

              <li>
                <strong className="text-white">Gmail information:</strong>{" "}
                information made available through the Gmail permissions you
                explicitly authorize.
              </li>

              <li>
                <strong className="text-white">Email information:</strong>{" "}
                email messages and related information required to provide the
                email automation features you request.
              </li>

              <li>
                <strong className="text-white">Usage information:</strong>{" "}
                information about interactions with the application, such as
                actions performed through the platform and technical
                information needed to operate and secure the service.
              </li>

              <li>
                <strong className="text-white">Payment information:</strong>{" "}
                subscription and payment-related information processed through
                our payment provider. We do not intentionally store complete
                payment card numbers or payment authentication credentials.
              </li>
            </ul>
          </section>

          {/* Google user data */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              3. Google User Data
            </h2>

            <p>
              Email Automation AI uses Google OAuth to allow users to
              authenticate and, when authorized, connect their Gmail account
              to the application.
            </p>

            <p className="mt-4">
              Depending on the permissions granted by the user, the application
              may access:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Your Google account name and email address.</li>
              <li>Your Google account identifier.</li>
              <li>Gmail messages and related information required for email automation.</li>
              <li>Permission to send Gmail messages on your behalf when you authorize that capability.</li>
            </ul>

            <p className="mt-4">
              We only request Google permissions that are needed for the
              functionality of the application.
            </p>
          </section>

          {/* How Google data is used */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              4. How Google Data Is Used
            </h2>

            <p>
              Google user data is used to provide the features that users
              request through Email Automation AI.
            </p>

            <p className="mt-4">
              This may include:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Authenticating the user.</li>
              <li>Connecting the user's Gmail account.</li>
              <li>Reading email information when the user requests an automation or analysis feature.</li>
              <li>Generating email drafts or automated responses requested by the user.</li>
              <li>Sending emails through Gmail when the user has granted the required permission.</li>
              <li>Providing automation, organization, and productivity functionality.</li>
              <li>Maintaining and securing the user's account and session.</li>
            </ul>

            <p className="mt-4">
              We do not use Google user data for targeted advertising, selling
              data to data brokers, or other purposes unrelated to providing or
              improving the user-facing functionality of Email Automation AI.
            </p>

            <p className="mt-4">
              Our handling of Google user data is intended to comply with the
              applicable Google API Services User Data Policy and Limited Use
              requirements.
            </p>
          </section>

          {/* AI processing */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              5. Artificial Intelligence Processing
            </h2>

            <p>
              Email Automation AI may use artificial intelligence services to
              provide features such as email analysis, classification,
              summarization, drafting, and automation.
            </p>

            <p className="mt-4">
              When an AI-powered feature requires email content or related
              information to generate a result, the relevant information may
              be processed by the AI service configured for the application.
            </p>

            <p className="mt-4">
              AI processing is used to provide the requested application
              functionality and is not intended to be used for advertising or
              selling personal information.
            </p>
          </section>

          {/* Sharing */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              6. Information Sharing
            </h2>

            <p>
              We do not sell your personal information or Google user data.
            </p>

            <p className="mt-4">
              Information may be processed by service providers that are
              necessary to operate Email Automation AI, such as:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Cloud hosting and database providers.</li>
              <li>Google APIs used to provide Gmail functionality.</li>
              <li>Artificial intelligence providers used to provide requested AI functionality.</li>
              <li>Payment providers used to process subscriptions and payments.</li>
              <li>Security, monitoring, and infrastructure providers when required to operate the service.</li>
            </ul>

            <p className="mt-4">
              Service providers receive only the information reasonably
              necessary to provide their services.
            </p>

            <p className="mt-4">
              We may also disclose information when required by applicable law,
              legal process, or to protect the security and rights of the
              service and its users.
            </p>
          </section>

          {/* Storage */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              7. Data Storage and Security
            </h2>

            <p>
              We use reasonable technical and organizational measures to
              protect information processed by Email Automation AI.
            </p>

            <p className="mt-4">
              Authentication sessions are protected using secure mechanisms.
              Sensitive authentication credentials, including Gmail refresh
              tokens used by the application, are encrypted before being stored
              by the application.
            </p>

            <p className="mt-4">
              However, no internet transmission or electronic storage system can
              be guaranteed to be completely secure.
            </p>
          </section>

          {/* Retention */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              8. Data Retention
            </h2>

            <p>
              We retain information for as long as reasonably necessary to
              provide the requested services, maintain accounts, comply with
              legal obligations, resolve disputes, and enforce our agreements.
            </p>

            <p className="mt-4">
              Gmail access information and authentication credentials are
              retained only while needed to provide connected Gmail features or
              until the user disconnects the account, subject to applicable
              legal or operational requirements.
            </p>

            <p className="mt-4">
              When information is no longer required for the purposes described
              in this policy, we may delete or anonymize it.
            </p>
          </section>

          {/* Account deletion */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              9. Data Deletion and Account Requests
            </h2>

            <p>
              Users may request deletion of their account and associated
              personal information by contacting us using the email address
              provided below.
            </p>

            <p className="mt-4">
              Users may also revoke Email Automation AI's access to their
              Google Account through their Google Account security settings.
            </p>

            <p className="mt-4">
              When an account deletion request is received, we will take
              reasonable steps to delete or anonymize information that we are
              not required to retain for legal, security, fraud-prevention, or
              other legitimate operational purposes.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              10. Cookies and Sessions
            </h2>

            <p>
              Email Automation AI uses authentication cookies and similar
              mechanisms to maintain secure user sessions.
            </p>

            <p className="mt-4">
              These cookies are used for authentication and application
              functionality rather than for third-party advertising.
            </p>
          </section>

          {/* Children's privacy */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              11. Children's Privacy
            </h2>

            <p>
              Email Automation AI is not intended for children who are below
              the minimum age required to use the applicable Google services
              and our application.
            </p>

            <p className="mt-4">
              We do not knowingly collect personal information from children in
              violation of applicable law.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              12. Changes to This Privacy Policy
            </h2>

            <p>
              We may update this Privacy Policy when our services, data
              practices, security practices, or legal requirements change.
            </p>

            <p className="mt-4">
              The updated policy will be published on this page with a revised
              effective or updated date.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              13. Contact Us
            </h2>

            <p>
              If you have questions about this Privacy Policy, Google user
              data, account deletion, or our data practices, contact:
            </p>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="font-semibold text-white">Email Automation AI</p>
              <p className="mt-2 text-slate-400">
                Email: kaushalgaikwad810@gmail.com
              </p>
            </div>
          </section>

          {/* Footer */}
          <section className="border-t border-slate-800 pt-8">
            <div className="flex flex-wrap gap-5 text-sm">
              <Link
                href="/"
                className="text-blue-400 hover:text-blue-300"
              >
                Home
              </Link>

              <Link
                href="/terms"
                className="text-blue-400 hover:text-blue-300"
              >
                Terms of Service
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}