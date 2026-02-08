"""
Main Application Entry Point.
Purpose: Initialize the FastAPI application with regulated middleware and health checks.
"""
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import router as api_router
from pydantic import BaseModel
import uvicorn

# Metadata for Documentation
description = """
MediLingua-Core Backend API.
Handles medical translation logic, terminology enforcement, and pixel-width validation.
"""

app = FastAPI(
    title="MediLingua-Core Compliance Engine",
    description=description,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
# Rationale: Allow frontend container to communicate during development.
# In production, specific origins must be whitelisted.
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routes Registration ---
app.include_router(api_router, prefix="/api/v1")

# --- Models ---
class HealthResponse(BaseModel):
    status: str
    version: str
    service: str

# --- System Routes ---

@app.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    tags=["System"]
)
async def health_check():
    """
    System Health Check.
    Used by Docker Healthcheck and Kubernetes Liveness probes.
    """
    return HealthResponse(
        status="operational",
        version="0.1.0",
        service="medilingua-backend"
    )

# --- Execution ---
if __name__ == "__main__":
    # Dev mode execution
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)