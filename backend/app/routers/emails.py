from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..deps import current_user, active_subscription
from ..db import get_db
from ..models import User, Email
from ..services.gmail import send_reply
from ..services.ai import shuffle_reply


router = APIRouter(
    prefix="/api/emails",
    tags=["emails"],
)


# ============================================================
# GET EMAILS
# ============================================================

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
        q = q.filter(
            Email.category == category
        )

        if category == "promotional":
            q = q.filter(
                Email.promo_deleted == False
            )

        elif category == "spam":
            q = q.filter(
                Email.spam_deleted == False
            )

        elif category == "purchase":
            q = q.filter(
                Email.purchase_deleted == False
            )

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
            "promo_deleted": e.promo_deleted,

            "spam_reason": e.spam_reason,
            "spam_risk": e.spam_risk,
            "spam_deleted": e.spam_deleted,

            "purchase_decision": e.purchase_decision,
            "purchase_reason": e.purchase_reason,
            "purchase_deleted": e.purchase_deleted,

            "received_at": e.received_at,
            "category": e.category,
            "replied": e.replied,
            "ignored": e.ignored,
        }
        for e in q.order_by(
            Email.received_at.desc()
        ).limit(100)
    ]


# ============================================================
# SEND REPLY
# ============================================================

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
        if e.sender and "<" in e.sender
        else e.sender
    )

    send_reply(
        user,
        to,
        e.subject or "",
        payload.body,
        e.thread_id,
    )

    e.replied = True

    db.commit()

    return {
        "ok": True,
        "message": "Reply sent successfully",
        "email_id": email_id,
    }


# ============================================================
# DON'T REPLY
# ============================================================

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
# SHUFFLE AI REPLY
# ============================================================

class ShuffleReplyRequest(BaseModel):
    current_reply: str = ""


@router.post("/{email_id}/shuffle-reply")
async def shuffle_email_reply(
    email_id: int,
    payload: ShuffleReplyRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    active_subscription(db, user)

    email = (
        db.query(Email)
        .filter(
            Email.id == email_id,
            Email.user_id == user.id,
            Email.ignored == False,
            Email.replied == False,
        )
        .first()
    )

    if not email:
        raise HTTPException(
            status_code=404,
            detail="Email not found",
        )

    try:
        result = await shuffle_reply(
            subject=email.subject or "",
            body=email.body_text or "",
            current_reply=payload.current_reply or "",
            style=user.style_profile or "",
        )

    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc

    new_reply = result.get("reply")

    if not new_reply:
        raise HTTPException(
            status_code=502,
            detail="AI did not generate a new reply.",
        )

    return {
        "ok": True,
        "reply": new_reply,
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


# ============================================================
# DELETE ONE SPAM EMAIL
# ============================================================

@router.delete("/{email_id}/spam")
def delete_spam(
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
            Email.category == "spam",
        )
        .first()
    )

    if not e:
        raise HTTPException(
            status_code=404,
            detail="Spam email not found",
        )

    e.spam_deleted = True

    db.commit()

    return {
        "ok": True,
        "message": "Spam email deleted",
        "email_id": email_id,
    }


# ============================================================
# DELETE ALL SPAM
# ============================================================

@router.delete("/spam")
def delete_all_spam(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    active_subscription(db, user)

    spam_emails = (
        db.query(Email)
        .filter(
            Email.user_id == user.id,
            Email.category == "spam",
            Email.spam_deleted == False,
        )
        .all()
    )

    deleted_count = len(spam_emails)

    for email in spam_emails:
        email.spam_deleted = True

    db.commit()

    return {
        "ok": True,
        "message": "All spam emails deleted",
        "deleted_count": deleted_count,
    }


# ============================================================
# DELETE ONE PURCHASE EMAIL
# ============================================================

@router.delete("/{email_id}/purchase")
def delete_purchase(
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
            Email.category == "purchase",
        )
        .first()
    )

    if not e:
        raise HTTPException(
            status_code=404,
            detail="Purchase email not found",
        )

    e.purchase_deleted = True

    db.commit()

    return {
        "ok": True,
        "message": "Purchase email deleted",
        "email_id": email_id,
    }


# ============================================================
# DELETE ALL PURCHASE EMAILS
# ============================================================

@router.delete("/purchases")
def delete_all_purchases(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    active_subscription(db, user)

    purchases = (
        db.query(Email)
        .filter(
            Email.user_id == user.id,
            Email.category == "purchase",
            Email.purchase_deleted == False,
        )
        .all()
    )

    deleted_count = len(purchases)

    for email in purchases:
        email.purchase_deleted = True

    db.commit()

    return {
        "ok": True,
        "message": "All purchase emails deleted",
        "deleted_count": deleted_count,
    }