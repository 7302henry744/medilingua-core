from fastapi import APIRouter, UploadFile, File, HTTPException
from ..core.schemas import FileAnalysisResponse, AnalysisRequest, AnalysisResponse
from ..core.parser import XliffParser
from ..core.engine import width_engine

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