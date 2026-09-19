from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from collections import Counter
from ..deps import current_user,active_subscription
from ..db import get_db
from ..models import User,Email
router=APIRouter(prefix="/api/insights",tags=["insights"])
@router.get("")
def insights(user:User=Depends(current_user),db:Session=Depends(get_db)):
    active_subscription(db,user); es=db.query(Email).filter_by(user_id=user.id).all(); senders=Counter((e.sender or "Unknown").split("<")[-1].replace(">","").strip() for e in es)
    return {"total":len(es),"reply":sum(e.category=="reply" for e in es),"promotional":sum(e.category=="promotional" for e in es),"replied":sum(e.replied for e in es),"ignored":sum(e.ignored for e in es),"top_senders":[{"sender":s,"count":c} for s,c in senders.most_common(5)]}
