import pytest
from fastapi.testclient import TestClient
from src.main import app

@pytest.fixture
def client():
    """
    Creates a TestClient that can issue requests to the FastAPI app.
    """
    return TestClient(app)

@pytest.fixture
def sample_xliff_content():
    """
    Returns a valid XLIFF byte string for testing.
    """
    return b"""<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file original="global" source-language="en" target-language="fi">
    <body>
      <trans-unit id="1">
        <source>START</source>
      </trans-unit>
      <trans-unit id="2">
        <source>CRITICAL ERROR</source>
      </trans-unit>
    </body>
  </file>
</xliff>"""