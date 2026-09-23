"use client";

import { useEffect, useState } from "react";
import Hero from "../components/Hero";

const BACKEND_URL =
  "https://email-automation-ai-agent.onrender.com";

export default function HomePage() {
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: NodeJS.Timeout | null = null;

    async function wakeBackend() {
      const maxAttempts = 20;
      let attempts = 0;

      while (!cancelled && attempts < maxAttempts) {
        attempts++;

        try {
          const response = await fetch(
            `${BACKEND_URL}/health`,
            {
              method: "GET",
              cache: "no-store",
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (response.ok) {
            console.log("MailPilot backend is ready.");

            if (!cancelled) {
              setBackendReady(true);
            }

            return;
          }
        } catch {
          console.log(
            `MailPilot backend waking up... attempt ${attempts}`
          );
        }

        await new Promise<void>((resolve) => {
          timer = setTimeout(resolve, 3000);
        });
      }

      if (!cancelled) {
        console.warn(
          "MailPilot backend did not become ready within the warm-up period."
        );
      }
    }

    wakeBackend();

    return () => {
      cancelled = true;

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            MailPilot AI
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-white/60 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="/privacy"
              className="text-sm text-white/60 transition hover:text-white"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="text-sm text-white/60 transition hover:text-white"
            >
              Terms
            </a>
          </nav>

          <a
            href="/login"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
          >
            Sign in
          </a>
        </div>
      </header>

      {/* Hero */}
      <Hero backendReady={backendReady} />

      {/* Features */}
      <section
        id="features"
        className="border-t border-white/10 px-6 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Built for your inbox
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Your email, with less manual work.
            </h2>

            <p className="mt-5 text-base leading-7 text-white/55 md:text-lg">
              MailPilot AI helps organize Gmail, understand incoming
              messages, prepare replies and keep you in control before
              anything is sent.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              title="Smart organization"
              description="Automatically understand and organize incoming messages into useful categories."
            />

            <FeatureCard
              title="AI reply drafts"
              description="Generate useful reply suggestions based on the context of the email."
            />

            <FeatureCard
              title="Your writing style"
              description="Learn your preferred tone, greetings, sentence style and communication patterns."
            />

            <FeatureCard
              title="Human approval"
              description="Review suggested responses before MailPilot sends anything from your Gmail account."
            />
          </div>
        </div>
      </section>

      {/* Privacy section */}
      <section className="border-t border-white/10 px-6 py-24 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center md:p-12">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Your inbox stays under your control.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
              MailPilot AI is designed around controlled Gmail access,
              transparent permissions and user approval before sending
              messages.
            </p>
          </div>

          <a
            href="/privacy"
            className="inline-flex rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
          >
            View Privacy Policy
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} MailPilot AI
          </p>

          <div className="flex gap-5">
            <a
              href="/privacy"
              className="transition hover:text-white"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="transition hover:text-white"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
        <div className="h-2 w-2 rounded-full bg-blue-400" />
      </div>

      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-white/50">
        {description}
      </p>
    </div>
  );
}