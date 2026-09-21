"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { api } from "../../../lib/api";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function finishLogin() {
      try {
        /*
         * The session cookie should already have been
         * created by:
         *
         * /api/auth/callback
         *
         * Now verify that the browser is authenticated.
         */

        const user = await api("/api/me");

        if (cancelled) {
          return;
        }

        if (user.subscription?.active) {
          router.replace("/dashboard");
        } else {
          router.replace("/subscription");
        }
      } catch (error) {
        console.error(
          "AUTH CALLBACK VERIFICATION ERROR:",
          error
        );

        if (!cancelled) {
          router.replace(
            "/login?error=session_not_found"
          );
        }
      }
    }

    finishLogin();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050505",
        color: "#fff",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            margin: "0 auto 18px",
            borderRadius: "50%",
            border: "3px solid #292929",
            borderTopColor: "#fff",
            animation: "mailpilot-spin 0.8s linear infinite",
          }}
        />

        <h1
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          Connecting your Gmail account
        </h1>

        <p
          style={{
            marginTop: 10,
            color: "#888",
            fontSize: 14,
          }}
        >
          Finishing your secure login…
        </p>
      </div>

      <style jsx>{`
        @keyframes mailpilot-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}