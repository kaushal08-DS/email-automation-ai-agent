from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import current_user
from ..models import User, Subscription


router = APIRouter(
    prefix="/api",
    tags=["user"],
)


def normalize_utc(value: datetime | None) -> datetime | None:
    """
    SQLite can return timezone-naive datetime objects even when the
    SQLAlchemy column is declared with timezone=True.

    Treat naive database timestamps as UTC.
    """
    if value is None:
        return None

    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)

    return value.astimezone(timezone.utc)


@router.get("/me")
def me(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    """
    Return the currently authenticated user's information
    and subscription status.
    """

    subscription = (
        db.query(Subscription)
        .filter(Subscription.user_id == user.id)
        .first()
    )

    active_subscription = False
    subscription_expires_at = None
    subscription_status = None
    plan_months = None

    if subscription:
        subscription_status = subscription.status
        plan_months = subscription.plan_months

        expires_at = normalize_utc(subscription.expires_at)

        if expires_at:
            subscription_expires_at = expires_at.isoformat()

            active_subscription = (
                subscription.status == "active"
                and expires_at > datetime.now(timezone.utc)
            )

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "picture": user.picture,
        "gmail_connected": user.gmail_connected,
        "gmail_scopes": user.gmail_scopes,
        "last_sync_at": (
            normalize_utc(user.last_sync_at).isoformat()
            if user.last_sync_at
            else None
        ),
        "subscription": {
            "active": active_subscription,
            "status": subscription_status,
            "plan_months": plan_months,
            "expires_at": subscription_expires_at,
        },
    }