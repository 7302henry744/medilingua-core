import pytest
from src.core.schemas import Segment

def test_health_check(client):
    """Ensure system is up."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "operational"

def test_analyze_file_upload(client, sample_xliff_content):
    """Test the full file analysis flow."""
    files = {"file": ("test.xlf", sample_xliff_content, "application/xml")}
    response = client.post("/api/v1/analyze-file", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "test.xlf"
    assert len(data["segments"]) == 2
    assert data["segments"][0]["width_px"] > 0
    assert data["segments"][0]["status"] == "SAFE"

def test_translate_segments_flow(client):
    """
    Test translation and width update.
    We mock the AI response by assuming the 'mock' mode is active 
    or by validating the structure regardless of content.
    """
    segments = [
        {"id": "1", "source_text": "START", "width_px": 0, "status": "PENDING"}
    ]
    
    response = client.post("/api/v1/translate-segments", json=segments)
    
    assert response.status_code == 200
    result = response.json()
    
    # "START" is in glossary -> "KÄYNNISTÄ"
    assert result[0]["target_text"] == "KÄYNNISTÄ"
    # Width should be recalculated for Finnish
    assert result[0]["width_px"] > 0