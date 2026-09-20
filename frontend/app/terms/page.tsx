import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Email Automation AI",
  description:
    "Terms of Service for Email Automation AI.",
};

export default function TermsPage() {
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
              Terms of Service
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Terms of Service
            </h1>

            <p className="mt-4 text-slate-400">
              Last updated: September 20, 2026
            </p>
          </div>
        </header>

        <div className="space-y-10 leading-7 text-slate-300">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              1. Acceptance of Terms
            </h2>

            <p>
              These Terms of Service govern your use of Email Automation AI.
              By accessing or using the application, you agree to these Terms.
            </p>

            <p className="mt-4">
              If you do not agree with these Terms, you should not use the
              application.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              2. Description of the Service
            </h2>

            <p>
              Email Automation AI is a software platform that provides email
              automation, email organization, artificial intelligence-assisted
              analysis, email drafting, and related productivity functionality.
            </p>

            <p className="mt-4">
              Certain features may require users to connect a Google Account
              and authorize access to Gmail.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              3. Google Account and Gmail Access
            </h2>

            <p>
              You may connect your Google Account to Email Automation AI using
              Google's OAuth authorization process.
            </p>

            <p className="mt-4">
              You control the permissions granted to the application through
              Google's authorization screen.
            </p>

            <p className="mt-4">
              Gmail access is used only to provide functionality requested by
              the user, such as reading relevant email information or sending
              emails when the required permission has been granted.
            </p>

            <p className="mt-4">
              You may revoke the application's access to your Google Account
              through your Google Account settings.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              4. User Responsibilities
            </h2>

            <p>
              You are responsible for maintaining the security of your account
              and for all activities performed through your account.
            </p>

            <p className="mt-4">
              You agree not to use Email Automation AI to:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Violate applicable laws or regulations.</li>
              <li>Send unlawful, fraudulent, abusive, or harmful communications.</li>
              <li>Attempt to gain unauthorized access to another person's account or data.</li>
              <li>Interfere with or disrupt the operation of the service.</li>
              <li>Abuse automated email functionality for spam or malicious activity.</li>
              <li>Use the application in a way that violates Google's applicable policies.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              5. AI-Generated Content
            </h2>

            <p>
              Some features of Email Automation AI use artificial intelligence
              to generate suggestions, classifications, summaries, drafts, or
              other content.
            </p>

            <p className="mt-4">
              AI-generated content may contain mistakes or inaccuracies.
              Users are responsible for reviewing generated content before
              sending or relying on it, particularly when the content has
              legal, financial, professional, or other significant
              consequences.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              6. Automated Emails
            </h2>

            <p>
              If you enable an automated email feature, you authorize the
              application to perform the actions associated with that feature
              according to the settings you configure.
            </p>

            <p className="mt-4">
              You are responsible for configuring automation rules carefully
              and reviewing recipients, content, schedules, and other settings
              before enabling automated actions.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              7. Subscriptions and Payments
            </h2>

            <p>
              Certain features may require a paid subscription.
            </p>

            <p className="mt-4">
              Subscription pricing, duration, payment terms, and available
              features will be presented to users before a purchase is
              completed.
            </p>

            <p className="mt-4">
              Payments may be processed by a third-party payment provider.
              Payment credentials are handled according to the payment
              provider's applicable policies and security practices.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              8. Intellectual Property
            </h2>

            <p>
              The Email Automation AI application, software, interface,
              branding, and associated materials are owned by or licensed to
              the service operator unless otherwise stated.
            </p>

            <p className="mt-4">
              These Terms do not transfer ownership of the application or its
              underlying technology to users.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              9. Service Availability
            </h2>

            <p>
              We aim to keep Email Automation AI available and reliable, but
              we do not guarantee that the service will always be available,
              uninterrupted, secure, or error-free.
            </p>

            <p className="mt-4">
              The service may occasionally be unavailable because of
              maintenance, infrastructure problems, third-party service
              outages, security events, or other circumstances.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              10. Third-Party Services
            </h2>

            <p>
              Email Automation AI may depend on third-party services including
              Google APIs, hosting providers, database providers, artificial
              intelligence services, and payment providers.
            </p>

            <p className="mt-4">
              Availability and functionality of these third-party services may
              affect features of Email Automation AI.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              11. Suspension or Termination
            </h2>

            <p>
              We may suspend or terminate access to the service where
              reasonably necessary to protect the service, users, third
              parties, or comply with applicable law.
            </p>

            <p className="mt-4">
              Users may stop using the application at any time and may request
              account deletion according to our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              12. Disclaimer
            </h2>

            <p>
              Email Automation AI is provided on an "as available" basis.
              To the maximum extent permitted by applicable law, we do not
              guarantee that the service or AI-generated results will always be
              accurate, complete, uninterrupted, or suitable for every
              particular purpose.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              13. Changes to These Terms
            </h2>

            <p>
              We may update these Terms from time to time as the service,
              business practices, or legal requirements change.
            </p>

            <p className="mt-4">
              Updated Terms will be published on this page with a revised
              updated date.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              14. Contact
            </h2>

            <p>
              Questions regarding these Terms can be sent to:
            </p>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="font-semibold text-white">Email Automation AI</p>
              <p className="mt-2 text-slate-400">
                Email: kaushalgaikwad810@gmail.com
              </p>
            </div>
          </section>

          <section className="border-t border-slate-800 pt-8">
            <div className="flex flex-wrap gap-5 text-sm">
              <Link
                href="/"
                className="text-blue-400 hover:text-blue-300"
              >
                Home
              </Link>

              <Link
                href="/privacy"
                className="text-blue-400 hover:text-blue-300"
              >
                Privacy Policy
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}