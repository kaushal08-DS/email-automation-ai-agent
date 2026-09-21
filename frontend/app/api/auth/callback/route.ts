import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://email-automation-ai-agent.onrender.com";

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "https://mailpilotai.theworkpc.com";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      `${FRONTEND_URL}/login?error=missing_code`
    );
  }

  try {
    console.log("AUTH CALLBACK: exchanging OAuth code");

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
        `${FRONTEND_URL}/login?error=authentication_failed`
      );
    }

    const data = await backendResponse.json();

    if (!data.session) {
      console.error(
        "AUTH EXCHANGE ERROR: session missing"
      );

      return NextResponse.redirect(
        `${FRONTEND_URL}/login?error=missing_session`
      );
    }

    console.log(
      "AUTH EXCHANGE SUCCESS: session received"
    );

    /*
     * IMPORTANT
     *
     * The session cookie belongs to the frontend domain:
     *
     * mailpilotai.theworkpc.com
     *
     * The browser will then automatically send this
     * cookie when calling:
     *
     * /api/me
     * /api/dashboard
     * /api/gmail/sync
     */

    const response = NextResponse.redirect(
      `${FRONTEND_URL}/auth/callback`
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

    console.log(
      "AUTH CALLBACK: session cookie created for frontend"
    );

    return response;
  } catch (error) {
    console.error(
      "AUTH CALLBACK ERROR:",
      error
    );

    return NextResponse.redirect(
      `${FRONTEND_URL}/login?error=authentication_failed`
    );
  }
}