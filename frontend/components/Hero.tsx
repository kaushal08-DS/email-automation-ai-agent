"use client";

import GoogleSignInButton from "./GoogleSignInButton";

interface HeroProps {
  backendReady: boolean;
}

export default function Hero({
  backendReady,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/65">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                backendReady
                  ? "bg-emerald-400"
                  : "animate-pulse bg-yellow-400"
              }`}
            />

            {backendReady
              ? "MailPilot AI is ready"
              : "Preparing MailPilot AI..."}
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-5xl font-bold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
            Automate your email.
            <br />

            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Work smarter.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
            MailPilot AI helps you organize Gmail, understand incoming
            messages, prepare intelligent replies and keep control of
            every email before it is sent.
          </p>

          {/* Google button */}
          <div className="mt-9 flex justify-center">
            <GoogleSignInButton
              backendReady={backendReady}
            />
          </div>

          {/* Backend status */}
          <div className="mt-5 flex items-center justify-center gap-2 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                backendReady
                  ? "bg-emerald-400"
                  : "animate-pulse bg-yellow-400"
              }`}
            />

            <span className="text-white/45">
              {backendReady
                ? "Secure connection ready"
                : "Connecting securely..."}
            </span>
          </div>
        </div>

        {/* Product preview */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/40">
            {/* Window header */}
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />

              <div className="ml-4 text-xs text-white/35">
                MailPilot AI
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="grid min-h-[350px] md:grid-cols-[220px_1fr]">
              {/* Sidebar */}
              <div className="hidden border-r border-white/10 p-5 md:block">
                <div className="mb-8 text-sm font-semibold text-white">
                  MailPilot AI
                </div>

                <div className="space-y-2">
                  {[
                    "Dashboard",
                    "Replies",
                    "Promotional",
                    "Insights",
                    "Alerts",
                    "Writing Style",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className={`rounded-lg px-3 py-2 text-xs ${
                        index === 0
                          ? "bg-white/10 text-white"
                          : "text-white/35"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main preview */}
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/35">
                      Overview
                    </p>

                    <h3 className="mt-1 text-xl font-semibold text-white">
                      Your inbox at a glance
                    </h3>
                  </div>

                  <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] text-emerald-300">
                    Gmail Connected
                  </div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <PreviewCard
                    label="Needs Reply"
                    value="12"
                  />

                  <PreviewCard
                    label="Promotional"
                    value="28"
                  />

                  <PreviewCard
                    label="Deadlines"
                    value="4"
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white/60">
                      Suggested reply
                    </span>

                    <span className="text-[10px] text-blue-400">
                      AI Generated
                    </span>
                  </div>

                  <div className="mt-4 h-3 w-4/5 rounded bg-white/10" />
                  <div className="mt-3 h-3 w-full rounded bg-white/5" />
                  <div className="mt-3 h-3 w-3/5 rounded bg-white/5" />

                  <div className="mt-5 flex gap-2">
                    <div className="h-8 w-20 rounded-lg bg-blue-500/80" />
                    <div className="h-8 w-20 rounded-lg bg-white/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust line */}
        <div className="mt-10 text-center">
          <p className="text-xs text-white/30">
            AI-assisted email automation with user-controlled sending
          </p>
        </div>
      </div>
    </section>
  );
}

function PreviewCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <p className="text-xs text-white/35">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}