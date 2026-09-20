import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Email Automation AI",
  description: "Terms of Service for Email Automation AI.",
};

export default function TermsPage() {
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
              Legal
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Terms of Service
            </h1>

            <p className="mt-4 text-slate-400">
              Last updated: September 20, 2026
            </p>
          </div>
        </header>

        <article className="space-y-10 text-[15px] leading-7 text-slate-300">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              1. Acceptance of Terms
            </h2>

            <p>
              These Terms of Service govern your use of Email Automation AI.
              By accessing or using the application, you agree to these Terms.
            </p>

            <p className="mt-4">
              If you do not agree with these Terms, do not use the application.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              2. Description of the Service
            </h2>

            <p>
              Email Automation AI provides email automation, email
              organization, AI-assisted analysis, email drafting, and related
              productivity functionality.
            </p>

            <p className="mt-4">
              Some features require a Google Account and Gmail authorization.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              3. Google Account and Gmail
            </h2>

            <p>
              Users may connect their Google Account through Google's OAuth
              authorization process.
            </p>

            <p className="mt-4">
              Users control the permissions granted to the application through
              Google's authorization screen.
            </p>

            <p className="mt-4">
              Gmail access is used to provide features requested by the user,
              including applicable email automation and sending functionality.
            </p>

            <p className="mt-4">
              Users can revoke the application's Google Account access through
              their Google Account settings.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              4. User Responsibilities
            </h2>

            <p>
              You are responsible for maintaining the security of your account
              and for activity performed through your account.
            </p>

            <p className="mt-4">
              You agree not to use Email Automation AI to:
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Violate applicable laws or regulations.</li>
              <li>Send unlawful, fraudulent, abusive, or harmful communications.</li>
              <li>Access another person's account or data without authorization.</li>
              <li>Disrupt or interfere with the service.</li>
              <li>Abuse automated email functionality for spam or malicious activity.</li>
              <li>Violate applicable Google policies.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              5. AI-Generated Content
            </h2>

            <p>
              Some application features use artificial intelligence to
              generate drafts, suggestions, classifications, summaries, or
              other content.
            </p>

            <p className="mt-4">
              AI-generated content may contain errors. Users are responsible
              for reviewing generated content before sending or relying on it.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              6. Automated Emails
            </h2>

            <p>
              When you enable an automated email feature, the application may
              perform actions according to the settings you configure.
            </p>

            <p className="mt-4">
              You are responsible for reviewing recipients, content, schedules,
              and other automation settings before enabling automated actions.
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
              Pricing, subscription duration, available features, and payment
              terms are presented before a purchase is completed.
            </p>

            <p className="mt-4">
              Payments may be processed by third-party payment providers.
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
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              9. Service Availability
            </h2>

            <p>
              We aim to maintain reliable service availability but do not
              guarantee that the service will always be uninterrupted,
              error-free, or continuously available.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              10. Third-Party Services
            </h2>

            <p>
              The application may depend on third-party services such as
              Google APIs, hosting providers, database providers, AI services,
              and payment providers.
            </p>

            <p className="mt-4">
              Changes or outages affecting these services may affect
              corresponding application functionality.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              11. Suspension or Termination
            </h2>

            <p>
              Access may be suspended or terminated when reasonably necessary
              to protect the service, users, third parties, or comply with
              applicable law.
            </p>

            <p className="mt-4">
              Users may stop using the application at any time and may request
              account deletion according to the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              12. Disclaimer
            </h2>

            <p>
              Email Automation AI is provided on an "as available" basis. To
              the maximum extent permitted by applicable law, we do not
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
              We may update these Terms when the service, business practices,
              or legal requirements change.
            </p>

            <p className="mt-4">
              Updated Terms will be published on this page with a revised date.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              14. Contact
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
            href="/privacy"
            className="text-blue-400 hover:text-blue-300"
          >
            Privacy Policy
          </Link>
        </footer>
      </div>
    </main>
  );
}