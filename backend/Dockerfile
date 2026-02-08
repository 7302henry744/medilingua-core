# Stage 1: Builder
FROM python:3.11-slim-bookworm AS builder
WORKDIR /tmp
RUN pip install uv
COPY pyproject.toml .
RUN uv pip compile pyproject.toml --extra dev -o requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim-bookworm
WORKDIR /app

# Install system dependencies for Pillow/Fonts
RUN apt-get update && apt-get install -y \
    fontconfig \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Download specific font
RUN mkdir -p assets/fonts && \
    curl -L -o assets/fonts/Roboto-Medium.ttf https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Medium.ttf

COPY --from=builder /tmp/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create the user first
RUN useradd -m medilingua

# Copy files
COPY src/ ./src/
COPY tests/ ./tests/

# --- THE FIX IS HERE ---
# Give the 'medilingua' user ownership of the /app directory
RUN chown -R medilingua:medilingua /app

# Switch to the user
USER medilingua

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]