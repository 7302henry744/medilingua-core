"""
API Routes Definitions.
Exposes endpoints for file analysis, width validation, AI translation, and context-aware explanations.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from typing import List
from ..core.schemas import (
    FileAnalysisResponse, 
    AnalysisRequest, 
    AnalysisResponse, 
    Segment,
    ChatRequest, 
    ChatResponse
)
from ..core.parser import XliffParser
from ..core.engine import width_engine
from ..core.ai import translator

router = APIRouter()
parser = XliffParser()

@router.post("/analyze-file", response_model=FileAnalysisResponse)
async def analyze_file(file: UploadFile = File(...)):
    """
    Upload an XLIFF file.
    Returns: List of segments with their Source Text Width calculated.
    """
    if not file.filename.endswith(('.xlf', '.xliff')):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be .xlf or .xliff")
    
    content = await file.read()
    
    try:
        segments = parser.parse(content)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Calculate width for all source segments (baseline)
    for seg in segments:
        seg.width_px = width_engine.calculate_width(seg.source_text)
        seg.status = "SAFE" # Baseline is always safe until compared

    return FileAnalysisResponse(
        filename=file.filename,
        total_segments=len(segments),
        segments=segments
    )

@router.post("/check-width", response_model=AnalysisResponse)
async def check_width(request: AnalysisRequest):
    """
    Ad-hoc check for a specific string (used by Frontend live preview).
    """
    width = width_engine.calculate_width(request.text, request.font_size)
    # Mock limit: 200px
    safe = width <= 200 
    
    return AnalysisResponse(
        text=request.text,
        width_px=width,
        safe=safe
    )

@router.post("/translate-segments", response_model=List[Segment])
async def translate_segments(segments: List[Segment] = Body(...)):
    """
    Batch processes segments:
    1. Translate (Glossary -> AI)
    2. Calculate new width for the TARGET text
    3. Update Status based on 200px limit
    """
    processed = []
    
    for seg in segments:
        # Perform Translation (Hybrid: Glossary First -> AI Second)
        target = await translator.translate(seg.source_text)
        seg.target_text = target
        
        # Calculate Width of the TARGET text (Visual Safety Check)
        width = width_engine.calculate_width(target)
        seg.width_px = width
        
        # Update Status (Mock limit 200px)
        # If target width > 200px, we flag it as OVERFLOW
        seg.status = "OVERFLOW" if width > 200 else "SAFE"
        
        processed.append(seg)
        
    return processed

@router.post("/explain-analysis", response_model=ChatResponse)
async def explain_analysis(request: ChatRequest):
    """
    Context-aware chat. 
    Accepts the current list of segments and a user question.
    Returns an AI-generated explanation of the analysis results.
    """
    reply = await translator.explain(request.segments, request.question)
    return ChatResponse(reply=reply)