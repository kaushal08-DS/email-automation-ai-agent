from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from ..deps import current_user,active_subscription
from ..db import get_db
from ..models import User,Alert
router=APIRouter(prefix="/api/alerts",tags=["alerts"])
@router.get("")
def alerts(user:User=Depends(current_user),db:Session=Depends(get_db)):
    active_subscription(db,user); return [{"id":a.id,"title":a.title,"description":a.description,"deadline":a.deadline,"priority":a.priority,"suggested_action":a.suggested_action} for a in db.query(Alert).filter_by(user_id=user.id,completed=False).order_by(Alert.deadline.asc()).all()]
