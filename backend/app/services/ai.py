import asyncio
import json
from typing import Any

import httpx

from ..config import settings


OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

MAX_ATTEMPTS = 3
MAX_RETRY_WAIT = 120


def _get_retry_seconds(
    response: httpx.Response,
    default: float,
) -> float:
    retry_after = response.headers.get("Retry-After")

    try:
        seconds = float(retry_after)
    except (TypeError, ValueError):
        seconds = default

    return max(0.0, min(seconds, MAX_RETRY_WAIT))


async def ai_json(
    system: str,
    user: str,
) -> dict[str, Any]:

    if not settings.openrouter_api_key:
        raise RuntimeError(
            "OpenRouter API key is not configured."
        )

    payload = {
        "model": settings.openrouter_model,
        "temperature": 0.2,
        "response_format": {
            "type": "json_object"
        },
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

    async with httpx.AsyncClient(
        timeout=timeout
    ) as client:

        for attempt in range(MAX_ATTEMPTS):

            try:
                response = await client.post(
                    OPENROUTER_URL,
                    json=payload,
                    headers=headers,
                )

            except httpx.TimeoutException as exc:

                if attempt < MAX_ATTEMPTS - 1:
                    await asyncio.sleep(
                        min(
                            5 * (attempt + 1),
                            MAX_RETRY_WAIT,
                        )
                    )
                    continue

                raise RuntimeError(
                    "AI service timed out while processing "
                    "the request. Please try again."
                ) from exc

            except httpx.RequestError as exc:

                if attempt < MAX_ATTEMPTS - 1:
                    await asyncio.sleep(
                        min(
                            3 * (attempt + 1),
                            MAX_RETRY_WAIT,
                        )
                    )
                    continue

                raise RuntimeError(
                    "Unable to connect to the AI service. "
                    "Please try again in a moment."
                ) from exc

            # --------------------------------------------------
            # RATE LIMIT
            # --------------------------------------------------

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

            # --------------------------------------------------
            # OPENROUTER 402
            # --------------------------------------------------

            if response.status_code == 402:

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

                if (
                    "in_flight_budget_exhausted"
                    in error_message
                ):

                    if attempt < MAX_ATTEMPTS - 1:

                        wait_seconds = _get_retry_seconds(
                            response,
                            default=30,
                        )

                        await asyncio.sleep(
                            wait_seconds
                        )

                        continue

                    raise RuntimeError(
                        "AI service is temporarily unavailable "
                        "because the OpenRouter in-flight request "
                        "limit was reached. Please wait a few "
                        "minutes and try again."
                    )

                raise RuntimeError(
                    "AI service is temporarily unavailable "
                    "because the OpenRouter account has reached "
                    "its current credit or request limit. "
                    "Please try again later."
                )

            # --------------------------------------------------
            # OTHER HTTP ERRORS
            # --------------------------------------------------

            if response.status_code >= 400:

                try:
                    error_data = response.json()
                except Exception:
                    error_data = response.text

                raise RuntimeError(
                    f"AI service request failed: {error_data}"
                )

            # --------------------------------------------------
            # SUCCESS
            # --------------------------------------------------

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

                content = choices[0]["message"]["content"]

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
                    "AI service returned an unexpected "
                    "message format."
                )

            content = content.strip()

            if not content:
                raise RuntimeError(
                    "AI service returned an empty response."
                )

            try:
                result = json.loads(content)
            except json.JSONDecodeError as exc:
                raise RuntimeError(
                    "AI service returned invalid JSON."
                ) from exc

            if not isinstance(result, dict):
                raise RuntimeError(
                    "AI service returned JSON in an "
                    "unexpected format."
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
    style: str = "",
) -> dict[str, Any]:

    system = """
You are MailPilot AI, a careful personal email assistant.

Analyze the email and classify it into exactly one category:

- reply
- promotional
- purchase
- spam
- informational
- other

Return ONLY valid JSON.

Use this structure:

{
  "category": "reply",
  "summary": "Short summary",
  "suggested_reply": "Suggested reply or null",

  "promo_explanation": "Explanation or null",
  "promo_suggestion": "Suggested action or null",
  "promo_reason": "Reason or null",

  "spam_reason": "Reason or null",
  "spam_risk": "low",

  "purchase_decision": "likely_purchase",
  "purchase_reason": "Reason or null",

  "needs_reply": true,

  "deadline_title": null,
  "deadline_description": null,
  "deadline_iso": null,

  "priority": "medium",
  "suggested_action": null
}

Rules:

1. category must be:
   reply, promotional, purchase, spam,
   informational, or other.

2. priority must be:
   low, medium, or high.

3. spam_risk must be:
   low, medium, high, or null.

4. purchase_decision must be:
   likely_purchase, review, likely_not_purchase, or null.

5. If category is not spam:
   spam_reason = null
   spam_risk = null

6. If category is not purchase:
   purchase_decision = null
   purchase_reason = null

7. If category is not promotional:
   promo_explanation = null
   promo_suggestion = null
   promo_reason = null

8. If needs_reply is false:
   suggested_reply = null

9. Never invent deadlines.

10. Never invent information that isn't in the email.

11. Suggested replies must preserve the user's writing style.

12. Return JSON only.

Keep summaries and reasons concise.
"""

    user = f"""
USER WRITING STYLE:

{style or "No writing style profile is available."}

EMAIL SUBJECT:

{subject or "(No subject)"}

EMAIL:

{body[:12000] if body else "(No email body available)"}
"""

    return await ai_json(
        system,
        user,
    )


# ============================================================
# WRITING STYLE
# ============================================================

async def analyze_style(
    sample: str,
) -> dict[str, Any]:

    system = """
Analyze the user's email writing style.

Return ONLY valid JSON with:

{
  "formality": "",
  "tone": "",
  "sentence_length": "",
  "greeting_style": "",
  "closing_style": "",
  "vocabulary": "",
  "request_style": "",
  "yes_no_style": "",
  "overall_style": "",
  "guidance": ""
}

Do not judge the person.
Only describe their writing style.
"""

    return await ai_json(
        system,
        sample or "",
    )


# ============================================================
# SHUFFLE REPLY
# ============================================================

async def shuffle_reply(
    subject: str,
    body: str,
    current_reply: str,
    style: str,
) -> dict[str, Any]:

    system = """
You are MailPilot AI's email reply variation assistant.

The user clicked the "Shuffle" button because they want a
meaningfully different reply from the current AI suggestion.

Generate a substantially different email reply.

IMPORTANT:

- Do NOT simply paraphrase the current reply.
- Keep the original email context.
- Preserve the user's writing style.
- The new reply can change the response direction when
  appropriate.
- It can be positive, neutral, cautious, negative,
  a polite refusal, a request for information, or
  a concise acknowledgement.
- Do not invent facts.
- Do not claim that the user agreed to something unless
  the email supports it.
- Do not mention AI.
- Do not explain your reasoning.
- Make the response ready to send.
- Keep it natural.

Return ONLY valid JSON:

{
  "reply": "The new email reply"
}
"""

    user = f"""
USER'S WRITING STYLE:

{style or "No writing style profile is available."}

ORIGINAL EMAIL SUBJECT:

{subject or "(No subject)"}

ORIGINAL EMAIL:

{body or "(No email body available)"}

CURRENT SUGGESTED REPLY:

{current_reply or "(No current reply)"}

Generate a substantially different reply.
"""

    return await ai_json(
        system,
        user,
    )