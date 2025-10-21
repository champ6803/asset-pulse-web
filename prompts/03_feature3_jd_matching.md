# Feature 3: JD → License Matching (AI-Powered) ⭐ PRIORITY

## Feature Overview
AI matches job descriptions to required software licenses using OpenAI GPT-4o. HR provides new hire info, system recommends software pack with rationale.

## User Flow (HR Role)
1. Click "New Hire / Onboarding"
2. Enter: Name, Job Title, Department, Job Description (min 50 chars)
3. AI analyzes JD (3-5 seconds)
4. View recommended apps with relevance scores + rationale
5. Edit/remove apps, see real-time cost updates
6. Submit for manager approval

## API Endpoint
**POST** `/api/v1/recommendations/jd-match`

### Request DTO
```go
// handler/dto/recommendation.dto.go
type JDMatchRequest struct {
    JobTitle       string `json:"job_title" validate:"required,min=3"`
    JobDescription string `json:"job_description" validate:"required,min=50"`
    Department     string `json:"department" validate:"required"`
    CompanyCode    string `json:"company_code" validate:"required"`
    EmployeeName   string `json:"employee_name" validate:"required"`
    Email          string `json:"email" validate:"email"`
    StartDate      string `json:"start_date"`
}

type JDMatchResponse struct {
    Recommendations []RecommendationItem `json:"recommendations"`
    TotalCost      float64              `json:"total_cost"`
    Confidence     int                  `json:"confidence"`
    ProcessingTime float64              `json:"processing_time_ms"`
}

type RecommendationItem struct {
    AppID          int     `json:"app_id"`
    AppName        string  `json:"app_name"`
    AppKey         string  `json:"app_key"`
    Category       string  `json:"category"`
    LicenseTier    string  `json:"license_tier"`
    RelevanceScore int     `json:"relevance_score"`
    AnnualCost     float64 `json:"annual_cost"`
    Rationale      string  `json:"rationale"`
}
```

## LLM Client Implementation
```go
// utils/llm/openai_client.go
package llm

import (
    "context"
    "github.com/sashabaranov/go-openai"
)

type OpenAIClient struct {
    client *openai.Client
    model  string
}

func NewOpenAIClient(apiKey string, model string) *OpenAIClient {
    return &OpenAIClient{
        client: openai.NewClient(apiKey),
        model:  model,
    }
}

func (c *OpenAIClient) CreateChatCompletion(ctx context.Context, messages []openai.ChatCompletionMessage) (string, error) {
    resp, err := c.client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
        Model:          c.model,
        Messages:       messages,
        Temperature:    0.3,
        ResponseFormat: &openai.ChatCompletionResponseFormat{Type: "json_object"},
    })
    
    if err != nil {
        return "", err
    }
    
    return resp.Choices[0].Message.Content, nil
}
```

## Redis Cache Implementation
```go
// utils/cache/redis_client.go
package cache

import (
    "context"
    "time"
    "github.com/redis/go-redis/v9"
)

type RedisClient struct {
    client *redis.Client
}

func NewRedisClient(host string, port string) *RedisClient {
    rdb := redis.NewClient(&redis.Options{
        Addr: host + ":" + port,
        DB:   0,
    })
    return &RedisClient{client: rdb}
}

func (r *RedisClient) Get(ctx context.Context, key string) (string, error) {
    return r.client.Get(ctx, key).Result()
}

func (r *RedisClient) Set(ctx context.Context, key string, value string, expiration time.Duration) error {
    return r.client.Set(ctx, key, value, expiration).Err()
}
```

## Usecase Implementation
```go
// usecase/recommendation_usecase.go
package usecase

import (
    "context"
    "crypto/md5"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "time"
    
    "asset-pulse-api/entities"
    "asset-pulse-api/repositories/database"
    "asset-pulse-api/utils/llm"
    "asset-pulse-api/utils/cache"
    "github.com/sashabaranov/go-openai"
)

type RecommendationUsecase struct {
    db        *database.DatabaseRepository
    llmClient *llm.OpenAIClient
    cache     *cache.RedisClient
}

func NewRecommendationUsecase(db *database.DatabaseRepository, llm *llm.OpenAIClient, cache *cache.RedisClient) *RecommendationUsecase {
    return &RecommendationUsecase{db: db, llmClient: llm, cache: cache}
}

type LLMRecommendation struct {
    Recommendations []struct {
        AppKey         string  `json:"app_key"`
        LicenseTier    string  `json:"license_tier"`
        RelevanceScore int     `json:"relevance_score"`
        Rationale      string  `json:"rationale"`
    } `json:"recommendations"`
}

func (uc *RecommendationUsecase) JDMatchUsecase(ctx context.Context, jobDesc, jobTitle, dept, company string) ([]entities.Recommendation, error) {
    // 1. Check cache
    cacheKey := fmt.Sprintf("jd_match:%s:%s", dept, hashString(jobDesc))
    if cached, err := uc.cache.Get(ctx, cacheKey); err == nil {
        var recs []entities.Recommendation
        json.Unmarshal([]byte(cached), &recs)
        return recs, nil
    }
    
    // 2. Get active apps
    apps, err := uc.db.GetApps(ctx, map[string]interface{}{"status": "active"})
    if err != nil {
        return nil, err
    }
    
    // 3. Build prompt
    prompt := buildJDMatchPrompt(jobDesc, jobTitle, dept, company, apps)
    
    // 4. Call LLM
    messages := []openai.ChatCompletionMessage{
        {Role: "system", Content: "You are an expert in enterprise software and job role analysis. Respond in JSON format."},
        {Role: "user", Content: prompt},
    }
    
    llmResponse, err := uc.llmClient.CreateChatCompletion(ctx, messages)
    if err != nil {
        return uc.fallbackRuleBased(ctx, dept, company)
    }
    
    // 5. Parse LLM response
    var llmRec LLMRecommendation
    if err := json.Unmarshal([]byte(llmResponse), &llmRec); err != nil {
        return nil, err
    }
    
    // 6. Map to entities
    recommendations := make([]entities.Recommendation, 0)
    appMap := make(map[string]entities.App)
    for _, app := range apps {
        appMap[app.AppKey] = app
    }
    
    for _, rec := range llmRec.Recommendations {
        if app, ok := appMap[rec.AppKey]; ok {
            recommendations = append(recommendations, entities.Recommendation{
                RecType:        "new_user",
                AppID:          app.AppID,
                LicenseTier:    rec.LicenseTier,
                RelevanceScore: rec.RelevanceScore,
                Rationale:      rec.Rationale,
                Status:         "pending",
                CreatedAt:      time.Now(),
            })
        }
    }
    
    // 7. Save to DB
    for _, rec := range recommendations {
        uc.db.CreateRecommendation(ctx, &rec)
    }
    
    // 8. Cache result (24 hours)
    cachedData, _ := json.Marshal(recommendations)
    uc.cache.Set(ctx, cacheKey, string(cachedData), 24*time.Hour)
    
    return recommendations, nil
}

func buildJDMatchPrompt(jd, title, dept, company string, apps []entities.App) string {
    appsJSON, _ := json.Marshal(apps)
    return fmt.Sprintf(`
Given this job description:
Title: %s
Department: %s
Company: %s

Description:
%s

Available software catalog:
%s

Task: Recommend top 10 software applications needed for this role.
For each, provide:
- app_key (from catalog)
- license_tier (Free/Basic/Pro/Enterprise)
- relevance_score (0-100)
- rationale (one sentence why needed)

Output JSON: {"recommendations": [...]}
`, title, dept, company, jd, string(appsJSON))
}

func hashString(s string) string {
    h := md5.Sum([]byte(s))
    return hex.EncodeToString(h[:])
}

func (uc *RecommendationUsecase) fallbackRuleBased(ctx context.Context, dept, company string) ([]entities.Recommendation, error) {
    // Use recommendation_rules table as fallback
    return uc.db.GetRecommendationsByDepartment(ctx, dept)
}
```

## Handler Implementation
```go
// handler/recommendation_handler.go
package handler

import (
    "time"
    "github.com/gofiber/fiber/v2"
    "asset-pulse-api/handler/dto"
    "asset-pulse-api/usecase"
)

type RecommendationHandler struct {
    usecase *usecase.RecommendationUsecase
}

func NewRecommendationHandler(uc *usecase.RecommendationUsecase) *RecommendationHandler {
    return &RecommendationHandler{usecase: uc}
}

func (h *RecommendationHandler) JDMatch(c *fiber.Ctx) error {
    startTime := time.Now()
    
    var req dto.JDMatchRequest
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(dto.ErrorResponse("Invalid request body"))
    }
    
    // Call usecase
    recommendations, err := h.usecase.JDMatchUsecase(
        c.Context(),
        req.JobDescription,
        req.JobTitle,
        req.Department,
        req.CompanyCode,
    )
    
    if err != nil {
        return c.Status(500).JSON(dto.ErrorResponse(err.Error()))
    }
    
    // Transform to response
    items := make([]dto.RecommendationItem, len(recommendations))
    totalCost := 0.0
    for i, rec := range recommendations {
        items[i] = dto.RecommendationItem{
            AppID:          rec.AppID,
            AppName:        rec.AppName,
            LicenseTier:    rec.LicenseTier,
            RelevanceScore: rec.RelevanceScore,
            Rationale:      rec.Rationale,
        }
        totalCost += rec.AnnualCost
    }
    
    processingTime := time.Since(startTime).Milliseconds()
    
    return c.JSON(dto.SuccessResponse(dto.JDMatchResponse{
        Recommendations: items,
        TotalCost:      totalCost,
        Confidence:     95,
        ProcessingTime: float64(processingTime),
    }))
}
```

## Routes Setup
```go
// handler/route.go
func SetupRoutes(app *fiber.App, handlers *Handlers) {
    api := app.Group("/api/v1")
    
    // Recommendations
    rec := api.Group("/recommendations")
    rec.Post("/jd-match", handlers.Recommendation.JDMatch)
}
```

## Testing with curl
```bash
curl -X POST http://localhost:8080/api/v1/recommendations/jd-match \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Senior Software Engineer",
    "job_description": "Build microservices, API development, CI/CD pipelines, code review",
    "department": "IT",
    "company_code": "SCB",
    "employee_name": "John Doe"
  }'
```

