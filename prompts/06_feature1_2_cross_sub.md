# Feature 1 & 2: Cross-Sub Match & Consolidation

## Feature 1: Cross-Subsidiary Software Match

### Overview
AI identifies duplicate/similar apps across subsidiaries using LLM semantic analysis. Enables consolidation opportunities.

### API Endpoint
**GET** `/api/v1/recommendations/cross-sub-match?similarity_threshold=80&category=all`

### Response
```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "group_id": 1,
        "category": "Project Management",
        "similarity_score": 87,
        "apps": [
          {
            "app_id": 10,
            "app_name": "Asana",
            "company_code": "SCB_DATA_X",
            "users": 50,
            "annual_cost": 180000
          },
          {
            "app_id": 15,
            "app_name": "Monday.com",
            "company_code": "SCB_TECHX",
            "users": 35,
            "annual_cost": 140000
          }
        ],
        "common_features": ["Task Management", "Kanban", "Collaboration"],
        "rationale": "Both tools provide task management with 85% feature overlap",
        "consolidation_potential": 200000
      }
    ]
  }
}
```

### Usecase Implementation
```go
// usecase/recommendation_usecase.go
func (uc *RecommendationUsecase) CrossSubMatchUsecase(ctx context.Context, similarityThreshold float64) ([]SimilarAppGroup, error) {
    // 1. Get all apps used across subsidiaries
    appsUsage, err := uc.db.GetCrossSubAppUsage(ctx)
    if err != nil {
        return nil, err
    }
    
    // 2. Check cached similarity scores
    similarPairs, err := uc.db.GetAppSimilarities(ctx, similarityThreshold)
    if err != nil {
        return nil, err
    }
    
    // 3. If no cached scores, calculate using LLM
    if len(similarPairs) == 0 {
        similarPairs, err = uc.calculateSimilaritiesWithLLM(ctx, appsUsage)
        if err != nil {
            return nil, err
        }
    }
    
    // 4. Group similar apps
    groups := uc.groupSimilarApps(similarPairs, appsUsage)
    
    return groups, nil
}

func (uc *RecommendationUsecase) calculateSimilaritiesWithLLM(ctx context.Context, apps []AppUsage) ([]AppSimilarity, error) {
    similarities := make([]AppSimilarity, 0)
    
    // Compare each pair of apps
    for i := 0; i < len(apps); i++ {
        for j := i + 1; j < len(apps); j++ {
            app1 := apps[i]
            app2 := apps[j]
            
            // Skip if same company
            if app1.CompanyCode == app2.CompanyCode {
                continue
            }
            
            // Get app details
            app1Details, _ := uc.db.GetAppByID(ctx, app1.AppID)
            app2Details, _ := uc.db.GetAppByID(ctx, app2.AppID)
            
            // LLM comparison
            prompt := fmt.Sprintf(`
Compare these two software applications and determine similarity:

Application 1:
Name: %s
Description: %s
Category: %s

Application 2:
Name: %s
Description: %s
Category: %s

Provide:
1. similarity_score (0-100)
2. common_features (array of strings)
3. rationale (one paragraph)
4. recommendation (consolidate/keep_separate/uncertain)

Output JSON format.
`, app1Details.AppName, app1Details.Description, app1Details.Category,
   app2Details.AppName, app2Details.Description, app2Details.Category)
            
            messages := []openai.ChatCompletionMessage{
                {Role: "system", Content: "You are a software analyst expert. Respond in JSON."},
                {Role: "user", Content: prompt},
            }
            
            llmResponse, err := uc.llmClient.CreateChatCompletion(ctx, messages)
            if err != nil {
                continue
            }
            
            var result struct {
                SimilarityScore  int      `json:"similarity_score"`
                CommonFeatures   []string `json:"common_features"`
                Rationale        string   `json:"rationale"`
                Recommendation   string   `json:"recommendation"`
            }
            
            if err := json.Unmarshal([]byte(llmResponse), &result); err != nil {
                continue
            }
            
            if result.SimilarityScore >= 70 {
                similarity := AppSimilarity{
                    AppID1:          app1.AppID,
                    AppID2:          app2.AppID,
                    SimilarityScore: float64(result.SimilarityScore),
                    Rationale:       result.Rationale,
                    CommonFeatures:  result.CommonFeatures,
                }
                
                similarities = append(similarities, similarity)
                
                // Save to database for caching
                uc.db.SaveAppSimilarity(ctx, &similarity)
            }
        }
    }
    
    return similarities, nil
}
```

---

## Feature 2: Group Contract Consolidation

### Overview
Recommend group-level pricing for apps used by multiple subsidiaries. AI generates business case memo.

### API Endpoints

#### 1. Get Consolidation Opportunities
**GET** `/api/v1/recommendations/consolidation?min_savings=100000`

#### 2. Get Consolidation Details
**GET** `/api/v1/recommendations/consolidation/:id`

#### 3. Generate Business Case Memo
**POST** `/api/v1/recommendations/consolidation/:id/generate-memo`

#### 4. Accept Consolidation
**POST** `/api/v1/recommendations/consolidation/:id/accept`

### Response Structure
```json
{
  "consolidation_id": 1,
  "app_name": "Monday.com",
  "category": "Project Management",
  "current_state": {
    "subsidiaries": [
      {
        "company_code": "SCB_DATA_X",
        "tool": "Asana",
        "users": 50,
        "annual_cost": 180000
      }
    ],
    "total_cost": 460000,
    "total_users": 130
  },
  "proposed_solution": {
    "tool": "Monday.com Enterprise",
    "group_plan": true,
    "unit_price": 2500,
    "discount_percent": 20,
    "total_cost": 260000
  },
  "financial_impact": {
    "current_cost": 460000,
    "proposed_cost": 260000,
    "savings": 200000,
    "savings_percent": 43,
    "payback_period_months": 3
  }
}
```

### Entity
```go
type GroupConsolidationOpp struct {
    ConsolidationID   int       `gorm:"primaryKey;autoIncrement" json:"consolidation_id"`
    Category          string    `gorm:"size:100" json:"category"`
    ProposedAppID     int       `json:"proposed_app_id"`
    TotalUsers        int       `json:"total_users"`
    CurrentCost       float64   `gorm:"type:decimal(15,2)" json:"current_cost"`
    ProposedCost      float64   `gorm:"type:decimal(15,2)" json:"proposed_cost"`
    EstimatedSavings  float64   `gorm:"type:decimal(15,2)" json:"estimated_savings"`
    SavingsPercent    float64   `gorm:"type:decimal(5,2)" json:"savings_percent"`
    Status            string    `gorm:"size:20;default:'pending'" json:"status"`
    Rationale         *string   `gorm:"type:text" json:"rationale"`
    MemoContent       *string   `gorm:"type:text" json:"memo_content"`
    CreatedAt         time.Time `json:"created_at"`
}
```

### Usecase Implementation
```go
func (uc *RecommendationUsecase) ConsolidationUsecase(ctx context.Context, minSavings float64) ([]entities.GroupConsolidationOpp, error) {
    // 1. Get apps used by multiple subsidiaries
    crossSubApps, err := uc.db.GetAppsUsedByMultipleSubs(ctx)
    if err != nil {
        return nil, err
    }
    
    opportunities := make([]entities.GroupConsolidationOpp, 0)
    
    // 2. For each app category, calculate group pricing potential
    for category, apps := range groupByCategory(crossSubApps) {
        if len(apps) < 2 {
            continue
        }
        
        // Current total cost
        currentCost := calculateTotalCost(apps)
        totalUsers := calculateTotalUsers(apps)
        
        // Find best app for consolidation
        bestApp := findBestConsolidationTarget(apps)
        
        // Get group pricing
        groupPrice, err := uc.db.GetGroupPricing(ctx, bestApp.AppID, totalUsers)
        if err != nil {
            continue
        }
        
        proposedCost := groupPrice.UnitPrice * float64(totalUsers) * (1 - groupPrice.DiscountPercent/100)
        savings := currentCost - proposedCost
        
        if savings >= minSavings {
            opp := entities.GroupConsolidationOpp{
                Category:         category,
                ProposedAppID:    bestApp.AppID,
                TotalUsers:       totalUsers,
                CurrentCost:      currentCost,
                ProposedCost:     proposedCost,
                EstimatedSavings: savings,
                SavingsPercent:   (savings / currentCost) * 100,
                Status:           "pending",
                CreatedAt:        time.Now(),
            }
            
            opportunities = append(opportunities, opp)
            uc.db.CreateConsolidationOpp(ctx, &opp)
        }
    }
    
    return opportunities, nil
}

func (uc *RecommendationUsecase) GenerateConsolidationMemo(ctx context.Context, consolidationID int) (string, error) {
    opp, err := uc.db.GetConsolidationOppByID(ctx, consolidationID)
    if err != nil {
        return "", err
    }
    
    prompt := fmt.Sprintf(`
Generate a professional business case memo for software consolidation:

Category: %s
Current Cost: %.2f THB/year
Proposed Cost: %.2f THB/year
Savings: %.2f THB/year (%.1f%%)
Total Users: %d

Include:
1. Executive Summary (2-3 sentences)
2. Current State Analysis (bullet points)
3. Proposed Solution (paragraph)
4. Financial Impact (table format)
5. Implementation Plan (3 phases with timeline)
6. Risk Assessment (2-3 risks with mitigation)
7. Recommendation (1 paragraph)

Format: Professional business memo in Markdown.
`, opp.Category, opp.CurrentCost, opp.ProposedCost, opp.EstimatedSavings, opp.SavingsPercent, opp.TotalUsers)
    
    messages := []openai.ChatCompletionMessage{
        {Role: "system", Content: "You are a strategic sourcing expert writing for C-level executives."},
        {Role: "user", Content: prompt},
    }
    
    memoContent, err := uc.llmClient.CreateChatCompletion(ctx, messages)
    if err != nil {
        return "", err
    }
    
    // Save memo to database
    uc.db.UpdateConsolidationOpp(ctx, consolidationID, map[string]interface{}{
        "memo_content": memoContent,
    })
    
    return memoContent, nil
}
```

### Handler
```go
func (h *RecommendationHandler) GetConsolidation(c *fiber.Ctx) error {
    minSavings, _ := strconv.ParseFloat(c.Query("min_savings", "100000"), 64)
    
    opportunities, err := h.usecase.ConsolidationUsecase(c.Context(), minSavings)
    if err != nil {
        return c.Status(500).JSON(dto.ErrorResponse(err.Error()))
    }
    
    return c.JSON(dto.SuccessResponse(opportunities))
}

func (h *RecommendationHandler) GenerateMemo(c *fiber.Ctx) error {
    id, _ := strconv.Atoi(c.Params("id"))
    
    memo, err := h.usecase.GenerateConsolidationMemo(c.Context(), id)
    if err != nil {
        return c.Status(500).JSON(dto.ErrorResponse(err.Error()))
    }
    
    return c.JSON(dto.SuccessResponse(map[string]string{
        "memo_content": memo,
    }))
}
```

### Routes
```go
// Cross-sub match
rec.Get("/cross-sub-match", handlers.Recommendation.GetCrossSubMatch)

// Consolidation
rec.Get("/consolidation", handlers.Recommendation.GetConsolidation)
rec.Get("/consolidation/:id", handlers.Recommendation.GetConsolidationDetails)
rec.Post("/consolidation/:id/generate-memo", handlers.Recommendation.GenerateMemo)
rec.Post("/consolidation/:id/accept", handlers.Recommendation.AcceptConsolidation)
```

