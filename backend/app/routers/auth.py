from datetime import datetime, timedelta, timezone

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


# ---------------------------------------------------------
# GOOGLE LOGIN
# ---------------------------------------------------------

@router.get("/google")
def google_start(request: Request):
    flow = make_flow()

    auth_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="false",
        prompt="consent",
    )

    response = RedirectResponse(auth_url)

    response.set_cookie(
        key="oauth_state",
        value=state,
        httponly=True,
        max_age=600,
        secure=settings.cookie_secure,
        samesite="lax",
        path="/",
    )

    return response


# ---------------------------------------------------------
# GOOGLE CALLBACK
# ---------------------------------------------------------

@router.get("/google/callback")
def google_callback(
    request: Request,
    db: Session = Depends(get_db),
):
    state = request.cookies.get("oauth_state")

    if not state:
        return RedirectResponse(
            settings.frontend_url
            + "/login?error=missing_oauth_state"
        )

    try:
        flow = make_flow(state)

        flow.fetch_token(
            authorization_response=str(request.url)
        )

        credentials = flow.credentials

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
            f"GOOGLE AUTH ERROR: "
            f"{type(exc).__name__}: {exc}"
        )

        return RedirectResponse(
            settings.frontend_url
            + "/login?error=google_auth_failed"
        )

    # -----------------------------------------------------
    # FIND OR CREATE USER
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # SAVE GMAIL TOKEN
    # -----------------------------------------------------

    if credentials.refresh_token:
        user.gmail_refresh_token = encrypt(
            credentials.refresh_token
        )

    user.gmail_connected = True

    user.gmail_scopes = " ".join(
        credentials.scopes or []
    )

    db.commit()

    # -----------------------------------------------------
    # CREATE SHORT-LIVED EXCHANGE TOKEN
    # -----------------------------------------------------

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

    # Delete OAuth state
    response = RedirectResponse(
        settings.frontend_url
        + "/api/auth/callback?code="
        + exchange_token
    )

    response.delete_cookie(
        key="oauth_state",
        path="/",
    )

    return response


# ---------------------------------------------------------
# EXCHANGE SHORT-LIVED TOKEN FOR SESSION
# ---------------------------------------------------------

@router.get("/exchange")
def exchange_session(
    code: str,
    db: Session = Depends(get_db),
):
    try:
        payload = jwt.decode(
            code,
            settings.jwt_secret,
            algorithms=["HS256"],
        )

        if payload.get("type") != "oauth_exchange":
            return JSONResponse(
                {"detail": "Invalid exchange token"},
                status_code=401,
            )

        user_id = int(payload["sub"])

    except (JWTError, ValueError, KeyError):
        return JSONResponse(
            {"detail": "Invalid or expired exchange token"},
            status_code=401,
        )

    user = db.get(User, user_id)

    if not user:
        return JSONResponse(
            {"detail": "User not found"},
            status_code=401,
        )

    return {
        "session": make_session(user.id)
    }


# ---------------------------------------------------------
# LOGOUT
# ---------------------------------------------------------

@router.post("/logout")
def logout():
    response = RedirectResponse(
        settings.frontend_url + "/login",
        status_code=303,
    )

    response.delete_cookie(
        key="session",
        path="/",
    )

    return response