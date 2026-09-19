from datetime import datetime, timezone, timedelta
import hmac,hashlib,razorpay
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..config import settings
from ..deps import current_user
from ..db import get_db
from ..models import User,Subscription
router=APIRouter(prefix="/api/payments",tags=["payments"])
PLANS={1:40000,3:110000,6:220000,12:400000}
class OrderReq(BaseModel): months:int
@router.post("/order")
def order(p:OrderReq,user:User=Depends(current_user),db:Session=Depends(get_db)):
    if p.months not in PLANS: raise HTTPException(400,"Invalid plan")
    if not settings.razorpay_key_id or not settings.razorpay_key_secret: raise HTTPException(503,"Razorpay is not configured")
    client=razorpay.Client(auth=(settings.razorpay_key_id,settings.razorpay_key_secret)); o=client.order.create({"amount":PLANS[p.months],"currency":"INR","receipt":f"emailagent-{user.id}-{p.months}","notes":{"user_id":str(user.id),"months":str(p.months)}})
    return {"order_id":o["id"],"amount":PLANS[p.months],"currency":"INR","key_id":settings.razorpay_key_id}
class VerifyReq(BaseModel): razorpay_order_id:str; razorpay_payment_id:str; razorpay_signature:str; months:int
@router.post("/verify")
def verify(p:VerifyReq,user:User=Depends(current_user),db:Session=Depends(get_db)):
    if p.months not in PLANS: raise HTTPException(400,"Invalid plan")
    generated=hmac.new(settings.razorpay_key_secret.encode(),f"{p.razorpay_order_id}|{p.razorpay_payment_id}".encode(),hashlib.sha256).hexdigest()
    if not hmac.compare_digest(generated,p.razorpay_signature): raise HTTPException(400,"Invalid payment signature")
    now=datetime.now(timezone.utc); old=db.query(Subscription).filter_by(user_id=user.id).first(); start=max(now,old.expires_at) if old and old.expires_at>now else now
    expires=start+timedelta(days=30*p.months)
    if not old: old=Subscription(user_id=user.id,plan_months=p.months,amount_paise=PLANS[p.months],status="active",starts_at=start,expires_at=expires); db.add(old)
    else: old.plan_months=p.months; old.amount_paise=PLANS[p.months]; old.status="active"; old.starts_at=start; old.expires_at=expires
    db.commit(); return {"ok":True,"expires_at":expires}
@router.post("/webhook")
async def webhook(request:Request,db:Session=Depends(get_db)):
    raw=await request.body(); sig=request.headers.get("X-Razorpay-Signature","")
    if settings.razorpay_webhook_secret and not hmac.compare_digest(hmac.new(settings.razorpay_webhook_secret.encode(),raw,hashlib.sha256).hexdigest(),sig): raise HTTPException(400,"Invalid webhook")
    return {"ok":True}
