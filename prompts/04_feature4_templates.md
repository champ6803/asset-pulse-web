# Feature 4: Purchase Templates

## Feature Overview
Department Managers create reusable software packs for common roles (e.g., "Engineering Onboarding", "Marketing Standard"). Templates speed up onboarding and ensure consistency.

## Database Entities
```go
// entities/database_entity.go
type PurchaseTemplate struct {
    TemplateID     int       `gorm:"primaryKey;autoIncrement" json:"template_id"`
    TemplateName   string    `gorm:"size:255;not null" json:"template_name"`
    Description    *string   `gorm:"type:text" json:"description"`
    TargetType     string    `gorm:"size:50" json:"target_type"` // new_hire/role/dept_standard
    ScopeType      string    `gorm:"size:50" json:"scope_type"` // department/company/group
    ScopeValue     string    `gorm:"size:100" json:"scope_value"`
    BudgetLimit    *float64  `gorm:"type:decimal(15,2)" json:"budget_limit"`
    Status         string    `gorm:"size:20;default:'active'" json:"status"`
    CreatedBy      int       `json:"created_by"`
    CreatedAt      time.Time `json:"created_at"`
    UpdatedAt      time.Time `json:"updated_at"`
}

type PurchaseTemplateItem struct {
    ItemID       int       `gorm:"primaryKey;autoIncrement" json:"item_id"`
    TemplateID   int       `gorm:"not null" json:"template_id"`
    AppID        int       `gorm:"not null" json:"app_id"`
    LicenseTier  string    `gorm:"size:50;not null" json:"license_tier"`
    IsRequired   bool      `gorm:"default:true" json:"is_required"`
    IsEditable   bool      `gorm:"default:true" json:"is_editable"`
    DisplayOrder int       `json:"display_order"`
    CreatedAt    time.Time `json:"created_at"`
}
```

## API Endpoints

### 1. List Templates
**GET** `/api/v1/templates?department=IT&status=active`

### 2. Get Template Details
**GET** `/api/v1/templates/:id`

### 3. Create Template
**POST** `/api/v1/templates`
```json
{
  "template_name": "Software Engineer - Backend",
  "description": "Standard tools for backend developers",
  "target_type": "new_hire",
  "scope_type": "department",
  "scope_value": "IT-BACKEND",
  "budget_limit": 50000,
  "items": [
    {
      "app_id": 1,
      "license_tier": "Pro",
      "is_required": true,
      "is_editable": false
    }
  ]
}
```

### 4. Update Template
**PUT** `/api/v1/templates/:id`

### 5. Delete Template
**DELETE** `/api/v1/templates/:id`

## DTOs
```go
// handler/dto/template.dto.go
package dto

type CreateTemplateRequest struct {
    TemplateName string                     `json:"template_name" validate:"required,min=3"`
    Description  string                     `json:"description"`
    TargetType   string                     `json:"target_type" validate:"required,oneof=new_hire role dept_standard"`
    ScopeType    string                     `json:"scope_type" validate:"required,oneof=department company group"`
    ScopeValue   string                     `json:"scope_value" validate:"required"`
    BudgetLimit  float64                    `json:"budget_limit"`
    Items        []CreateTemplateItemRequest `json:"items" validate:"required,min=1"`
}

type CreateTemplateItemRequest struct {
    AppID        int    `json:"app_id" validate:"required"`
    LicenseTier  string `json:"license_tier" validate:"required"`
    IsRequired   bool   `json:"is_required"`
    IsEditable   bool   `json:"is_editable"`
    DisplayOrder int    `json:"display_order"`
}

type TemplateResponse struct {
    TemplateID   int                `json:"template_id"`
    TemplateName string             `json:"template_name"`
    Description  string             `json:"description"`
    TargetType   string             `json:"target_type"`
    Status       string             `json:"status"`
    TotalApps    int                `json:"total_apps"`
    TotalCost    float64            `json:"total_cost"`
    CreatedAt    string             `json:"created_at"`
    Items        []TemplateItemResponse `json:"items"`
}

type TemplateItemResponse struct {
    AppID       int     `json:"app_id"`
    AppName     string  `json:"app_name"`
    LicenseTier string  `json:"license_tier"`
    AnnualCost  float64 `json:"annual_cost"`
    IsRequired  bool    `json:"is_required"`
    IsEditable  bool    `json:"is_editable"`
}
```

## Repository Methods
```go
// repositories/database/database_repository.go
func (r *DatabaseRepository) GetTemplates(ctx context.Context, filters map[string]interface{}) ([]entities.PurchaseTemplate, error) {
    var templates []entities.PurchaseTemplate
    query := r.db.WithContext(ctx)
    
    if dept, ok := filters["department"]; ok {
        query = query.Where("scope_value = ?", dept)
    }
    if status, ok := filters["status"]; ok {
        query = query.Where("status = ?", status)
    }
    
    err := query.Find(&templates).Error
    return templates, err
}

func (r *DatabaseRepository) GetTemplateByID(ctx context.Context, id int) (*entities.PurchaseTemplate, error) {
    var template entities.PurchaseTemplate
    err := r.db.WithContext(ctx).First(&template, id).Error
    return &template, err
}

func (r *DatabaseRepository) GetTemplateItems(ctx context.Context, templateID int) ([]entities.PurchaseTemplateItem, error) {
    var items []entities.PurchaseTemplateItem
    err := r.db.WithContext(ctx).Where("template_id = ?", templateID).Order("display_order").Find(&items).Error
    return items, err
}

func (r *DatabaseRepository) CreateTemplate(ctx context.Context, template *entities.PurchaseTemplate) error {
    return r.db.WithContext(ctx).Create(template).Error
}

func (r *DatabaseRepository) CreateTemplateItems(ctx context.Context, items []entities.PurchaseTemplateItem) error {
    return r.db.WithContext(ctx).Create(&items).Error
}

func (r *DatabaseRepository) UpdateTemplate(ctx context.Context, id int, updates map[string]interface{}) error {
    return r.db.WithContext(ctx).Model(&entities.PurchaseTemplate{}).Where("template_id = ?", id).Updates(updates).Error
}

func (r *DatabaseRepository) DeleteTemplate(ctx context.Context, id int) error {
    tx := r.db.WithContext(ctx).Begin()
    
    // Delete items first
    if err := tx.Where("template_id = ?", id).Delete(&entities.PurchaseTemplateItem{}).Error; err != nil {
        tx.Rollback()
        return err
    }
    
    // Delete template
    if err := tx.Delete(&entities.PurchaseTemplate{}, id).Error; err != nil {
        tx.Rollback()
        return err
    }
    
    return tx.Commit().Error
}
```

## Usecase Implementation
```go
// usecase/template_usecase.go
package usecase

import (
    "context"
    "asset-pulse-api/entities"
    "asset-pulse-api/repositories/database"
)

type TemplateUsecase struct {
    db *database.DatabaseRepository
}

func NewTemplateUsecase(db *database.DatabaseRepository) *TemplateUsecase {
    return &TemplateUsecase{db: db}
}

func (uc *TemplateUsecase) GetTemplates(ctx context.Context, filters map[string]interface{}) ([]entities.PurchaseTemplate, error) {
    return uc.db.GetTemplates(ctx, filters)
}

func (uc *TemplateUsecase) GetTemplateDetails(ctx context.Context, id int) (*entities.PurchaseTemplate, []entities.PurchaseTemplateItem, error) {
    template, err := uc.db.GetTemplateByID(ctx, id)
    if err != nil {
        return nil, nil, err
    }
    
    items, err := uc.db.GetTemplateItems(ctx, id)
    if err != nil {
        return nil, nil, err
    }
    
    return template, items, nil
}

func (uc *TemplateUsecase) CreateTemplate(ctx context.Context, template *entities.PurchaseTemplate, items []entities.PurchaseTemplateItem) error {
    // Create template
    if err := uc.db.CreateTemplate(ctx, template); err != nil {
        return err
    }
    
    // Set template_id for items
    for i := range items {
        items[i].TemplateID = template.TemplateID
    }
    
    // Create items
    return uc.db.CreateTemplateItems(ctx, items)
}

func (uc *TemplateUsecase) UpdateTemplate(ctx context.Context, id int, updates map[string]interface{}) error {
    return uc.db.UpdateTemplate(ctx, id, updates)
}

func (uc *TemplateUsecase) DeleteTemplate(ctx context.Context, id int) error {
    return uc.db.DeleteTemplate(ctx, id)
}
```

## Handler Implementation
```go
// handler/template_handler.go
package handler

import (
    "strconv"
    "github.com/gofiber/fiber/v2"
    "asset-pulse-api/handler/dto"
    "asset-pulse-api/usecase"
    "asset-pulse-api/entities"
)

type TemplateHandler struct {
    usecase *usecase.TemplateUsecase
}

func NewTemplateHandler(uc *usecase.TemplateUsecase) *TemplateHandler {
    return &TemplateHandler{usecase: uc}
}

func (h *TemplateHandler) GetTemplates(c *fiber.Ctx) error {
    filters := make(map[string]interface{})
    
    if dept := c.Query("department"); dept != "" {
        filters["department"] = dept
    }
    if status := c.Query("status"); status != "" {
        filters["status"] = status
    }
    
    templates, err := h.usecase.GetTemplates(c.Context(), filters)
    if err != nil {
        return c.Status(500).JSON(dto.ErrorResponse(err.Error()))
    }
    
    return c.JSON(dto.SuccessResponse(templates))
}

func (h *TemplateHandler) GetTemplateByID(c *fiber.Ctx) error {
    id, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return c.Status(400).JSON(dto.ErrorResponse("Invalid template ID"))
    }
    
    template, items, err := h.usecase.GetTemplateDetails(c.Context(), id)
    if err != nil {
        return c.Status(404).JSON(dto.ErrorResponse("Template not found"))
    }
    
    response := dto.TemplateResponse{
        TemplateID:   template.TemplateID,
        TemplateName: template.TemplateName,
        Description:  *template.Description,
        TargetType:   template.TargetType,
        Status:       template.Status,
        TotalApps:    len(items),
    }
    
    return c.JSON(dto.SuccessResponse(response))
}

func (h *TemplateHandler) CreateTemplate(c *fiber.Ctx) error {
    var req dto.CreateTemplateRequest
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(dto.ErrorResponse("Invalid request"))
    }
    
    template := &entities.PurchaseTemplate{
        TemplateName: req.TemplateName,
        Description:  &req.Description,
        TargetType:   req.TargetType,
        ScopeType:    req.ScopeType,
        ScopeValue:   req.ScopeValue,
        BudgetLimit:  &req.BudgetLimit,
        Status:       "active",
    }
    
    items := make([]entities.PurchaseTemplateItem, len(req.Items))
    for i, item := range req.Items {
        items[i] = entities.PurchaseTemplateItem{
            AppID:        item.AppID,
            LicenseTier:  item.LicenseTier,
            IsRequired:   item.IsRequired,
            IsEditable:   item.IsEditable,
            DisplayOrder: item.DisplayOrder,
        }
    }
    
    if err := h.usecase.CreateTemplate(c.Context(), template, items); err != nil {
        return c.Status(500).JSON(dto.ErrorResponse(err.Error()))
    }
    
    return c.Status(201).JSON(dto.SuccessResponse(template))
}

func (h *TemplateHandler) DeleteTemplate(c *fiber.Ctx) error {
    id, _ := strconv.Atoi(c.Params("id"))
    
    if err := h.usecase.DeleteTemplate(c.Context(), id); err != nil {
        return c.Status(500).JSON(dto.ErrorResponse(err.Error()))
    }
    
    return c.JSON(dto.SuccessResponse("Template deleted successfully"))
}
```

## Routes
```go
// handler/route.go
templates := api.Group("/templates")
templates.Get("/", handlers.Template.GetTemplates)
templates.Get("/:id", handlers.Template.GetTemplateByID)
templates.Post("/", handlers.Template.CreateTemplate)
templates.Put("/:id", handlers.Template.UpdateTemplate)
templates.Delete("/:id", handlers.Template.DeleteTemplate)
```

