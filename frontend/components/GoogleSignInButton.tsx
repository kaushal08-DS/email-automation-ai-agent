"use client";

import { useState } from "react";

const BACKEND_URL =
  "https://email-automation-ai-agent.onrender.com";

interface GoogleSignInButtonProps {
  backendReady: boolean;
}

export default function GoogleSignInButton({
  backendReady,
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  async function waitForBackend() {
    const maxAttempts = 20;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
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
          return true;
        }
      } catch {
        // Backend is still waking up.
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 3000)
      );
    }

    return false;
  }

  async function handleLogin() {
    if (loading) return;

    setLoading(true);

    try {
      /*
       * If the homepage already confirmed the backend,
       * immediately start Google OAuth.
       */
      if (backendReady) {
        window.location.href = "/login";
        return;
      }

      /*
       * If the user clicks while Render is still waking,
       * wait here instead of sending them into a broken
       * OAuth request.
       */
      const ready = await waitForBackend();

      if (ready) {
        window.location.href = "/login";
        return;
      }

      alert(
        "MailPilot AI is taking longer than usual to start. Please try again in a few seconds."
      );
    } catch (error) {
      console.error(
        "Google login preparation failed:",
        error
      );

      alert(
        "Unable to connect to MailPilot AI. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading;

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={disabled}
      className={[
        "group inline-flex min-w-[245px] items-center justify-center gap-3",
        "rounded-xl px-6 py-3.5",
        "font-semibold text-white",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
        disabled
          ? "cursor-wait bg-blue-500/50"
          : "bg-blue-500 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-blue-500/30",
      ].join(" ")}
    >
      {loading ? (
        <>
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

          <span>
            Connecting...
          </span>
        </>
      ) : (
        <>
          {/* Google icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M21.805 12.23c0-.79-.064-1.56-.19-2.3H12v4.35h5.5a4.7 4.7 0 0 1-2.04 3.09v2.57h3.3c1.93-1.78 3.045-4.4 3.045-7.71Z"
              fill="currentColor"
              opacity=".95"
            />

            <path
              d="M12 22c2.76 0 5.08-.91 6.77-2.46l-3.3-2.57c-.91.61-2.07.98-3.47.98-2.67 0-4.94-1.8-5.75-4.23H2.84v2.65A10.22 10.22 0 0 0 12 22Z"
              fill="currentColor"
              opacity=".8"
            />

            <path
              d="M6.25 13.72A6.13 6.13 0 0 1 5.93 12c0-.6.11-1.18.32-1.72V7.63H2.84A10 10 0 0 0 1.77 12c0 1.61.39 3.13 1.07 4.37l3.41-2.65Z"
              fill="currentColor"
              opacity=".65"
            />

            <path
              d="M12 6.05c1.5 0 2.84.52 3.9 1.54l2.93-2.93C17.07 2.97 14.75 2 12 2a10.22 10.22 0 0 0-9.16 5.63l3.41 2.65C7.06 7.85 9.33 6.05 12 6.05Z"
              fill="currentColor"
            />
          </svg>

          <span>
            Sign in with Google
          </span>
        </>
      )}
    </button>
  );
}