from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from googleapiclient.discovery import build

from ..db import get_db
from ..models import User
from ..services.google_oauth import make_flow
from ..services.security import encrypt, make_session
from ..config import settings


router = APIRouter(prefix="/api/auth", tags=["auth"])

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
        secure=True,
        samesite="lax",
        path="/",
    )

    return response


@router.get("/google/callback")
def google_callback(
    request: Request,
    db: Session = Depends(get_db),
):
    state = request.cookies.get("oauth_state")

    if not state:
        return RedirectResponse(
            settings.frontend_url + "/login?error=missing_oauth_state"
        )

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

    if credentials.refresh_token:
        user.gmail_refresh_token = encrypt(
            credentials.refresh_token
        )

    user.gmail_connected = True
    user.gmail_scopes = " ".join(
        credentials.scopes or []
    )

    db.commit()

    response = RedirectResponse(
        settings.frontend_url + "/auth/callback"
    )

    response.set_cookie(
        key="session",
        value=make_session(user.id),
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=604800,
    )

    response.delete_cookie("oauth_state")

    return response


@router.post("/logout")
def logout():
    response = RedirectResponse(
        settings.frontend_url + "/login",
        status_code=303,
    )

    response.delete_cookie("session")

    return response