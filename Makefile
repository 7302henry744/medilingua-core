.PHONY: setup install-frontend up down build logs test clean

# ==============================================================================
# Configuration & Paths
# ==============================================================================
# Main Production Compose File (Root)
COMPOSE_FILE := docker-compose.yml
BACKEND_DIR  := backend
FRONTEND_DIR := frontend
PYTHON       := python

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
	docker-compose -f $(COMPOSE_FILE) build --no-cache
	docker-compose -f $(COMPOSE_FILE) up -d
	@echo "System is UP."
	@echo "  - Frontend:  http://localhost:3000"
	@echo "  - Backend:   http://localhost:8000/docs"

# Stop the system
down:
	docker-compose -f $(COMPOSE_FILE) down

# Rebuild images without cache
build:
	docker-compose -f $(COMPOSE_FILE) build --no-cache

# View logs in real-time
logs:
	docker-compose -f $(COMPOSE_FILE) logs -f

# Test the system (both backend and frontend)
test: test-backend test-frontend

test-backend:
	@echo "🧪 Running Backend Tests..."
	cd $(BACKEND_DIR) && pytest

test-frontend:
	@echo "🧪 Running Frontend Tests..."
	cd $(FRONTEND_DIR) && npm test -- --run

# ==============================================================================
# Maintenance & Debugging
# ==============================================================================

clean:
	@echo "⚠️  Cleaning up ALL Docker resources..."
	docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans
	docker system prune -f
	@echo "🧹 Cleaning Python cache..."
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name ".coverage" -delete
	@echo "🧹 Cleaning Node modules..."
	rm -rf $(FRONTEND_DIR)/node_modules
	@echo "✨ Clean complete."