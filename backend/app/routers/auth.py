from datetime import datetime, timedelta, timezone
import secrets

from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
from googleapiclient.discovery import build
from jose import jwt, JWTError

from ..db import get_db
from ..models import User
from ..services.google_oauth import make_flow
from ..services.security import encrypt, make_session
from ..config import settings


router = APIRouter(prefix="/api/auth", tags=["auth"])


# ============================================================
# OAuth State
# ============================================================

def create_oauth_state() -> str:
    """
    Create a signed, short-lived OAuth state token.
    This avoids relying on a backend cookie during the
    Google OAuth redirect.
    """
    payload = {
        "type": "oauth_state",
        "nonce": secrets.token_urlsafe(32),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=10),
    }

    return jwt.encode(
        payload,
        settings.jwt_secret,
        algorithm="HS256",
    )


def verify_oauth_state(state: str) -> bool:
    """
    Verify that the OAuth state token is valid and has not expired.
    """
    try:
        payload = jwt.decode(
            state,
            settings.jwt_secret,
            algorithms=["HS256"],
        )

        return payload.get("type") == "oauth_state"

    except JWTError:
        return False


# ============================================================
# Start Google Login
# ============================================================

@router.get("/google")
def google_start():
    """
    Start Google OAuth login.
    """

    state = create_oauth_state()

    flow = make_flow(state)

    auth_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="false",
        prompt="consent",
    )

    return RedirectResponse(auth_url)


# ============================================================
# Google OAuth Callback
# ============================================================

@router.get("/google/callback")
def google_callback(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Google redirects here after authentication.

    This endpoint:
    1. Validates OAuth state.
    2. Exchanges Google's authorization code.
    3. Gets Google user information.
    4. Creates/updates the local user.
    5. Creates a short-lived exchange token.
    6. Redirects the browser to the FRONTEND callback.
    """

    state = request.query_params.get("state")
    code = request.query_params.get("code")
    error = request.query_params.get("error")

    # --------------------------------------------------------
    # Google returned an error
    # --------------------------------------------------------

    if error:
        print(f"GOOGLE AUTH ERROR: {error}")

        return RedirectResponse(
            settings.frontend_url
            + "/login?error="
            + error
        )

    # --------------------------------------------------------
    # Validate parameters
    # --------------------------------------------------------

    if not state or not code:
        print("GOOGLE AUTH ERROR: missing state or code")

        return RedirectResponse(
            settings.frontend_url
            + "/login?error=missing_oauth_parameters"
        )

    # --------------------------------------------------------
    # Verify OAuth state
    # --------------------------------------------------------

    if not verify_oauth_state(state):
        print("GOOGLE AUTH ERROR: invalid or expired state")

        return RedirectResponse(
            settings.frontend_url
            + "/login?error=invalid_oauth_state"
        )

    # --------------------------------------------------------
    # Exchange Google authorization code
    # --------------------------------------------------------

    try:
        flow = make_flow(state)

        flow.fetch_token(
            authorization_response=str(request.url)
        )

        credentials = flow.credentials

    except Exception as exc:
        print(
            "GOOGLE TOKEN EXCHANGE ERROR:",
            type(exc).__name__,
            str(exc),
        )

        return RedirectResponse(
            settings.frontend_url
            + "/login?error=google_token_exchange_failed"
        )

    # --------------------------------------------------------
    # Get Google user information
    # --------------------------------------------------------

    try:
        info = (
            build(
                "oauth2",
                "v2",
                credentials=credentials,
                cache_discovery=False,
            )
            .userinfo()
            .get()
            .execute()
        )

    except Exception as exc:
        print(
            "GOOGLE USERINFO ERROR:",
            type(exc).__name__,
            str(exc),
        )

        return RedirectResponse(
            settings.frontend_url
            + "/login?error=google_userinfo_failed"
        )

    # --------------------------------------------------------
    # Create or find user
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(User.google_sub == info["id"])
        .first()
    )

    if not user:
        user = User(
            google_sub=info["id"],
            email=info["email"],
            name=info.get("name"),
            picture=info.get("picture"),
        )

        db.add(user)
        db.flush()

    # --------------------------------------------------------
    # Save Gmail refresh token
    # --------------------------------------------------------

    if credentials.refresh_token:
        user.gmail_refresh_token = encrypt(
            credentials.refresh_token
        )

    user.gmail_connected = True

    user.gmail_scopes = " ".join(
        credentials.scopes or []
    )

    db.commit()

    print(
        f"GOOGLE LOGIN SUCCESS: user_id={user.id}"
    )

    # --------------------------------------------------------
    # Create short-lived exchange token
    # --------------------------------------------------------

    exchange_token = jwt.encode(
        {
            "sub": str(user.id),
            "type": "oauth_exchange",
            "exp": datetime.now(timezone.utc)
            + timedelta(minutes=2),
        },
        settings.jwt_secret,
        algorithm="HS256",
    )

    # --------------------------------------------------------
    # IMPORTANT:
    # Redirect to the production FRONTEND.
    # --------------------------------------------------------

    frontend_callback_url = (
        settings.frontend_url
        + "/api/auth/callback?code="
        + exchange_token
    )

    print(
        "OAUTH FRONTEND REDIRECT:",
        settings.frontend_url,
    )

    print(
        "OAUTH CALLBACK URL:",
        settings.frontend_url
        + "/api/auth/callback"
    )

    return RedirectResponse(
        frontend_callback_url
    )


# ============================================================
# Exchange OAuth Token For Session
# ============================================================

@router.get("/exchange")
def exchange_session(
    code: str,
    db: Session = Depends(get_db),
):
    """
    Exchange the short-lived OAuth exchange token
    for the normal application session JWT.

    The frontend Next.js route then stores this JWT
    in an HttpOnly cookie on the frontend domain.
    """

    try:
        payload = jwt.decode(
            code,
            settings.jwt_secret,
            algorithms=["HS256"],
        )

        if payload.get("type") != "oauth_exchange":
            return JSONResponse(
                {
                    "detail": "Invalid exchange token"
                },
                status_code=401,
            )

        user_id = int(payload["sub"])

    except (
        JWTError,
        ValueError,
        KeyError,
        TypeError,
    ):
        return JSONResponse(
            {
                "detail": "Invalid or expired exchange token"
            },
            status_code=401,
        )

    # --------------------------------------------------------
    # Find user
    # --------------------------------------------------------

    user = db.get(User, user_id)

    if not user:
        return JSONResponse(
            {
                "detail": "User not found"
            },
            status_code=401,
        )

    # --------------------------------------------------------
    # Create normal application session
    # --------------------------------------------------------

    session_token = make_session(user.id)

    return {
        "session": session_token
    }


# ============================================================
# Logout
# ============================================================

@router.post("/logout")
def logout():
    """
    Logout endpoint.

    The actual session cookie is owned by the frontend
    domain, so the frontend callback/session architecture
    handles the browser cookie.
    """

    response = RedirectResponse(
        settings.frontend_url + "/login",
        status_code=303,
    )

    response.delete_cookie(
        key="session",
        path="/",
    )

    return response