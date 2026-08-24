import os
import httpx
<<<<<<< HEAD
from typing import Dict, Any, Optional, List, AsyncGenerator
from backend.config import (
    NVIDIA_API_KEY, NVIDIA_BASE_URL, NVIDIA_MODEL,
    GEMINI_API_KEY, OPENAI_API_KEY, AI_PROVIDER
=======
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
>>>>>>> 611aab4dcee9a9d5de9509ea61c5ad984c6d2c4f
)
from backend.services.diff_service import generate_unified_diff

class AIService:
    @staticmethod
<<<<<<< HEAD
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
                            "temperature": 0.3,
                            "max_tokens": 2048,
                            "top_p": 0.95
                        }
                    )
=======
    async def chat(messages: List[Dict[str, str]], context: Optional[str] = None) -> Dict[str, Any]:
        """Interactive multi-turn chat with Nemotron AI."""
        if NVIDIA_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        f"{NVIDIA_BASE_URL}/chat/completions",
                        headers={
                            "Authorization": f"Bearer {NVIDIA_API_KEY}",
                            "Content-Type": "application/json",
                        },
                        json={
                            "model": NVIDIA_MODEL,
                            "messages": messages,
                            "temperature": NVIDIA_TEMPERATURE,
                            "top_p": NVIDIA_TOP_P,
                            "max_tokens": NVIDIA_MAX_TOKENS,
                        },
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        reply = data["choices"][0]["message"]["content"]
                        return {
                            "provider": "NVIDIA NIM (Nemotron)",
                            "model": NVIDIA_MODEL,
                            "response": reply,
                            "disclaimer": "AI-generated content. Always verify before relying on it.",
                        }
            except Exception as e:
                print(f"[NVIDIA NIM Chat Error]: {e}")

        return {
            "provider": "CodeVault Assistant (Built-in)",
            "model": "local-fallback",
            "response": "I am ready to help you with code explanations, complexity analysis, and debugging.",
            "disclaimer": "Advisory analysis only.",
        }

    @staticmethod
    async def explain_code(source_code: str, language: str, context: Optional[str] = None) -> Dict[str, Any]:
        """Explains the purpose, algorithm, and time/space complexity of the provided code."""
        prompt = (
            f"You are a friendly, encouraging Computer Science tutor for high school and university students.\n"
            f"Explain the following {language} code in simple, clear terms.\n"
            f"Include:\n1. 🎯 Purpose & High-Level Summary\n2. 🔍 Key Logic Breakdown\n3. ⚡ Time & Space Complexity (Big-O)\n4. 💡 Beginner Tip & Pitfalls.\n\n"
            f"Code:\n```{language}\n{source_code}\n```"
        )

        # 1. Check NVIDIA NIM (Nemotron)
        if NVIDIA_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        f"{NVIDIA_BASE_URL}/chat/completions",
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
                            "provider": "NVIDIA NIM (Nemotron)",
                            "model": NVIDIA_MODEL,
                            "explanation": explanation,
                            "disclaimer": "AI-generated code explanation. Always verify logic independently.",
                        }
            except Exception as e:
                print(f"[NVIDIA NIM API Error]: {e}")

        # 2. Check Gemini API Key
        if GEMINI_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
                    payload = {"contents": [{"parts": [{"text": prompt}]}]}
                    resp = await client.post(url, json=payload)
>>>>>>> 611aab4dcee9a9d5de9509ea61c5ad984c6d2c4f
                    if resp.status_code == 200:
                        data = resp.json()
                        reply = data["choices"][0]["message"]["content"]
                        return {
<<<<<<< HEAD
                            "provider": "NVIDIA Nemotron",
                            "message": reply,
                            "content": reply,
                            "model": NVIDIA_MODEL,
                            "disclaimer": "Powered by CodeVault AI (NVIDIA Nemotron). Verify code before production use."
=======
                            "provider": "Google Gemini",
                            "explanation": explanation,
                            "disclaimer": "AI-generated content. May be inaccurate. Always verify before relying on it.",
>>>>>>> 611aab4dcee9a9d5de9509ea61c5ad984c6d2c4f
                        }
            except Exception as e:
                print(f"[NVIDIA Nemotron Error] {e}")

<<<<<<< HEAD
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

        # 3. Fallback: OpenAI
=======
        # 3. Check OpenAI Key
>>>>>>> 611aab4dcee9a9d5de9509ea61c5ad984c6d2c4f
        if OPENAI_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=20.0) as client:
                    resp = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
                        json={
                            "model": "gpt-4o-mini",
<<<<<<< HEAD
                            "messages": formatted_messages
                        }
=======
                            "messages": [
                                {"role": "system", "content": "You are a helpful student coding tutor."},
                                {"role": "user", "content": prompt},
                            ],
                        },
>>>>>>> 611aab4dcee9a9d5de9509ea61c5ad984c6d2c4f
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        reply = data["choices"][0]["message"]["content"]
                        return {
                            "provider": "OpenAI",
<<<<<<< HEAD
                            "message": reply,
                            "content": reply,
                            "disclaimer": "Powered by CodeVault AI."
=======
                            "explanation": explanation,
                            "disclaimer": "AI-generated content. May be inaccurate. Always verify before relying on it.",
>>>>>>> 611aab4dcee9a9d5de9509ea61c5ad984c6d2c4f
                        }
            except Exception as e:
                print(f"[OpenAI Error] {e}")

<<<<<<< HEAD
        # 4. Built-in Local Advisory Engine
        last_msg = messages[-1]["content"] if messages else "Hello"
        return {
            "provider": "CodeVault Assistant (Built-in)",
            "message": f"Hello! I am CodeVault AI. I am currently in standalone mode.\n\nYou asked: \"{last_msg}\"\n\nTo enable full cloud reasoning, configure your NVIDIA Nemotron API credentials, or download CodeVault Offline AI for on-device reasoning.",
            "content": f"Hello! I am CodeVault AI. I am currently in standalone mode.\n\nYou asked: \"{last_msg}\"\n\nTo enable full cloud reasoning, configure your NVIDIA Nemotron API credentials, or download CodeVault Offline AI for on-device reasoning.",
            "disclaimer": "Advisory response."
        }

    @staticmethod
    async def explain_code(source_code: str, language: str, context: Optional[str] = None) -> Dict[str, Any]:
        """Explains the purpose, algorithm, and time/space complexity of the provided code."""
        prompt = (
            f"You are a friendly, encouraging Computer Science tutor for students.\n"
            f"Explain the following {language} code in simple, clear terms.\n"
            f"Include:\n1. Summary / Purpose\n2. Key Logic Breakdown\n3. Time & Space Complexity (if applicable)\n4. Beginner Tip.\n\n"
            f"Code:\n```{language}\n{source_code}\n```"
        )
        chat_res = await AIService.chat([{"role": "user", "content": prompt}])
        return {
            "provider": chat_res.get("provider", "CodeVault AI"),
            "explanation": chat_res.get("content", ""),
            "disclaimer": "AI-generated content. Always verify code logic independently."
=======
        # Fallback Explanation Engine
        lines = source_code.strip().splitlines()
        line_count = len(lines)
        lang_upper = language.upper()

        explanation = (
            f"### 📘 Code Explanation ({lang_upper})\n\n"
            f"**Overview:**\n"
            f"This program is written in **{lang_upper}** and contains **{line_count} lines** of code.\n\n"
            f"**Structure & Key Observations:**\n"
            f"- Contains structured execution logic and data input/output handling.\n"
            f"- Processes program flow with sequential and conditional statements.\n\n"
            f"**Beginner Tip:**\n"
            f"To test this code effectively, try running it with both standard and edge-case inputs in the Playground!"
        )
        return {
            "provider": "CodeVault Assistant (Built-in)",
            "explanation": explanation,
            "disclaimer": "Advisory analysis only.",
>>>>>>> 611aab4dcee9a9d5de9509ea61c5ad984c6d2c4f
        }

    @staticmethod
    async def suggest_fix(
        source_code: str,
        language: str,
        error_message: Optional[str] = None,
        input_data: Optional[str] = None,
        expected_output: Optional[str] = None,
        actual_output: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Suggests a targeted fix for failing code or runtime errors, returning a diff."""
        prompt = (
            f"You are a debugging assistant for students.\n"
            f"Analyze this {language} code and the failure information:\n"
            f"Error / Failure: {error_message or 'Output mismatch'}\n"
            f"Input: {input_data or 'N/A'}\n"
            f"Expected Output: {expected_output or 'N/A'}\n"
            f"Actual Output: {actual_output or 'N/A'}\n\n"
            f"Code:\n```{language}\n{source_code}\n```\n\n"
            f"Provide:\n1. Root Cause\n2. Suggested Fix Description\n3. Full Corrected Code inside a ```{language} codeblock."
        )

<<<<<<< HEAD
        chat_res = await AIService.chat([{"role": "user", "content": prompt}])
        text = chat_res.get("content", "")

        suggested_code = source_code
        if f"```{language}" in text:
            code_part = text.split(f"```{language}")[1].split("```")[0].strip()
            suggested_code = code_part
        elif "```" in text:
            code_part = text.split("```")[1].split("```")[0].strip()
            suggested_code = code_part

        diff_text = generate_unified_diff(source_code, suggested_code, "Original Code", "Suggested Fix")
        return {
            "provider": chat_res.get("provider", "CodeVault AI"),
            "explanation": text,
            "suggested_code": suggested_code,
            "diff_text": diff_text,
            "disclaimer": "AI-generated content. Always verify code logic independently."
=======
        if NVIDIA_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        f"{NVIDIA_BASE_URL}/chat/completions",
                        headers={
                            "Authorization": f"Bearer {NVIDIA_API_KEY}",
                            "Content-Type": "application/json",
                        },
                        json={
                            "model": NVIDIA_MODEL,
                            "messages": [
                                {"role": "system", "content": "You are Nemotron, an expert debugging assistant for CodeVault Pro."},
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
                        extracted_code = source_code
                        import re
                        match = re.search(rf"```{language}?\s*([\s\S]*?)```", explanation, re.IGNORECASE)
                        if match:
                            extracted_code = match.group(1).strip()

                        diff_patch = generate_unified_diff(source_code, extracted_code, filename=f"solution.{language}")

                        return {
                            "provider": "NVIDIA NIM (Nemotron)",
                            "model": NVIDIA_MODEL,
                            "explanation": explanation,
                            "suggested_code": extracted_code,
                            "diff": diff_patch,
                            "disclaimer": "AI-generated fixes are advisory. Verify test execution before accepting.",
                        }
            except Exception as e:
                print(f"[NVIDIA NIM Fix Error]: {e}")

        # Fallback fix advice
        return {
            "provider": "CodeVault Assistant (Built-in)",
            "model": "local-fallback",
            "explanation": f"### Fix Suggestions\n\n- Check variable declarations and scope.\n- Verify syntax and matching braces.\n- Ensure required inputs (STDIN) are provided.",
            "suggested_code": source_code,
            "disclaimer": "Advisory analysis only.",
>>>>>>> 611aab4dcee9a9d5de9509ea61c5ad984c6d2c4f
        }
