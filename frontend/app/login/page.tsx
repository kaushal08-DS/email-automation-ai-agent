"use client";

import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    window.location.replace("/api/auth/google");
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />

        <p className="text-sm text-slate-400">
          Redirecting to Google...
        </p>
      </div>
    </main>
  );
}