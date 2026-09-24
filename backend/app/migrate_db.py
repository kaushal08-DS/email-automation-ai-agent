from sqlalchemy import text

from app.db import engine


SQL = """
ALTER TABLE public.emails
ADD COLUMN IF NOT EXISTS spam_reason TEXT;

ALTER TABLE public.emails
ADD COLUMN IF NOT EXISTS spam_risk VARCHAR(30);

ALTER TABLE public.emails
ADD COLUMN IF NOT EXISTS spam_deleted BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.emails
ADD COLUMN IF NOT EXISTS purchase_decision VARCHAR(40);

ALTER TABLE public.emails
ADD COLUMN IF NOT EXISTS purchase_reason TEXT;

ALTER TABLE public.emails
ADD COLUMN IF NOT EXISTS purchase_deleted BOOLEAN NOT NULL DEFAULT FALSE;
"""


def migrate():

    print("Starting MailPilot database migration...")

    with engine.begin() as connection:
        connection.execute(text(SQL))

    print("Database migration completed successfully.")


if __name__ == "__main__":
    migrate()