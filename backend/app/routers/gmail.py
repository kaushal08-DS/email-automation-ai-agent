from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..deps import current_user, active_subscription
from ..db import get_db
from ..models import User, Email, Alert
from ..services.gmail import (
    list_messages,
    get_message,
    header,
    text_from_payload,
)
from ..services.ai import classify_email


router = APIRouter(
    prefix="/api/gmail",
    tags=["gmail"],
)


@router.post("/sync")
async def sync(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    active_subscription(db, user)

    if not user.gmail_refresh_token:
        raise HTTPException(
            status_code=400,
            detail="Gmail is not connected",
        )

    count = 0

    messages = list_messages(user)

    for item in messages:

        gmail_id = item["id"]

        # -----------------------------------------
        # SKIP EMAIL ALREADY IMPORTED
        # -----------------------------------------

        existing = (
            db.query(Email)
            .filter(
                Email.user_id == user.id,
                Email.gmail_id == gmail_id,
            )
            .first()
        )

        if existing:
            continue

        # -----------------------------------------
        # GET FULL GMAIL MESSAGE
        # -----------------------------------------

        raw = get_message(
            user,
            gmail_id,
        )

        payload = raw.get(
            "payload",
            {},
        )

        headers = payload.get(
            "headers",
            [],
        )

        subject = header(
            headers,
            "Subject",
        )

        sender = header(
            headers,
            "From",
        )

        date = header(
            headers,
            "Date",
        )

        # -----------------------------------------
        # PARSE DATE
        # -----------------------------------------

        try:

            received = (
                parsedate_to_datetime(date)
                if date
                else None
            )

        except Exception:

            received = None

        # -----------------------------------------
        # EXTRACT BODY
        # -----------------------------------------

        body = text_from_payload(
            payload
        )

        # -----------------------------------------
        # AI CLASSIFICATION
        # -----------------------------------------

        result = await classify_email(
            subject=subject,
            body=body,
            style=user.style_profile or "",
        )

        # -----------------------------------------
        # CREATE EMAIL
        # -----------------------------------------

        email = Email(
            user_id=user.id,

            gmail_id=gmail_id,

            thread_id=raw.get(
                "threadId"
            ),

            sender=sender,

            subject=subject,

            body_text=body,

            snippet=raw.get(
                "snippet"
            ),

            received_at=received,

            # -----------------------------
            # AI CATEGORY
            # -----------------------------

            category=result.get(
                "category",
                "other",
            ),

            summary=result.get(
                "summary"
            ),

            suggested_reply=result.get(
                "suggested_reply"
            ),

            # -----------------------------
            # PROMOTIONAL
            # -----------------------------

            promo_explanation=result.get(
                "promo_explanation"
            ),

            promo_suggestion=result.get(
                "promo_suggestion"
            ),

            promo_reason=result.get(
                "promo_reason"
            ),

            # -----------------------------
            # SPAM
            # -----------------------------

            spam_reason=result.get(
                "spam_reason"
            ),

            spam_risk=result.get(
                "spam_risk"
            ),

            # -----------------------------
            # PURCHASE
            # -----------------------------

            purchase_decision=result.get(
                "purchase_decision"
            ),

            purchase_reason=result.get(
                "purchase_reason"
            ),
        )

        db.add(email)

        db.flush()

        # -----------------------------------------
        # DEADLINE / ALERT
        # -----------------------------------------

        deadline_title = result.get(
            "deadline_title"
        )

        deadline_iso = result.get(
            "deadline_iso"
        )

        if deadline_title and deadline_iso:

            try:

                deadline = datetime.fromisoformat(
                    deadline_iso.replace(
                        "Z",
                        "+00:00",
                    )
                )

            except Exception:

                deadline = None

            if deadline:

                alert = Alert(
                    user_id=user.id,

                    email_id=email.id,

                    title=deadline_title,

                    description=(
                        result.get(
                            "deadline_description"
                        )
                        or ""
                    ),

                    deadline=deadline,

                    priority=(
                        result.get(
                            "priority"
                        )
                        or "normal"
                    ),

                    suggested_action=(
                        result.get(
                            "suggested_action"
                        )
                    ),
                )

                db.add(alert)

        count += 1

    # -----------------------------------------
    # UPDATE LAST SYNC
    # -----------------------------------------

    user.last_sync_at = datetime.now(
        timezone.utc
    )

    db.commit()

    return {
        "new_emails": count,
        "synced_at": user.last_sync_at,
    }