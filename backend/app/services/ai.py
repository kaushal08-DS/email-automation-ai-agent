import asyncio
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

            if response.status_code == 429:
                if attempt < max_attempts - 1:
                    retry_after = response.headers.get("Retry-After")

                    try:
                        wait_seconds = float(retry_after)
                    except (TypeError, ValueError):
                        wait_seconds = 5 * (attempt + 1)

                    await asyncio.sleep(min(wait_seconds, 20))
                    continue

                raise RuntimeError(
                    "AI service is temporarily rate limited. "
                    "Please try again in a moment."
                )

            if response.status_code >= 400:
                try:
                    error_data = response.json()
                except Exception:
                    error_data = response.text

                raise RuntimeError(
                    f"AI service request failed: {error_data}"
                )

            data = response.json()

            try:
                return data["choices"][0]["message"]["content"]
            except (KeyError, IndexError, TypeError) as exc:
                raise RuntimeError(
                    "AI service returned an unexpected response."
                ) from exc

    raise RuntimeError("AI service request failed.")


async def classify_email(
    subject: str,
    body: str,
    style: str,
):
    system = """
You are an email classification assistant for MailPilot AI.

Analyze the email and classify it into one of these categories:

- reply
- promotional
- informational
- other

Determine whether the email requires a response.

Return ONLY valid JSON with these fields:

{
  "category": "reply",
  "needs_reply": true,
  "summary": "short summary",
  "priority": "low",
  "reason": "short explanation"
}

Priority must be one of:
- low
- medium
- high

Do not return markdown.
"""

    user = f"""
User's writing style:

{style}

Email subject:

{subject}

Email body:

{body}
"""

    return await ai_json(system, user)


async def analyze_style(sample: str):
    system = """
You are an email writing-style analyzer for MailPilot AI.

Analyze the user's email writing sample.

Return ONLY valid JSON with:

{
  "tone": "",
  "formality": "",
  "sentence_length": "",
  "greeting_style": "",
  "closing_style": "",
  "vocabulary": "",
  "punctuation_style": "",
  "common_phrases": [],
  "communication_preferences": "",
  "overall_style_summary": ""
}

Do not return markdown.
"""

    user = f"""
Analyze this email writing sample:

{sample}
"""

    return await ai_json(system, user)