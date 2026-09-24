import asyncio
import json

import httpx

from ..config import settings


OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


async def ai_json(system: str, user: str):
    if not settings.openrouter_api_key:
        raise RuntimeError("OpenRouter API key is not configured.")

    payload = {
        "model": settings.openrouter_model,
        "messages": [
            {
                "role": "system",
                "content": system,
            },
            {
                "role": "user",
                "content": user,
            },
        ],
        "response_format": {
            "type": "json_object"
        },
    }

    headers = {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": settings.frontend_url,
        "X-Title": "MailPilot AI",
    }

    max_attempts = 3

    async with httpx.AsyncClient(timeout=60) as client:

        for attempt in range(max_attempts):

            response = await client.post(
                OPENROUTER_URL,
                json=payload,
                headers=headers,
            )

            # -----------------------------
            # RATE LIMIT
            # -----------------------------

            if response.status_code == 429:

                if attempt < max_attempts - 1:

                    retry_after = response.headers.get(
                        "Retry-After"
                    )

                    try:
                        wait_seconds = float(
                            retry_after
                        )
                    except (
                        TypeError,
                        ValueError,
                    ):
                        wait_seconds = 5 * (
                            attempt + 1
                        )

                    await asyncio.sleep(
                        min(wait_seconds, 20)
                    )

                    continue

                raise RuntimeError(
                    "AI service is temporarily "
                    "rate limited. Please try again "
                    "in a moment."
                )

            # -----------------------------
            # OTHER API ERRORS
            # -----------------------------

            if response.status_code >= 400:

                try:
                    error_data = response.json()
                except Exception:
                    error_data = response.text

                raise RuntimeError(
                    f"AI service request failed: "
                    f"{error_data}"
                )

            # -----------------------------
            # PARSE RESPONSE
            # -----------------------------

            data = response.json()

            try:

                content = data[
                    "choices"
                ][0][
                    "message"
                ][
                    "content"
                ]

            except (
                KeyError,
                IndexError,
                TypeError,
            ) as exc:

                raise RuntimeError(
                    "AI service returned an "
                    "unexpected response."
                ) from exc

            # -----------------------------
            # PARSE JSON
            # -----------------------------

            try:

                result = json.loads(
                    content
                )

            except (
                json.JSONDecodeError,
                TypeError,
            ) as exc:

                raise RuntimeError(
                    "AI service returned "
                    "invalid JSON."
                ) from exc

            if not isinstance(result, dict):

                raise RuntimeError(
                    "AI service returned JSON "
                    "in an unexpected format."
                )

            return result

    raise RuntimeError(
        "AI service request failed."
    )


# =========================================================
# EMAIL CLASSIFIER
# =========================================================

async def classify_email(
    subject: str,
    body: str,
    style: str,
):

    system = """
You are the email intelligence engine for
MailPilot AI.

Your job is to analyze an email and classify it
into exactly ONE of these categories:

1. reply
2. promotional
3. purchase
4. spam
5. informational
6. other


=========================================================
CATEGORY DEFINITIONS
=========================================================

REPLY

Use "reply" when the email is legitimate and
requires or strongly suggests a response.

Examples:

- Someone asking the user a question
- Work-related communication
- Interview communication
- Client communication
- College communication requiring a response
- Personal email requiring a response


PROMOTIONAL

Use "promotional" for legitimate marketing,
advertising, offers, newsletters, discounts,
product announcements, or sales content.

Examples:

- Amazon offers
- Flipkart offers
- Clothing discounts
- Newsletter promotions
- SaaS marketing emails

Do NOT classify a genuine order confirmation
as promotional if it is primarily about a transaction.


PURCHASE

Use "purchase" when the email is primarily
related to a transaction.

Examples:

- Order confirmation
- Payment confirmation
- Invoice
- Receipt
- Subscription payment
- Booking confirmation
- Hotel reservation
- Flight booking
- Food order
- Product delivery
- Purchase cancellation
- Refund related to a transaction

A legitimate purchase confirmation should NOT
automatically be classified as spam.


SPAM

Use "spam" only when there are meaningful
signals that the email is unwanted, suspicious,
deceptive, phishing-related, fraudulent,
impersonating another organization/person,
or potentially malicious.

Possible signals include:

- Suspicious links
- Fake account warnings
- Fake payment warnings
- Impersonation
- Unrealistic prizes
- Scam offers
- Requests for passwords
- Requests for OTPs
- Requests for sensitive information
- Urgent deceptive language
- Suspicious sender/content mismatch
- Clearly malicious instructions

Do NOT classify an email as spam simply because
it is automated, promotional, or from an unfamiliar
company.

A legitimate receipt, invoice, or order confirmation
should not be marked spam without concrete evidence.


INFORMATIONAL

Use "informational" when the email contains
legitimate information but does not require a
response.

Examples:

- Company announcements
- General notifications
- System notifications
- Newsletters without promotional intent
- Service status updates
- General account information


OTHER

Use "other" when the email does not clearly fit
any category above.


=========================================================
REPLY ANALYSIS
=========================================================

Determine whether the email needs a response.

Set:

"needs_reply": true

when a response is reasonably expected.

Otherwise:

"needs_reply": false


=========================================================
PURCHASE ANALYSIS
=========================================================

If category = "purchase", analyze the transaction
and provide an AI assessment.

purchase_decision MUST be exactly one of:

"likely_purchase"

"review"

"likely_not_purchase"


Meaning:

likely_purchase
----------------
The email contains strong evidence that the
transaction appears intentional or legitimate.

review
------
The transaction should be reviewed before taking
any action.

likely_not_purchase
-------------------
The transaction contains signals that it may be
unwanted, unnecessary, unfamiliar, or should be
verified before action.

IMPORTANT:

This is an AI assessment based only on the email.

Do NOT present it as a financial fact.


For non-purchase emails:

purchase_decision = null

purchase_reason = null


=========================================================
SPAM ANALYSIS
=========================================================

If category = "spam", determine the risk level.

spam_risk MUST be exactly one of:

"low"

"medium"

"high"


Give a concise explanation of the concrete signals
that caused the spam classification.

For example:

"Sender appears to impersonate a financial service
and asks the recipient to verify sensitive information
through an external link."


For non-spam emails:

spam_risk = null

spam_reason = null


=========================================================
PRIORITY
=========================================================

Priority MUST be exactly one of:

"low"

"medium"

"high"


Use:

high
-----
Urgent or potentially important action.

medium
-------
Moderately important.

low
----
Low urgency.


=========================================================
SUMMARY
=========================================================

Create a short, useful summary of the email.

Do not copy the entire email.

Keep it concise.


=========================================================
SUGGESTED REPLY
=========================================================

For emails that need a response:

Generate a concise suggested reply that follows
the user's writing style.

For emails that do not need a reply:

suggested_reply = null


=========================================================
PROMOTIONAL EMAIL ANALYSIS
=========================================================

For promotional emails:

promo_explanation:
Explain why it is promotional.

promo_suggestion:
Suggest what the user could do.

promo_reason:
Short reason.

For non-promotional emails:

promo_explanation = null

promo_suggestion = null

promo_reason = null


=========================================================
DEADLINE ANALYSIS
=========================================================

If the email contains a clear deadline or important
date that requires attention:

deadline_title:
Short title.

deadline_iso:
ISO-8601 datetime.

deadline_description:
Short explanation.

suggested_action:
What the user should consider doing.

If there is no meaningful deadline:

deadline_title = null

deadline_iso = null

deadline_description = null

suggested_action = null


=========================================================
OUTPUT FORMAT
=========================================================

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations outside the JSON.

Use EXACTLY these fields:

{
    "category": "reply",
    "needs_reply": true,
    "summary": "Short summary",
    "suggested_reply": null,

    "priority": "medium",
    "reason": "Short explanation",

    "promo_explanation": null,
    "promo_suggestion": null,
    "promo_reason": null,

    "spam_reason": null,
    "spam_risk": null,

    "purchase_decision": null,
    "purchase_reason": null,

    "deadline_title": null,
    "deadline_iso": null,
    "deadline_description": null,
    "suggested_action": null
}

The category MUST be exactly one of:

reply
promotional
purchase
spam
informational
other
"""

    user = f"""
USER'S WRITING STYLE:

{style}


EMAIL SUBJECT:

{subject}


EMAIL BODY:

{body}
"""

    return await ai_json(
        system,
        user,
    )


# =========================================================
# WRITING STYLE ANALYSIS
# =========================================================

async def analyze_style(sample: str):

    system = """
You are a writing-style analysis assistant for
MailPilot AI.

Analyze the user's email sample and describe
their writing style.

Return ONLY valid JSON.

Use this structure:

{
    "tone": "professional",
    "formality": "medium",
    "greeting_style": "friendly",
    "closing_style": "short",
    "sentence_style": "concise",
    "common_phrases": [],
    "overall_style": "Short description"
}

Do not return markdown.
"""

    user = f"""
Analyze this email writing sample:

{sample}
"""

    return await ai_json(
        system,
        user,
    )