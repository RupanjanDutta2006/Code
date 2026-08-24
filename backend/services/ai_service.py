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
                    if resp.status_code == 200:
                        data = resp.json()
                        explanation = data["candidates"][0]["content"]["parts"][0]["text"]
                        return {
                            "provider": "Google Gemini",
                            "explanation": explanation,
                            "disclaimer": "AI-generated content. May be inaccurate. Always verify before relying on it.",
                        }
            except Exception as e:
                print(f"Gemini API error: {e}")

        # 3. Check OpenAI Key
        if OPENAI_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
                        json={
                            "model": "gpt-4o-mini",
                            "messages": [
                                {"role": "system", "content": "You are a helpful student coding tutor."},
                                {"role": "user", "content": prompt},
                            ],
                        },
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        explanation = data["choices"][0]["message"]["content"]
                        return {
                            "provider": "OpenAI",
                            "explanation": explanation,
                            "disclaimer": "AI-generated content. May be inaccurate. Always verify before relying on it.",
                        }
            except Exception as e:
                print(f"OpenAI API error: {e}")

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
        }
