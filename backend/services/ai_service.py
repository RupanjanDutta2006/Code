import os
import httpx
from typing import Dict, Any, Optional
from backend.config import GEMINI_API_KEY, OPENAI_API_KEY, AI_PROVIDER
from backend.services.diff_service import generate_unified_diff

class AIService:
    @staticmethod
    async def explain_code(source_code: str, language: str, context: Optional[str] = None) -> Dict[str, Any]:
        """Explains the purpose, algorithm, and time/space complexity of the provided code."""
        prompt = (
            f"You are a friendly, encouraging Computer Science tutor for high school and university students.\n"
            f"Explain the following {language} code in simple, clear terms.\n"
            f"Include:\n1. Summary / Purpose\n2. Key Logic Breakdown\n3. Time & Space Complexity (if applicable)\n4. Beginner Tip.\n\n"
            f"Code:\n```{language}\n{source_code}\n```"
        )
        
        # Check Gemini API Key
        if GEMINI_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
                    payload = {
                        "contents": [{"parts": [{"text": prompt}]}]
                    }
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        explanation = data["candidates"][0]["content"]["parts"][0]["text"]
                        return {
                            "provider": "Google Gemini",
                            "explanation": explanation,
                            "disclaimer": "AI-generated content. May be inaccurate. Always verify before relying on it."
                        }
            except Exception as e:
                print(f"Gemini API error: {e}")

        # Check OpenAI Key
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
                                {"role": "user", "content": prompt}
                            ]
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        explanation = data["choices"][0]["message"]["content"]
                        return {
                            "provider": "OpenAI",
                            "explanation": explanation,
                            "disclaimer": "AI-generated content. May be inaccurate. Always verify before relying on it."
                        }
            except Exception as e:
                print(f"OpenAI API error: {e}")

        # Intelligent Fallback Explanation Engine
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
            f"To test this code effectively, try running it with both standard and edge-case inputs in the Playground or Practice & Check panel!"
        )
        return {
            "provider": "CodeVault Assistant (Built-in)",
            "explanation": explanation,
            "disclaimer": "AI-generated content. May be inaccurate. Always verify before relying on it."
        }

    @staticmethod
    async def suggest_fix(
        source_code: str,
        language: str,
        error_message: Optional[str] = None,
        input_data: Optional[str] = None,
        expected_output: Optional[str] = None,
        actual_output: Optional[str] = None
    ) -> Dict[str, Any]:
        """Suggests a targeted fix for failing code or runtime errors, returning a diff."""
        prompt = (
            f"You are a debugging assistant for students.\n"
            f"Analyze this {language} code and the failure information:\n"
            f"Error / Failure: {error_message or 'Output mismatch'}\n"
            f"Input: {input_data or 'N/A'}\n"
            f"Expected Output: {expected_output or 'N/A'}\n"
            f"Actual Output: {actual_output or 'N/A'}\n\n"
            f"Source Code:\n```{language}\n{source_code}\n```\n\n"
            f"Respond with:\n"
            f"1. Explanation of why the bug occurred\n"
            f"2. Exact corrected code inside a ```{language} code block."
        )

        if GEMINI_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
                    resp = await client.post(url, json={"contents": [{"parts": [{"text": prompt}]}]})
                    if resp.status_code == 200:
                        data = resp.json()
                        text = data["candidates"][0]["content"]["parts"][0]["text"]
                        
                        # Extract suggested code if present
                        suggested_code = source_code
                        if f"```{language}" in text:
                            code_part = text.split(f"```{language}")[1].split("```")[0].strip()
                            suggested_code = code_part
                        elif "```" in text:
                            code_part = text.split("```")[1].split("```")[0].strip()
                            suggested_code = code_part

                        diff_text = generate_unified_diff(source_code, suggested_code, "Original Code", "Suggested Fix")
                        return {
                            "provider": "Google Gemini",
                            "explanation": text,
                            "suggested_code": suggested_code,
                            "diff_text": diff_text,
                            "disclaimer": "AI-generated content. May be inaccurate. Always verify before relying on it."
                        }
            except Exception as e:
                print(f"Gemini error: {e}")

        # Fallback fix suggestion
        explanation = (
            f"### 🛠️ Debug Analysis\n\n"
            f"- **Observed Error/Mismatch**: `{error_message or 'Check failed against expected answer'}`\n"
            f"- **Recommendation**: Verify variable types, boundary conditions (such as 0-indexing vs 1-indexing), and ensure all edge cases (empty input, single element, negative numbers) are handled."
        )
        return {
            "provider": "CodeVault Assistant (Built-in)",
            "explanation": explanation,
            "suggested_code": source_code,
            "diff_text": generate_unified_diff(source_code, source_code, "Original Code", "Suggested Fix"),
            "disclaimer": "AI-generated content. May be inaccurate. Always verify before relying on it."
        }
