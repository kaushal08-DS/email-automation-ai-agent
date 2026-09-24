from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from pydantic import BaseModel

from sqlalchemy.orm import Session

from ..deps import (
    current_user,
    active_subscription,
)

from ..db import get_db

from ..models import (
    User,
    Email,
)

from ..services.gmail import send_reply


router = APIRouter(
    prefix="/api/emails",
    tags=["emails"],
)


# =========================================================
# GET EMAILS
# =========================================================

@router.get("")
def emails(
    category: str | None = None,

    user: User = Depends(
        current_user
    ),

    db: Session = Depends(
        get_db
    ),
):

    active_subscription(
        db,
        user,
    )

    query = (
        db.query(Email)
        .filter(
            Email.user_id == user.id,

            Email.replied == False,

            Email.ignored == False,
        )
    )

    # -----------------------------------------
    # CATEGORY FILTER
    # -----------------------------------------

    if category:

        query = query.filter(
            Email.category == category
        )

        # Promotional deleted emails
        if category == "promotional":

            query = query.filter(
                Email.promo_deleted == False
            )

        # Spam deleted emails
        elif category == "spam":

            query = query.filter(
                Email.spam_deleted == False
            )

        # Purchase deleted emails
        elif category == "purchase":

            query = query.filter(
                Email.purchase_deleted == False
            )

    results = (
        query
        .order_by(
            Email.received_at.desc()
        )
        .limit(100)
        .all()
    )

    return [

        {
            "id": email.id,

            "sender": email.sender,

            "subject": email.subject,

            "body_text": email.body_text,

            "snippet": email.snippet,

            "summary": email.summary,

            "suggested_reply": (
                email.suggested_reply
            ),

            # ---------------------------------
            # PROMOTIONAL
            # ---------------------------------

            "promo_explanation": (
                email.promo_explanation
            ),

            "promo_suggestion": (
                email.promo_suggestion
            ),

            "promo_reason": (
                email.promo_reason
            ),

            "promo_deleted": (
                email.promo_deleted
            ),

            # ---------------------------------
            # SPAM
            # ---------------------------------

            "spam_reason": (
                email.spam_reason
            ),

            "spam_risk": (
                email.spam_risk
            ),

            "spam_deleted": (
                email.spam_deleted
            ),

            # ---------------------------------
            # PURCHASE
            # ---------------------------------

            "purchase_decision": (
                email.purchase_decision
            ),

            "purchase_reason": (
                email.purchase_reason
            ),

            "purchase_deleted": (
                email.purchase_deleted
            ),

            # ---------------------------------
            # GENERAL
            # ---------------------------------

            "received_at": (
                email.received_at
            ),

            "category": email.category,

            "replied": email.replied,

            "ignored": email.ignored,
        }

        for email in results
    ]


# =========================================================
# REPLY
# =========================================================

class Reply(BaseModel):

    body: str


@router.post(
    "/{email_id}/reply"
)
def reply(
    email_id: int,

    payload: Reply,

    user: User = Depends(
        current_user
    ),

    db: Session = Depends(
        get_db
    ),
):

    active_subscription(
        db,
        user,
    )

    email = (
        db.query(Email)
        .filter(
            Email.id == email_id,

            Email.user_id == user.id,
        )
        .first()
    )

    if not email:

        raise HTTPException(
            status_code=404,
            detail="Email not found",
        )

    if email.replied:

        raise HTTPException(
            status_code=400,
            detail="Email already replied",
        )

    if email.ignored:

        raise HTTPException(
            status_code=400,
            detail="Email is ignored",
        )

    if not email.sender:

        raise HTTPException(
            status_code=400,
            detail="Email sender is missing",
        )

    # -----------------------------------------
    # SEND GMAIL REPLY
    # -----------------------------------------

    send_reply(
        user=user,

        to=email.sender,

        subject=email.subject or "",

        body=payload.body,

        thread_id=email.thread_id,
    )

    # -----------------------------------------
    # MARK AS REPLIED
    # -----------------------------------------

    email.replied = True

    db.commit()

    return {
        "ok": True,

        "message": "Reply sent successfully",

        "email_id": email.id,
    }


# =========================================================
# IGNORE EMAIL
# =========================================================

@router.post(
    "/{email_id}/ignore"
)
def ignore(
    email_id: int,

    user: User = Depends(
        current_user
    ),

    db: Session = Depends(
        get_db
    ),
):

    active_subscription(
        db,
        user,
    )

    email = (
        db.query(Email)
        .filter(
            Email.id == email_id,

            Email.user_id == user.id,
        )
        .first()
    )

    if not email:

        raise HTTPException(
            status_code=404,

            detail="Email not found",
        )

    email.ignored = True

    db.commit()

    return {
        "ok": True,

        "email_id": email.id,
    }


# =========================================================
# DELETE ONE PROMOTIONAL EMAIL
# =========================================================

@router.delete(
    "/{email_id}/promotion"
)
def delete_promotion(
    email_id: int,

    user: User = Depends(
        current_user
    ),

    db: Session = Depends(
        get_db
    ),
):

    active_subscription(
        db,
        user,
    )

    email = (
        db.query(Email)
        .filter(
            Email.id == email_id,

            Email.user_id == user.id,

            Email.category == "promotional",
        )
        .first()
    )

    if not email:

        raise HTTPException(
            status_code=404,

            detail="Promotional email not found",
        )

    email.promo_deleted = True

    db.commit()

    return {
        "ok": True,

        "email_id": email.id,
    }


# =========================================================
# DELETE ALL PROMOTIONAL EMAILS
# =========================================================

@router.delete(
    "/promotions"
)
def delete_all_promotions(
    user: User = Depends(
        current_user
    ),

    db: Session = Depends(
        get_db
    ),
):

    active_subscription(
        db,
        user,
    )

    emails = (
        db.query(Email)
        .filter(
            Email.user_id == user.id,

            Email.category == "promotional",

            Email.promo_deleted == False,
        )
        .all()
    )

    count = len(emails)

    for email in emails:

        email.promo_deleted = True

    db.commit()

    return {
        "ok": True,

        "deleted_count": count,
    }


# =========================================================
# DELETE ONE SPAM EMAIL
# =========================================================

@router.delete(
    "/{email_id}/spam"
)
def delete_spam(
    email_id: int,

    user: User = Depends(
        current_user
    ),

    db: Session = Depends(
        get_db
    ),
):

    active_subscription(
        db,
        user,
    )

    email = (
        db.query(Email)
        .filter(
            Email.id == email_id,

            Email.user_id == user.id,

            Email.category == "spam",
        )
        .first()
    )

    if not email:

        raise HTTPException(
            status_code=404,

            detail="Spam email not found",
        )

    email.spam_deleted = True

    db.commit()

    return {
        "ok": True,

        "message": "Spam email deleted",

        "email_id": email.id,
    }


# =========================================================
# DELETE ALL SPAM
# =========================================================

@router.delete(
    "/spam"
)
def delete_all_spam(
    user: User = Depends(
        current_user
    ),

    db: Session = Depends(
        get_db
    ),
):

    active_subscription(
        db,
        user,
    )

    emails = (
        db.query(Email)
        .filter(
            Email.user_id == user.id,

            Email.category == "spam",

            Email.spam_deleted == False,
        )
        .all()
    )

    count = len(emails)

    for email in emails:

        email.spam_deleted = True

    db.commit()

    return {
        "ok": True,

        "message": "All spam emails deleted",

        "deleted_count": count,
    }


# =========================================================
# DELETE ONE PURCHASE
# =========================================================

@router.delete(
    "/{email_id}/purchase"
)
def delete_purchase(
    email_id: int,

    user: User = Depends(
        current_user
    ),

    db: Session = Depends(
        get_db
    ),
):

    active_subscription(
        db,
        user,
    )

    email = (
        db.query(Email)
        .filter(
            Email.id == email_id,

            Email.user_id == user.id,

            Email.category == "purchase",
        )
        .first()
    )

    if not email:

        raise HTTPException(
            status_code=404,

            detail="Purchase email not found",
        )

    email.purchase_deleted = True

    db.commit()

    return {
        "ok": True,

        "message": "Purchase email deleted",

        "email_id": email.id,
    }


# =========================================================
# DELETE ALL PURCHASE EMAILS
# =========================================================

@router.delete(
    "/purchases"
)
def delete_all_purchases(
    user: User = Depends(
        current_user
    ),

    db: Session = Depends(
        get_db
    ),
):

    active_subscription(
        db,
        user,
    )

    emails = (
        db.query(Email)
        .filter(
            Email.user_id == user.id,

            Email.category == "purchase",

            Email.purchase_deleted == False,
        )
        .all()
    )

    count = len(emails)

    for email in emails:

        email.purchase_deleted = True

    db.commit()

    return {
        "ok": True,

        "message": "All purchase emails deleted",

        "deleted_count": count,
    }