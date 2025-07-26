# backend/app/services/openrouter.py

import httpx  # type: ignore
from app.config.settings import settings
from fastapi import HTTPException

async def convert_code(from_lang: str, to_lang: str, code: str) -> str:
    prompt = (
        f"Convert the following {from_lang} code to {to_lang}. "
        f"Do not include explanations, headers, or markdown.\n\n"
        f"```{from_lang.lower()}\n{code}\n```"
    )

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": settings.OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": "You are a code converter."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 500  # ✅ LIMIT TOKENS TO AVOID 402 ERRORS
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )

    try:
        response.raise_for_status()
    except httpx.HTTPStatusError:
        raise HTTPException(status_code=500, detail=f"🛑 OpenRouter API error: {response.text}")

    output = response.json()
    return output['choices'][0]['message']['content'].strip()
