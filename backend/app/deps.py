from datetime import datetime, timezone

from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from .db import get_db
from .models import User, Subscription
from .services.security import decode_session


def normalize_utc(value: datetime | None) -> datetime | None:
    """
    Normalize a datetime to a timezone-aware UTC datetime.

    SQLite can return naive datetime objects even when the SQLAlchemy
    column is declared with DateTime(timezone=True), so naive values
    are treated as UTC.
    """
    if value is None:
        return None

    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)

    return value.astimezone(timezone.utc)


def current_user(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Get the currently authenticated user from the session cookie.
    """

    token = request.cookies.get("session")

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Please sign in",
        )

    try:
        payload = decode_session(token)
        user_id = int(payload["sub"])
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Session expired",
        )

    user = db.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    return user


def active_subscription(
    db: Session,
    user: User,
) -> bool:
    """
    Check whether the user currently has an active subscription.

    Handles both timezone-aware and timezone-naive datetimes so that
    SQLite does not cause:

        TypeError: can't compare offset-naive and offset-aware datetimes
    """

    subscription = (
        db.query(Subscription)
        .filter(Subscription.user_id == user.id)
        .first()
    )

    if not subscription:
        return False

    # Check subscription status first.
    if subscription.status != "active":
        return False

    expires_at = normalize_utc(subscription.expires_at)

    if expires_at is None:
        return False

    now_utc = datetime.now(timezone.utc)

    if expires_at <= now_utc:
        return False

    return True