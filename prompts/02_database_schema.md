# Asset Pulse - Database Schema & Core Entities

## Database Tables Overview (30+ tables)

### Organization Hierarchy (4 tables)
```go
// entities/database_entity.go

type Org struct {
    OrgID        int       `gorm:"primaryKey;autoIncrement" json:"org_id"`
    OrgName      string    `gorm:"size:100;not null" json:"org_name"`
    OrgKey       string    `gorm:"size:50;unique;not null" json:"org_key"`
    CreatedAt    time.Time `json:"created_at"`
}

type Company struct {
    CompanyID    int       `gorm:"primaryKey;autoIncrement" json:"company_id"`
    OrgID        int       `gorm:"not null" json:"org_id"`
    CompanyName  string    `gorm:"size:100;not null" json:"company_name"`
    CompanyCode  string    `gorm:"size:50;unique;not null" json:"company_code"`
    CreatedAt    time.Time `json:"created_at"`
}

type Department struct {
    DepartmentID   int       `gorm:"primaryKey;autoIncrement" json:"department_id"`
    CompanyID      int       `gorm:"not null" json:"company_id"`
    DepartmentName string    `gorm:"size:100;not null" json:"department_name"`
    DepartmentCode string    `gorm:"size:50;unique;not null" json:"department_code"`
    CreatedAt      time.Time `json:"created_at"`
}
```

### Users & Roles (4 tables)
```go
type Role struct {
    RoleID      int       `gorm:"primaryKey;autoIncrement" json:"role_id"`
    RoleName    string    `gorm:"size:50;unique;not null" json:"role_name"`
    Description string    `gorm:"size:255" json:"description"`
    CreatedAt   time.Time `json:"created_at"`
}

type User struct {
    UserID         int       `gorm:"primaryKey;autoIncrement" json:"user_id"`
    Username       string    `gorm:"size:100;unique;not null" json:"username"`
    Email          string    `gorm:"size:255;unique;not null" json:"email"`
    PasswordHash   string    `gorm:"size:255;not null" json:"-"`
    FirstName      string    `gorm:"size:100" json:"first_name"`
    LastName       string    `gorm:"size:100" json:"last_name"`
    DepartmentCode *string   `gorm:"size:50" json:"department_code"`
    CompanyCode    *string   `gorm:"size:50" json:"company_code"`
    Status         string    `gorm:"size:20;default:'active'" json:"status"`
    CreatedAt      time.Time `json:"created_at"`
    UpdatedAt      time.Time `json:"updated_at"`
}

type UserRole struct {
    UserRoleID int       `gorm:"primaryKey;autoIncrement" json:"user_role_id"`
    UserID     int       `gorm:"not null" json:"user_id"`
    RoleID     int       `gorm:"not null" json:"role_id"`
    ScopeType  *string   `gorm:"size:50" json:"scope_type"` // user/app/dept/subsidiary/group
    ScopeValue *string   `gorm:"size:100" json:"scope_value"`
    AssignedAt time.Time `json:"assigned_at"`
}

type JobProfile struct {
    JobProfileID   int       `gorm:"primaryKey;autoIncrement" json:"job_profile_id"`
    JobProfileKey  string    `gorm:"size:100;unique;not null" json:"job_profile_key"`
    JobProfileName string    `gorm:"size:255;not null" json:"job_profile_name"`
    Description    *string   `gorm:"type:text" json:"description"`
    CreatedAt      time.Time `json:"created_at"`
}
```

### Application Catalog (4 tables)
```go
type App struct {
    AppID       int       `gorm:"primaryKey;autoIncrement" json:"app_id"`
    AppName     string    `gorm:"size:255;not null" json:"app_name"`
    AppKey      string    `gorm:"size:100;unique;not null" json:"app_key"`
    Description *string   `gorm:"type:text" json:"description"`
    Category    *string   `gorm:"size:100" json:"category"`
    Status      string    `gorm:"size:20;default:'active'" json:"status"`
    CreatedAt   time.Time `json:"created_at"`
}

type AppFeature struct {
    FeatureID   int       `gorm:"primaryKey;autoIncrement" json:"feature_id"`
    AppID       int       `gorm:"not null" json:"app_id"`
    FeatureName string    `gorm:"size:255;not null" json:"feature_name"`
    Description *string   `gorm:"type:text" json:"description"`
    CreatedAt   time.Time `json:"created_at"`
}

type AppSimilarity struct {
    SimilarityID    int       `gorm:"primaryKey;autoIncrement" json:"similarity_id"`
    AppID1          int       `gorm:"not null" json:"app_id1"`
    AppID2          int       `gorm:"not null" json:"app_id2"`
    SimilarityScore float64   `gorm:"type:decimal(5,2)" json:"similarity_score"`
    Rationale       *string   `gorm:"type:text" json:"rationale"`
    CalculatedAt    time.Time `json:"calculated_at"`
}
```

### Contracts & Licenses (7 tables)
```go
type Vendor struct {
    VendorID    int       `gorm:"primaryKey;autoIncrement" json:"vendor_id"`
    VendorName  string    `gorm:"size:255;not null" json:"vendor_name"`
    ContactInfo *string   `gorm:"type:text" json:"contact_info"`
    CreatedAt   time.Time `json:"created_at"`
}

type Contract struct {
    ContractID     int       `gorm:"primaryKey;autoIncrement" json:"contract_id"`
    ContractNumber string    `gorm:"size:100;unique;not null" json:"contract_number"`
    VendorID       int       `gorm:"not null" json:"vendor_id"`
    CompanyCode    string    `gorm:"size:50;not null" json:"company_code"`
    StartDate      time.Time `json:"start_date"`
    EndDate        time.Time `json:"end_date"`
    Status         string    `gorm:"size:20;default:'active'" json:"status"`
    CreatedAt      time.Time `json:"created_at"`
}

type ContractTerm struct {
    TermID        int        `gorm:"primaryKey;autoIncrement" json:"term_id"`
    ContractID    int        `gorm:"not null" json:"contract_id"`
    AppID         int        `gorm:"not null" json:"app_id"`
    LicenseTier   string     `gorm:"size:50;not null" json:"license_tier"`
    PricingModel  string     `gorm:"size:50" json:"pricing_model"` // seat/usage
    UnitPrice     *float64   `gorm:"type:decimal(15,2)" json:"unit_price"`
    Quantity      *int       `json:"quantity"`
    CreatedAt     time.Time  `json:"created_at"`
}

type LicenseInventory struct {
    InventoryID     int       `gorm:"primaryKey;autoIncrement" json:"inventory_id"`
    ContractID      int       `gorm:"not null" json:"contract_id"`
    AppID           int       `gorm:"not null" json:"app_id"`
    LicenseTier     string    `gorm:"size:50;not null" json:"license_tier"`
    TotalLicenses   int       `gorm:"not null" json:"total_licenses"`
    AssignedLicenses int      `gorm:"default:0" json:"assigned_licenses"`
    AvailableLicenses int     `json:"available_licenses"`
    UpdatedAt       time.Time `json:"updated_at"`
}

type LicenseAssignment struct {
    AssignmentID int       `gorm:"primaryKey;autoIncrement" json:"assignment_id"`
    UserID       int       `gorm:"not null" json:"user_id"`
    AppID        int       `gorm:"not null" json:"app_id"`
    LicenseTier  string    `gorm:"size:50;not null" json:"license_tier"`
    ContractID   int       `gorm:"not null" json:"contract_id"`
    AssignedAt   time.Time `json:"assigned_at"`
    RevokedAt    *time.Time `json:"revoked_at"`
    Status       string    `gorm:"size:20;default:'active'" json:"status"`
}
```

### Usage Tracking (1 table)
```go
type UsageEvent struct {
    EventID    int64     `gorm:"primaryKey;autoIncrement" json:"event_id"`
    UserID     int       `gorm:"not null;index" json:"user_id"`
    AppID      int       `gorm:"not null;index" json:"app_id"`
    EventAt    time.Time `gorm:"not null;index" json:"event_at"`
    EventType  string    `gorm:"size:50;not null" json:"event_type"` // signin/activity/action
    EventValue *float64  `json:"event_value"`
    Metadata   *string   `gorm:"type:jsonb" json:"metadata"`
}
```

## Key Database Relationships
- User → Department → Company → Org (hierarchy)
- User ← UserRole → Role (RBAC)
- Contract → ContractTerm → App (pricing)
- LicenseInventory → LicenseAssignment → User (license tracking)
- UsageEvent → User + App (usage analytics)

## PostgreSQL Setup with pgvector
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- for text similarity

-- Index for usage event queries
CREATE INDEX idx_usage_events_user_app ON usage_events(user_id, app_id, event_at DESC);
CREATE INDEX idx_usage_events_app_time ON usage_events(app_id, event_at DESC);

-- Index for license assignments
CREATE INDEX idx_license_assignments_user ON license_assignments(user_id, status);
CREATE INDEX idx_license_assignments_app ON license_assignments(app_id, status);
```

## GORM Connection Setup
```go
// utils/gorm/pgClient.go
package gorm

import (
    "fmt"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "gorm.io/gorm/logger"
)

func NewPostgresDB(host, user, password, dbname string, port int) (*gorm.DB, error) {
    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=disable TimeZone=Asia/Bangkok",
        host, user, password, dbname, port)
    
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
        Logger: logger.Default.LogMode(logger.Info),
    })
    
    if err != nil {
        return nil, err
    }
    
    // Connection pooling
    sqlDB, _ := db.DB()
    sqlDB.SetMaxIdleConns(10)
    sqlDB.SetMaxOpenConns(100)
    
    return db, nil
}
```

