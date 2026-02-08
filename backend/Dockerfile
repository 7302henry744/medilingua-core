# Stage 1: Builder
FROM python:3.11-slim-bookworm AS builder
WORKDIR /tmp
RUN pip install uv
COPY pyproject.toml .
RUN uv pip compile pyproject.toml -o requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim-bookworm
WORKDIR /app

# Install system dependencies for Pillow/Fonts
RUN apt-get update && apt-get install -y \
    fontconfig \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Download specific font for reproducibility (Roboto Medium)
# In a real air-gapped environment, this file would be COPY'd from a local assets folder
RUN mkdir -p assets/fonts && \
    curl -L -o assets/fonts/Roboto-Medium.ttf https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Medium.ttf

COPY --from=builder /tmp/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
RUN mkdir -p tests

RUN useradd -m medilingua
USER medilingua

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]