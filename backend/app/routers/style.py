from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..deps import current_user
from ..db import get_db
from ..models import User
from ..services.ai import analyze_style
router=APIRouter(prefix="/api/style",tags=["style"])
class Sample(BaseModel): text:str
@router.post("/learn")
async def learn(payload:Sample,user:User=Depends(current_user),db:Session=Depends(get_db)):
    if len(payload.text.strip())<20: raise HTTPException(400,"Please write at least a short email reply.")
    profile=await analyze_style(payload.text); user.style_sample=payload.text; user.style_profile=str(profile); db.commit(); return {"profile":profile}
@router.get("")
def get_style(user:User=Depends(current_user)): return {"ready":bool(user.style_profile),"profile":user.style_profile}
