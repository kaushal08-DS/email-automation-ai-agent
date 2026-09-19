import json, httpx
from ..config import settings

async def ai_json(system: str, user: str):
    if not settings.openrouter_api_key: raise RuntimeError("OPENROUTER_API_KEY is not configured")
    payload={"model":settings.openrouter_model,"temperature":0.2,"response_format":{"type":"json_object"},"messages":[{"role":"system","content":system},{"role":"user","content":user}]}
    headers={"Authorization":f"Bearer {settings.openrouter_api_key}","Content-Type":"application/json"}
    async with httpx.AsyncClient(timeout=60) as c:
        r=await c.post("https://openrouter.ai/api/v1/chat/completions",json=payload,headers=headers); r.raise_for_status()
        return json.loads(r.json()["choices"][0]["message"]["content"])

async def classify_email(subject, body, style=""):
    system='''You are a careful personal email assistant. Return JSON only with keys: category, summary, suggested_reply, promo_explanation, promo_suggestion, promo_reason, needs_reply, deadline_title, deadline_description, deadline_iso, priority, suggested_action. category must be reply, promotional, or other. Never invent deadlines; deadline_iso must be null unless clearly present. Keep summaries concise. Suggested replies must preserve the user's style.'''
    user=f"STYLE:\n{style}\n\nSUBJECT:\n{subject}\n\nEMAIL:\n{body[:12000]}"
    return await ai_json(system,user)

async def analyze_style(sample):
    return await ai_json("Analyze a user's email writing style. Return JSON with formality, tone, sentence_length, greeting_style, closing_style, vocabulary, request_style, yes_no_style, overall_style and guidance. Do not judge the person.", sample)
