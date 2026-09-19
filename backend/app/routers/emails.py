from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..deps import current_user, active_subscription
from ..db import get_db
from ..models import User, Email
from ..services.gmail import send_reply


router = APIRouter(
    prefix="/api/emails",
    tags=["emails"],
)


@router.get("")
def emails(
    category: str | None = None,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    active_subscription(db, user)

    q = (
        db.query(Email)
        .filter(
            Email.user_id == user.id,
            Email.replied == False,
            Email.ignored == False,
        )
    )

    if category:
        q = q.filter(Email.category == category)

        # Deleted promotional emails should not appear
        # in the promotional section again.
        if category == "promotional":
            q = q.filter(Email.promo_deleted == False)

    return [
        {
            "id": e.id,
            "sender": e.sender,
            "subject": e.subject,
            "summary": e.summary,
            "suggested_reply": e.suggested_reply,
            "promo_explanation": e.promo_explanation,
            "promo_suggestion": e.promo_suggestion,
            "promo_reason": e.promo_reason,
            "received_at": e.received_at,
            "category": e.category,
            "replied": e.replied,
            "ignored": e.ignored,
            "promo_deleted": e.promo_deleted,
        }
        for e in q.order_by(
            Email.received_at.desc()
        ).limit(100)
    ]


class Reply(BaseModel):
    body: str


@router.post("/{email_id}/reply")
def reply(
    email_id: int,
    payload: Reply,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    active_subscription(db, user)

    e = (
        db.query(Email)
        .filter(
            Email.id == email_id,
            Email.user_id == user.id,
        )
        .first()
    )

    if not e:
        raise HTTPException(
            status_code=404,
            detail="Email not found",
        )

    if e.replied or e.ignored:
        raise HTTPException(
            status_code=400,
            detail="This email is already handled",
        )

    to = (
        e.sender.split("<")[-1]
        .replace(">", "")
        .strip()
        if "<" in e.sender
        else e.sender
    )

    # Send the reply first.
    send_reply(
        user,
        to,
        e.subject or "",
        payload.body,
        e.thread_id,
    )

    # Only mark it as replied after Gmail accepts the reply.
    e.replied = True

    db.commit()

    return {
        "ok": True,
        "message": "Reply sent successfully",
        "email_id": email_id,
    }


@router.post("/{email_id}/ignore")
def ignore(
    email_id: int,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    active_subscription(db, user)

    e = (
        db.query(Email)
        .filter(
            Email.id == email_id,
            Email.user_id == user.id,
        )
        .first()
    )

    if not e:
        raise HTTPException(
            status_code=404,
            detail="Email not found",
        )

    if e.replied or e.ignored:
        raise HTTPException(
            status_code=400,
            detail="This email is already handled",
        )

    e.ignored = True

    db.commit()

    return {
        "ok": True,
        "message": "Email marked as Do Not Reply",
        "email_id": email_id,
    }


# ============================================================
# DELETE ONE PROMOTIONAL EMAIL
# ============================================================

@router.delete("/{email_id}/promotion")
def delete_promotion(
    email_id: int,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    active_subscription(db, user)

    e = (
        db.query(Email)
        .filter(
            Email.id == email_id,
            Email.user_id == user.id,
            Email.category == "promotional",
        )
        .first()
    )

    if not e:
        raise HTTPException(
            status_code=404,
            detail="Promotional email not found",
        )

    e.promo_deleted = True

    db.commit()

    return {
        "ok": True,
        "message": "Promotional email deleted",
        "email_id": email_id,
    }


# ============================================================
# DELETE ALL PROMOTIONAL EMAILS
# ============================================================

@router.delete("/promotions")
def delete_all_promotions(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    active_subscription(db, user)

    promotions = (
        db.query(Email)
        .filter(
            Email.user_id == user.id,
            Email.category == "promotional",
            Email.promo_deleted == False,
        )
        .all()
    )

    deleted_count = len(promotions)

    for email in promotions:
        email.promo_deleted = True

    db.commit()

    return {
        "ok": True,
        "message": "All promotional emails deleted",
        "deleted_count": deleted_count,
    }