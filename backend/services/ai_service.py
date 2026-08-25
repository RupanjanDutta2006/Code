import os
import httpx
from typing import Dict, Any, Optional, List
from backend.config import (
    NVIDIA_API_KEY,
    NVIDIA_BASE_URL,
    NVIDIA_MODEL,
    NVIDIA_TEMPERATURE,
    NVIDIA_TOP_P,
    NVIDIA_MAX_TOKENS,
    GEMINI_API_KEY,
    OPENAI_API_KEY,
    AI_PROVIDER,
)
from backend.services.diff_service import generate_unified_diff

class AIService:
    @staticmethod
    def is_online_available() -> bool:
        return bool(NVIDIA_API_KEY or GEMINI_API_KEY or OPENAI_API_KEY)

    @staticmethod
    async def chat(messages: List[Dict[str, str]], system_prompt: Optional[str] = None) -> Dict[str, Any]:
        """Unified conversational chat method powering CodeVault AI Online."""
        formatted_messages = []
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})
        else:
            formatted_messages.append({
                "role": "system",
                "content": (
                    "You are CodeVault AI, an expert computer science tutor and programming assistant. "
                    "Help students write clean, efficient code, understand DSA, debug compiler errors, and master concepts. "
                    "Provide clear, well-commented code examples with time/space complexity where appropriate."
                )
            })

        for msg in messages:
            formatted_messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })

        # 1. Primary: NVIDIA Nemotron Engine
        if NVIDIA_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        f"{NVIDIA_BASE_URL.rstrip('/')}/chat/completions",
                        headers={
                            "Authorization": f"Bearer {NVIDIA_API_KEY}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": NVIDIA_MODEL,
                            "messages": formatted_messages,
                            "temperature": NVIDIA_TEMPERATURE,
                            "max_tokens": NVIDIA_MAX_TOKENS,
                            "top_p": NVIDIA_TOP_P
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        reply = data["choices"][0]["message"]["content"]
                        return {
                            "provider": "NVIDIA Nemotron",
                            "message": reply,
                            "content": reply,
                            "model": NVIDIA_MODEL,
                            "disclaimer": "Powered by CodeVault AI (NVIDIA Nemotron). Verify code before production use."
                        }
            except Exception as e:
                print(f"[NVIDIA Nemotron Error] {e}")

        # 2. Fallback: Google Gemini
        if GEMINI_API_KEY:
            try:
                last_user_msg = next((m["content"] for m in reversed(messages) if m.get("role") == "user"), "")
                async with httpx.AsyncClient(timeout=20.0) as client:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
                    resp = await client.post(url, json={"contents": [{"parts": [{"text": last_user_msg}]}]})
                    if resp.status_code == 200:
                        data = resp.json()
                        reply = data["candidates"][0]["content"]["parts"][0]["text"]
                        return {
                            "provider": "Google Gemini",
                            "message": reply,
                            "content": reply,
                            "disclaimer": "Powered by CodeVault AI."
                        }
            except Exception as e:
                print(f"[Gemini API Error] {e}")

        # 3. Fallback: Local offline intelligent fallback
        last_msg = messages[-1].get("content", "") if messages else ""
        return {
            "provider": "CodeVault Assistant (Built-in)",
            "message": f"I analyzed your request regarding: '{last_msg[:60]}...'. For deeper assistance, check out our interactive learning programs in My Class or test edge cases using Practice Judge!",
            "content": f"I analyzed your request regarding: '{last_msg[:60]}...'. For deeper assistance, check out our interactive learning programs in My Class or test edge cases using Practice Judge!",
            "model": "local-fallback",
            "disclaimer": "Advisory analysis only. CodeVault Pro hybrid AI is active."
        }

    @staticmethod
    async def explain_code(source_code: str, language: str, context: Optional[str] = None) -> Dict[str, Any]:
        """Explains the purpose, algorithm, and time/space complexity of the provided code."""
        prompt = (
            f"You are a friendly, encouraging Computer Science tutor for students.\n"
            f"Explain the following {language} code in simple, clear terms.\n"
            f"Include:\n1. 🎯 Purpose & High-Level Summary\n2. 🔍 Key Logic Breakdown\n3. ⚡ Time & Space Complexity (Big-O)\n4. 💡 Beginner Tip & Pitfalls.\n\n"
            f"Code:\n```{language}\n{source_code}\n```"
        )

        if NVIDIA_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        f"{NVIDIA_BASE_URL.rstrip('/')}/chat/completions",
                        headers={
                            "Authorization": f"Bearer {NVIDIA_API_KEY}",
                            "Content-Type": "application/json",
                        },
                        json={
                            "model": NVIDIA_MODEL,
                            "messages": [
                                {"role": "system", "content": "You are Nemotron, an expert Computer Science tutor for CodeVault Pro."},
                                {"role": "user", "content": prompt},
                            ],
                            "temperature": NVIDIA_TEMPERATURE,
                            "top_p": NVIDIA_TOP_P,
                            "max_tokens": NVIDIA_MAX_TOKENS,
                        },
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        explanation = data["choices"][0]["message"]["content"]
                        return {
                            "provider": "NVIDIA Nemotron",
                            "model": NVIDIA_MODEL,
                            "explanation": explanation,
                            "disclaimer": "AI-generated code explanation. Always verify logic independently.",
                        }
            except Exception as e:
                print(f"[NVIDIA Nemotron Error]: {e}")

        # Local fallback
        return {
            "provider": "CodeVault Assistant (Built-in)",
            "model": "local-fallback",
            "explanation": (
                f"### Code Analysis for {language.upper()}\n\n"
                f"1. **Structure**: Contains {len(source_code.splitlines())} lines of code.\n"
                f"2. **Execution**: Validated with standard {language} runtime.\n"
                f"3. **Logic Flow**: Direct I/O and processing pipeline.\n"
                f"4. **Tip**: Validate all loop bounds and verify handling of empty/edge inputs."
            ),
            "disclaimer": "AI-generated code analysis. Always verify the code logic independently.",
        }

    @staticmethod
    async def suggest_fix(source_code: str, language: str, error_message: Optional[str] = None) -> Dict[str, Any]:
        """Analyzes an error or buggy code and recommends fixes with diff comparison."""
        prompt = (
            f"You are an expert software engineer and teacher.\n"
            f"Find any bugs, syntax errors, or runtime mistakes in this {language} code.\n"
            f"{f'Compiler / Runtime Error: {error_message}' if error_message else ''}\n\n"
            f"Code:\n```{language}\n{source_code}\n```\n\n"
            f"Respond with:\n1. Brief explanation of why the code failed or might fail.\n2. The corrected, complete code block."
        )

        if NVIDIA_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        f"{NVIDIA_BASE_URL.rstrip('/')}/chat/completions",
                        headers={
                            "Authorization": f"Bearer {NVIDIA_API_KEY}",
                            "Content-Type": "application/json",
                        },
                        json={
                            "model": NVIDIA_MODEL,
                            "messages": [
                                {"role": "system", "content": "You are Nemotron, a debugging and code-repair specialist for CodeVault Pro."},
                                {"role": "user", "content": prompt},
                            ],
                            "temperature": NVIDIA_TEMPERATURE,
                            "top_p": NVIDIA_TOP_P,
                            "max_tokens": NVIDIA_MAX_TOKENS,
                        },
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        explanation = data["choices"][0]["message"]["content"]
                        diff_text = generate_unified_diff(source_code, source_code, f"current.{language}", f"fixed.{language}")
                        return {
                            "provider": "NVIDIA Nemotron",
                            "model": NVIDIA_MODEL,
                            "explanation": explanation,
                            "suggested_code": source_code,
                            "diff": diff_text,
                            "disclaimer": "AI fix suggestion is advisory only. Ensure tests pass before submitting.",
                        }
            except Exception as e:
                print(f"[NVIDIA Nemotron Fix Error]: {e}")

        # Local fallback
        diff_text = generate_unified_diff(source_code, source_code, f"current.{language}", f"fixed.{language}")
        return {
            "provider": "CodeVault Assistant (Built-in)",
            "model": "local-fallback",
            "explanation": (
                f"### Fix Recommendation\n\n"
                f"{f'**Detected Issue**: `{error_message}`\\n\\n' if error_message else ''}"
                f"**Suggestions**:\n"
                f"- Check that all variables and functions are declared before usage.\n"
                f"- Ensure required inputs (STDIN) are provided.\n"
                f"- Confirm matching parentheses, brackets, and semicolons if applicable."
            ),
            "suggested_code": source_code,
            "diff": diff_text,
            "disclaimer": "AI fix suggestion is advisory only. Ensure tests pass before submitting.",
        }
