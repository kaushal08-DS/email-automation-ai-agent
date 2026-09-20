"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function Callback() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    async function finishLogin() {
      try {
        const user = await api("/api/me");

        if (user.subscription?.active) {
          router.replace("/dashboard");
        } else {
          router.replace("/subscription");
        }
      } catch (err) {
        console.error(
          "AUTH CALLBACK ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Authentication failed"
        );
      }
    }

    finishLogin();
  }, [router]);

  if (error) {
    return (
      <div className="layout-center">
        <div className="login">
          <h1>Authentication failed</h1>

          <p className="muted">
            {error}
          </p>

          <button
            className="btn primary"
            onClick={() =>
              router.replace("/login")
            }
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-center">
      <div className="login">
        <h1>
          Connecting your Gmail account…
        </h1>

        <p className="muted">
          Finishing your secure login.
        </p>
      </div>
    </div>
  );
}