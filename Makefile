.PHONY: help install dev backend frontend docker-up docker-down clean

help:
	@echo "Available commands:"
	@echo "  make install    - Install all dependencies"
	@echo "  make dev        - Start frontend and backend in development"
	@echo "  make backend    - Start backend only"
	@echo "  make frontend   - Start frontend only"
	@echo "  make docker-up  - Start all services with Docker Compose"
	@echo "  make docker-down - Stop all services"
	@echo "  make clean      - Clean node_modules and Python cache"

install:
	npm install
	cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt

dev: backend frontend

backend:
	cd backend && source venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

frontend:
	npm run dev

docker-up:
	docker-compose up --build

docker-down:
	docker-compose down

clean:
	rm -rf node_modules .next
	cd backend && find . -type d -name __pycache__ -exec rm -r {} + 2>/dev/null || true
	cd backend && find . -type f -name "*.pyc" -delete

