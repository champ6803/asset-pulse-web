# Seat Optimization Feature Design

## Overview
This document outlines the design for the Seat Optimization feature that uses AI to analyze license usage data and generate optimization recommendations (revoke, reallocate, downgrade).

## Architecture

### Backend Components

#### 1. AI Service - SeatOptimizationService
- **Location**: `asset-pulse-api/services/ai/seat_optimization_service.go`
- **Purpose**: Analyze license usage patterns using OpenAI to generate intelligent recommendations
- **Key Features**:
  - Analyze usage patterns (active, inactive, low usage)
  - Detect allocation opportunities (reallocate from inactive to requesting departments)
  - Identify downgrade opportunities (users using minimal features)
  - Generate AI rationale for each recommendation
  - Calculate priority scores and risk levels

#### 2. Database Repository Methods
- **Location**: `asset-pulse-api/repositories/database/database_repository.go`
- **New Methods Needed**:
  ```go
  // Get license usage analytics by company/department/app
  GetLicenseUsageAnalytics(ctx context.Context, companyCode, departmentCode, appName string) ([]LicenseUsageAnalytic, error)
  
  // Get pending license requests
  GetPendingLicenseRequests(ctx context.Context, companyCode, appName string) ([]LicenseRequest, error)
  
  // Get inactive users for an app
  GetInactiveUsers(ctx context.Context, appID int64, days int) ([]InactiveUser, error)
  ```

#### 3. Use Case Layer
- **Location**: `asset-pulse-api/usecase/seat_optimization_usecase.go`
- **Flow**:
  1. Fetch license usage data from database
  2. Fetch inactive users data
  3. Fetch pending requests
  4. Call AI service with aggregated data
  5. Process AI recommendations
  6. Merge with database data
  7. Return optimized response

#### 4. API Handler
- **Location**: `asset-pulse-api/handler/seat_optimization_handler.go`
- **Endpoint**: `GET /api/v1/cto/optimization`
- **Query Parameters**:
  - `company_code` (optional)
  - `department_code` (optional)
  - `app_name` (optional)
  - `action` (optional): revoke, reallocate, downgrade
  - `sort_by` (optional): priority, savings, date
  - `limit` (optional, default: 50)
  - `offset` (optional, default: 0)

### Frontend Components

#### 1. API Client
- **Location**: `asset-pulse-web/src/lib/api.ts`
- **Method**:
  ```typescript
  async getSeatOptimization(params?: {
    companyCode?: string;
    departmentCode?: string;
    appName?: string;
    action?: string;
    sortBy?: string;
    limit?: number;
    offset?: number;
  })
  ```

#### 2. Page Component
- **Location**: `asset-pulse-web/src/app/seat-optimization/page.tsx`
- **State Management**:
  - Filters: company, department, app, action, sort
  - Data: optimizations array
  - Pagination: limit, offset, total
  - Loading/error states

#### 3. Data Flow
1. Component mounts → Fetch initial data with filters
2. User changes filter → Debounced API call
3. API returns data → Update state and render
4. User selects items → Track selection state
5. User approves/dismisses → Call action API

## Data Models

### Backend Models

#### SeatOptimizationRequest (Enhanced)
```go
type SeatOptimizationRequest struct {
    CompanyCode    string
    DepartmentCode string
    AppName        string
    Action         string  // revoke, reallocate, downgrade
    SortBy         string  // priority, savings, date
    Limit          int
    Offset         int
}
```

#### SeatOptimizationResponse (Enhanced)
```go
type SeatOptimizationResponse struct {
    Optimizations []OptimizationOpportunity
    TotalSavings  float64
    TotalUsers    int
    Counts        OptimizationCounts
}

type OptimizationCounts struct {
    Total      int
    Revoke     int
    Reallocate int
    Downgrade  int
}
```

#### OptimizationOpportunity (Enhanced)
```go
type OptimizationOpportunity struct {
    ID                  int64
    AppID               int64
    AppName             string
    AppCategory         string
    Department          string
    DepartmentCode      string
    CompanyCode         string
    Action              string           // revoke, reallocate, downgrade
    InactiveUsers       int
    PendingRequests     int
    CanReallocate       int
    PotentialSavings    float64
    RiskLevel           string
    Priority            int              // 1-3 stars
    Rationale           string
    AIGeneratedRationale string
    FromDepartment      string           // For reallocate
    ToDepartment        string           // For reallocate
    DowngradeFrom       string           // For downgrade
    DowngradeTo         string           // For downgrade
    LastUsedDays        int              // For revoke
    CreatedAt           time.Time
    UpdatedAt           time.Time
}
```

### Frontend Types

```typescript
interface SeatOptimization {
  id: string;
  appId: number;
  appName: string;
  appCategory: string;
  department: string;
  departmentCode: string;
  companyCode: string;
  action: 'revoke' | 'reallocate' | 'downgrade';
  inactiveUsers: number;
  pendingRequests: number;
  canReallocate: number;
  potentialSavings: number;
  riskLevel: string;
  priority: 1 | 2 | 3;
  rationale: string;
  aiGeneratedRationale: string;
  fromDepartment?: string;
  toDepartment?: string;
  downgradeFrom?: string;
  downgradeTo?: string;
  lastUsedDays?: number;
  createdAt: string;
  updatedAt: string;
}

interface OptimizationFilters {
  companyCode?: string;
  departmentCode?: string;
  appName?: string;
  action?: 'revoke' | 'reallocate' | 'downgrade';
  sortBy?: 'priority' | 'savings' | 'date';
  limit?: number;
  offset?: number;
}

interface OptimizationCounts {
  total: number;
  revoke: number;
  reallocate: number;
  downgrade: number;
}

interface SeatOptimizationResponse {
  optimizations: SeatOptimization[];
  totalSavings: number;
  totalUsers: number;
  counts: OptimizationCounts;
}
```

## AI Service Implementation

### SeatOptimizationService Structure

```go
type SeatOptimizationService struct {
    client      *openai.Client
    db          *gorm.DB
    initialized bool
}

type OptimizationAnalysisRequest struct {
    UsageData        []LicenseUsageData
    InactiveUsers    []InactiveUserData
    PendingRequests  []LicenseRequestData
    CompanyContext   CompanyContextData
}

type OptimizationAnalysisResponse struct {
    Recommendations []AIRecommendation
    Confidence      float64
}

type AIRecommendation struct {
    Action              string
    AppName             string
    Department          string
    Rationale           string
    PriorityScore       int
    RiskAssessment      string
    PotentialSavings    float64
    FromDepartment      string
    ToDepartment        string
    DowngradeFrom       string
    DowngradeTo         string
}
```

### AI Prompt Design

```
You are a license optimization AI assistant. Analyze the following data and recommend license optimization opportunities.

License Usage Data:
{usage_data}

Inactive Users:
{inactive_users}

Pending Requests:
{pending_requests}

For each recommendation, provide:
1. Action type: revoke, reallocate, or downgrade
2. Rationale: Why this action is recommended
3. Priority: 1-3 (3 = high priority)
4. Risk Level: Low, Medium, High
5. For reallocate: specify from and to departments
6. For downgrade: specify from and to tiers
7. Estimated savings

Return JSON format:
{
  "recommendations": [
    {
      "action": "revoke|reallocate|downgrade",
      "app_name": "...",
      "department": "...",
      "rationale": "...",
      "priority": 1-3,
      "risk_level": "...",
      "potential_savings": 0.0,
      "from_department": "...",
      "to_department": "...",
      "downgrade_from": "...",
      "downgrade_to": "..."
    }
  ],
  "confidence": 0.0-1.0
}
```

## Database Queries

### Get License Usage Analytics
```sql
SELECT 
    a.id as app_id,
    a.name as app_name,
    a.category,
    la.license_tier,
    d.code as department_code,
    d.name as department_name,
    COUNT(DISTINCT la.user_id) as total_users,
    COUNT(DISTINCT CASE WHEN ue.id IS NULL THEN la.user_id END) as inactive_users,
    AVG(pb.list_price) as avg_cost_per_user,
    SUM(pb.list_price) as total_cost
FROM license_assignments la
JOIN apps a ON a.id = la.app_id
JOIN users u ON u.id = la.user_id
JOIN departments d ON d.code = u.department_code
LEFT JOIN usage_events ue ON ue.app_id = la.app_id 
    AND ue.user_id = la.user_id 
    AND ue.event_at > NOW() - INTERVAL '90 days'
LEFT JOIN license_inventories li ON li.id = la.license_id
LEFT JOIN price_books pb ON pb.app_id = la.app_id AND pb.tier = la.license_tier
WHERE la.revoked_at IS NULL
    AND la.company_code = COALESCE($1, la.company_code)
    AND d.code = COALESCE($2, d.code)
    AND a.name = COALESCE($3, a.name)
GROUP BY a.id, a.name, a.category, la.license_tier, d.code, d.name
ORDER BY total_cost DESC;
```

### Sequence Diagram

Sequence diagram showing the flow:
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant UseCase
    participant DBRepo
    participant AIService
    participant OpenAI

    User->>Frontend: Load page
    Frontend->>API: GET /api/v1/cto/optimization?filters
    API->>UseCase: GetSeatOptimization(request)
    UseCase->>DBRepo: GetLicenseUsageAnalytics()
    DBRepo-->>UseCase: usageData[]
    UseCase->>DBRepo: GetInactiveUsers()
    DBRepo-->>UseCase: inactiveUsers[]
    UseCase->>DBRepo: GetPendingLicenseRequests()
    DBRepo-->>UseCase: pendingRequests[]
    UseCase->>AIService: AnalyzeOpportunities(data)
    AIService->>OpenAI: GPT-4 API call with prompt
    OpenAI-->>AIService: AI recommendations[]
    AIService-->>UseCase: recommendations[]
    UseCase->>UseCase: Merge & calculate
    UseCase-->>API: response
    API-->>Frontend: JSON response
    Frontend-->>User: Display optimizations

## UI Components Breakdown

### Summary Cards
- Display total counts for each action type
- Show total potential savings
- Clickable to filter by action

### Filter Bar
- Company dropdown: Dynamic from API
- Department dropdown: Filtered by company
- App dropdown: Dynamic from API
- Action dropdown: revoke, reallocate, downgrade
- Sort dropdown: priority, savings, date

### Optimization List
- Card per optimization
- Action badge with color coding
- Priority stars (1-3)
- AI rationale in collapsible section
- Metrics display
- Action buttons (Approve, Dismiss, View Details, Save)

### Bulk Actions
- Select All checkbox
- Selected count display
- Bulk approve/dismiss
- Export selected

### Pagination
- Page size selector
- Previous/Next buttons
- Page numbers
- Total count display

## Security Considerations

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Only subsidiary-cto and group-cto roles can access
3. **Input Validation**: Sanitize all filter parameters
4. **SQL Injection**: Use parameterized queries
5. **Rate Limiting**: Limit AI service calls per user/IP
6. **Data Privacy**: Only show company's own data

## Monitoring & Logging

1. Log all API requests with parameters
2. Track AI service response times
3. Monitor error rates
4. Alert on high error rates
5. Track filter usage patterns

## Future Enhancements

1. **Caching**: Implement Redis caching for recommendations
2. **Batch Processing**: Process optimizations in background jobs
3. **Notifications**: Email users about recommended actions
4. **Approval Workflow**: Manager approval required
5. **Historical Tracking**: Track implemented optimizations
6. **Analytics Dashboard**: Visualize optimization impact
7. **Automation**: Auto-apply low-risk recommendations

