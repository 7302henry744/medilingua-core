from pydantic import BaseModel, Field
from typing import List, Optional

class Segment(BaseModel):
    """Represents a single translation unit from the XLIFF file."""
    id: str
    source_text: str
    target_text: Optional[str] = None
    # The computed width of the translation (or source if target missing)
    width_px: int = 0
    # The safety status
    status: str = Field(default="PENDING", pattern="^(PENDING|SAFE|OVERFLOW)$")

class AnalysisRequest(BaseModel):
    """Request model for manual text analysis (testing/debugging)."""
    text: str
    font_size: int = 16

class AnalysisResponse(BaseModel):
    text: str
    width_px: int
    safe: bool

class FileAnalysisResponse(BaseModel):
    filename: str
    total_segments: int
    segments: List[Segment]