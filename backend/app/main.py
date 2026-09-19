import os
os.environ.setdefault("OAUTHLIB_INSECURE_TRANSPORT", "1")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .db import Base,engine
from .routers import auth,user,style,gmail,emails,payments,dashboard,alerts,insights
Base.metadata.create_all(bind=engine)
app=FastAPI(title="Email Automation AI Agent",version="1.0.0")
app.add_middleware(CORSMiddleware,allow_origins=[settings.frontend_url],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
app.include_router(auth.router); app.include_router(user.router); app.include_router(style.router); app.include_router(gmail.router); app.include_router(emails.router); app.include_router(payments.router); app.include_router(dashboard.router); app.include_router(alerts.router); app.include_router(insights.router)
@app.get("/health")
def health(): return {"status":"ok"}
