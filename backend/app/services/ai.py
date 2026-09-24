import asyncio
import json
from typing import Any

import httpx

from ..config import settings


OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Maximum number of automatic retries for temporary OpenRouter failures.
MAX_ATTEMPTS = 3

# Never sleep longer than this between automatic retries.
MAX_RETRY_WAIT = 120


def _get_retry_seconds(response: httpx.Response, default: float) -> float:
    """
    Read Retry-After from the OpenRouter response.

    OpenRouter may return this header when requests are temporarily
    rate-limited or when the current in-flight budget is exhausted.
    """
    retry_after = response.headers.get("Retry-After")

    try:
        seconds = float(retry_after)
    except (TypeError, ValueError):
        seconds = default

    return max(0.0, min(seconds, MAX_RETRY_WAIT))


async def ai_json(system: str, user: str) -> dict[str, Any]:
    """
    Send a request to OpenRouter and return a validated JSON object.

    Handles:
    - OpenRouter 402 in-flight budget exhaustion
    - OpenRouter 429 rate limiting
    - temporary retry delays
    - invalid JSON
    - malformed OpenRouter responses
    - missing API key
    """

    if not settings.openrouter_api_key:
        raise RuntimeError(
            "OpenRouter API key is not configured."
        )

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

    timeout = httpx.Timeout(
        connect=20.0,
        read=60.0,
        write=30.0,
        pool=20.0,
    )

    async with httpx.AsyncClient(timeout=timeout) as client:

        for attempt in range(MAX_ATTEMPTS):

            try:
                response = await client.post(
                    OPENROUTER_URL,
                    json=payload,
                    headers=headers,
                )

            except httpx.TimeoutException as exc:

                if attempt < MAX_ATTEMPTS - 1:
                    wait_seconds = min(
                        5 * (attempt + 1),
                        MAX_RETRY_WAIT,
                    )

                    await asyncio.sleep(wait_seconds)
                    continue

                raise RuntimeError(
                    "AI service timed out while processing the request. "
                    "Please try again in a moment."
                ) from exc

            except httpx.RequestError as exc:

                if attempt < MAX_ATTEMPTS - 1:
                    wait_seconds = min(
                        3 * (attempt + 1),
                        MAX_RETRY_WAIT,
                    )

                    await asyncio.sleep(wait_seconds)
                    continue

                raise RuntimeError(
                    "Unable to connect to the AI service. "
                    "Please try again in a moment."
                ) from exc

            # ---------------------------------------------------------
            # OpenRouter temporary rate limit
            # ---------------------------------------------------------

            if response.status_code == 429:

                if attempt < MAX_ATTEMPTS - 1:

                    wait_seconds = _get_retry_seconds(
                        response,
                        default=5 * (attempt + 1),
                    )

                    await asyncio.sleep(wait_seconds)
                    continue

                raise RuntimeError(
                    "AI service is temporarily rate limited. "
                    "Please try again in a moment."
                )

            # ---------------------------------------------------------
            # OpenRouter 402
            #
            # This can happen when the account's current in-flight
            # request budget is exhausted.
            # ---------------------------------------------------------

            if response.status_code == 402:

                if attempt < MAX_ATTEMPTS - 1:

                    wait_seconds = _get_retry_seconds(
                        response,
                        default=30,
                    )

                    await asyncio.sleep(wait_seconds)
                    continue

                try:
                    error_data = response.json()
                except Exception:
                    error_data = None

                error_message = ""

                if isinstance(error_data, dict):
                    error = error_data.get("error")

                    if isinstance(error, dict):
                        error_message = str(
                            error.get("message") or ""
                        )

                if "in_flight_budget_exhausted" in error_message:
                    raise RuntimeError(
                        "AI service is temporarily unavailable because "
                        "the OpenRouter in-flight request limit was reached. "
                        "Please wait a few minutes and try syncing again."
                    )

                raise RuntimeError(
                    "AI service is temporarily unavailable because "
                    "the OpenRouter account has reached its current "
                    "credit or request limit. Please try again later."
                )

            # ---------------------------------------------------------
            # Other HTTP errors
            # ---------------------------------------------------------

            if response.status_code >= 400:

                try:
                    error_data = response.json()
                except Exception:
                    error_data = response.text

                raise RuntimeError(
                    f"AI service request failed: {error_data}"
                )

            # ---------------------------------------------------------
            # Successful response
            # ---------------------------------------------------------

            try:
                data = response.json()
            except Exception as exc:
                raise RuntimeError(
                    "AI service returned an invalid response."
                ) from exc

            try:
                choices = data["choices"]

                if not choices:
                    raise ValueError(
                        "No choices returned."
                    )

                message = choices[0]["message"]

                content = message["content"]

            except (
                KeyError,
                IndexError,
                TypeError,
                ValueError,
            ) as exc:

                raise RuntimeError(
                    "AI service returned an unexpected response."
                ) from exc

            if not isinstance(content, str):
                raise RuntimeError(
                    "AI service returned an unexpected message format."
                )

            content = content.strip()

            if not content:
                raise RuntimeError(
                    "AI service returned an empty response."
                )

            # ---------------------------------------------------------
            # Parse JSON
            # ---------------------------------------------------------

            try:
                result = json.loads(content)

            except json.JSONDecodeError as exc:

                raise RuntimeError(
                    "AI service returned invalid JSON."
                ) from exc

            if not isinstance(result, dict):
                raise RuntimeError(
                    "AI service returned JSON in an unexpected format."
                )

            return result

    raise RuntimeError(
        "AI service request failed after multiple attempts."
    )


# ============================================================
# EMAIL CLASSIFICATION
# ============================================================

async def classify_email(
    subject: str,
    body: str,
    style: str,
) -> dict[str, Any]:

    system = """
You are an email classification assistant for MailPilot AI.

Analyze the email and classify it into exactly one of these categories:

- reply
- promotional
- purchase
- spam
- informational
- other

Determine whether the email requires a response.

For spam emails, identify:
- why the email appears to be spam
- spam risk

For purchase-related emails, determine:
- likely_purchase
- review
- likely_not_purchase

For emails that may require a response, provide a concise suggested reply.

If the email contains a deadline or important date, identify it when possible.

Return ONLY valid JSON.

Use this structure:

{
  "category": "reply",
  "needs_reply": true,
  "summary": "Short summary of the email",
  "priority": "medium",
  "reason": "Short explanation",

  "suggested_reply": "Suggested reply text or null",

  "promo_explanation": "Explanation if promotional or null",
  "promo_suggestion": "Suggested action if promotional or null",
  "promo_reason": "Reason if promotional or null",

  "spam_reason": "Reason if spam or null",
  "spam_risk": "low",

  "purchase_decision": "likely_purchase",
  "purchase_reason": "Reason if purchase-related or null",

  "deadline_title": "Deadline title or null",
  "deadline_iso": "ISO datetime or null",
  "deadline_description": "Deadline description or null",
  "suggested_action": "Suggested action or null"
}

Rules:

1. category must be exactly one of:
   reply, promotional, purchase, spam, informational, other

2. priority must be exactly one of:
   low, medium, high

3. spam_risk must be:
   low, medium, high, or null

4. purchase_decision must be:
   likely_purchase, review, likely_not_purchase, or null

5. If the email is not spam:
   spam_reason must be null
   spam_risk must be null

6. If the email is not purchase-related:
   purchase_decision must be null
   purchase_reason must be null

7. If the email is not promotional:
   promo_explanation must be null
   promo_suggestion must be null
   promo_reason must be null

8. If the email does not require a response:
   needs_reply should be false
   suggested_reply should be null

9. Do not invent information that is not present in the email.

10. Do not return markdown.

11. Return valid JSON only.
"""

    user = f"""
User's writing style:

{style or "No writing style profile is available."}

Email subject:

{subject or "(No subject)"}

Email body:

{body or "(No email body available)"}
"""

    return await ai_json(
        system=system,
        user=user,
    )


# ============================================================
# WRITING STYLE ANALYSIS
# ============================================================

async def analyze_style(
    sample: str,
) -> dict[str, Any]:

    system = """
You are a writing-style analysis assistant for MailPilot AI.

Analyze the user's email writing sample and create a concise
writing-style profile that can be used to generate future
email replies in the user's natural style.

Analyze:

- tone
- formality
- sentence length
- greeting style
- closing style
- vocabulary
- directness
- use of emojis
- punctuation
- common phrases
- overall writing characteristics

Return ONLY valid JSON.

Use this structure:

{
  "tone": "friendly",
  "formality": "casual",
  "sentence_length": "short",
  "greeting_style": "Hi",
  "closing_style": "Thanks",
  "vocabulary": "simple and conversational",
  "directness": "direct",
  "emoji_usage": "rare",
  "punctuation": "simple",
  "common_phrases": [],
  "profile": "Concise description of the user's writing style"
}

Do not invent characteristics that are not supported by
the provided writing sample.

Return valid JSON only.
"""

    user = f"""
Analyze this writing sample:

{sample or "(No writing sample provided)"}
"""

    return await ai_json(
        system=system,
        user=user,
    )