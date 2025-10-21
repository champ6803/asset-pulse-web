# Deployment & Main Application Setup

## Go Backend Main Entry Point

### main.go
```go
// main.go
package main

import (
    "fmt"
    "log"
    "os"
    
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
    "github.com/gofiber/fiber/v2/middleware/logger"
    "github.com/joho/godotenv"
    
    "asset-pulse-api/configs"
    "asset-pulse-api/entities"
    "asset-pulse-api/handler"
    "asset-pulse-api/handler/middleware"
    "asset-pulse-api/repositories/database"
    "asset-pulse-api/usecase"
    "asset-pulse-api/utils/gorm"
    "asset-pulse-api/utils/llm"
    "asset-pulse-api/utils/cache"
)

func main() {
    // Load environment variables
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, using system environment")
    }
    
    // Load configuration
    config := configs.LoadConfig()
    
    // Initialize database
    db, err := gorm.NewPostgresDB(
        config.DBHost,
        config.DBUser,
        config.DBPassword,
        config.DBName,
        config.DBPort,
    )
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    
    // Auto-migrate (optional, for development)
    if config.AppEnv == "development" {
        db.AutoMigrate(&entities.User{}, &entities.App{}, &entities.Recommendation{})
    }
    
    // Initialize Redis cache
    redisClient := cache.NewRedisClient(config.RedisHost, config.RedisPort)
    
    // Initialize LLM client
    llmClient := llm.NewOpenAIClient(config.OpenAIAPIKey, config.OpenAIModel)
    
    // Initialize repositories
    dbRepo := database.NewDatabaseRepository(db)
    
    // Initialize usecases
    authUsecase := usecase.NewAuthUsecase(dbRepo, config.JWTSecret)
    recommendationUsecase := usecase.NewRecommendationUsecase(dbRepo, llmClient, redisClient)
    templateUsecase := usecase.NewTemplateUsecase(dbRepo)
    
    // Initialize handlers
    handlers := &handler.Handlers{
        Auth:           handler.NewAuthHandler(authUsecase),
        Recommendation: handler.NewRecommendationHandler(recommendationUsecase),
        Template:       handler.NewTemplateHandler(templateUsecase),
    }
    
    // Initialize Fiber app
    app := fiber.New(fiber.Config{
        AppName: "Asset Pulse API",
        ErrorHandler: customErrorHandler,
    })
    
    // Middleware
    app.Use(logger.New())
    app.Use(cors.New(cors.Config{
        AllowOrigins: config.AllowedOrigins,
        AllowHeaders: "Origin, Content-Type, Accept, Authorization",
        AllowMethods: "GET, POST, PUT, DELETE",
    }))
    
    // Health check
    app.Get("/health", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{"status": "ok"})
    })
    
    // Setup routes
    handler.SetupRoutes(app, handlers, config.JWTSecret)
    
    // Start server
    port := config.AppPort
    log.Printf("🚀 Server starting on port %s", port)
    log.Fatal(app.Listen(fmt.Sprintf(":%s", port)))
}

func customErrorHandler(c *fiber.Ctx, err error) error {
    code := fiber.StatusInternalServerError
    
    if e, ok := err.(*fiber.Error); ok {
        code = e.Code
    }
    
    return c.Status(code).JSON(fiber.Map{
        "success": false,
        "message": err.Error(),
    })
}
```

### configs/config.go
```go
// configs/config.go
package configs

import "os"

type Config struct {
    // Database
    DBHost     string
    DBPort     int
    DBUser     string
    DBPassword string
    DBName     string
    
    // Redis
    RedisHost string
    RedisPort string
    
    // OpenAI
    OpenAIAPIKey string
    OpenAIModel  string
    
    // JWT
    JWTSecret string
    JWTExpiry string
    
    // App
    AppPort        string
    AppEnv         string
    AllowedOrigins string
}

func LoadConfig() *Config {
    return &Config{
        DBHost:         getEnv("DB_HOST", "localhost"),
        DBPort:         getEnvAsInt("DB_PORT", 5432),
        DBUser:         getEnv("DB_USER", "postgres"),
        DBPassword:     getEnv("DB_PASSWORD", "postgres"),
        DBName:         getEnv("DB_NAME", "asset_pulse"),
        
        RedisHost:      getEnv("REDIS_HOST", "localhost"),
        RedisPort:      getEnv("REDIS_PORT", "6379"),
        
        OpenAIAPIKey:   getEnv("OPENAI_API_KEY", ""),
        OpenAIModel:    getEnv("OPENAI_MODEL", "gpt-4o"),
        
        JWTSecret:      getEnv("JWT_SECRET", "your-secret-key-change-me"),
        JWTExpiry:      getEnv("JWT_EXPIRY", "8h"),
        
        AppPort:        getEnv("APP_PORT", "8080"),
        AppEnv:         getEnv("APP_ENV", "development"),
        AllowedOrigins: getEnv("ALLOWED_ORIGINS", "*"),
    }
}

func getEnv(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
    // Implementation omitted for brevity
    return defaultValue
}
```

## Docker Setup

### Dockerfile (Multi-stage build)
```dockerfile
# Dockerfile
# Stage 1: Build
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Stage 2: Runtime
FROM alpine:latest

WORKDIR /app

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Copy binary from builder
COPY --from=builder /app/main .
COPY --from=builder /app/.env.example .env

EXPOSE 8080

CMD ["./main"]
```

### docker-compose.yaml
```yaml
# docker-compose.yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: asset_pulse
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_NAME: asset_pulse
      REDIS_HOST: redis
      REDIS_PORT: 6379
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      JWT_SECRET: ${JWT_SECRET}
      APP_ENV: production
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  # Frontend (Next.js)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8080/api/v1
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Makefile
```makefile
# Makefile
.PHONY: help dev build run test clean docker-up docker-down migrate

help: ## Show this help
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

dev: ## Run in development mode
	go run main.go

build: ## Build the application
	go build -o bin/asset-pulse-api main.go

run: build ## Build and run
	./bin/asset-pulse-api

test: ## Run tests
	go test -v ./...

clean: ## Clean build artifacts
	rm -rf bin/

docker-up: ## Start all services with Docker Compose
	docker-compose up -d

docker-down: ## Stop all services
	docker-compose down

docker-logs: ## View logs
	docker-compose logs -f

migrate: ## Run database migrations
	psql -h localhost -U postgres -d asset_pulse -f scripts/0001_initial_tables.sql
	psql -h localhost -U postgres -d asset_pulse -f scripts/0002_insert_mockdata.sql

install: ## Install dependencies
	go mod download
	go mod tidy
```

## Environment Variables

### .env.example
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=asset_pulse

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# OpenAI
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=8h

# Application
APP_PORT=8080
APP_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## GitHub Actions CI/CD

### .github/workflows/ci.yaml
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'
      
      - name: Install dependencies
        run: go mod download
      
      - name: Run tests
        run: go test -v ./...
      
      - name: Build
        run: go build -v ./...
  
  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t asset-pulse-api:latest .
      
      - name: Push to registry
        run: echo "Push to Docker registry here"
```

## Quick Start Commands

```bash
# 1. Clone and setup
git clone <repo>
cd asset-pulse-web

# 2. Copy environment file
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 3. Start services with Docker
make docker-up

# 4. Run database migrations
make migrate

# 5. Check logs
make docker-logs

# 6. Access
# Backend: http://localhost:8080
# Frontend: http://localhost:3000
# Postgres: localhost:5432
# Redis: localhost:6379

# 7. Stop services
make docker-down
```

## Development Workflow

```bash
# Development (hot reload with Air)
go install github.com/cosmtrek/air@latest
air

# Run tests
go test ./... -v

# Format code
go fmt ./...

# Lint
golangci-lint run

# Build for production
CGO_ENABLED=0 GOOS=linux go build -o bin/app
```

## Production Deployment Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Set OPENAI_API_KEY
- [ ] Configure database backups
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (nginx/traefik)
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Configure log aggregation
- [ ] Set up rate limiting
- [ ] Enable database connection pooling
- [ ] Configure Redis persistence
- [ ] Set up automated backups
- [ ] Document API endpoints (Swagger/OpenAPI)

## Testing Endpoints

```bash
# Health check
curl http://localhost:8080/health

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# JD Match (with token)
curl -X POST http://localhost:8080/api/v1/recommendations/jd-match \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Software Engineer",
    "job_description": "Build microservices...",
    "department": "IT",
    "company_code": "SCB",
    "employee_name": "John Doe"
  }'
```

