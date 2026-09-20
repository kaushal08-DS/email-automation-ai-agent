import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://email-automation-ai-agent.onrender.com";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/login?error=missing_code",
        request.url
      )
    );
  }

  try {
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/auth/exchange?code=${encodeURIComponent(code)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!backendResponse.ok) {
      console.error(
        "AUTH EXCHANGE FAILED:",
        backendResponse.status
      );

      return NextResponse.redirect(
        new URL(
          "/login?error=authentication_failed",
          request.url
        )
      );
    }

    const data = await backendResponse.json();

    if (!data.session) {
      console.error(
        "AUTH EXCHANGE ERROR: session missing"
      );

      return NextResponse.redirect(
        new URL(
          "/login?error=missing_session",
          request.url
        )
      );
    }

    // ---------------------------------------------------
    // CREATE FRONTEND SESSION COOKIE
    // ---------------------------------------------------

    const response = NextResponse.redirect(
      new URL(
        "/auth/callback",
        request.url
      )
    );

    response.cookies.set({
      name: "session",
      value: data.session,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    console.error(
      "AUTH CALLBACK ERROR:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/login?error=authentication_failed",
        request.url
      )
    );
  }
}