from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import current_user, active_subscription
from ..db import get_db
from ..models import User, Email, Alert
from ..services.gmail import list_messages,get_message,header,text_from_payload
from ..services.ai import classify_email
router=APIRouter(prefix="/api/gmail",tags=["gmail"])
@router.post("/sync")
async def sync(user:User=Depends(current_user),db:Session=Depends(get_db)):
    active_subscription(db,user)
    if not user.gmail_refresh_token: raise HTTPException(400,"Gmail is not connected")
    count=0
    for item in list_messages(user):
        if db.query(Email).filter_by(user_id=user.id,gmail_id=item["id"]).first(): continue
        raw=get_message(user,item["id"]); p=raw.get("payload",{}); hs=p.get("headers",[])
        subject=header(hs,"Subject"); sender=header(hs,"From"); date=header(hs,"Date")
        try: received=parsedate_to_datetime(date) if date else None
        except: received=None
        body=text_from_payload(p); result=await classify_email(subject,body,user.style_profile or "")
        e=Email(user_id=user.id,gmail_id=item["id"],thread_id=raw.get("threadId"),sender=sender,subject=subject,body_text=body,snippet=raw.get("snippet"),received_at=received,category=result.get("category","other"),summary=result.get("summary"),suggested_reply=result.get("suggested_reply"),promo_explanation=result.get("promo_explanation"),promo_suggestion=result.get("promo_suggestion"),promo_reason=result.get("promo_reason")); db.add(e); db.flush()
        if result.get("deadline_title") and result.get("deadline_iso"):
            try: deadline=datetime.fromisoformat(result["deadline_iso"].replace("Z","+00:00"))
            except: deadline=None
            if deadline: db.add(Alert(user_id=user.id,email_id=e.id,title=result["deadline_title"],description=result.get("deadline_description") or "",deadline=deadline,priority=result.get("priority","normal"),suggested_action=result.get("suggested_action")))
        count+=1
    user.last_sync_at=datetime.now(timezone.utc); db.commit(); return {"new_emails":count,"synced_at":user.last_sync_at}
