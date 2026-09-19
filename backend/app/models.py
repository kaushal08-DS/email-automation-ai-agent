from datetime import datetime, timezone

from sqlalchemy import (
    String,
    Text,
    DateTime,
    Boolean,
    Integer,
    ForeignKey,
)
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


def now() -> datetime:
    """
    Return the current UTC time as a timezone-aware datetime.
    """
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    google_sub: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(320),
        unique=True,
        index=True,
        nullable=False,
    )

    name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    picture: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    gmail_connected: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    gmail_refresh_token: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    gmail_scopes: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    last_sync_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    style_profile: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    style_sample: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=now,
        nullable=False,
    )


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        unique=True,
        index=True,
        nullable=False,
    )

    plan_months: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    amount_paise: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="active",
        nullable=False,
    )

    razorpay_order_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    razorpay_payment_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    starts_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=now,
        nullable=False,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )


class Email(Base):
    __tablename__ = "emails"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        index=True,
        nullable=False,
    )

    gmail_id: Mapped[str] = mapped_column(
        String(255),
        index=True,
        nullable=False,
    )

    thread_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    sender: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    subject: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    body_text: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    snippet: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    received_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    category: Mapped[str] = mapped_column(
        String(40),
        default="other",
        nullable=False,
    )

    summary: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    suggested_reply: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    promo_explanation: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    promo_suggestion: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    promo_reason: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    # Promotional items can be removed from the user's
    # active promotional workspace without deleting
    # the original Gmail email.
    promo_deleted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    ignored: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    replied: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=now,
        nullable=False,
    )


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        index=True,
        nullable=False,
    )

    email_id: Mapped[int | None] = mapped_column(
        ForeignKey("emails.id"),
        nullable=True,
    )

    title: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text(),
        nullable=False,
    )

    deadline: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    priority: Mapped[str] = mapped_column(
        String(30),
        default="normal",
        nullable=False,
    )

    suggested_action: Mapped[str | None] = mapped_column(
        Text(),
        nullable=True,
    )

    completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )