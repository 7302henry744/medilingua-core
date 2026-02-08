import pytest
from src.core.engine import width_engine
from src.core.parser import XliffParser
from src.core.glossary import lookup_term

def test_glossary_lookup():
    """Verify deterministic safety terms."""
    assert lookup_term("STOP") == "PYSÄYTÄ"
    assert lookup_term("stop") == "PYSÄYTÄ" # Case insensitive
    assert lookup_term("Random Text") is None

def test_width_calculation():
    """Verify pixel width logic."""
    # "WWWWW" should be wider than "iiiii"
    width_w = width_engine.calculate_width("WWWWW")
    width_i = width_engine.calculate_width("iiiii")
    assert width_w > width_i
    assert width_engine.calculate_width("") == 0

def test_xliff_parsing(sample_xliff_content):
    """Verify XML parsing extracts segments correctly."""
    parser = XliffParser()
    segments = parser.parse(sample_xliff_content)
    
    assert len(segments) == 2
    assert segments[0].id == "1"
    assert segments[0].source_text == "START"
    assert segments[1].source_text == "CRITICAL ERROR"