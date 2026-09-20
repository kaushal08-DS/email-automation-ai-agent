import Link from "next/link";

export const metadata = {
  title: "Email Automation AI | Intelligent Email Automation",
  description:
    "Email Automation AI helps users manage, analyze, draft, and automate email workflows using Gmail and artificial intelligence.",
};

const features = [
  {
    number: "01",
    title: "Connect Gmail",
    description:
      "Securely connect your Google Account through Google's OAuth authorization flow and choose the permissions required by the application.",
  },
  {
    number: "02",
    title: "Analyze Emails",
    description:
      "Use automation and AI-assisted workflows to organize and analyze email information according to the features you enable.",
  },
  {
    number: "03",
    title: "Generate Responses",
    description:
      "Create AI-assisted email drafts and responses designed to help reduce repetitive writing tasks.",
  },
  {
    number: "04",
    title: "Automate Workflows",
    description:
      "Configure email automation workflows for repetitive communication tasks and review your settings before enabling them.",
  },
];

const googleData = [
  "Google account name and email address",
  "Google account identifier",
  "Gmail messages and related information required by enabled features",
  "Permission to send Gmail messages when the user authorizes that capability",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 font-bold text-white shadow-lg shadow-blue-500/20">
              EA
            </div>

            <div>
              <p className="font-semibold tracking-tight">
                Email Automation AI
              </p>
              <p className="text-xs text-slate-500">
                Intelligent email workflows
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-6 text-sm text-slate-400 sm:flex">
            <a
              href="#features"
              className="transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#google-data"
              className="transition hover:text-white"
            >
              Google Data
            </a>

            <Link
              href="/privacy"
              className="transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white"
            >
              Terms
            </Link>
          </div>

          <Link
            href="/login"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-10">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              AI-powered email productivity
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Automate your email.
              <span className="block text-blue-400">
                Work smarter.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              Email Automation AI is a productivity platform that connects
              with Gmail to help users organize email workflows, analyze
              messages, generate AI-assisted responses, and automate repetitive
              communication tasks.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
              >
                Get Started
                <span className="ml-2">→</span>
              </Link>

              <Link
                href="/privacy"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Read Privacy Policy
              </Link>
            </div>
          </div>

          {/* Trust information */}
          <div className="mt-20 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-slate-200">
                Google OAuth
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Authentication through Google's authorization system.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-200">
                Gmail Integration
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Gmail access is requested only for enabled features.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-200">
                User Control
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Users control the permissions granted to the application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y border-white/10 bg-slate-900/40"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              What the application does
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              One workspace for email automation
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Email Automation AI combines Gmail connectivity, automation
              workflows, and AI-assisted productivity features in one
              application.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="rounded-2xl border border-white/10 bg-slate-950 p-7 transition hover:border-blue-400/30"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-semibold text-blue-400">
                    {feature.number}
                  </span>

                  <span className="text-slate-700">✦</span>
                </div>

                <h3 className="mt-8 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Data */}
      <section id="google-data">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                Google data transparency
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Why Email Automation AI requests Google access
              </h2>

              <p className="mt-5 leading-8 text-slate-400">
                Google permissions are requested so that the application can
                provide Gmail-based automation and productivity functionality.
                Users see Google's authorization screen before access is
                granted.
              </p>

              <p className="mt-5 leading-8 text-slate-400">
                The application does not request Gmail access simply for
                advertising. Google data is used to provide the email
                functionality that the user enables.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-7">
              <h3 className="text-lg font-semibold">
                Google information that may be accessed
              </h3>

              <ul className="mt-6 space-y-4">
                {googleData.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-6 text-slate-400"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-2xl border border-blue-400/10 bg-blue-400/5 p-5">
                <p className="text-sm leading-6 text-slate-300">
                  Users can revoke Email Automation AI's access to their
                  Google Account through their Google Account settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy commitment */}
      <section className="border-y border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Privacy and security
          </p>

          <h2 className="mt-4 text-3xl font-bold">
            Your data is used to provide the service
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
            Email Automation AI is designed to use account and Google data for
            the functionality users request. We do not sell Google user data.
            Sensitive authentication information is protected using security
            measures described in our Privacy Policy.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/privacy"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              View Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              View Terms
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-24 text-center sm:px-8 lg:px-10">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Start managing your email more efficiently.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
            Connect your Google Account and use the email automation features
            available in Email Automation AI.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex rounded-xl bg-blue-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
          >
            Sign in with Google
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="font-semibold">Email Automation AI</p>
            <p className="mt-1 text-sm text-slate-500">
              Intelligent email automation and productivity.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm">
            <Link
              href="/privacy"
              className="text-slate-400 transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-slate-400 transition hover:text-white"
            >
              Terms of Service
            </Link>

            <a
              href="mailto:kaushalgaikwad810@gmail.com"
              className="text-slate-400 transition hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}