from datetime import datetime,timezone,timedelta
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from ..deps import current_user,active_subscription
from ..db import get_db
from ..models import User,Email,Alert
router=APIRouter(prefix="/api/dashboard",tags=["dashboard"])
@router.get("")
def dashboard(user:User=Depends(current_user),db:Session=Depends(get_db)):
    active_subscription(db,user); es=db.query(Email).filter_by(user_id=user.id).all(); alerts=db.query(Alert).filter_by(user_id=user.id,completed=False).order_by(Alert.deadline.asc()).limit(10).all()
    return {"received":len(es),"replies":sum(e.category=="reply" and not e.replied and not e.ignored for e in es),"promotional":sum(e.category=="promotional" for e in es),"replied":sum(e.replied for e in es),"ignored":sum(e.ignored for e in es),"pending_actions":sum(e.category=="reply" and not e.replied and not e.ignored for e in es),"alerts":[{"id":a.id,"title":a.title,"description":a.description,"deadline":a.deadline,"priority":a.priority,"suggested_action":a.suggested_action} for a in alerts]}
