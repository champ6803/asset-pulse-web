# Asset Pulse - Technical Specification Document

## Document Information

- **Application Name**: Asset Pulse
- **Document Type**: Technical Specification
- **Version**: 1.0
- **Date**: October 21, 2025
- **Organization**: SCBX Group
- **Target Platform**: Azure Kubernetes Service (AKS)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Sprint Planning & Deliverables](#2-sprint-planning--deliverables)
3. [Feature 1: Cross-Subsidiary Software Match](#3-feature-1-cross-subsidiary-software-match)
4. [Feature 2: Group Contract Consolidation](#4-feature-2-group-contract-consolidation)
5. [Feature 3: JD → License Matching (AI)](#5-feature-3-jd--license-matching-ai)
6. [Feature 4: Purchase Template Management](#6-feature-4-purchase-template-management)
7. [Feature 5: Seat Optimization with Reallocation](#7-feature-5-seat-optimization-with-reallocation)
8. [Feature 6: Pay-Per-Use Optimization](#8-feature-6-pay-per-use-optimization)
9. [API Specifications](#9-api-specifications)
10. [Database Architecture](#10-database-architecture)
11. [Sequence Diagrams](#11-sequence-diagrams)
12. [Component Architecture](#12-component-architecture)
13. [Integration Points](#13-integration-points)
14. [Security Specifications](#14-security-specifications)
15. [Testing Strategy](#15-testing-strategy)

---

## 1. Executive Summary

### 1.1 Purpose

This technical specification document provides detailed implementation guidance for all six core features of Asset Pulse across multiple sprints. It includes API specifications, sequence diagrams, database schemas, and integration details necessary for development teams.

### 1.2 System Overview

Asset Pulse is an AI-powered Software Asset Management platform with:
- **Backend**: Go (Golang) + Fiber framework
- **Frontend**: Next.js (React + TypeScript)
- **Database**: PostgreSQL 15 + pgvector
- **Cache**: Redis
- **AI/LLM**: Azure OpenAI (GPT-4o)
- **Infrastructure**: Azure Kubernetes Service (AKS)

### 1.3 Key Features

| Feature | Priority | Complexity | Sprint |
|---------|----------|------------|--------|
| **Feature 3**: JD → License Matching | ⭐ High | High | Sprint 1-2 |
| **Feature 4**: Purchase Templates | ⭐ High | Medium | Sprint 1-2 |
| **Feature 5**: Seat Optimization + Reallocation | High | High | Sprint 3-4 |
| **Feature 1**: Cross-Sub Software Match | Medium | High | Sprint 4-5 |
| **Feature 2**: Group Consolidation | Medium | High | Sprint 5-6 |
| **Feature 6**: Pay-Per-Use Optimization | Low | Medium | Sprint 6 |

---

## 2. Sprint Planning & Deliverables

### Sprint 1 (Weeks 1-2): Foundation + Authentication

#### Deliverables
- ✅ Database schema deployment
- ✅ Backend project structure
- 🎯 Authentication & Authorization (JWT + Azure AD)
- 🎯 RBAC middleware implementation
- 🎯 User management APIs
- 🎯 Frontend authentication flow

#### Technical Tasks
1. **Database Setup**
   - Deploy `0001_initial_tables.sql`
   - Deploy `0002_insert_mockdata.sql`
   - Deploy `0003_create_view_recommend_pack_for_user.sql`
   - Verify all tables and relationships

2. **Authentication Module** (`handler/auth_handler.go`)
   ```go
   // POST /api/v1/auth/login
   // POST /api/v1/auth/logout
   // GET /api/v1/auth/me
   // POST /api/v1/auth/refresh
   ```

3. **RBAC Middleware** (`handler/middleware/rbac.go`)
   - JWT token validation
   - Role-based permission checking
   - Scope-based access control

4. **CI/CD Pipeline**
   - GitHub Actions workflow
   - Docker image build
   - AKS deployment scripts

#### Acceptance Criteria
- [ ] User can login with email/password
- [ ] JWT token issued and validated
- [ ] Role-based access working
- [ ] Frontend redirects based on role
- [ ] All unit tests passing

---

### Sprint 2 (Weeks 3-4): Feature 3 - JD Matching (MVP)

#### Deliverables
- 🎯 LLM client implementation (Azure OpenAI)
- 🎯 Feature 3: Job Description → License Matching
- 🎯 Recommendation engine (with fallback)
- 🎯 New hire request form (Frontend)
- 🎯 AI recommendation results UI

#### Technical Tasks
1. **LLM Integration** (`utils/llm/openai_client.go`)
   - OpenAI SDK setup
   - Prompt templates
   - Token usage tracking
   - Error handling & fallback

2. **Recommendation Usecase** (`usecase/recommendation_usecase.go`)
   ```go
   func (uc *RecommendationUsecase) JDMatchUsecase(
       ctx context.Context,
       jobDescription string,
       jobTitle string,
       department string,
       companyCode string,
   ) ([]entities.Recommendation, error)
   ```

3. **API Handlers** (`handler/recommendation_handler.go`)
   ```go
   POST /api/v1/recommendations/jd-match
   GET /api/v1/recommendations/:id
   ```

4. **Frontend Screens**
   - `/requests/new-hire` - New hire form
   - `/requests/new-hire/recommendations` - AI results
   - `/requests/confirmation` - Success page

#### Sequence Diagram
```mermaid
sequenceDiagram
    participant HR as HR User
    participant FE as Frontend
    participant API as Backend API
    participant LLM as Azure OpenAI
    participant DB as PostgreSQL
    participant Cache as Redis

    HR->>FE: Fill new hire form
    FE->>API: POST /recommendations/jd-match
    API->>Cache: Check cache for similar JD
    alt Cache Hit
        Cache-->>API: Return cached recommendations
    else Cache Miss
        API->>DB: Get app catalog
        DB-->>API: Return apps
        API->>LLM: Generate recommendations (GPT-4o)
        LLM-->>API: Return recommendations + rationale
        API->>DB: Save recommendations
        API->>Cache: Cache result (24h TTL)
    end
    API-->>FE: Return recommendations
    FE->>HR: Display AI recommendations
    HR->>FE: Review & submit
    FE->>API: POST /requests
    API->>DB: Create request
    API-->>FE: Request created
```

#### Acceptance Criteria
- [ ] HR can input job description
- [ ] AI generates 10 relevant recommendations
- [ ] Each recommendation has rationale
- [ ] Fallback to rule-based if LLM fails
- [ ] Results cached for 24 hours
- [ ] Frontend displays results beautifully
- [ ] User can customize and submit

---

### Sprint 3 (Weeks 5-6): Feature 4 - Templates + Feature 5 Start

#### Deliverables
- 🎯 Feature 4: Purchase Template Management
- 🎯 Feature 5: Seat Optimization (Revoke/Downgrade)
- 🎯 Template CRUD APIs
- 🎯 Template UI (List, Create, Edit)
- 🎯 Basic optimization dashboard

#### Technical Tasks
1. **Template Usecase** (`usecase/template_usecase.go`)
   ```go
   func (uc *TemplateUsecase) CreateTemplate(...)
   func (uc *TemplateUsecase) GetTemplates(...)
   func (uc *TemplateUsecase) UpdateTemplate(...)
   func (uc *TemplateUsecase) DeleteTemplate(...)
   func (uc *TemplateUsecase) ApplyTemplate(...)
   ```

2. **Optimization Usecase (Part 1)** (`usecase/recommendation_usecase.go`)
   ```go
   func (uc *RecommendationUsecase) SeatOptimizationUsecase(...)
   // Focus on revoke & downgrade first
   ```

3. **Frontend Screens**
   - `/templates` - Template list
   - `/templates/create` - Create template
   - `/templates/:id/edit` - Edit template
   - `/recommendations/seat-optimization` - Optimization dashboard

#### Acceptance Criteria
- [ ] Manager can create template
- [ ] Template includes apps + tiers
- [ ] HR can apply template to new hire
- [ ] CTO sees inactive license recommendations
- [ ] Revoke recommendations generated
- [ ] Downgrade recommendations generated

---

### Sprint 4 (Weeks 7-8): Feature 5 - Reallocation

#### Deliverables
- 🎯 Feature 5: License Reallocation Logic
- 🎯 Reallocation matching algorithm
- 🎯 Department & cross-subsidiary reallocation
- 🎯 Reallocation UI with detail view
- 🎯 Approval workflow integration

#### Technical Tasks
1. **Reallocation Algorithm**
   ```go
   func (uc *RecommendationUsecase) GenerateReallocationRecommendations(
       ctx context.Context,
       companyCode string,
   ) ([]entities.ReallocationRecommendation, error) {
       // 1. Find inactive licenses (90+ days)
       // 2. Find pending requests
       // 3. Match by app_id, contract scope
       // 4. Calculate impact (cost avoided, requests fulfilled)
       // 5. Generate recommendations
   }
   ```

2. **API Endpoints**
   ```go
   GET /api/v1/recommendations/seat-optimization/reallocation
   GET /api/v1/recommendations/seat-optimization/:id/details
   POST /api/v1/recommendations/seat-optimization/:id/apply
   ```

3. **Frontend Screens**
   - `/recommendations/seat-optimization/reallocation` - Reallocation list
   - `/recommendations/seat-optimization/:id/details` - Detail view with source/target

#### Sequence Diagram
```mermaid
sequenceDiagram
    participant CTO as Subsidiary CTO
    participant FE as Frontend
    participant API as Backend API
    participant DB as PostgreSQL

    CTO->>FE: Open seat optimization
    FE->>API: GET /recommendations/seat-optimization/reallocation
    API->>DB: Find inactive licenses (90+ days)
    API->>DB: Find pending requests
    API->>DB: Match by app + contract scope
    API->>DB: Calculate savings & impact
    API-->>FE: Return reallocation opportunities
    FE->>CTO: Display opportunities
    CTO->>FE: Click "View Details"
    FE->>API: GET /recommendations/:id/details
    API->>DB: Get detailed user list (source/target)
    API-->>FE: Return details
    FE->>CTO: Show source users & target requests
    CTO->>FE: Click "Approve Reallocation"
    FE->>API: POST /recommendations/:id/apply
    API->>DB: Start transaction
    API->>DB: Update license_assignments (revoke from source)
    API->>DB: Create license_assignments (assign to target)
    API->>DB: Update requests (mark as fulfilled)
    API->>DB: Create notifications
    API->>DB: Commit transaction
    API-->>FE: Success
    FE->>CTO: Show confirmation
```

#### Acceptance Criteria
- [ ] System identifies reallocation opportunities
- [ ] Matching considers contract scope
- [ ] Shows source (inactive) and target (pending)
- [ ] Calculates cost avoided + savings
- [ ] CTO can approve reallocation
- [ ] Notifications sent to all parties
- [ ] Audit log created

---

### Sprint 5 (Weeks 9-10): Feature 1 - Cross-Sub Match

#### Deliverables
- 🎯 Feature 1: Cross-Subsidiary Software Matching
- 🎯 App similarity calculation (Jaccard + LLM)
- 🎯 Similar software detection UI
- 🎯 Group-level view for Group CTO

#### Technical Tasks
1. **Similarity Calculation**
   ```go
   func (uc *RecommendationUsecase) CalculateAppSimilarity(
       ctx context.Context,
       appA, appB *entities.App,
   ) (float64, string, error) {
       // 1. Feature-based Jaccard similarity
       // 2. LLM-based semantic similarity
       // 3. Combine scores
       // 4. Generate rationale
   }
   ```

2. **Batch Processing** (Background Job)
   ```go
   // Run nightly: compare all app pairs across subsidiaries
   func (job *SimilarityJob) ProcessAllPairs(ctx context.Context)
   ```

3. **API Endpoints**
   ```go
   GET /api/v1/recommendations/cross-sub-match
   GET /api/v1/recommendations/cross-sub-match/:app_id
   POST /api/v1/recommendations/cross-sub-match/:id/save
   ```

#### Acceptance Criteria
- [ ] System detects similar apps (>80% similarity)
- [ ] Shows all subsidiaries using each tool
- [ ] AI explains why apps are similar
- [ ] Group CTO can view all matches
- [ ] Results cached and refreshed nightly

---

### Sprint 6 (Weeks 11-12): Feature 2 + Feature 6

#### Deliverables
- 🎯 Feature 2: Group Consolidation Recommendations
- 🎯 Feature 6: Pay-Per-Use Optimization
- 🎯 AI memo generation
- 🎯 Consolidation workflow UI
- 🎯 PayG recommendations

#### Technical Tasks
1. **Consolidation Usecase**
   ```go
   func (uc *RecommendationUsecase) GenerateConsolidationOpportunities(
       ctx context.Context,
       similarAppGroup []int64, // app_ids
   ) (*entities.ConsolidationOpportunity, error) {
       // 1. Aggregate current contracts & costs
       // 2. Calculate group pricing
       // 3. Estimate savings
       // 4. Generate business case
   }
   ```

2. **Memo Generation (AI)**
   ```go
   func (uc *MemoUsecase) GenerateMemo(
       ctx context.Context,
       consolidationID int64,
   ) (string, error) {
       // Use LLM to generate executive memo
   }
   ```

3. **API Endpoints**
   ```go
   GET /api/v1/recommendations/consolidation
   POST /api/v1/memos/generate
   GET /api/v1/memos/:id
   ```

#### Acceptance Criteria
- [ ] System calculates consolidation savings
- [ ] AI generates professional memo
- [ ] Group CTO can review and edit memo
- [ ] Memo includes financial analysis
- [ ] PayG recommendations identify low-usage users

---

## 3. Feature 1: Cross-Subsidiary Software Match

### 3.1 Overview

**Purpose**: Identify duplicate or similar applications across subsidiaries to enable consolidation.

**Business Value**: Reduce software sprawl, identify group buying opportunities.

### 3.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| F1-1 | System shall analyze all apps across 25+ subsidiaries | Must Have |
| F1-2 | System shall calculate similarity score (0-100%) | Must Have |
| F1-3 | System shall use Jaccard index + LLM for similarity | Must Have |
| F1-4 | System shall generate human-readable rationale | Must Have |
| F1-5 | System shall group similar apps (>80% similarity) | Must Have |
| F1-6 | System shall show subsidiaries using each tool | Must Have |
| F1-7 | Similarity calculation shall run nightly (batch) | Should Have |

### 3.3 Technical Design

#### 3.3.1 Similarity Calculation Algorithm

```go
// Stage 1: Feature-based Jaccard Similarity
func CalculateJaccardSimilarity(appA, appB *entities.App) float64 {
    featuresA := GetAppFeatures(appA.ID)
    featuresB := GetAppFeatures(appB.ID)
    
    intersection := Intersect(featuresA, featuresB)
    union := Union(featuresA, featuresB)
    
    if len(union) == 0 {
        return 0.0
    }
    
    return float64(len(intersection)) / float64(len(union))
}

// Stage 2: LLM Semantic Similarity
func CalculateLLMSimilarity(
    ctx context.Context,
    appA, appB *entities.App,
) (float64, string, error) {
    prompt := fmt.Sprintf(`
You are a software analyst expert.

Application 1:
Name: %s
Description: %s
Features: %s

Application 2:
Name: %s
Description: %s
Features: %s

Task: Determine similarity (0-100%%) and explain why.
Output JSON: {"similarity": 85, "rationale": "Both provide..."}
`, appA.Name, appA.Description, appA.Features,
   appB.Name, appB.Description, appB.Features)
    
    response, err := llmClient.CreateChatCompletion(ctx, prompt)
    if err != nil {
        return 0, "", err
    }
    
    var result struct {
        Similarity float64 `json:"similarity"`
        Rationale  string  `json:"rationale"`
    }
    json.Unmarshal([]byte(response.Content), &result)
    
    return result.Similarity / 100.0, result.Rationale, nil
}

// Stage 3: Combined Score
func CalculateFinalSimilarity(
    ctx context.Context,
    appA, appB *entities.App,
) (float64, string, error) {
    jaccardScore := CalculateJaccardSimilarity(appA, appB)
    
    // Only call LLM if Jaccard > 0.3 (optimization)
    if jaccardScore < 0.3 {
        return jaccardScore, "Low feature overlap", nil
    }
    
    llmScore, rationale, err := CalculateLLMSimilarity(ctx, appA, appB)
    if err != nil {
        // Fallback to Jaccard only
        return jaccardScore, "Feature-based similarity", nil
    }
    
    // Weighted average: 40% Jaccard + 60% LLM
    finalScore := (0.4 * jaccardScore) + (0.6 * llmScore)
    
    return finalScore, rationale, nil
}
```

#### 3.3.2 Database Schema

```sql
-- Store pre-calculated similarities
CREATE TABLE app_similarity (
  app_a_id          BIGINT NOT NULL REFERENCES apps(id),
  app_b_id          BIGINT NOT NULL REFERENCES apps(id),
  method            VARCHAR(50) NOT NULL, -- jaccard/llm/combined
  score             NUMERIC(6,4) NOT NULL, -- 0..1
  reason_json       JSONB,
  description       TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (app_a_id, app_b_id, method)
);

CREATE INDEX idx_app_similarity_score 
  ON app_similarity(method, score DESC);
```

### 3.4 API Specification

#### GET /api/v1/recommendations/cross-sub-match

Get all similar software groups across subsidiaries.

**Request**
```http
GET /api/v1/recommendations/cross-sub-match?min_similarity=0.8
Authorization: Bearer <jwt_token>
```

**Query Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| min_similarity | float | No | Minimum similarity (0-1), default: 0.8 |
| category | string | No | Filter by category |
| company_code | string | No | Filter by company |

**Response**
```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "group_id": 1,
        "category": "Project Management",
        "similarity_score": 0.87,
        "apps": [
          {
            "app_id": 101,
            "app_name": "Asana",
            "company_code": "DATAX",
            "users": 50,
            "annual_cost": 180000
          },
          {
            "app_id": 102,
            "app_name": "Monday.com",
            "company_code": "TECHX",
            "users": 35,
            "annual_cost": 140000
          }
        ],
        "total_cost": 320000,
        "rationale": "Both tools provide task management, kanban boards, and team collaboration with 85% feature overlap.",
        "common_features": [
          "Task Management",
          "Kanban Boards",
          "Team Collaboration",
          "Integrations"
        ],
        "consolidation_potential": 200000
      }
    ],
    "total_groups": 12,
    "total_potential_savings": 5200000
  },
  "meta": {
    "timestamp": "2025-10-21T10:30:00Z"
  }
}
```

---

## 4. Feature 2: Group Contract Consolidation

### 4.1 Overview

**Purpose**: Recommend cost savings by consolidating subsidiary contracts into group agreements.

**Business Value**: Leverage group buying power, reduce costs by 20-30%.

### 4.2 Consolidation Calculation Logic

```go
type ConsolidationOpportunity struct {
    AppID              int64
    AppName            string
    CurrentContracts   []ContractInfo
    ProposedGroupContract GroupContractProposal
    Savings            ConsolidationSavings
    Rationale          string
}

type ContractInfo struct {
    CompanyCode   string
    Users         int
    AnnualCost    float64
    ContractID    int64
}

type GroupContractProposal struct {
    TotalUsers    int
    BasePrice     float64
    GroupDiscount float64 // 20%
    FinalPrice    float64
}

type ConsolidationSavings struct {
    CurrentTotal   float64
    ProposedTotal  float64
    AnnualSavings  float64
    SavingsPercent float64
    PaybackMonths  int
}

func (uc *RecommendationUsecase) CalculateConsolidation(
    ctx context.Context,
    similarAppIDs []int64,
) (*ConsolidationOpportunity, error) {
    // 1. Get current contracts for all apps in group
    contracts := []ContractInfo{}
    for _, appID := range similarAppIDs {
        appContracts := uc.db.GetContractsByApp(ctx, appID)
        contracts = append(contracts, appContracts...)
    }
    
    // 2. Calculate current total cost
    currentTotal := 0.0
    totalUsers := 0
    for _, c := range contracts {
        currentTotal += c.AnnualCost
        totalUsers += c.Users
    }
    
    // 3. Get group pricing (from price book or vendor quote)
    basePrice := uc.db.GetGroupPrice(ctx, appID, totalUsers)
    groupDiscount := 0.20 // 20% group discount
    finalPrice := basePrice * (1 - groupDiscount)
    
    // 4. Calculate savings
    savings := ConsolidationSavings{
        CurrentTotal:   currentTotal,
        ProposedTotal:  finalPrice,
        AnnualSavings:  currentTotal - finalPrice,
        SavingsPercent: ((currentTotal - finalPrice) / currentTotal) * 100,
        PaybackMonths:  calculatePayback(migrationCost, savings),
    }
    
    // 5. Generate rationale (LLM)
    rationale := uc.generateConsolidationRationale(ctx, contracts, savings)
    
    return &ConsolidationOpportunity{
        AppID:              appID,
        CurrentContracts:   contracts,
        ProposedGroupContract: GroupContractProposal{
            TotalUsers:    totalUsers,
            BasePrice:     basePrice,
            GroupDiscount: groupDiscount,
            FinalPrice:    finalPrice,
        },
        Savings:   savings,
        Rationale: rationale,
    }, nil
}
```

### 4.3 AI Memo Generation

```go
func (uc *MemoUsecase) GenerateMemo(
    ctx context.Context,
    consolidation *ConsolidationOpportunity,
) (string, error) {
    prompt := fmt.Sprintf(`
You are a strategic sourcing expert. Generate a professional business case memo.

TO: Subsidiary CTOs
FROM: Group CTO
RE: Software Consolidation Opportunity

Current State:
%s

Proposed Solution:
%s

Financial Impact:
- Current Cost: %.2f THB/year
- Proposed Cost: %.2f THB/year
- Savings: %.2f THB/year (%.1f%%)

Generate a memo with:
1. Executive Summary
2. Current State Analysis
3. Proposed Solution
4. Financial Impact
5. Implementation Plan
6. Risk Assessment
7. Recommendation

Output in Markdown format.
`, 
    formatCurrentState(consolidation.CurrentContracts),
    formatProposal(consolidation.ProposedGroupContract),
    consolidation.Savings.CurrentTotal,
    consolidation.Savings.ProposedTotal,
    consolidation.Savings.AnnualSavings,
    consolidation.Savings.SavingsPercent,
)
    
    response, err := uc.llmClient.CreateChatCompletion(ctx, llm.ChatRequest{
        Model: "gpt-4o",
        Messages: []llm.Message{
            {Role: "system", Content: "You are a strategic sourcing expert."},
            {Role: "user", Content: prompt},
        },
        Temperature: 0.5,
    })
    
    if err != nil {
        return "", err
    }
    
    return response.Content, nil
}
```

### 4.4 API Specification

#### POST /api/v1/memos/generate

Generate AI memo for consolidation opportunity.

**Request**
```json
{
  "consolidation_id": 123,
  "tone": "professional",
  "include_sections": [
    "executive_summary",
    "financial_impact",
    "implementation_plan",
    "recommendation"
  ]
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "memo_id": 456,
    "content_markdown": "# MEMORANDUM\n\n**TO**: Subsidiary CTOs...",
    "word_count": 850,
    "generated_at": "2025-10-21T10:45:00Z",
    "editable": true
  }
}
```

---

## 5. Feature 3: JD → License Matching (AI)

### 5.1 Overview

**Purpose**: Automatically recommend software licenses based on job description using AI.

**Priority**: ⭐ **HIGHEST** - MVP Feature

### 5.2 LLM Integration Architecture

```
┌─────────────────────────────────────────────────────┐
│              Feature 3: JD Matching Flow             │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1. User Input                                      │
│     ├─ Job Title                                     │
│     ├─ Job Description (min 50 chars)               │
│     ├─ Department                                    │
│     └─ Company Code                                  │
│                                                      │
│  2. Cache Check (Redis)                             │
│     └─ Key: md5(dept + jd_hash)                     │
│                                                      │
│  3. LLM Processing (if cache miss)                  │
│     ├─ Extract key skills                            │
│     ├─ Extract responsibilities                      │
│     ├─ Match to app catalog                          │
│     └─ Generate rationale per app                    │
│                                                      │
│  4. Fallback (if LLM fails)                         │
│     └─ Rule-based from recommendation_rules          │
│                                                      │
│  5. Response                                         │
│     ├─ Top 10 apps                                   │
│     ├─ Relevance scores (0-100)                      │
│     ├─ License tiers                                 │
│     └─ AI rationales                                 │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 5.3 Implementation

#### 5.3.1 Prompt Engineering

```go
func (uc *RecommendationUsecase) buildJDMatchPrompt(
    jd, title, dept, company string,
    apps []entities.App,
) string {
    appsJSON, _ := json.Marshal(apps)
    
    return fmt.Sprintf(`
You are an expert in enterprise software and job role analysis.

**Job Information:**
- Title: %s
- Department: %s
- Company: %s

**Job Description:**
%s

**Available Software Catalog:**
%s

**Task:**
Analyze the job requirements and recommend the most suitable software applications.

For each recommendation, provide:
1. app_id (from catalog)
2. app_name
3. recommended_tier (Free/Basic/Pro/Enterprise)
4. relevance_score (0-100, where 100 is perfect match)
5. rationale (1-2 sentences explaining why this app is needed)

**Scoring Criteria:**
- Direct mention in JD: +40 points
- Skill/tool alignment: +30 points
- Department standard: +20 points
- Industry best practice: +10 points

**Output Format:**
Return JSON array of top 10 recommendations, sorted by relevance_score descending.

Example:
[
  {
    "app_id": 101,
    "app_name": "GitHub Enterprise",
    "recommended_tier": "Pro",
    "relevance_score": 95,
    "rationale": "Required for code collaboration and version control. Job mentions 'CI/CD pipelines' and 'code review'."
  }
]
`,
        title, dept, company, jd, string(appsJSON),
    )
}
```

#### 5.3.2 Caching Strategy

```go
func (uc *RecommendationUsecase) JDMatchUsecase(
    ctx context.Context,
    jobDescription, jobTitle, department, companyCode string,
) ([]entities.Recommendation, error) {
    // 1. Generate cache key
    jdHash := md5.Sum([]byte(jobDescription))
    cacheKey := fmt.Sprintf("jd_match:%s:%x", department, jdHash)
    
    // 2. Check Redis cache
    cached, err := uc.cache.Get(ctx, cacheKey)
    if err == nil {
        var recommendations []entities.Recommendation
        json.Unmarshal([]byte(cached), &recommendations)
        log.Info("Cache hit for JD match", "key", cacheKey)
        return recommendations, nil
    }
    
    // 3. Get app catalog
    apps, err := uc.db.GetApps(ctx, map[string]interface{}{
        "status": "active",
    })
    if err != nil {
        return nil, err
    }
    
    // 4. Build prompt
    prompt := uc.buildJDMatchPrompt(jobDescription, jobTitle, department, companyCode, apps)
    
    // 5. Call LLM (with retry logic)
    var recommendations []entities.Recommendation
    maxRetries := 3
    for i := 0; i < maxRetries; i++ {
        llmResponse, err := uc.llmClient.CreateChatCompletion(ctx, llm.ChatRequest{
            Model: "gpt-4o",
            Messages: []llm.Message{
                {Role: "system", Content: "You are an expert in enterprise software."},
                {Role: "user", Content: prompt},
            },
            Temperature:    0.3,
            ResponseFormat: "json_object",
        })
        
        if err == nil {
            recommendations, err = uc.parseLLMRecommendations(llmResponse.Content)
            if err == nil {
                break
            }
        }
        
        if i == maxRetries-1 {
            // Final retry failed, use fallback
            log.Warn("LLM failed after retries, using rule-based fallback", "error", err)
            return uc.fallbackRuleBased(ctx, department, companyCode)
        }
        
        time.Sleep(time.Second * time.Duration(i+1)) // Exponential backoff
    }
    
    // 6. Enrich with pricing
    for i := range recommendations {
        price := uc.db.GetPrice(ctx, recommendations[i].AppID, recommendations[i].LicenseTier)
        recommendations[i].EstimatedCost = price
    }
    
    // 7. Save to database
    for _, rec := range recommendations {
        rec.RecType = "new_user"
        rec.Status = "pending"
        rec.GeneratedAt = time.Now()
        uc.db.CreateRecommendation(ctx, &rec)
    }
    
    // 8. Cache result (24 hours)
    cachedData, _ := json.Marshal(recommendations)
    uc.cache.Set(ctx, cacheKey, string(cachedData), 24*time.Hour)
    
    return recommendations, nil
}
```

### 5.4 API Specification

#### POST /api/v1/recommendations/jd-match

Generate license recommendations from job description.

**Request**
```json
{
  "job_title": "Senior Software Engineer",
  "job_description": "Responsible for building and maintaining microservices using Go and Python. Will work on API development, database optimization, and CI/CD pipelines. Requires experience with Docker, Kubernetes, and cloud platforms (AWS/Azure). Strong collaboration skills needed for code reviews and mentoring junior developers.",
  "department": "IT",
  "company_code": "DATAX",
  "new_hire_email": "john.doe@datax.com",
  "start_date": "2025-11-01"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "recommendation_id": "REC-2025-001234",
    "job_title": "Senior Software Engineer",
    "department": "IT",
    "confidence_score": 95,
    "total_estimated_cost": 48000,
    "recommendations": [
      {
        "app_id": 101,
        "app_name": "GitHub Enterprise",
        "app_key": "GITHUB",
        "category": "DevOps",
        "recommended_tier": "Pro",
        "relevance_score": 98,
        "rationale": "Essential for code collaboration, version control, and CI/CD workflows. Job description explicitly mentions 'code reviews' and 'CI/CD pipelines'.",
        "estimated_cost_annual": 10000,
        "features_matched": [
          "Git hosting",
          "Pull requests",
          "CI/CD (GitHub Actions)",
          "Code review"
        ]
      },
      {
        "app_id": 102,
        "app_name": "Jira Software",
        "app_key": "JIRA",
        "category": "Project Management",
        "recommended_tier": "Standard",
        "relevance_score": 92,
        "rationale": "Required for agile project management, sprint planning, and issue tracking. Standard for engineering teams.",
        "estimated_cost_annual": 6000,
        "features_matched": [
          "Scrum boards",
          "Sprint planning",
          "Issue tracking"
        ]
      },
      {
        "app_id": 103,
        "app_name": "Slack Enterprise",
        "app_key": "SLACK",
        "category": "Collaboration",
        "recommended_tier": "Enterprise",
        "relevance_score": 90,
        "rationale": "Primary communication tool for engineering teams. Supports channels, integrations, and huddles.",
        "estimated_cost_annual": 4000
      },
      {
        "app_id": 104,
        "app_name": "Postman",
        "app_key": "POSTMAN",
        "category": "DevOps",
        "recommended_tier": "Pro",
        "relevance_score": 88,
        "rationale": "API development and testing tool. Job mentions 'API development'.",
        "estimated_cost_annual": 5000
      },
      {
        "app_id": 105,
        "app_name": "Datadog",
        "app_key": "DATADOG",
        "category": "Observability",
        "recommended_tier": "Pro",
        "relevance_score": 85,
        "rationale": "APM and monitoring for microservices architecture. Job mentions 'microservices'.",
        "estimated_cost_annual": 8000
      }
    ],
    "generated_at": "2025-10-21T10:30:00Z",
    "cache_hit": false,
    "llm_model": "gpt-4o",
    "tokens_used": {
      "input": 1250,
      "output": 850,
      "total": 2100
    }
  },
  "meta": {
    "fallback_used": false,
    "processing_time_ms": 3500
  }
}
```

**Error Response**
```json
{
  "success": false,
  "error": {
    "code": "LLM_FAILED",
    "message": "LLM service unavailable, using rule-based recommendations",
    "fallback_used": true
  },
  "data": {
    "recommendations": [...]
  }
}
```

---

## 6. Feature 4: Purchase Template Management

### 6.1 Overview

**Purpose**: Enable managers to create reusable software templates for roles/departments.

**Business Value**: Standardize onboarding, reduce repetitive work by 70%.

### 6.2 Template Structure

```go
type PurchaseTemplate struct {
    ID          int64
    CompanyCode string
    Name        string
    Target      string // "department", "onboarding", "role"
    ScopeLevel  string
    ScopeRefID  int64
    Description string
    Version     int
    IsActive    bool
    CreatedBy   int64
    CreatedAt   time.Time
}

type PurchaseTemplateItem struct {
    ID          int64
    TemplateID  int64
    AppID       int64
    LicenseTier string
    Quantity    int
    IsRequired  bool
    IsEditable  bool
    CreatedAt   time.Time
}
```

### 6.3 Template Application Logic

```go
func (uc *TemplateUsecase) ApplyTemplate(
    ctx context.Context,
    templateID int64,
    userID int64,
    customizations map[int64]string, // app_id -> tier override
) (*entities.Request, error) {
    // 1. Get template
    template, err := uc.db.GetTemplate(ctx, templateID)
    if err != nil {
        return nil, err
    }
    
    // 2. Get template items
    items, err := uc.db.GetTemplateItems(ctx, templateID)
    if err != nil {
        return nil, err
    }
    
    // 3. Apply customizations
    requestItems := []entities.RequestItem{}
    for _, item := range items {
        tier := item.LicenseTier
        
        // Allow override if editable
        if item.IsEditable {
            if customTier, exists := customizations[item.AppID]; exists {
                tier = customTier
            }
        }
        
        requestItems = append(requestItems, entities.RequestItem{
            AppID:       item.AppID,
            LicenseTier: tier,
            Quantity:    1, // For single user
            Source:      "template",
            TemplateID:  templateID,
        })
    }
    
    // 4. Calculate total cost
    totalCost := 0.0
    for _, item := range requestItems {
        price := uc.db.GetPrice(ctx, item.AppID, item.LicenseTier)
        totalCost += price
    }
    
    // 5. Create request
    request := &entities.Request{
        Type:            "purchase",
        RequesterUserID: userID,
        ScopeLevel:      "user",
        ScopeRefID:      userID,
        Status:          "pending",
        PayloadJSON: map[string]interface{}{
            "template_id": templateID,
            "items":       requestItems,
            "total_cost":  totalCost,
        },
        CreatedAt: time.Now(),
    }
    
    err = uc.db.CreateRequest(ctx, request)
    if err != nil {
        return nil, err
    }
    
    // 6. Create approval steps
    err = uc.createApprovalSteps(ctx, request.ID, totalCost)
    if err != nil {
        return nil, err
    }
    
    return request, nil
}
```

### 6.4 API Specification

#### POST /api/v1/templates

Create new purchase template.

**Request**
```json
{
  "name": "Software Engineer - Backend",
  "description": "Standard tools for backend developers",
  "target": "onboarding",
  "scope_level": "department",
  "scope_ref_id": 123,
  "items": [
    {
      "app_id": 101,
      "license_tier": "Pro",
      "quantity": 1,
      "is_required": true,
      "is_editable": false
    },
    {
      "app_id": 102,
      "license_tier": "Standard",
      "quantity": 1,
      "is_required": true,
      "is_editable": true
    }
  ]
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "template_id": 456,
    "name": "Software Engineer - Backend",
    "status": "active",
    "total_apps": 8,
    "estimated_cost_per_user": 45000,
    "created_at": "2025-10-21T10:30:00Z"
  }
}
```

---

## 7. Feature 5: Seat Optimization with Reallocation

### 7.1 Overview

**Purpose**: Identify inactive/underutilized licenses and recommend revoke, downgrade, or reallocation.

**Business Value**: Reduce waste, maximize utilization, fulfill pending requests without new purchases.

### 7.2 Optimization Types

| Type | Description | Action | Impact |
|------|-------------|--------|--------|
| **Revoke** | License inactive 90+ days | Remove license | Cost savings |
| **Downgrade** | User on Pro, only uses Basic features | Move to lower tier | Cost savings |
| **Reallocate (Dept)** | Dept A has inactive, Dept B needs | Transfer within subsidiary | Fulfill demand |
| **Reallocate (Cross-Sub)** | Sub A has inactive, Sub B needs | Transfer between subsidiaries | Fulfill demand |

### 7.3 Reallocation Matching Algorithm

```go
type ReallocationOpportunity struct {
    ID                int64
    AppID             int64
    AppName           string
    SourceDepartment  string
    TargetDepartment  string
    SourceCompany     string
    TargetCompany     string
    InactiveUsers     []InactiveUser
    PendingRequests   []PendingRequest
    LicensesToTransfer int
    CostAvoided       float64
    CostSaved         float64
    TotalImpact       float64
    Priority          int // 1-5
    Rationale         string
}

type InactiveUser struct {
    UserID      int64
    UserName    string
    JobTitle    string
    LastActive  time.Time
    DaysInactive int
}

type PendingRequest struct {
    RequestID   int64
    UserID      int64
    UserName    string
    JobTitle    string
    RequestedAt time.Time
    Justification string
    Priority    string
}

func (uc *RecommendationUsecase) GenerateReallocationRecommendations(
    ctx context.Context,
    companyCode string,
) ([]ReallocationOpportunity, error) {
    opportunities := []ReallocationOpportunity{}
    
    // 1. Find all apps with inactive licenses
    inactiveLicenses := uc.findInactiveLicenses(ctx, companyCode, 90)
    
    // 2. Find all pending license requests
    pendingRequests := uc.findPendingRequests(ctx, companyCode)
    
    // 3. Group by app
    inactiveByApp := groupByApp(inactiveLicenses)
    requestsByApp := groupByApp(pendingRequests)
    
    // 4. Match opportunities
    for appID, inactive := range inactiveByApp {
        requests, hasRequests := requestsByApp[appID]
        if !hasRequests || len(requests) == 0 {
            continue // No pending requests, skip reallocation
        }
        
        // 5. Check contract scope compatibility
        sourceContract := uc.db.GetContractForLicense(ctx, inactive[0].LicenseID)
        canReallocate := uc.checkContractScope(ctx, sourceContract, requests[0].DepartmentCode)
        
        if !canReallocate {
            continue // Contract doesn't allow transfer
        }
        
        // 6. Calculate reallocation count
        transferCount := min(len(inactive), len(requests))
        
        // 7. Calculate impact
        annualCostPerLicense := uc.db.GetPrice(ctx, appID, inactive[0].LicenseTier)
        costAvoided := float64(transferCount) * annualCostPerLicense
        remainingInactive := len(inactive) - transferCount
        costSaved := float64(remainingInactive) * annualCostPerLicense
        
        // 8. Generate rationale (AI)
        rationale := uc.generateReallocationRationale(ctx, appID, inactive, requests)
        
        // 9. Calculate priority
        priority := uc.calculatePriority(costAvoided, costSaved, transferCount)
        
        opp := ReallocationOpportunity{
            AppID:             appID,
            AppName:           uc.getAppName(ctx, appID),
            SourceDepartment:  inactive[0].DepartmentCode,
            TargetDepartment:  requests[0].DepartmentCode,
            SourceCompany:     inactive[0].CompanyCode,
            TargetCompany:     requests[0].CompanyCode,
            InactiveUsers:     convertToInactiveUsers(inactive),
            PendingRequests:   convertToPendingRequests(requests),
            LicensesToTransfer: transferCount,
            CostAvoided:       costAvoided,
            CostSaved:         costSaved,
            TotalImpact:       costAvoided + costSaved,
            Priority:          priority,
            Rationale:         rationale,
        }
        
        opportunities = append(opportunities, opp)
    }
    
    // 10. Sort by priority (highest first)
    sort.Slice(opportunities, func(i, j int) bool {
        return opportunities[i].Priority > opportunities[j].Priority
    })
    
    return opportunities, nil
}

func (uc *RecommendationUsecase) ApplyReallocation(
    ctx context.Context,
    opportunityID int64,
    config ApplyConfig,
) error {
    // Start transaction
    tx, err := uc.db.BeginTx(ctx)
    if err != nil {
        return err
    }
    defer tx.Rollback()
    
    // 1. Get opportunity details
    opp, err := uc.db.GetReallocationOpportunity(ctx, opportunityID)
    if err != nil {
        return err
    }
    
    // 2. Revoke from source users
    for i := 0; i < opp.LicensesToTransfer; i++ {
        user := opp.InactiveUsers[i]
        
        // Update license_assignments (set revoked_at)
        err = tx.RevokeLicense(ctx, user.LicenseAssignmentID, "reallocation")
        if err != nil {
            return err
        }
        
        // Send notification (7-day notice)
        if config.NotifySourceUsers {
            uc.notification.Send(ctx, user.UserID, "license_revoke_notice", map[string]interface{}{
                "app_name": opp.AppName,
                "notice_days": 7,
                "reason": "license_reallocation",
            })
        }
    }
    
    // 3. Assign to target users
    for i := 0; i < opp.LicensesToTransfer; i++ {
        request := opp.PendingRequests[i]
        
        // Create license_assignments
        err = tx.AssignLicense(ctx, &entities.LicenseAssignment{
            UserID:           request.UserID,
            AppID:            opp.AppID,
            LicenseTier:      request.RequestedTier,
            AssignmentSource: "reallocation",
            AssignedAt:       time.Now().Add(7 * 24 * time.Hour), // 7 days from now
            Reason:           fmt.Sprintf("Reallocated from %s", opp.SourceDepartment),
        })
        if err != nil {
            return err
        }
        
        // Update request status
        err = tx.UpdateRequestStatus(ctx, request.RequestID, "fulfilled")
        if err != nil {
            return err
        }
        
        // Send notification
        uc.notification.Send(ctx, request.UserID, "license_assigned", map[string]interface{}{
            "app_name": opp.AppName,
            "effective_date": time.Now().Add(7 * 24 * time.Hour),
        })
    }
    
    // 4. Create recommendation record
    err = tx.CreateRecommendation(ctx, &entities.Recommendation{
        Type:           "reallocation",
        AppID:          opp.AppID,
        Action:         "reallocate",
        ImpactSavingAmt: opp.TotalImpact,
        Status:         "applied",
        AppliedAt:      timePtr(time.Now()),
    })
    if err != nil {
        return err
    }
    
    // 5. Create audit log
    tx.CreateAuditLog(ctx, &entities.AuditLog{
        Action:    "apply_reallocation",
        Entity:    "recommendations",
        EntityID:  opportunityID,
        DiffJSON:  map[string]interface{}{
            "transferred": opp.LicensesToTransfer,
            "cost_impact": opp.TotalImpact,
        },
    })
    
    // Commit transaction
    return tx.Commit()
}
```

### 7.4 API Specification

#### GET /api/v1/recommendations/seat-optimization/reallocation

Get all reallocation opportunities.

**Request**
```http
GET /api/v1/recommendations/seat-optimization/reallocation?company_code=DATAX
Authorization: Bearer <jwt_token>
```

**Response**
```json
{
  "success": true,
  "data": {
    "opportunities": [
      {
        "opportunity_id": 789,
        "app_id": 105,
        "app_name": "Tableau Pro",
        "priority": 5,
        "priority_label": "High",
        "source": {
          "department_code": "MKT",
          "department_name": "Marketing",
          "company_code": "DATAX",
          "inactive_licenses": 7,
          "inactive_days_avg": 120
        },
        "target": {
          "department_code": "ANALYTICS",
          "department_name": "Analytics",
          "company_code": "DATAX",
          "pending_requests": 2
        },
        "recommendation": {
          "action": "reallocate_and_revoke",
          "transfer_count": 2,
          "revoke_count": 5
        },
        "impact": {
          "cost_avoided": 20000,
          "cost_saved": 50000,
          "total_impact": 70000,
          "requests_fulfilled": 2
        },
        "rationale": "Marketing team has 7 Tableau licenses with no activity in 90+ days. Analytics team has 2 pending requests. Transfer 2 licenses to fulfill demand, revoke remaining 5 for cost savings.",
        "created_at": "2025-10-21T10:00:00Z"
      }
    ],
    "summary": {
      "total_opportunities": 15,
      "total_licenses_to_transfer": 28,
      "total_cost_avoided": 280000,
      "total_cost_saved": 450000,
      "total_impact": 730000
    }
  }
}
```

#### POST /api/v1/recommendations/seat-optimization/:id/apply

Apply optimization recommendation (revoke/reallocate/downgrade).

**Request**
```json
{
  "action": "reallocate_and_revoke",
  "config": {
    "notify_source_users": true,
    "notice_period_days": 7,
    "auto_assign_to_target": true,
    "send_manager_memo": true
  },
  "notes": "Approved by CTO - Marketing team confirmed low utilization"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "execution_id": "EXEC-2025-001",
    "status": "scheduled",
    "timeline": {
      "notification_sent": "2025-10-21T10:30:00Z",
      "revocation_date": "2025-10-28T00:00:00Z",
      "assignment_date": "2025-10-28T00:00:00Z"
    },
    "affected_users": {
      "source_users": 7,
      "target_users": 2
    },
    "impact": {
      "total_savings": 70000,
      "requests_fulfilled": 2
    }
  }
}
```

---

## 8. Feature 6: Pay-Per-Use Optimization

### 8.1 Overview

**Purpose**: Recommend switching from seat-based to pay-per-use pricing for low-frequency users.

**Business Value**: Save 70-90% for occasional users.

### 8.2 Cost Comparison Logic

```go
type PaygRecommendation struct {
    UserID            int64
    AppID             int64
    CurrentLicenseTier string
    CurrentAnnualCost  float64
    UsageFrequency    UsagePattern
    PaygEstimatedCost  float64
    AnnualSavings      float64
    SavingsPercent     float64
    Recommendation     string // "switch_to_payg" / "keep_seat"
    Rationale          string
}

type UsagePattern struct {
    EventsPer30Days   int
    AveragePerWeek    float64
    PeakMonth         string
    IsSeasonalUser    bool
}

func (uc *RecommendationUsecase) AnalyzePaygOpportunity(
    ctx context.Context,
    userID, appID int64,
) (*PaygRecommendation, error) {
    // 1. Get current license
    license := uc.db.GetUserLicense(ctx, userID, appID)
    currentCost := uc.db.GetPrice(ctx, appID, license.Tier)
    
    // 2. Analyze usage pattern (last 6 months)
    events := uc.db.GetUsageEvents(ctx, userID, appID, 180)
    pattern := uc.analyzeUsagePattern(events)
    
    // 3. Get pay-per-use pricing
    paygPrice := uc.db.GetPaygPrice(ctx, appID)
    
    // 4. Calculate estimated pay-per-use cost
    // Assume pattern continues for next 12 months
    estimatedAnnualEvents := pattern.EventsPer30Days * 12
    paygEstimatedCost := float64(estimatedAnnualEvents) * paygPrice
    
    // 5. Calculate savings
    savings := currentCost - paygEstimatedCost
    savingsPercent := (savings / currentCost) * 100
    
    // 6. Make recommendation
    recommendation := "keep_seat"
    if savingsPercent > 50 && !pattern.IsSeasonalUser {
        recommendation = "switch_to_payg"
    }
    
    // 7. Generate rationale
    rationale := fmt.Sprintf(
        "User has %d events/month (avg %.1f/week). "+
        "Seat cost: %.0f THB/year. PayG cost: %.0f THB/year. "+
        "Switching saves %.0f THB/year (%.1f%%).",
        pattern.EventsPer30Days,
        pattern.AveragePerWeek,
        currentCost,
        paygEstimatedCost,
        savings,
        savingsPercent,
    )
    
    return &PaygRecommendation{
        UserID:            userID,
        AppID:             appID,
        CurrentLicenseTier: license.Tier,
        CurrentAnnualCost:  currentCost,
        UsageFrequency:    pattern,
        PaygEstimatedCost:  paygEstimatedCost,
        AnnualSavings:      savings,
        SavingsPercent:     savingsPercent,
        Recommendation:     recommendation,
        Rationale:          rationale,
    }, nil
}
```

### 8.3 API Specification

#### GET /api/v1/recommendations/payg-optimization

Get pay-per-use optimization recommendations.

**Request**
```http
GET /api/v1/recommendations/payg-optimization?min_savings=10000
Authorization: Bearer <jwt_token>
```

**Response**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "user_id": 1234,
        "user_name": "John Doe",
        "app_id": 110,
        "app_name": "Postman Pro",
        "current_license_tier": "Pro",
        "current_annual_cost": 18000,
        "usage_pattern": {
          "events_per_30_days": 5,
          "average_per_week": 1.2,
          "peak_month": "March",
          "is_seasonal_user": false
        },
        "payg_estimated_cost": 2400,
        "annual_savings": 15600,
        "savings_percent": 87,
        "recommendation": "switch_to_payg",
        "rationale": "User has 5 API calls/month (avg 1.2/week). Seat cost: 18,000 THB/year. PayG cost: 2,400 THB/year. Switching saves 15,600 THB/year (87%).",
        "confidence": "high"
      }
    ],
    "summary": {
      "total_recommendations": 25,
      "total_potential_savings": 450000,
      "users_affected": 25
    }
  }
}
```

---

## 9. API Specifications

### 9.1 Base URL & Versioning

```
Base URL: https://asset-pulse.scb.co.th/api/v1
```

### 9.2 Authentication

All endpoints require JWT token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 9.3 Common Response Format

```json
{
  "success": true|false,
  "data": {...},
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  },
  "meta": {
    "timestamp": "2025-10-21T10:30:00Z",
    "request_id": "req_abc123",
    "page": 1,
    "per_page": 20,
    "total": 100
  }
}
```

### 9.4 Complete API Endpoints

#### Authentication
```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
POST   /api/v1/auth/refresh
```

#### Users
```
GET    /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
POST   /api/v1/users
DELETE /api/v1/users/:id
```

#### Applications
```
GET    /api/v1/apps
GET    /api/v1/apps/:id
GET    /api/v1/apps/:id/features
POST   /api/v1/apps
PUT    /api/v1/apps/:id
```

#### Licenses
```
GET    /api/v1/licenses/inventory
GET    /api/v1/licenses/assignments
POST   /api/v1/licenses/assign
DELETE /api/v1/licenses/revoke/:id
GET    /api/v1/licenses/users/:user_id
```

#### Recommendations (6 Features)
```
# Feature 3: JD Matching
POST   /api/v1/recommendations/jd-match
GET    /api/v1/recommendations/:id

# Feature 1: Cross-Sub Match
GET    /api/v1/recommendations/cross-sub-match
GET    /api/v1/recommendations/cross-sub-match/:app_id

# Feature 2: Consolidation
GET    /api/v1/recommendations/consolidation
GET    /api/v1/recommendations/consolidation/:id
POST   /api/v1/recommendations/consolidation/:id/accept

# Feature 5: Seat Optimization
GET    /api/v1/recommendations/seat-optimization
GET    /api/v1/recommendations/seat-optimization/reallocation
GET    /api/v1/recommendations/seat-optimization/:id/details
POST   /api/v1/recommendations/seat-optimization/:id/apply

# Feature 6: Pay-per-Use
GET    /api/v1/recommendations/payg-optimization
GET    /api/v1/recommendations/payg-optimization/:user_id
```

#### Templates (Feature 4)
```
GET    /api/v1/templates
GET    /api/v1/templates/:id
POST   /api/v1/templates
PUT    /api/v1/templates/:id
DELETE /api/v1/templates/:id
POST   /api/v1/templates/:id/apply
```

#### Requests & Approvals
```
GET    /api/v1/requests
GET    /api/v1/requests/:id
POST   /api/v1/requests
POST   /api/v1/requests/:id/approve
POST   /api/v1/requests/:id/reject
GET    /api/v1/requests/pending
```

#### Memos
```
POST   /api/v1/memos/generate
GET    /api/v1/memos/:id
PUT    /api/v1/memos/:id
POST   /api/v1/memos/:id/send
```

#### Analytics
```
GET    /api/v1/analytics/dashboard
GET    /api/v1/analytics/usage/:app_id
GET    /api/v1/analytics/costs
GET    /api/v1/analytics/savings
```

---

## 10. Database Architecture

### 10.1 Schema Overview

**Total Tables**: 30+
- **Organization**: orgs, companies, departments, roles, users, user_roles
- **Applications**: apps, app_features, app_feature_embeddings, app_similarity
- **Contracts**: vendors, contracts, contract_terms, contract_scopes
- **Licenses**: license_inventories, license_assignments, price_books
- **Usage**: usage_events
- **Recommendations**: job_profiles, user_job_profiles, recommendation_rules, recommendations
- **Templates**: purchase_templates, purchase_template_items
- **Workflow**: requests, request_steps, memos, notifications, audit_logs
- **Consolidation**: group_consolidation_opps

### 10.2 Key Relationships

```mermaid
erDiagram
    users ||--o{ license_assignments : has
    apps ||--o{ license_assignments : assigned
    users ||--o{ usage_events : generates
    apps ||--o{ usage_events : tracks
    apps ||--o{ app_features : has
    apps ||--o{ app_similarity : similar_to
    contracts ||--o{ contract_terms : contains
    contract_terms ||--o{ license_inventories : provides
    purchase_templates ||--o{ purchase_template_items : includes
    requests ||--o{ request_steps : has_approval
```

### 10.3 Indexing Strategy

```sql
-- Usage analytics queries
CREATE INDEX idx_usage_user_app_time ON usage_events(user_id, app_id, event_at DESC);
CREATE INDEX idx_usage_app_time ON usage_events(app_id, event_at DESC);
CREATE INDEX idx_usage_company_time ON usage_events(company_code, event_at DESC);

-- License lookups
CREATE INDEX idx_license_user_app ON license_assignments(user_id, app_id);
CREATE INDEX idx_license_status ON license_assignments(status) WHERE revoked_at IS NULL;
CREATE INDEX idx_license_active ON license_assignments(app_id, user_id) WHERE revoked_at IS NULL;

-- Recommendations
CREATE INDEX idx_rec_type_status ON recommendations(type, status);
CREATE INDEX idx_rec_target ON recommendations(target_level, target_ref_id, status);
CREATE INDEX idx_rec_priority ON recommendations(priority DESC, generated_at DESC);

-- App similarity (for Feature 1)
CREATE INDEX idx_app_sim_score ON app_similarity(method, score DESC);
CREATE INDEX idx_app_sim_apps ON app_similarity(app_a_id, app_b_id);

-- Requests & approvals
CREATE INDEX idx_requests_status ON requests(status, created_at DESC);
CREATE INDEX idx_requests_scope ON requests(scope_level, scope_ref_id, status);
CREATE INDEX idx_request_steps_approver ON request_steps(approver_user_id, status);
```

### 10.4 Partitioning Strategy

```sql
-- Partition usage_events by month (high-volume table)
CREATE TABLE usage_events (
    event_id BIGSERIAL,
    company_code VARCHAR(20),
    app_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    event_at TIMESTAMP NOT NULL,
    source VARCHAR(30),
    event_type VARCHAR(50),
    value_numeric NUMERIC,
    meta_json JSONB,
    PRIMARY KEY (event_id, event_at)
) PARTITION BY RANGE (event_at);

-- Create monthly partitions
CREATE TABLE usage_events_2025_10 PARTITION OF usage_events
    FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

CREATE TABLE usage_events_2025_11 PARTITION OF usage_events
    FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- Automated partition creation via cron job
```

---

## 11. Sequence Diagrams

### 11.1 Feature 3: JD Matching Complete Flow

```mermaid
sequenceDiagram
    actor HR as HR User
    participant FE as Frontend
    participant API as Backend API
    participant Auth as Auth Service
    participant Cache as Redis Cache
    participant LLM as Azure OpenAI
    participant DB as PostgreSQL
    participant Queue as Job Queue

    HR->>FE: Navigate to "New Hire"
    FE->>API: GET /auth/me (validate session)
    API->>Auth: Validate JWT
    Auth-->>API: User authorized (role: HR)
    API-->>FE: User profile

    Note over HR,FE: Step 1: Fill Form
    HR->>FE: Fill job details + JD
    FE->>FE: Client-side validation
    
    HR->>FE: Click "Get AI Recommendations"
    FE->>API: POST /recommendations/jd-match
    Note right of API: Request Body:<br/>{<br/>  job_title,<br/>  job_description,<br/>  department,<br/>  company_code<br/>}
    
    API->>Auth: Validate JWT
    Auth-->>API: Authorized
    
    Note over API,Cache: Check cache first
    API->>Cache: GET jd_match:IT:hash(jd)
    alt Cache Hit
        Cache-->>API: Cached recommendations
        API-->>FE: Return recommendations (fast)
    else Cache Miss
        Cache-->>API: null
        
        Note over API,DB: Fetch app catalog
        API->>DB: SELECT * FROM apps WHERE status='active'
        DB-->>API: Return 35 apps
        
        Note over API,LLM: Call LLM (with retry)
        API->>LLM: CreateChatCompletion<br/>Model: gpt-4o<br/>Prompt: JD match prompt
        
        alt LLM Success
            LLM-->>API: Recommendations + Rationale
            
            Note over API: Parse & enrich results
            loop For each recommendation
                API->>DB: Get price for (app_id, tier)
                DB-->>API: Annual cost
            end
            
            Note over API,DB: Save recommendations
            API->>DB: INSERT INTO recommendations
            DB-->>API: Saved
            
            Note over API,Cache: Cache for 24h
            API->>Cache: SET jd_match:IT:hash(jd), TTL=86400
            Cache-->>API: OK
            
        else LLM Failure (after retries)
            Note over API: Fallback to rule-based
            API->>DB: SELECT FROM recommendation_rules<br/>WHERE target='department'<br/>AND target_value='IT'
            DB-->>API: Rule-based recommendations
        end
        
        API-->>FE: Return recommendations
    end
    
    Note over HR,FE: Step 2: Review Recommendations
    FE->>HR: Display 10 recommended apps
    
    HR->>FE: Click "Why?" on GitHub
    FE->>FE: Show rationale modal
    
    HR->>FE: Remove DataDog
    FE->>FE: Update selection (client-side)
    
    HR->>FE: Add Confluence manually
    FE->>API: GET /apps/search?q=Confluence
    API->>DB: Search apps
    DB-->>API: Confluence found
    API-->>FE: App details
    FE->>HR: Show Confluence card
    HR->>FE: Add to pack
    
    Note over HR,FE: Step 3: Submit for Approval
    HR->>FE: Click "Submit for Approval"
    FE->>API: POST /requests
    Note right of API: Request Body:<br/>{<br/>  type: "purchase",<br/>  items: [...apps],<br/>  total_cost: 48000<br/>}
    
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT INTO requests
    DB-->>API: request_id = 1234
    
    Note over API: Create approval workflow
    API->>DB: INSERT INTO request_steps<br/>(step 1: Dept Manager)
    API->>DB: INSERT INTO request_steps<br/>(step 2: Finance, if >10k)
    DB-->>API: Steps created
    
    Note over API: Send notifications
    API->>Queue: Enqueue notification job
    Queue->>DB: Get approver email
    Queue->>Queue: Send email to manager
    
    API->>DB: COMMIT
    API-->>FE: Request created successfully
    
    FE->>HR: Show confirmation page
    Note over HR: Request ID: REQ-2025-001234<br/>Status: Pending Approval<br/>Approver: David (IT Manager)<br/>SLA: 3 days
```

### 11.2 Feature 5: Reallocation Approval Flow

```mermaid
sequenceDiagram
    actor CTO as Subsidiary CTO
    participant FE as Frontend
    participant API as Backend API
    participant DB as PostgreSQL
    participant NotifSvc as Notification Service
    participant AuditSvc as Audit Service

    Note over CTO,FE: Daily scheduled job runs
    API->>DB: Generate reallocation recommendations
    DB-->>API: 15 opportunities found
    API->>DB: Save recommendations
    
    Note over CTO,API: CTO logs in
    CTO->>FE: Open "Seat Optimization"
    FE->>API: GET /recommendations/seat-optimization?type=reallocation
    API->>DB: SELECT * FROM recommendations<br/>WHERE type='reallocation'<br/>AND status='pending'
    DB-->>API: 15 recommendations
    API-->>FE: Return opportunities
    
    FE->>CTO: Display list (sorted by priority)
    
    CTO->>FE: Click opportunity #1 (Tableau)
    FE->>API: GET /recommendations/789/details
    API->>DB: Get full details (users, requests)
    DB-->>API: Source: 7 inactive users<br/>Target: 2 pending requests
    API-->>FE: Return detailed breakdown
    
    FE->>CTO: Show detail view:<br/>- Left: Inactive users list<br/>- Right: Pending requests list<br/>- Impact: 70k THB savings
    
    CTO->>FE: Review details
    CTO->>FE: Click "Approve Reallocation"
    
    FE->>API: POST /recommendations/789/apply
    Note right of API: Request Body:<br/>{<br/>  action: "reallocate_and_revoke",<br/>  notify_users: true,<br/>  notice_period_days: 7<br/>}
    
    API->>DB: BEGIN TRANSACTION
    
    Note over API,DB: Step 1: Revoke from source
    loop For each inactive user (7 users)
        API->>DB: UPDATE license_assignments<br/>SET revoked_at = now() + 7 days,<br/>    reason = 'reallocation'<br/>WHERE user_id = ?
        DB-->>API: Updated
        
        API->>NotifSvc: Send revocation notice
        NotifSvc->>DB: INSERT notification
        NotifSvc->>NotifSvc: Send email (7-day notice)
    end
    
    Note over API,DB: Step 2: Assign to target
    loop For each pending request (2 requests)
        API->>DB: INSERT INTO license_assignments<br/>(user_id, app_id, tier, assigned_at)<br/>VALUES (?, ?, ?, now() + 7 days)
        DB-->>API: Created
        
        API->>DB: UPDATE requests<br/>SET status = 'fulfilled'<br/>WHERE id = ?
        DB-->>API: Updated
        
        API->>NotifSvc: Send assignment notification
        NotifSvc->>DB: INSERT notification
        NotifSvc->>NotifSvc: Send email (license assigned)
    end
    
    Note over API,DB: Step 3: Update recommendation
    API->>DB: UPDATE recommendations<br/>SET status = 'applied',<br/>    applied_at = now(),<br/>    saving_verified_amt = 70000<br/>WHERE id = 789
    DB-->>API: Updated
    
    Note over API: Step 4: Create audit log
    API->>AuditSvc: Log reallocation action
    AuditSvc->>DB: INSERT INTO audit_logs
    DB-->>API: Logged
    
    API->>DB: COMMIT TRANSACTION
    API-->>FE: Success response
    
    FE->>CTO: Show confirmation:<br/>"Reallocation scheduled<br/>Effective: 2025-10-28<br/>Users notified: 9<br/>Savings: 70,000 THB/year"
    
    Note over CTO,NotifSvc: 7 days later (automated)
    NotifSvc->>DB: Check scheduled revocations/assignments
    DB-->>NotifSvc: Today: 7 revoke, 2 assign
    NotifSvc->>DB: Execute revocations
    NotifSvc->>DB: Execute assignments
    NotifSvc->>NotifSvc: Send final notifications
```

---

## 12. Component Architecture

### 12.1 Backend Components

```
asset-pulse-api/
├── cmd/
│   ├── api/              # Main API server
│   └── worker/           # Background job worker
├── internal/
│   ├── domain/           # Business entities
│   ├── usecase/          # Business logic
│   ├── repository/       # Data access
│   ├── handler/          # HTTP handlers
│   └── middleware/       # HTTP middleware
├── pkg/
│   ├── llm/              # LLM client (OpenAI)
│   ├── cache/            # Redis client
│   ├── logger/           # Logging
│   └── errors/           # Error handling
└── configs/              # Configuration
```

### 12.2 Frontend Components

```
asset-pulse-web/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── (auth)/       # Auth pages
│   │   ├── (dashboard)/  # Dashboard pages
│   │   └── api/          # API routes
│   ├── components/       # React components
│   │   ├── ui/           # UI primitives
│   │   ├── features/     # Feature components
│   │   └── layouts/      # Layouts
│   ├── lib/              # Utilities
│   │   ├── api/          # API client
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Helper functions
│   └── types/            # TypeScript types
└── public/               # Static assets
```

---

## 13. Integration Points

### 13.1 Azure AD / Entra ID Integration

```go
// OAuth 2.0 / OIDC flow
func (uc *AuthUsecase) AzureADLogin(ctx context.Context, code string) (*entities.User, string, error) {
    // 1. Exchange code for token
    token, err := uc.azureClient.ExchangeCodeForToken(ctx, code)
    if err != nil {
        return nil, "", err
    }
    
    // 2. Get user profile from Azure AD
    profile, err := uc.azureClient.GetUserProfile(ctx, token.AccessToken)
    if err != nil {
        return nil, "", err
    }
    
    // 3. Find or create user in our database
    user, err := uc.db.FindUserByEntraID(ctx, profile.EntraID)
    if err == sql.ErrNoRows {
        // Create new user
        user = &entities.User{
            EntraID:      profile.EntraID,
            Email:        profile.Email,
            DisplayName:  profile.DisplayName,
            CompanyCode:  extractCompanyFromEmail(profile.Email),
            Status:       "active",
        }
        err = uc.db.CreateUser(ctx, user)
        if err != nil {
            return nil, "", err
        }
    }
    
    // 4. Generate our JWT
    jwtToken, err := uc.jwt.GenerateToken(user)
    if err != nil {
        return nil, "", err
    }
    
    return user, jwtToken, nil
}
```

### 13.2 Azure OpenAI Service Integration

```go
// LLM client configuration
type OpenAIClient struct {
    client   *openai.Client
    cache    *redis.Client
    config   *Config
}

type Config struct {
    APIKey           string
    Endpoint         string
    DeploymentName   string // "gpt-4o"
    MaxTokens        int    // 4096
    Temperature      float32 // 0.3
    MaxRetries       int    // 3
    TimeoutSeconds   int    // 30
}

func NewOpenAIClient(cfg *Config, cache *redis.Client) *OpenAIClient {
    config := openai.DefaultConfig(cfg.APIKey)
    config.BaseURL = cfg.Endpoint // Azure OpenAI endpoint
    
    return &OpenAIClient{
        client: openai.NewClientWithConfig(config),
        cache:  cache,
        config: cfg,
    }
}

func (c *OpenAIClient) CreateChatCompletion(
    ctx context.Context,
    req ChatRequest,
) (*ChatResponse, error) {
    // Implement with retry logic, caching, token tracking
    ...
}
```

### 13.3 Redis Cache Integration

```go
type CacheClient struct {
    client *redis.Client
}

func NewCacheClient(addr, password string) *CacheClient {
    return &CacheClient{
        client: redis.NewClient(&redis.Options{
            Addr:     addr,
            Password: password,
            DB:       0,
        }),
    }
}

func (c *CacheClient) Get(ctx context.Context, key string) (string, error) {
    return c.client.Get(ctx, key).Result()
}

func (c *CacheClient) Set(ctx context.Context, key string, value string, ttl time.Duration) error {
    return c.client.Set(ctx, key, value, ttl).Err()
}

func (c *CacheClient) Delete(ctx context.Context, key string) error {
    return c.client.Del(ctx, key).Err()
}
```

---

## 14. Security Specifications

### 14.1 Authentication Flow

```
1. User → Frontend: Navigate to /login
2. Frontend → Azure AD: Redirect to OAuth consent
3. User → Azure AD: Approve consent
4. Azure AD → Frontend: Redirect with auth code
5. Frontend → Backend: POST /auth/azure-callback {code}
6. Backend → Azure AD: Exchange code for token
7. Azure AD → Backend: Return access token + profile
8. Backend → Database: Find/create user
9. Backend → Backend: Generate JWT
10. Backend → Frontend: Return JWT + user profile
11. Frontend → LocalStorage: Store JWT
12. Frontend → User: Redirect to dashboard
```

### 14.2 Authorization Matrix

| Role | Dashboard | Recommendations | Templates | Approvals | Analytics |
|------|-----------|----------------|-----------|-----------|-----------|
| **Employee** | Own | View own | - | View own | - |
| **HR** | All employees | Create for new hire | - | Submit | - |
| **Dept Manager** | Team | View team | Create/Edit | Approve L1 | Team |
| **Subsidiary CTO** | Subsidiary | All types | View all | Approve L2 | Subsidiary |
| **Group CTO** | Group | All types | View all | Approve L3 | Group |

### 14.3 API Rate Limiting

```go
// Rate limiting middleware
func RateLimitMiddleware(limit int, window time.Duration) fiber.Handler {
    return func(c *fiber.Ctx) error {
        userID := c.Locals("user_id").(int64)
        key := fmt.Sprintf("ratelimit:%d", userID)
        
        count, err := cache.Incr(c.Context(), key)
        if err != nil {
            return err
        }
        
        if count == 1 {
            cache.Expire(c.Context(), key, window)
        }
        
        if count > int64(limit) {
            return c.Status(429).JSON(fiber.Map{
                "error": "Rate limit exceeded",
                "retry_after": window.Seconds(),
            })
        }
        
        return c.Next()
    }
}

// Apply to routes
app.Use("/api/v1/recommendations/jd-match", 
    RateLimitMiddleware(10, time.Hour), // 10 requests per hour
)
```

---

## 15. Testing Strategy

### 15.1 Unit Tests

```go
// Example: Recommendation usecase test
func TestJDMatchUsecase(t *testing.T) {
    // Setup
    mockDB := new(MockDatabaseRepository)
    mockLLM := new(MockLLMClient)
    mockCache := new(MockCacheClient)
    
    uc := NewRecommendationUsecase(mockDB, mockLLM, mockCache)
    
    // Mock data
    apps := []entities.App{
        {ID: 1, Name: "GitHub", Category: "DevOps"},
        {ID: 2, Name: "Jira", Category: "Project Management"},
    }
    mockDB.On("GetApps", mock.Anything, mock.Anything).Return(apps, nil)
    
    llmResponse := `[
        {"app_id": 1, "app_name": "GitHub", "recommended_tier": "Pro", "relevance_score": 95}
    ]`
    mockLLM.On("CreateChatCompletion", mock.Anything, mock.Anything).Return(&ChatResponse{
        Content: llmResponse,
    }, nil)
    
    mockCache.On("Get", mock.Anything, mock.Anything).Return("", redis.Nil)
    mockCache.On("Set", mock.Anything, mock.Anything, mock.Anything, mock.Anything).Return(nil)
    
    // Execute
    recommendations, err := uc.JDMatchUsecase(context.Background(), 
        "Job description...",
        "Software Engineer",
        "IT",
        "DATAX",
    )
    
    // Assert
    assert.NoError(t, err)
    assert.Len(t, recommendations, 1)
    assert.Equal(t, int64(1), recommendations[0].AppID)
    assert.Equal(t, "Pro", recommendations[0].LicenseTier)
    
    mockDB.AssertExpectations(t)
    mockLLM.AssertExpectations(t)
    mockCache.AssertExpectations(t)
}
```

### 15.2 Integration Tests

```go
func TestJDMatchIntegration(t *testing.T) {
    // Setup test database
    db := setupTestDB(t)
    defer cleanupTestDB(t, db)
    
    // Setup test server
    app := setupTestApp(t, db)
    
    // Create test data
    createTestApps(t, db)
    
    // Make request
    reqBody := map[string]interface{}{
        "job_title": "Software Engineer",
        "job_description": "Build APIs with Go...",
        "department": "IT",
        "company_code": "DATAX",
    }
    
    resp := makeRequest(t, app, "POST", "/api/v1/recommendations/jd-match", reqBody)
    
    // Assert
    assert.Equal(t, 200, resp.StatusCode)
    
    var result map[string]interface{}
    json.Unmarshal(resp.Body, &result)
    
    assert.True(t, result["success"].(bool))
    assert.NotNil(t, result["data"])
}
```

### 15.3 E2E Tests (Frontend)

```typescript
// Playwright E2E test
test('HR can create new hire request with AI recommendations', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'hr@datax.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  // Navigate to new hire form
  await page.click('text=New Hire');
  await expect(page).toHaveURL('/requests/new-hire');
  
  // Fill form
  await page.fill('input[name="job_title"]', 'Software Engineer');
  await page.fill('textarea[name="job_description"]', 'Build APIs...');
  await page.selectOption('select[name="department"]', 'IT');
  
  // Get recommendations
  await page.click('button:has-text("Get AI Recommendations")');
  
  // Wait for recommendations
  await page.waitForSelector('[data-testid="recommendation-card"]');
  
  // Verify recommendations loaded
  const recommendations = await page.locator('[data-testid="recommendation-card"]').count();
  expect(recommendations).toBeGreaterThan(0);
  
  // Submit
  await page.click('button:has-text("Submit for Approval")');
  
  // Verify success
  await expect(page).toHaveURL(/\/requests\/confirmation/);
  await expect(page.locator('text=Request submitted successfully')).toBeVisible();
});
```

---

## Appendix A: Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `AUTH_INVALID_TOKEN` | JWT token invalid or expired | 401 |
| `AUTH_INSUFFICIENT_PERMISSIONS` | User lacks required permissions | 403 |
| `LLM_FAILED` | LLM API call failed | 500 |
| `LLM_TIMEOUT` | LLM request timeout | 504 |
| `DB_CONNECTION_FAILED` | Database connection error | 500 |
| `VALIDATION_FAILED` | Input validation error | 400 |
| `RESOURCE_NOT_FOUND` | Requested resource not found | 404 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `CONTRACT_SCOPE_INVALID` | Reallocation not allowed by contract | 400 |

---

## Appendix B: Environment Variables

```bash
# Backend API
APP_ENV=production
APP_PORT=8080
LOG_LEVEL=info

# Database
DB_HOST=asset-pulse-postgres-prod.postgres.database.azure.com
DB_PORT=5432
DB_NAME=asset_pulse_prod
DB_USER=postgres
DB_PASSWORD=<secret>
DB_SSL_MODE=require
DB_MAX_CONNECTIONS=50

# Redis
REDIS_HOST=asset-pulse-redis-prod.redis.cache.windows.net
REDIS_PORT=6380
REDIS_PASSWORD=<secret>
REDIS_SSL=true

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://asset-pulse-openai.openai.azure.com/
AZURE_OPENAI_API_KEY=<secret>
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2023-12-01-preview

# Azure AD
AZURE_AD_TENANT_ID=<tenant-id>
AZURE_AD_CLIENT_ID=<client-id>
AZURE_AD_CLIENT_SECRET=<secret>
AZURE_AD_REDIRECT_URI=https://asset-pulse.scb.co.th/auth/callback

# JWT
JWT_SECRET=<secret>
JWT_EXPIRATION=8h

# Feature Flags
FEATURE_JD_MATCHING_ENABLED=true
FEATURE_REALLOCATION_ENABLED=true
FEATURE_CROSS_SUB_MATCH_ENABLED=true
FEATURE_CONSOLIDATION_ENABLED=true

# Monitoring
APPINSIGHTS_INSTRUMENTATION_KEY=<key>
SENTRY_DSN=<dsn>
```

---

## Document Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Solution Architect | __________ | __________ | __________ |
| Technical Lead | __________ | __________ | __________ |
| Backend Lead | __________ | __________ | __________ |
| Frontend Lead | __________ | __________ | __________ |
| QA Lead | __________ | __________ | __________ |
| CTO | __________ | __________ | __________ |

---

**End of Technical Specification Document v1.0**
