# Asset Pulse - Project Overview & Setup

## System Overview
Asset Pulse is an AI-powered Software Asset Management (SAM) platform for SCBX Group (25+ subsidiaries). The system optimizes software licensing costs by 20-30% through AI/LLM-powered recommendations.

## Tech Stack
**Backend**: Go (Golang) + Fiber framework
**Frontend**: React/Next.js + TypeScript + Tailwind CSS
**Database**: PostgreSQL 15+ with pgvector extension
**AI/LLM**: OpenAI GPT-4o via Go SDK
**Cache**: Redis
**DevOps**: Docker + Docker Compose

## Core Business Features (6 Features)
1. **Cross-Subsidiary Software Match** - Find duplicate apps across subsidiaries using LLM
2. **Group Contract Consolidation** - Recommend group pricing with AI-generated memos
3. **JD → License Matching** ⭐ PRIORITY - AI matches job descriptions to software needs
4. **Purchase Templates** - Reusable software packs for departments
5. **Seat Optimization** - Identify inactive licenses + reallocate across departments
6. **Pay-per-Use Optimization** - Recommend usage-based pricing for low-frequency users

## User Roles & Permissions
1. **Employee/HR** - Request licenses, view own licenses, apply templates
2. **Department Manager** - Create templates, approve team requests, view team analytics
3. **Subsidiary CTO** - Optimize licenses, approve high-value requests, view subsidiary analytics
4. **Group CTO** - Cross-subsidiary optimization, group consolidation, strategic decisions

## Project Structure (Go Backend)
```
asset-pulse-api/
├── configs/          # Configuration (env, app config)
├── entities/         # GORM database models
├── handler/          # HTTP handlers (controllers)
│   └── dto/         # Request/Response DTOs
├── repositories/     # Data access layer
│   └── database/    # Database operations
├── usecase/         # Business logic + AI/LLM integration
│   └── models/      # Usecase models
├── utils/           # Utilities
│   ├── llm/        # OpenAI/Claude clients
│   ├── cache/      # Redis cache
│   ├── logger/     # Logging
│   └── gorm/       # DB connection
├── main.go          # Entry point
├── go.mod           # Dependencies
└── Dockerfile       # Container image
```

## Key Go Libraries
- `github.com/gofiber/fiber/v2` - Web framework
- `gorm.io/gorm` + `gorm.io/driver/postgres` - ORM
- `github.com/sashabaranov/go-openai` - OpenAI SDK
- `github.com/redis/go-redis/v9` - Redis client
- `github.com/golang-jwt/jwt/v5` - JWT auth
- `github.com/pgvector/pgvector-go` - Vector support

## Architecture Layers
1. **Handler** - HTTP routing, validation, DTOs
2. **Usecase** - Business logic, AI/LLM integration
3. **Repository** - Database operations (GORM)
4. **Entities** - Database models
5. **Utils** - Shared utilities (LLM, cache, logger)

## Design Principles
- Clean Architecture with dependency injection
- Repository pattern for data access
- Context propagation for Go routines
- Error handling via centralized error types
- Redis caching for LLM responses (cost optimization)

## Environment Variables
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
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRY=8h

# App
APP_PORT=8080
APP_ENV=development
```

## API Base Structure
- Base URL: `/api/v1`
- Auth: JWT Bearer token
- Response format: `{"success": bool, "data": any, "message": string, "errors": []}`
- Error codes: Standard HTTP status codes
- CORS: Configured for frontend origin

## Implementation Priority (MVP - 4 weeks)
**Week 1-2**: Setup + Auth + Feature 3 (JD Matching with LLM)
**Week 3**: Feature 4 (Templates) + Basic Approval Workflow
**Week 4**: Frontend Dashboard + Request Flow

## Success Metrics
- Complete HR onboarding in < 3 minutes
- 90%+ AI recommendation acceptance rate
- 20-30% cost reduction through optimization
- < 2 seconds API response time

