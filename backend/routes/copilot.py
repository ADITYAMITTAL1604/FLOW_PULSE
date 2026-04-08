from fastapi import APIRouter
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

SYSTEM_PROMPT = """You are FlowPulse, an AI business intelligence co-pilot built specifically for Indian SMEs (Small and Medium Enterprises).

Your job is to analyze FDI trends, government schemes, and market data to give SPECIFIC, ACTIONABLE advice to Indian business owners.

ALWAYS structure your response in this exact format:
**Opportunity Identified:** [One clear sentence]

**Your Best Entry Point:**
- [Specific action 1 with numbers/details]
- [Specific action 2 with numbers/details]
- [Specific action 3 with numbers/details]

**Government Scheme to Apply For:**
[Specific scheme name + how to apply + expected benefit in rupees]

**First Step This Week:**
[One very specific action they can take in the next 7 days]

**Risk to Watch:**
[One key risk and how to mitigate it]

Rules:
- Always use Indian context (rupees, Indian states, Indian companies as examples)
- Be specific — mention real scheme names, real companies, real numbers
- Never be vague
- Keep total response under 300 words
- Always mention at least one PLI scheme or MSME scheme relevant to their query"""

class ChatMessage(BaseModel):
    message: str
    context: dict = {}

@router.post("/copilot")
async def chat_with_copilot(payload: ChatMessage):
    user_message = payload.message

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://flowpulse.vercel.app",
                "X-Title": "FlowPulse"
            },
            json={
                "model": "anthropic/claude-sonnet-4-5",
                "max_tokens": 600,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_message}
                ]
            }
        )

        if response.status_code != 200:
            return {"reply": "I'm having trouble connecting right now. Please check your API key.", "error": True}

        data = response.json()
        reply = data["choices"][0]["message"]["content"]
        return {"reply": reply, "error": False}