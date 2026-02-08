.PHONY: setup install-frontend up down build logs test clean

# ==============================================================================
# Configuration & Paths
# ==============================================================================
# Main Production Compose File (Root)
COMPOSE_FILE := docker-compose.yml
BACKEND_DIR  := backend
FRONTEND_DIR := frontend
PYTHON       := python
# NEW: Define the command explicitly to allow overrides if needed
DOCKER_COMPOSE := docker compose

# Copy env example to .env
setup:
	cp .env.example .env
	@echo "Environment file created. Please run 'make up'."

# Install frontend dependencies
install-frontend:
	@echo "Installing Frontend Dependencies..."
	cd $(FRONTEND_DIR) && npm install

# Start the system
up: install-frontend
	@echo "Launching MediLingua-Core (Full Stack)..."
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) build --no-cache
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d
	@echo "System is UP."
	@echo "  - Frontend:  http://localhost:3000"
	@echo "  - Backend:   http://localhost:8000/docs"

# Stop the system
down:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down

# Rebuild images without cache
build:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) build --no-cache

# View logs in real-time
logs:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) logs -f

# Test the system (both backend and frontend) inside Docker containers
test: test-backend test-frontend

test-backend:
	@echo "🧪 Running Backend Tests (Inside Docker Container)..."
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec backend python -m pytest

test-frontend:
	@echo "🧪 Running Frontend Tests (Inside Docker Container)..."
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec frontend npm test -- --run

# ==============================================================================
# Maintenance & Debugging
# ==============================================================================

clean:
	@echo "Cleaning up ALL Docker resources..."
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down -v --remove-orphans
	docker system prune -f
	@echo "Cleaning Python cache..."
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name ".coverage" -delete
	@echo "Cleaning Node modules..."
	rm -rf $(FRONTEND_DIR)/node_modules
	@echo "✨ Clean complete."