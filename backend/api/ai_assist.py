from fastapi import APIRouter, HTTPException
from backend.schemas import AIExplainRequest, AISuggestFixRequest, AIResponse
from backend.services.ai_service import AIService

router = APIRouter(prefix="/api/ai", tags=["AI Assist"])

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
