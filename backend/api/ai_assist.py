# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException
from backend.schemas import (
    AIExplainRequest, AISuggestFixRequest, AIResponse,
    AIChatRequest, AIChatResponse
)
from backend.services.ai_service import AIService

router = APIRouter(prefix="/api/ai", tags=["AI Assist"])

@router.get("/health")
def ai_health():
    """Health check endpoint for CodeVault AI online service (Safe - no secrets exposed)."""
    return {
        "status": "ok",
        "service": "CodeVault AI Online Service",
        "primary_provider": "NVIDIA Nemotron",
        "online_available": AIService.is_online_available(),
        "version": "2.1.0"
    }

@router.post("/chat", response_model=AIChatResponse)
async def chat_with_ai(req: AIChatRequest):
    if not req.messages:
        raise HTTPException(status_code=400, detail="Messages list cannot be empty.")
    
    # Prepare message dicts
    messages_payload = [{"role": m.role, "content": m.content} for m in req.messages]
    
    # Enrich prompt with attached code or compiler error if present
    context_prefix = ""
    if req.language and req.source_code:
        context_prefix += f"\n\n[Attached Code ({req.language.upper()})]:\n```{req.language}\n{req.source_code}\n```"
    if req.error_message:
        context_prefix += f"\n\n[Terminal Compiler Error]:\n```\n{req.error_message}\n```"
    
    if context_prefix and messages_payload:
        messages_payload[-1]["content"] += context_prefix

    result = await AIService.chat(
        messages=messages_payload,
        system_prompt=req.system_prompt
    )
    return AIChatResponse(**result)

@router.post("/explain", response_model=AIResponse)
async def explain_code(req: AIExplainRequest):
    if not req.source_code.strip():
        raise HTTPException(status_code=400, detail="Source code cannot be empty.")
    
    result = await AIService.explain_code(
        source_code=req.source_code,
        language=req.language,
        context=req.context
    )
    return AIResponse(**result)

@router.post("/suggest-fix", response_model=AIResponse)
async def suggest_fix(req: AISuggestFixRequest):
    if not req.source_code.strip():
        raise HTTPException(status_code=400, detail="Source code cannot be empty.")

    result = await AIService.suggest_fix(
        source_code=req.source_code,
        language=req.language,
        error_message=req.error_message,
        input_data=req.input_data,
        expected_output=req.expected_output,
        actual_output=req.actual_output
    )
    return AIResponse(**result)
