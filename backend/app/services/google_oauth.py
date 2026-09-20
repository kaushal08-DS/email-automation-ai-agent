from google_auth_oauthlib.flow import Flow
from ..config import settings


SCOPES = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
]


def make_flow(state=None):
    client_config = {
        "web": {
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "redirect_uris": [
                settings.google_redirect_uri
            ],
            "auth_uri":
                "https://accounts.google.com/o/oauth2/auth",
            "token_uri":
                "https://oauth2.googleapis.com/token",
        }
    }

    flow = Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        state=state,
        redirect_uri=settings.google_redirect_uri,
        autogenerate_code_verifier=False,
    )

    flow.oauth2session.scope = [
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send",
    ]

    return flow