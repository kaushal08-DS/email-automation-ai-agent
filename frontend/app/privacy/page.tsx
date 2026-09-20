import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Email Automation AI",
  description:
    "Privacy Policy for Email Automation AI.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-10">
        <header className="mb-12">
          <Link
            href="/"
            className="text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            ← Back to Email Automation AI
          </Link>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Privacy
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Privacy Policy
            </h1>

            <p className="mt-4 text-slate-400">
              Last updated: September 20, 2026
            </p>
          </div>
        </header>

        <article className="space-y-10 text-[15px] leading-7 text-slate-300">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              1. Introduction
            </h2>

            <p>
              Email Automation AI is an email productivity and automation
              application that can connect to a user's Google Account and
              Gmail account to provide email-related functionality.
            </p>

            <p className="mt-4">
              This Privacy Policy explains how information is accessed, used,
              stored, protected, and deleted when you use Email Automation AI.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              2. Information We Collect
            </h2>

            <p>
              Depending on the features you use, the application may process:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Google account name and email address.</li>
              <li>Google account identifier.</li>
              <li>Gmail information required by enabled features.</li>
              <li>Authentication and session information.</li>
              <li>Application usage and technical information.</li>
              <li>Subscription and payment-related information.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              3. Google User Data
            </h2>

            <p>
              Email Automation AI uses Google OAuth to authenticate users and
              allow users to connect Gmail.
            </p>

            <p className="mt-4">
              Depending on the permissions granted by the user, the
              application may access:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Google account name and email address.</li>
              <li>Google account identifier.</li>
              <li>Gmail messages and related information required by enabled features.</li>
              <li>Permission to send Gmail messages when the user grants the required permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              4. How Google Data Is Used
            </h2>

            <p>
              Google user data is used to provide the functionality requested
              by the user, including:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Authenticating users.</li>
              <li>Connecting a user's Gmail account.</li>
              <li>Reading email information required by enabled features.</li>
              <li>Generating AI-assisted email drafts or responses.</li>
              <li>Sending emails through Gmail when authorized by the user.</li>
              <li>Providing email automation and productivity functionality.</li>
            </ul>

            <p className="mt-4">
              We do not sell Google user data or use Google user data for
              targeted advertising.
            </p>

            <p className="mt-4">
              Google user data is handled in accordance with applicable Google
              API Services User Data Policy requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              5. Artificial Intelligence
            </h2>

            <p>
              Some features may use artificial intelligence to analyze,
              summarize, classify, or generate email-related content.
            </p>

            <p className="mt-4">
              Information required to perform an AI feature may be processed
              by the AI service configured for the application.
            </p>

            <p className="mt-4">
              AI processing is intended to provide the requested application
              functionality and is not intended for advertising or selling
              personal information.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              6. Information Sharing
            </h2>

            <p>
              We do not sell personal information or Google user data.
            </p>

            <p className="mt-4">
              Information may be processed by service providers required to
              operate the application, including:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Cloud hosting and database providers.</li>
              <li>Google APIs.</li>
              <li>Artificial intelligence providers.</li>
              <li>Payment providers.</li>
              <li>Security and infrastructure providers.</li>
            </ul>

            <p className="mt-4">
              Information may also be disclosed when required by applicable
              law or necessary to protect the service, users, or third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              7. Security
            </h2>

            <p>
              We use reasonable technical and organizational measures to
              protect information processed by the application.
            </p>

            <p className="mt-4">
              Sensitive authentication credentials used by the application are
              protected using encryption and other security mechanisms.
            </p>

            <p className="mt-4">
              No internet service can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              8. Data Retention
            </h2>

            <p>
              Information is retained for as long as reasonably necessary to
              provide the service, maintain accounts, meet legal requirements,
              resolve disputes, and protect the service.
            </p>

            <p className="mt-4">
              Gmail authentication information is retained while needed for
              connected Gmail functionality or until the user disconnects the
              account, subject to applicable legal and operational requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              9. Data Deletion
            </h2>

            <p>
              Users may request deletion of their account and associated
              personal information by contacting us.
            </p>

            <p className="mt-4">
              Users can also revoke the application's Google Account access
              through their Google Account security settings.
            </p>

            <p className="mt-4">
              We will take reasonable steps to delete or anonymize information
              that is no longer required, except where retention is required
              for legal, security, fraud-prevention, or legitimate operational
              purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              10. Cookies
            </h2>

            <p>
              Email Automation AI uses authentication cookies and related
              mechanisms to maintain secure user sessions and application
              functionality.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              11. Children's Privacy
            </h2>

            <p>
              Email Automation AI is not intended for children who are below
              the minimum age required to use the applicable services.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              12. Changes to This Policy
            </h2>

            <p>
              We may update this Privacy Policy when our services, data
              practices, or legal requirements change.
            </p>

            <p className="mt-4">
              Updates will be published on this page with a revised date.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              13. Contact
            </h2>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <p className="font-semibold text-white">
                Email Automation AI
              </p>

              <p className="mt-2 text-slate-400">
                Email: kaushalgaikwad810@gmail.com
              </p>
            </div>
          </section>
        </article>

        <footer className="mt-12 flex flex-wrap gap-6 border-t border-white/10 pt-8 text-sm">
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
        </footer>
      </div>
    </main>
  );
}