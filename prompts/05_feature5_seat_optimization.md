# Feature 5: Seat Optimization with Reallocation

## Feature Overview
AI identifies inactive/underutilized licenses and recommends:
1. **Revoke** - Remove from inactive user → cost savings
2. **Reallocate** - Transfer to pending request in another department → fulfill demand without new purchase
3. **Downgrade** - Move to lower tier → cost savings

## Database Entities
```go
// entities/database_entity.go
type Recommendation struct {
    RecID            int       `gorm:"primaryKey;autoIncrement" json:"rec_id"`
    RecType          string    `gorm:"size:50;not null" json:"rec_type"` // seat_opt/new_user/etc
    UserID           *int      `json:"user_id"`
    AppID            int       `gorm:"not null" json:"app_id"`
    LicenseTier      string    `gorm:"size:50" json:"license_tier"`
    Action           string    `gorm:"size:50" json:"action"` // revoke/reallocate/downgrade
    SourceDept       *string   `gorm:"size:100" json:"source_dept"`
    TargetDept       *string   `gorm:"size:100" json:"target_dept"`
    TargetUserID     *int      `json:"target_user_id"`
    EstimatedSavings *float64  `gorm:"type:decimal(15,2)" json:"estimated_savings"`
    CostAvoided      *float64  `gorm:"type:decimal(15,2)" json:"cost_avoided"`
    Priority         *int      `json:"priority"` // 1=High, 2=Med, 3=Low
    Rationale        *string   `gorm:"type:text" json:"rationale"`
    Status           string    `gorm:"size:20;default:'pending'" json:"status"`
    CreatedAt        time.Time `json:"created_at"`
    AppliedAt        *time.Time `json:"applied_at"`
}
```

## API Endpoints

### 1. Get All Optimization Recommendations
**GET** `/api/v1/recommendations/seat-optimization`
Query params: `?company_code=SCB&department=IT&action=reallocate`

### 2. Get Reallocation Opportunities
**GET** `/api/v1/recommendations/seat-optimization/reallocation`

### 3. Get Recommendation Details
**GET** `/api/v1/recommendations/seat-optimization/:id/details`

### 4. Apply Recommendation
**POST** `/api/v1/recommendations/seat-optimization/:id/apply`
```json
{
  "action": "reallocate",
  "notify_users": true,
  "grace_period_days": 7,
  "note": "Reallocating to fulfill Analytics team request"
}
```

### 5. Bulk Apply
**POST** `/api/v1/recommendations/seat-optimization/bulk-apply`
```json
{
  "rec_ids": [1, 2, 3],
  "action": "revoke",
  "notify_users": true
}
```

## DTOs
```go
// handler/dto/recommendation.dto.go
type SeatOptimizationResponse struct {
    Summary      OptimizationSummary    `json:"summary"`
    Recommendations []OptimizationItem  `json:"recommendations"`
}

type OptimizationSummary struct {
    TotalOpportunities int     `json:"total_opportunities"`
    RevokeCount        int     `json:"revoke_count"`
    ReallocateCount    int     `json:"reallocate_count"`
    DowngradeCount     int     `json:"downgrade_count"`
    TotalSavings       float64 `json:"total_savings"`
    CostAvoided        float64 `json:"cost_avoided"`
}

type OptimizationItem struct {
    RecID            int     `json:"rec_id"`
    Action           string  `json:"action"`
    UserID           int     `json:"user_id"`
    Username         string  `json:"username"`
    AppName          string  `json:"app_name"`
    LicenseTier      string  `json:"license_tier"`
    LastActiveDate   string  `json:"last_active_date"`
    DaysInactive     int     `json:"days_inactive"`
    SourceDept       string  `json:"source_dept"`
    TargetDept       string  `json:"target_dept"`
    TargetUsername   string  `json:"target_username"`
    EstimatedSavings float64 `json:"estimated_savings"`
    CostAvoided      float64 `json:"cost_avoided"`
    Priority         string  `json:"priority"`
    Rationale        string  `json:"rationale"`
}

type ApplyRecommendationRequest struct {
    Action            string `json:"action" validate:"required,oneof=revoke reallocate downgrade"`
    NotifyUsers       bool   `json:"notify_users"`
    GracePeriodDays   int    `json:"grace_period_days"`
    Note              string `json:"note"`
}
```

## Usecase Implementation
```go
// usecase/recommendation_usecase.go
func (uc *RecommendationUsecase) SeatOptimizationUsecase(ctx context.Context, filters map[string]interface{}) ([]entities.Recommendation, error) {
    // 1. Get inactive license assignments
    inactiveAssignments, err := uc.getInactiveLicenses(ctx, 30) // 30 days threshold
    if err != nil {
        return nil, err
    }
    
    // 2. Get pending license requests
    pendingRequests, err := uc.db.GetPendingRequests(ctx, filters)
    if err != nil {
        return nil, err
    }
    
    recommendations := make([]entities.Recommendation, 0)
    
    // 3. Match inactive licenses with pending requests (Reallocation)
    reallocationMap := uc.matchInactiveWithRequests(inactiveAssignments, pendingRequests)
    
    for _, match := range reallocationMap {
        rec := entities.Recommendation{
            RecType:          "seat_opt",
            UserID:           &match.SourceUserID,
            AppID:            match.AppID,
            LicenseTier:      match.LicenseTier,
            Action:           "reallocate",
            SourceDept:       &match.SourceDept,
            TargetDept:       &match.TargetDept,
            TargetUserID:     &match.TargetUserID,
            CostAvoided:      &match.AnnualCost,
            Priority:         intPtr(1), // High priority
            Rationale:        stringPtr(fmt.Sprintf("Transfer from inactive user to fulfill pending request. Cost avoided: %.2f THB/year", match.AnnualCost)),
            Status:           "pending",
            CreatedAt:        time.Now(),
        }
        
        recommendations = append(recommendations, rec)
        
        // Use AI to generate detailed rationale
        if uc.llmClient != nil {
            aiRationale, _ := uc.generateReallocationRationale(ctx, match)
            if aiRationale != "" {
                rec.Rationale = &aiRationale
            }
        }
        
        uc.db.CreateRecommendation(ctx, &rec)
    }
    
    // 4. Remaining inactive licenses → Revoke recommendations
    for _, inactive := range inactiveAssignments {
        if !uc.isAlreadyMatched(inactive, reallocationMap) {
            savings := uc.calculateAnnualCost(inactive.AppID, inactive.LicenseTier)
            rec := entities.Recommendation{
                RecType:          "seat_opt",
                UserID:           &inactive.UserID,
                AppID:            inactive.AppID,
                LicenseTier:      inactive.LicenseTier,
                Action:           "revoke",
                EstimatedSavings: &savings,
                Priority:         intPtr(2),
                Rationale:        stringPtr(fmt.Sprintf("No activity for %d days. Savings: %.2f THB/year", inactive.DaysInactive, savings)),
                Status:           "pending",
                CreatedAt:        time.Time{},
            }
            
            recommendations = append(recommendations, rec)
            uc.db.CreateRecommendation(ctx, &rec)
        }
    }
    
    return recommendations, nil
}

type ReallocationMatch struct {
    SourceUserID   int
    TargetUserID   int
    AppID          int
    LicenseTier    string
    SourceDept     string
    TargetDept     string
    AnnualCost     float64
}

func (uc *RecommendationUsecase) matchInactiveWithRequests(
    inactive []InactiveLicense,
    pending []PendingRequest,
) []ReallocationMatch {
    matches := make([]ReallocationMatch, 0)
    
    // Group pending requests by app_id + license_tier
    requestMap := make(map[string][]PendingRequest)
    for _, req := range pending {
        key := fmt.Sprintf("%d_%s", req.AppID, req.LicenseTier)
        requestMap[key] = append(requestMap[key], req)
    }
    
    // Match inactive licenses with pending requests
    for _, inact := range inactive {
        key := fmt.Sprintf("%d_%s", inact.AppID, inact.LicenseTier)
        if requests, ok := requestMap[key]; ok && len(requests) > 0 {
            // Match found!
            req := requests[0]
            matches = append(matches, ReallocationMatch{
                SourceUserID: inact.UserID,
                TargetUserID: req.RequesterUserID,
                AppID:        inact.AppID,
                LicenseTier:  inact.LicenseTier,
                SourceDept:   inact.Department,
                TargetDept:   req.Department,
                AnnualCost:   inact.AnnualCost,
            })
            
            // Remove matched request
            requestMap[key] = requests[1:]
        }
    }
    
    return matches
}

func (uc *RecommendationUsecase) getInactiveLicenses(ctx context.Context, daysThreshold int) ([]InactiveLicense, error) {
    query := `
        SELECT 
            la.user_id,
            la.app_id,
            la.license_tier,
            u.username,
            u.department_code as department,
            a.app_name,
            MAX(ue.event_at) as last_active,
            EXTRACT(DAY FROM NOW() - MAX(ue.event_at)) as days_inactive,
            ct.unit_price * 12 as annual_cost
        FROM license_assignments la
        JOIN users u ON la.user_id = u.user_id
        JOIN apps a ON la.app_id = a.app_id
        LEFT JOIN usage_events ue ON la.user_id = ue.user_id AND la.app_id = ue.app_id
        LEFT JOIN contract_terms ct ON la.app_id = ct.app_id AND la.license_tier = ct.license_tier
        WHERE la.status = 'active'
        GROUP BY la.user_id, la.app_id, la.license_tier, u.username, u.department_code, a.app_name, ct.unit_price
        HAVING EXTRACT(DAY FROM NOW() - MAX(ue.event_at)) >= ?
        ORDER BY days_inactive DESC
    `
    
    var results []InactiveLicense
    err := uc.db.Raw(ctx, query, daysThreshold).Scan(&results)
    return results, err
}

func (uc *RecommendationUsecase) generateReallocationRationale(ctx context.Context, match ReallocationMatch) (string, error) {
    prompt := fmt.Sprintf(`
Generate a concise rationale for reallocating a software license:
- Source: User in %s department (inactive for 90+ days)
- Target: User in %s department (pending request)
- Application: App ID %d, Tier: %s
- Cost avoided: %.2f THB/year

Provide one sentence explaining the business benefit.
`, match.SourceDept, match.TargetDept, match.AppID, match.LicenseTier, match.AnnualCost)
    
    messages := []openai.ChatCompletionMessage{
        {Role: "system", Content: "You are a software asset management expert."},
        {Role: "user", Content: prompt},
    }
    
    return uc.llmClient.CreateChatCompletion(ctx, messages)
}

func (uc *RecommendationUsecase) ApplyRecommendation(ctx context.Context, recID int, action string, notifyUsers bool, gracePeriodDays int) error {
    rec, err := uc.db.GetRecommendationByID(ctx, recID)
    if err != nil {
        return err
    }
    
    switch action {
    case "revoke":
        return uc.revokeALicense(ctx, *rec.UserID, rec.AppID, notifyUsers, gracePeriodDays)
    case "reallocate":
        return uc.reallocateLicense(ctx, *rec.UserID, *rec.TargetUserID, rec.AppID, rec.LicenseTier, notifyUsers)
    case "downgrade":
        return uc.downgradeLicense(ctx, *rec.UserID, rec.AppID, rec.LicenseTier)
    }
    
    return nil
}
```

## Handler Implementation
```go
// handler/recommendation_handler.go
func (h *RecommendationHandler) GetSeatOptimization(c *fiber.Ctx) error {
    filters := map[string]interface{}{
        "company_code": c.Query("company_code"),
        "department":   c.Query("department"),
        "action":       c.Query("action"),
    }
    
    recommendations, err := h.usecase.SeatOptimizationUsecase(c.Context(), filters)
    if err != nil {
        return c.Status(500).JSON(dto.ErrorResponse(err.Error()))
    }
    
    // Calculate summary
    summary := calculateSummary(recommendations)
    
    return c.JSON(dto.SuccessResponse(dto.SeatOptimizationResponse{
        Summary:         summary,
        Recommendations: transformToItems(recommendations),
    }))
}

func (h *RecommendationHandler) ApplyRecommendation(c *fiber.Ctx) error {
    recID, _ := strconv.Atoi(c.Params("id"))
    
    var req dto.ApplyRecommendationRequest
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(dto.ErrorResponse("Invalid request"))
    }
    
    err := h.usecase.ApplyRecommendation(c.Context(), recID, req.Action, req.NotifyUsers, req.GracePeriodDays)
    if err != nil {
        return c.Status(500).JSON(dto.ErrorResponse(err.Error()))
    }
    
    return c.JSON(dto.SuccessResponse("Recommendation applied successfully"))
}
```

