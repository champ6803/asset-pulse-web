# Feature 6 & Authentication

## Feature 6: Pay-per-Use Optimization

### Overview
Identify users with low usage frequency where pay-per-use pricing would be cheaper than seat-based licenses.

### API Endpoint
**GET** `/api/v1/recommendations/payg-optimization?user_id=123&min_savings=5000`

### Response
```json
{
  "recommendations": [
    {
      "user_id": 123,
      "username": "john.doe",
      "app_name": "Postman Pro",
      "current_model": "seat",
      "current_cost": 18000,
      "usage_last_90_days": 15,
      "avg_monthly_usage": 5,
      "payg_cost": 2400,
      "estimated_savings": 15600,
      "savings_percent": 87,
      "recommendation": "switch_to_payg",
      "rationale": "Low usage detected (5 API calls/month). Pay-per-use would save 87%."
    }
  ]
}
```

### Usecase
```go
func (uc *RecommendationUsecase) PaygOptimizationUsecase(ctx context.Context, filters map[string]interface{}) ([]entities.Recommendation, error) {
    // 1. Get users with seat-based licenses
    seatLicenses, err := uc.db.GetSeatBasedLicenses(ctx, filters)
    if err != nil {
        return nil, err
    }
    
    recommendations := make([]entities.Recommendation, 0)
    
    for _, license := range seatLicenses {
        // 2. Calculate usage frequency (last 90 days)
        usage, err := uc.db.GetUsageCount(ctx, license.UserID, license.AppID, 90)
        if err != nil {
            continue
        }
        
        // 3. Get pricing models
        seatCost, _ := uc.db.GetSeatCost(ctx, license.AppID, license.LicenseTier)
        paygCost, _ := uc.db.GetPaygCost(ctx, license.AppID)
        
        // 4. Calculate estimated payg cost
        avgMonthlyUsage := usage / 3
        estimatedPaygCost := paygCost * float64(avgMonthlyUsage) * 12
        
        // 5. If savings > threshold, recommend
        if seatCost-estimatedPaygCost > 5000 {
            rec := entities.Recommendation{
                RecType:          "payg_opt",
                UserID:           &license.UserID,
                AppID:            license.AppID,
                Action:           "switch_to_payg",
                EstimatedSavings: floatPtr(seatCost - estimatedPaygCost),
                Rationale:        stringPtr(fmt.Sprintf("Low usage (%d/month). Switch to pay-per-use saves %.0f THB/year", avgMonthlyUsage, seatCost-estimatedPaygCost)),
                Status:           "pending",
                CreatedAt:        time.Now(),
            }
            
            recommendations = append(recommendations, rec)
            uc.db.CreateRecommendation(ctx, &rec)
        }
    }
    
    return recommendations, nil
}
```

---

## Authentication & Authorization

### JWT Authentication

#### Auth Entities
```go
// entities/database_entity.go
type User struct {
    UserID       int    `gorm:"primaryKey" json:"user_id"`
    Username     string `gorm:"unique;not null" json:"username"`
    Email        string `gorm:"unique;not null" json:"email"`
    PasswordHash string `gorm:"not null" json:"-"`
    Status       string `gorm:"default:'active'" json:"status"`
}

type UserRole struct {
    UserRoleID int    `gorm:"primaryKey" json:"user_role_id"`
    UserID     int    `gorm:"not null" json:"user_id"`
    RoleID     int    `gorm:"not null" json:"role_id"`
    ScopeType  string `json:"scope_type"`  // user/app/dept/subsidiary/group
    ScopeValue string `json:"scope_value"`
}
```

#### DTOs
```go
// handler/dto/auth.dto.go
type LoginRequest struct {
    Username string `json:"username" validate:"required"`
    Password string `json:"password" validate:"required,min=8"`
}

type LoginResponse struct {
    Token     string   `json:"token"`
    ExpiresAt string   `json:"expires_at"`
    User      UserInfo `json:"user"`
}

type UserInfo struct {
    UserID    int      `json:"user_id"`
    Username  string   `json:"username"`
    Email     string   `json:"email"`
    Roles     []string `json:"roles"`
}
```

#### JWT Utility
```go
// utils/jwt/jwt.go
package jwt

import (
    "time"
    "github.com/golang-jwt/jwt/v5"
)

type Claims struct {
    UserID   int      `json:"user_id"`
    Username string   `json:"username"`
    Roles    []string `json:"roles"`
    jwt.RegisteredClaims
}

func GenerateToken(userID int, username string, roles []string, secret string, expiry time.Duration) (string, error) {
    claims := Claims{
        UserID:   userID,
        Username: username,
        Roles:    roles,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    }
    
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(secret))
}

func ValidateToken(tokenString string, secret string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
        return []byte(secret), nil
    })
    
    if err != nil {
        return nil, err
    }
    
    if claims, ok := token.Claims.(*Claims); ok && token.Valid {
        return claims, nil
    }
    
    return nil, err
}
```

#### Auth Usecase
```go
// usecase/auth_usecase.go
package usecase

import (
    "context"
    "errors"
    "golang.org/x/crypto/bcrypt"
    "asset-pulse-api/repositories/database"
    "asset-pulse-api/utils/jwt"
)

type AuthUsecase struct {
    db        *database.DatabaseRepository
    jwtSecret string
}

func NewAuthUsecase(db *database.DatabaseRepository, jwtSecret string) *AuthUsecase {
    return &AuthUsecase{db: db, jwtSecret: jwtSecret}
}

func (uc *AuthUsecase) Login(ctx context.Context, username, password string) (string, error) {
    // 1. Get user by username
    user, err := uc.db.GetUserByUsername(ctx, username)
    if err != nil {
        return "", errors.New("invalid credentials")
    }
    
    // 2. Verify password
    if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
        return "", errors.New("invalid credentials")
    }
    
    // 3. Check user status
    if user.Status != "active" {
        return "", errors.New("user account is inactive")
    }
    
    // 4. Get user roles
    roles, err := uc.db.GetUserRoles(ctx, user.UserID)
    if err != nil {
        return "", err
    }
    
    roleNames := make([]string, len(roles))
    for i, role := range roles {
        roleNames[i] = role.RoleName
    }
    
    // 5. Generate JWT token
    token, err := jwt.GenerateToken(user.UserID, user.Username, roleNames, uc.jwtSecret, 8*time.Hour)
    if err != nil {
        return "", err
    }
    
    return token, nil
}

func (uc *AuthUsecase) GetCurrentUser(ctx context.Context, userID int) (*entities.User, error) {
    return uc.db.GetUserByID(ctx, userID)
}
```

#### Auth Handler
```go
// handler/auth_handler.go
package handler

import (
    "github.com/gofiber/fiber/v2"
    "asset-pulse-api/handler/dto"
    "asset-pulse-api/usecase"
)

type AuthHandler struct {
    usecase *usecase.AuthUsecase
}

func NewAuthHandler(uc *usecase.AuthUsecase) *AuthHandler {
    return &AuthHandler{usecase: uc}
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
    var req dto.LoginRequest
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(dto.ErrorResponse("Invalid request"))
    }
    
    token, err := h.usecase.Login(c.Context(), req.Username, req.Password)
    if err != nil {
        return c.Status(401).JSON(dto.ErrorResponse(err.Error()))
    }
    
    return c.JSON(dto.SuccessResponse(dto.LoginResponse{
        Token:     token,
        ExpiresAt: time.Now().Add(8 * time.Hour).Format(time.RFC3339),
    }))
}

func (h *AuthHandler) GetMe(c *fiber.Ctx) error {
    userID := c.Locals("user_id").(int)
    
    user, err := h.usecase.GetCurrentUser(c.Context(), userID)
    if err != nil {
        return c.Status(404).JSON(dto.ErrorResponse("User not found"))
    }
    
    return c.JSON(dto.SuccessResponse(user))
}
```

#### JWT Middleware
```go
// handler/middleware/auth.go
package middleware

import (
    "strings"
    "github.com/gofiber/fiber/v2"
    "asset-pulse-api/utils/jwt"
)

func JWTAuth(secret string) fiber.Handler {
    return func(c *fiber.Ctx) error {
        authHeader := c.Get("Authorization")
        if authHeader == "" {
            return c.Status(401).JSON(fiber.Map{"error": "Missing authorization header"})
        }
        
        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        
        claims, err := jwt.ValidateToken(tokenString, secret)
        if err != nil {
            return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
        }
        
        // Store user info in context
        c.Locals("user_id", claims.UserID)
        c.Locals("username", claims.Username)
        c.Locals("roles", claims.Roles)
        
        return c.Next()
    }
}
```

#### RBAC Middleware
```go
// handler/middleware/rbac.go
package middleware

import (
    "github.com/gofiber/fiber/v2"
)

func RequireRole(allowedRoles ...string) fiber.Handler {
    return func(c *fiber.Ctx) error {
        userRoles := c.Locals("roles").([]string)
        
        for _, userRole := range userRoles {
            for _, allowedRole := range allowedRoles {
                if userRole == allowedRole {
                    return c.Next()
                }
            }
        }
        
        return c.Status(403).JSON(fiber.Map{"error": "Insufficient permissions"})
    }
}
```

#### Routes with Auth
```go
// handler/route.go
func SetupRoutes(app *fiber.App, handlers *Handlers, jwtSecret string) {
    api := app.Group("/api/v1")
    
    // Public routes
    auth := api.Group("/auth")
    auth.Post("/login", handlers.Auth.Login)
    
    // Protected routes
    api.Use(middleware.JWTAuth(jwtSecret))
    
    // User info
    api.Get("/auth/me", handlers.Auth.GetMe)
    
    // Recommendations (require authentication)
    rec := api.Group("/recommendations")
    rec.Post("/jd-match", handlers.Recommendation.JDMatch)
    rec.Get("/seat-optimization", handlers.Recommendation.GetSeatOptimization)
    
    // CTO-only routes
    cto := rec.Group("/consolidation")
    cto.Use(middleware.RequireRole("Group CTO", "Subsidiary CTO"))
    cto.Get("/", handlers.Recommendation.GetConsolidation)
}
```

### Password Hashing
```go
import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    return string(bytes), err
}
```

