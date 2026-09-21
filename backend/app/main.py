from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import Base, engine
from .routers import (
    auth,
    user,
    style,
    gmail,
    emails,
    payments,
    dashboard,
    alerts,
    insights,
)


# ============================================================
# DATABASE
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# APPLICATION
# ============================================================

app = FastAPI(
    title="Email Automation AI Agent",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "https://mailpilotai.theworkpc.com",
        "https://email-automation-ai-agent-1.onrender.com",
        "http://localhost:3000",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# ROUTERS
# ============================================================

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(style.router)
app.include_router(gmail.router)
app.include_router(emails.router)
app.include_router(payments.router)
app.include_router(dashboard.router)
app.include_router(alerts.router)
app.include_router(insights.router)


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "ok"
    }