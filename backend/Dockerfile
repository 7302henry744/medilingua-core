# Stage 1: Builder
FROM python:3.11-slim-bookworm AS builder

WORKDIR /tmp
RUN pip install uv

COPY pyproject.toml .
# Generate requirements.txt from pyproject.toml
RUN uv pip compile pyproject.toml -o requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim-bookworm

WORKDIR /app

# Install dependencies
COPY --from=builder /tmp/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
# We copy strict folders to ensure structure is maintained
COPY src/ ./src/
# Create an empty tests folder if not mapped, to prevent import errors if tools look for it
RUN mkdir -p tests

# Create non-root user for security (Simulates regulated environment best practice)
RUN useradd -m medilingua
USER medilingua

# Expose port
EXPOSE 8000

# Command
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]