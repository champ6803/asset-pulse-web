# Asset Pulse - Requirements Specification

## Document Information

- **Application Name**: Asset Pulse
- **Version**: 2.3
- **Date**: October 21, 2025
- **Organization**: SCBX Group

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Core Features](#2-core-features)
3. [User Roles & Workflows](#3-user-roles--workflows)
4. [AI/LLM Integration](#4-aillm-integration)
5. [Data Model](#5-data-model)
6. [Technical Architecture](#6-technical-architecture)
7. [Business Rules](#7-business-rules)
8. [Glossary](#8-glossary)

---

## 1. Executive Summary

**Asset Pulse** is an AI-powered Software Asset Management (SAM) platform designed to optimize software licensing costs across SCBX Group and its 25+ subsidiaries. The system leverages Large Language Models (LLM) and AI to provide intelligent recommendations for license optimization, cost savings, and automated provisioning.

### 1.1 Business Objectives

- **Cost Optimization**: Reduce software licensing costs by 20-30% through AI-powered optimization
- **Smart Recommendations**: Use LLM to match job descriptions with appropriate software licenses
- **Cross-Subsidiary Intelligence**: Identify duplicate applications and consolidation opportunities across subsidiaries
- **Automated Onboarding**: Streamline new employee software provisioning with AI recommendations
- **Usage-Based Optimization**: Optimize seat allocation and pay-per-use contracts based on actual usage

### 1.2 System Scope

- **Organization**: SCBX Group with 25+ subsidiaries (SCB, SCBAM, INVX, etc.)
- **Applications**: 35+ enterprise applications (Jira, Slack, Microsoft 365, GitHub, etc.)
- **Users**: Thousands of employees across multiple departments
- **Database**: PostgreSQL with usage tracking and contract management

---

## 2. Core Features

Asset Pulse is built around **6 core optimization features**, all powered by AI and data analytics:

### 2.1 Feature 1: Cross-Subsidiary Software Match

**Purpose**: Identify duplicate or similar applications across subsidiaries to enable consolidation

**How it works**:
- Analyze application features and capabilities across all subsidiaries
- Use **LLM to compare software descriptions** and identify similar tools
- Calculate similarity scores using feature overlap analysis (Jaccard index + semantic similarity)
- Recommend closest matching software in the catalog

**Example Use Case**:
- Subsidiary A uses "Asana" for project management
- Subsidiary B uses "Monday.com" for project management  
- System identifies 85% feature overlap and recommends consolidating to one platform

**AI/LLM Role**: 
- Semantic analysis of application descriptions and features
- Natural language comparison of software capabilities
- Generate human-readable rationale for similarity matches

**Database Tables Used**:
- `apps` - Application catalog
- `app_features` - Feature definitions
- `app_similarity` - Pre-calculated similarity scores
- `license_assignments` - Current usage per subsidiary

**Output**:
- List of similar applications across subsidiaries
- Similarity scores and rationale
- Potential consolidation opportunities

---

### 2.2 Feature 2: Group Contract Consolidation Recommendations

**Purpose**: Recommend cost savings by consolidating multiple subsidiary contracts into group-wide agreements

**How it works**:
- Aggregate usage and spending across all subsidiaries for each application
- Calculate current total cost vs. potential group pricing
- Use **AI to analyze contract terms** and identify consolidation opportunities
- Generate business case with estimated savings

**Example Use Case**:
- 5 subsidiaries each pay 100,000 THB/year for Slack (total: 500,000 THB)
- Group contract would cost 350,000 THB/year
- System recommends consolidation with 150,000 THB (30%) savings

**AI/LLM Role**:
- Analyze contract terms and pricing models
- Generate savings projections and business justification
- Create memo/proposal text for stakeholder approval

**Database Tables Used**:
- `contracts` - Current contracts per subsidiary
- `contract_terms` - Pricing and seat information
- `license_inventories` - Available licenses
- `group_consolidation_opps` - Track consolidation recommendations

**Output**:
- Consolidation opportunities ranked by savings
- Business case memo with AI-generated rationale
- Approval workflow for Group CTO/Finance

---

### 2.3 Feature 3: New User Software Recommendations (Job Description Matching)

**Purpose**: Automatically recommend software licenses for new employees based on their job description and organization

**How it works**:
- HR provides new hire information (job title, description, department)
- **LLM analyzes job description** to extract required skills and responsibilities
- Match against software catalog using semantic understanding
- Recommend software pack based on job profile + department templates + peer patterns

**Example Use Case**:
- New hire: "Senior Software Engineer - Backend Development"
- Job description mentions: "microservices, API development, CI/CD, code review"
- System recommends: GitHub Enterprise, Jira, Slack, Postman, DataDog

**AI/LLM Role** (PRIMARY USE CASE):
- Parse and understand job descriptions in natural language
- Extract key responsibilities, skills, and tool requirements
- Match job requirements to software capabilities
- Generate personalized recommendation rationale

**Database Tables Used**:
- `job_profiles` - Standard job profiles
- `recommendation_rules` - Rule-based recommendations
- `purchase_templates` - Department templates
- `license_assignments` - Peer usage patterns
- `apps` - Application catalog

**Output**:
- Ranked list of recommended applications with license tiers
- AI-generated explanation for each recommendation
- Software pack ready for HR approval and provisioning

**Target**: Production-ready for HR onboarding workflow (as per flowchart)

---

### 2.4 Feature 4: Department Purchase Template Management

**Purpose**: Enable Department Managers to create reusable software templates for common roles

**How it works**:
- Department Manager creates template (e.g., "Engineering Onboarding", "Marketing Team")
- Defines software applications + license tiers + quantity
- Template can be applied to new hires or bulk requests
- Templates can be edited, versioned, and shared

**Example Use Case**:
- Marketing Department creates "Marketing Analyst Template"
- Includes: Google Analytics, Tableau, Slack, Microsoft 365
- When new Marketing Analyst joins, HR applies this template
- Template items can be customized before approval

**AI/LLM Role**:
- Suggest template contents based on department usage patterns
- Recommend updates to templates based on new trends

**Database Tables Used**:
- `purchase_templates` - Template definitions
- `purchase_template_items` - Applications in each template
- `departments` - Department information
- `apps` - Application catalog

**Output**:
- Template library for department managers
- One-click software pack selection
- Version history and audit trail

---

### 2.5 Feature 5: License Seat Optimization

**Purpose**: Identify inactive or underutilized licenses and recommend optimization actions including revocation, downgrade, or reallocation across departments/subsidiaries

**How it works**:
- Track application usage events (sign-ins, activity)
- Identify users with no activity in last 30/60/90 days
- Analyze license utilization by department and subsidiary
- Calculate cost of inactive licenses
- **Identify transfer opportunities**: departments with unused licenses vs. departments with pending requests
- Generate recommendations to revoke, downgrade, or **reallocate licenses**

**Example Use Case 1: Revoke Inactive License**
- User has Figma Pro license (5,000 THB/year)
- Last sign-in was 90 days ago
- System recommends revoking license → saves 5,000 THB/year

**Example Use Case 2: Reallocate Across Departments** ⭐ NEW
- **Department A (Marketing)**: Has 10 Tableau Pro licenses, only 3 actively used (7 inactive)
- **Department B (Analytics)**: Has 2 pending requests for Tableau Pro
- System recommends: 
  - Revoke 5 inactive licenses from Department A
  - Transfer 2 licenses to Department B (fulfill pending requests)
  - Total: 3 licenses saved, 2 reallocated → 5,000 THB/year savings

**Example Use Case 3: Cross-Subsidiary Reallocation** ⭐ NEW
- **Subsidiary A (SCB Data X)**: Has 20 GitHub Enterprise licenses, only 12 actively used
- **Subsidiary B (SCB TechX)**: Needs 5 additional GitHub Enterprise licenses (contract at capacity)
- System recommends:
  - Transfer 5 inactive licenses from Subsidiary A to Subsidiary B
  - Avoid new contract purchase → saves 50,000 THB/year

**Optimization Actions**:
1. **Revoke**: Remove license from inactive user → cost savings
2. **Downgrade**: Move user to lower tier (Pro → Standard) → cost savings
3. **Reallocate - Department**: Transfer license to another department in same subsidiary → fulfill demand, no new purchase
4. **Reallocate - Subsidiary**: Transfer license to another subsidiary (if contract scope allows) → maximize utilization
5. **Keep**: User has seasonal pattern or critical role

**AI/LLM Role**:
- Analyze usage patterns to distinguish inactive vs. seasonal users
- Generate contextual recommendations (e.g., "User may be on extended leave")
- Identify optimal reallocation matches based on:
  - Pending requests by department/subsidiary
  - Job profile similarity (reallocate to users with similar needs)
  - Contract scope constraints
- Prioritize recommendations by impact (savings + fulfillment)

**Database Tables Used**:
- `license_assignments` - Assigned licenses
- `usage_events` - Activity tracking
- `requests` - Pending license requests by department/subsidiary
- `recommendations` - Generated optimization suggestions
- `contract_terms` - Pricing information
- `contract_scopes` - Contract coverage (group/subsidiary/department)
- `departments` - Department information
- `companies` - Subsidiary information

**Output**:
- **Revocation List**: Inactive licenses with estimated savings
- **Reallocation Matrix**: Source department/subsidiary → Target department/subsidiary
  - License details
  - Reason (inactive user → pending request)
  - Impact (cost avoided, request fulfilled)
- **Priority Score**: Based on savings + demand urgency
- **Approval Workflow**: Manager approval for reallocation (notify both source and target users)

**API Endpoints**:
- `GET /recommendations/seat-optimization` - Get all optimization recommendations
- `GET /recommendations/seat-optimization/reallocation` - Get reallocation-specific recommendations
- `POST /recommendations/seat-optimization/:id/apply` - Apply recommendation (revoke/reallocate/downgrade)

---

### 2.6 Feature 6: Pay-Per-Use Optimization

**Purpose**: Recommend switching from seat-based to pay-per-use pricing for low-frequency users

**How it works**:
- Analyze usage frequency and patterns
- Compare seat cost vs. pay-per-use cost based on actual usage
- Identify users who would be cheaper on usage-based pricing
- Calculate potential savings from switching pricing models

**Example Use Case**:
- User has Postman Pro seat-based license: 1,500 THB/month (18,000 THB/year)
- Usage: 5 API calls per month
- Pay-per-use cost would be: 200 THB/month (2,400 THB/year)
- System recommends switching → saves 15,600 THB/year (87% savings)

**AI/LLM Role**:
- Predict future usage patterns based on historical trends
- Recommend optimal pricing model per user

**Database Tables Used**:
- `license_assignments` - Current seat-based licenses
- `usage_events` - Usage activity
- `contract_terms` - Pricing models
- `price_books` - Pay-per-use pricing

**Output**:
- List of users suitable for pay-per-use model
- Break-even analysis and savings projections
- Recommendations with risk assessment

---

## 3. User Roles & Workflows

Based on the system flowchart, Asset Pulse supports **4 primary user roles** with distinct workflows:

### 3.1 Role 1: Employee/HR

**Responsibilities**:
- Request software access for self or new hires
- View assigned licenses
- Apply onboarding templates

**Key Workflow** (from flowchart):
1. Login → Select Role: Employee/HR
2. **New Hire / Onboarding**
3. **Recommend Software Pack** (AI/LLM powered - Feature 3)
4. Select Software Pack
5. Pack present and allow edit
6. Confirm → **Approval Software Pack** (route to Department Manager)
7. If approved → Notification and show summary → End
8. If not approved → Disapproval notification → End

**Permissions**:
- View own licenses
- Request licenses
- View recommendations
- Apply templates (HR only)

---

### 3.2 Role 2: Department Manager

**Responsibilities**:
- Create and manage department purchase templates
- Approve license requests from team members
- View team usage and cost

**Key Workflow** (from flowchart):
1. Login → Select Role: Department Manager
2. **New Department Setup**
3. **Recommend Purchase Template / Software Lists** (AI-suggested)
4. Select Template
5. Template present and allow edit
6. **Approval Software Pack**
7. If approved → Notification and show summary → End
8. If not approved → Disapproval notification → End

**Permissions**:
- Create/edit department templates (Feature 4)
- Approve team license requests (1st level approval)
- View team usage analytics
- View seat optimization recommendations (Feature 5)

---

### 3.3 Role 3: Subsidiary CTO

**Responsibilities**:
- Manage application licenses at subsidiary level
- Review and approve purchase templates
- Optimize licenses within subsidiary
- Approve license requests

**Key Workflow** (from flowchart):
1. Login → Select Role: Subsidiary CTO
2. **Select Scope**: App/Department/Subsidiary
3. **Approval Template** (review templates from Department Managers)
4. If confirmed → Yes → (continue to next flow)
5. If not confirmed → No → loop back
6. **Approved?** decision
7. If Yes → Notification and show summary → End
8. If No → Disapproval notification → End

**Additional Workflows**:
- **Detect Low-frequency Users** (Feature 5 & 6)
- **Analyze Unutilization** (seat optimization)

**Permissions**:
- Approve purchase requests (2nd level approval)
- View subsidiary-wide analytics
- Access seat optimization recommendations (Feature 5)
- Access pay-per-use recommendations (Feature 6)
- Approve consolidation within subsidiary

---

### 3.4 Role 4: Group CTO / Finance Manager

**Responsibilities**:
- Group-wide license strategy and optimization
- Cross-subsidiary software matching and consolidation
- Approve high-value purchases
- Cost management and budgeting

**Key Workflow** (from flowchart):
1. Login → Select Role: Group CTO / Finance Manager
2. **Select Scope**: Subsidiary/Group
3. **Groups Purchasing / AAD Log**
4. **Similar Software** (Feature 1: Cross-subsidiary matching)
5. **IsGroupLevel?** decision
   - If Yes → **List of Consolidation Group Contract Opportunities** (Feature 2)
   - If No → continue
6. **Review and allow customize**
7. **View Memo**
8. **Submit?** decision
9. If Yes → Notification memo, recommend license action → End
10. If No → loop back to View Memo

**Permissions**:
- View group-wide analytics
- Access cross-subsidiary software match recommendations (Feature 1)
- Access group consolidation opportunities (Feature 2)
- Approve group-level contracts
- Final approval for high-value purchases (3rd level approval)
- Create and distribute policy memos

---

### 3.5 Approval Workflow Rules

Multi-level approval based on request value:

| Request Value | Approval Chain |
|--------------|----------------|
| < 10,000 THB | Department Manager |
| 10,000 - 100,000 THB | Department Manager → Finance Manager |
| > 100,000 THB | Department Manager → Finance Manager → Subsidiary/Group CTO |

**SLA**:
- Department Manager: 3 business days
- Finance Manager: 5 business days
- CTO: 7 business days

---

## 4. AI/LLM Integration

Asset Pulse heavily leverages **Large Language Models (LLM)** and **AI** to provide intelligent recommendations. This section details the AI integration approach.

### 4.1 LLM Use Cases

#### Use Case 1: Job Description → License Matching (Feature 3) ⭐ **PRIMARY**

**Problem**: HR has a new hire job description and needs to know which software to provision

**LLM Task**:
- **Input**: Job description text (e.g., "Senior Data Analyst responsible for creating dashboards, analyzing customer behavior, and presenting insights to stakeholders")
- **Process**:
  1. Extract key responsibilities and skills from job description
  2. Map responsibilities to software categories (e.g., "dashboards" → BI tools)
  3. Match skills to specific applications (e.g., "SQL" → Database tools)
  4. Consider department context and peer patterns
  5. Rank recommendations by relevance
- **Output**: JSON with recommended applications, license tiers, and AI-generated rationale

**LLM Prompt Example**:
```
You are an expert in enterprise software and job role analysis.

Given the following job description:
"{job_description}"

Department: {department}
Company: {company}

Available applications in our catalog:
{app_catalog}

Task: Recommend the top 10 software applications this employee will need.
For each recommendation, provide:
1. Application name
2. Recommended license tier
3. Relevance score (0-100)
4. Rationale (one sentence explaining why)

Output format: JSON
```

**Implementation**:
- LLM: GPT-4o or Claude Sonnet
- Fallback: Rule-based recommendations from `recommendation_rules` table
- Caching: Store recommendations per job profile for faster repeat queries

**Go Code Example** (Based on actual backend structure):
```go
// usecase/recommendation_usecase.go
package usecase

import (
    "context"
    "encoding/json"
    "fmt"
    "time"

    "asset-pulse-api/entities"
    "asset-pulse-api/repositories/database"
    "asset-pulse-api/utils/llm"
    "asset-pulse-api/utils/cache"
    "asset-pulse-api/utils/logger"
)

type RecommendationUsecase struct {
    db        *database.DatabaseRepository
    llmClient *llm.OpenAIClient
    cache     *cache.RedisClient
}

func NewRecommendationUsecase(
    db *database.DatabaseRepository,
    llmClient *llm.OpenAIClient,
    cache *cache.RedisClient,
) *RecommendationUsecase {
    return &RecommendationUsecase{
        db:        db,
        llmClient: llmClient,
        cache:     cache,
    }
}

// Feature 3: JD → License Matching
func (uc *RecommendationUsecase) JDMatchUsecase(
    ctx context.Context,
    jobDescription string,
    jobTitle string,
    department string,
    companyCode string,
) ([]entities.Recommendation, error) {
    logger.Info("Starting JD Match recommendation", "department", department)

    // 1. Check cache first
    cacheKey := fmt.Sprintf("jd_match:%s:%s", department, hashString(jobDescription))
    if cached, err := uc.cache.Get(ctx, cacheKey); err == nil {
        var recommendations []entities.Recommendation
        json.Unmarshal([]byte(cached), &recommendations)
        return recommendations, nil
    }

    // 2. Get available applications from database
    apps, err := uc.db.GetApps(ctx, map[string]interface{}{
        "status": "active",
    })
    if err != nil {
        return nil, err
    }

    // 3. Build prompt for LLM
    prompt := uc.buildJDMatchPrompt(jobDescription, jobTitle, department, companyCode, apps)

    // 4. Call OpenAI GPT-4o via LLM client
    llmResponse, err := uc.llmClient.CreateChatCompletion(ctx, llm.ChatRequest{
        Model: "gpt-4o",
        Messages: []llm.Message{
            {
                Role:    "system",
                Content: "You are an expert in enterprise software and job role analysis.",
            },
            {
                Role:    "user",
                Content: prompt,
            },
        },
        Temperature:    0.3,
        ResponseFormat: "json_object",
    })
    if err != nil {
        logger.Error("LLM API error, falling back to rule-based", "error", err)
        return uc.fallbackRuleBased(ctx, department, companyCode)
    }

    // 5. Parse LLM response
    recommendations, err := uc.parseLLMRecommendations(llmResponse.Content)
    if err != nil {
        return nil, err
    }

    // 6. Save recommendations to database
    for _, rec := range recommendations {
        rec.RecType = "new_user"
        rec.Status = "pending"
        rec.CreatedAt = time.Now()
        
        if err := uc.db.CreateRecommendation(ctx, &rec); err != nil {
            logger.Error("Failed to save recommendation", "error", err)
        }
    }

    // 7. Cache result (24 hours)
    cachedData, _ := json.Marshal(recommendations)
    uc.cache.Set(ctx, cacheKey, string(cachedData), 24*time.Hour)

    return recommendations, nil
}

func (uc *RecommendationUsecase) buildJDMatchPrompt(
    jd, title, dept, company string, 
    apps []entities.App,
) string {
    appsJSON, _ := json.Marshal(apps)
    return fmt.Sprintf(`
Given the following job description:
Job Title: %s
Department: %s
Company: %s

Job Description:
%s

Available applications in our catalog:
%s

Task: Recommend the top 10 software applications this employee will need.
For each recommendation, provide:
1. app_id (from catalog)
2. app_name
3. recommended_tier (Free/Basic/Pro/Enterprise)
4. relevance_score (0-100)
5. rationale (one sentence explaining why)

Output format: JSON array
`, title, dept, company, jd, string(appsJSON))
}

func (uc *RecommendationUsecase) fallbackRuleBased(
    ctx context.Context,
    department string,
    companyCode string,
) ([]entities.Recommendation, error) {
    // Fallback to recommendation_rules table
    rules, err := uc.db.GetRecommendationRules(ctx, map[string]interface{}{
        "target_type":  "department",
        "target_value": department,
        "is_active":    true,
    })
    if err != nil {
        return nil, err
    }

    recommendations := make([]entities.Recommendation, 0)
    for _, rule := range rules {
        recommendations = append(recommendations, entities.Recommendation{
            RecType:      "new_user",
            AppID:        rule.AppID,
            LicenseTier:  rule.LicenseTier,
            Status:       "pending",
            Rationale:    rule.Rationale,
        })
    }

    return recommendations, nil
}
```

---

#### Use Case 2: Application Similarity Matching (Feature 1)

**Problem**: Identify if two applications from different subsidiaries serve the same purpose

**LLM Task**:
- **Input**: 
  - Application A name, description, features
  - Application B name, description, features
- **Process**:
  1. Semantic comparison of application descriptions
  2. Feature overlap analysis
  3. Generate similarity score (0-100)
  4. Explain similarity rationale
- **Output**: Similarity score + human-readable explanation

**LLM Prompt Example**:
```
You are a software analyst expert.

Application 1:
Name: {app1_name}
Description: {app1_description}
Features: {app1_features}

Application 2:
Name: {app2_name}
Description: {app2_description}
Features: {app2_features}

Task: Determine if these two applications serve similar purposes.
Provide:
1. Similarity score (0-100)
2. Feature overlap percentage
3. One paragraph explanation
4. Recommendation: consolidate, keep separate, or uncertain

Output format: JSON
```

**Implementation**:
- LLM: GPT-4o-mini (faster, cheaper for batch processing)
- Enhancement: Use embeddings (pgvector) for initial filtering before LLM call
- Batch processing: Run nightly for all cross-subsidiary app pairs

---

#### Use Case 3: Cost Savings Memo Generation (Feature 2)

**Problem**: Generate business case memo for group consolidation opportunities

**LLM Task**:
- **Input**:
  - List of subsidiaries using the application
  - Current contracts and pricing
  - Proposed group contract terms
  - Estimated savings
- **Process**:
  1. Analyze data and calculate ROI
  2. Generate professional business memo
  3. Include executive summary, financial analysis, and recommendation
- **Output**: Markdown-formatted memo ready for stakeholder review

**LLM Prompt Example**:
```
You are a strategic sourcing and procurement expert.

Generate a business case memo for consolidating software licenses across SCBX Group subsidiaries.

Data:
Application: {app_name}
Current situation:
{subsidiary_contracts}

Proposed group contract:
{group_contract_terms}

Financial impact:
- Current annual cost: {current_cost} THB
- Proposed annual cost: {proposed_cost} THB
- Estimated savings: {savings} THB ({savings_percent}%)

Task: Write a professional memo to the Group CTO recommending this consolidation.
Include:
1. Executive Summary
2. Current State Analysis
3. Proposed Solution
4. Financial Impact
5. Implementation Plan
6. Risk Assessment
7. Recommendation

Output format: Markdown
```

---

### 4.2 AI-Powered Analytics

#### Usage Pattern Analysis (Feature 5 & 6)

**AI Task**: Distinguish between truly inactive users vs. seasonal/periodic users

**Approach**:
- Time series analysis of usage events
- Clustering users by usage patterns
- Anomaly detection for sudden usage drops
- Predictive modeling for future usage

**Algorithm**:
- Feature engineering: frequency, recency, duration, event types
- Classification: active, low-usage, inactive, seasonal
- Regression: predict next 30-day usage
- Recommendation: revoke, downgrade, keep, or switch to pay-per-use

---

### 4.3 LLM Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Web Application                       │
│  (User Interface - React/Next.js)                       │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend API Layer                      │
│  (Go/Golang with Fiber/Gin Framework)                   │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │     Recommendation Service (LLM Integration)     │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  • Job Description Parser (OpenAI Go SDK)        │  │
│  │  • Application Similarity Matcher                │  │
│  │  • Memo Generator                                │  │
│  │  • Usage Pattern Analyzer                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                     ▼
┌──────────────────────┐          ┌──────────────────────┐
│   LLM Provider API    │          │  PostgreSQL Database │
│  (OpenAI / Anthropic) │          │   (with pgvector)    │
├──────────────────────┤          ├──────────────────────┤
│  • GPT-4o            │          │  • apps              │
│  • Claude Sonnet     │          │  • app_features      │
│  • Embeddings API    │          │  • users             │
└──────────────────────┘          │  • license_*         │
                                   │  • usage_events      │
                                   │  • recommendations   │
                                   └──────────────────────┘
```

**Key Components**:
1. **LLM Provider**: OpenAI GPT-4o / Anthropic Claude
2. **Embedding Store**: pgvector for semantic search
3. **Caching Layer**: Redis for frequently accessed LLM responses
4. **Background Jobs**: Go routines + channels for concurrent LLM processing

**Go Libraries** (Currently Used):
- `github.com/sashabaranov/go-openai` - Official OpenAI Go SDK
- `github.com/anthropics/anthropic-sdk-go` - Claude API client (backup)
- `github.com/pgvector/pgvector-go` - pgvector support for similarity search
- `github.com/gofiber/fiber/v2` - High-performance web framework (Express-like)
- `gorm.io/gorm` - ORM for database operations
- `gorm.io/driver/postgres` - PostgreSQL driver for GORM
- `github.com/redis/go-redis/v9` - Redis client for caching
- `github.com/joho/godotenv` - Environment variable loading
- `github.com/golang-jwt/jwt/v5` - JWT authentication

---

### 4.4 LLM Configuration

**API Selection**:
- **Primary**: OpenAI GPT-4o (best performance for complex reasoning)
- **Secondary**: Anthropic Claude Sonnet (alternative/backup)
- **Embeddings**: OpenAI text-embedding-3-large (pgvector storage)

**Cost Optimization**:
- Cache LLM responses for identical queries
- Use GPT-4o-mini for simple tasks (similarity matching)
- Batch processing for non-urgent recommendations
- Rate limiting and budget controls

**Prompt Engineering**:
- System prompts tailored per use case
- Few-shot examples for consistent output format
- JSON output mode for structured data
- Temperature = 0.3 for deterministic recommendations

---

## 5. Data Model

### 5.1 Core Database Tables

#### Organization & Users
- **orgs**: Organization hierarchy (Group level)
- **companies**: Subsidiaries (SCBX, SCB, SCBAM, etc.)
- **departments**: Departments within companies
- **users**: User profiles with authentication
- **roles**: System roles (Employee, HR, Dept Manager, CTO, etc.)
- **user_roles**: Role assignments with scope
- **job_profiles**: Job definitions (Engineer, HR, Finance, etc.)
- **user_job_profiles**: User-to-job-profile mapping

#### Application Catalog
- **apps**: Application registry (Jira, Slack, GitHub, etc.)
- **app_features**: Features per application
- **app_feature_embeddings**: Vector embeddings for semantic search (pgvector)
- **app_similarity**: Pre-calculated similarity scores between apps

#### Contracts & Licenses
- **vendors**: Software vendors
- **contracts**: Master contracts per subsidiary
- **contract_terms**: Pricing and seat information per app
- **contract_scopes**: Organizational scope of contracts
- **license_inventories**: Available license pools
- **license_assignments**: User license assignments
- **price_books**: Pricing information (list prices)

#### Usage Tracking
- **usage_events**: Application usage logs (sign-ins, activity)
  - Columns: user_id, app_id, event_at, event_type, event_value, metadata

#### Recommendations & Templates
- **recommendation_rules**: Rule-based recommendation logic
- **recommendations**: Generated recommendations (all types)
  - Types: new_user, seat_opt, payg_opt, cross_sub_match, group_consolidation
- **purchase_templates**: Department templates
- **purchase_template_items**: Applications in templates
- **group_consolidation_opps**: Group-level consolidation opportunities

#### Workflow
- **requests**: License/purchase requests
- **request_steps**: Multi-level approval steps
- **memos**: Business case memos
- **notifications**: User notifications
- **audit_logs**: System audit trail

---

### 5.2 Key Views

#### View: recommended_pack_for_user
Pre-joined view for new user recommendations (used by HR workflow)

```sql
CREATE VIEW v_recommended_pack_for_user AS
SELECT 
  u.user_id,
  u.username,
  u.department_code,
  u.company_code,
  jp.job_profile_name,
  rec.app_id,
  a.app_name,
  rec.license_tier,
  rec.weight,
  rec.rationale
FROM users u
JOIN user_job_profiles ujp ON u.user_id = ujp.user_id
JOIN job_profiles jp ON ujp.job_profile_id = jp.job_profile_id
JOIN recommendation_rules rec ON rec.target_type = 'job_profile' 
  AND rec.target_value = jp.job_profile_key
JOIN apps a ON rec.app_id = a.app_id
WHERE rec.is_active = TRUE
ORDER BY rec.weight DESC;
```

---

## 6. Technical Architecture

### 6.1 Technology Stack

**Frontend**:
- React / Next.js (TypeScript)
- Tailwind CSS for styling
- Recharts / D3.js for visualizations
- React Query for data fetching

**Backend**:
- **Go (Golang)** with Fiber or Gin framework
- REST API architecture
- Clean Architecture / Hexagonal Architecture pattern
- Go routines for concurrent processing
- Integration with OpenAI/Anthropic SDKs

**Database**:
- PostgreSQL 15+ with pgvector extension
- Redis for caching and session management

**AI/LLM**:
- OpenAI API (GPT-4o, GPT-4o-mini) via Go SDK
- Anthropic Claude API (backup) via Go SDK
- pgvector for embeddings storage
- Direct API integration (no LangChain - using native Go)

**DevOps**:
- Docker + Docker Compose (Multi-stage builds for Go)
- CI/CD: GitHub Actions with Go toolchain
- Hosting: Cloud provider (AWS, GCP, Azure)
- Go build tools: `go mod`, `go build`, `go test`
- Air for hot-reload during development

---

### 6.2 Go Backend Architecture (Actual Implementation)

**Project**: `asset-pulse-api/`

**Project Structure**:
```
asset-pulse-api/
├── configs/                    # Configuration management
│   └── config.go              # App config struct with env bindings
│
├── entities/                   # Database entities (GORM models)
│   └── database_entity.go     # All database entities from SQL schema
│       ├── Org, Company, Department
│       ├── Role, User, UserRole
│       ├── App, AppFeature, AppSimilarity
│       ├── Vendor, Contract, ContractTerms
│       ├── LicenseInventory, LicenseAssignment
│       ├── UsageEvent
│       ├── JobProfile, UserJobProfile
│       ├── Recommendation, RecommendationRule
│       ├── PurchaseTemplate, PurchaseTemplateItem
│       ├── Request, RequestStep
│       └── Memo, Notification, AuditLog
│
├── handler/                    # HTTP handlers (controllers)
│   ├── dto/                   # Data transfer objects
│   │   ├── base.response.go  # Base response structure
│   │   ├── users.dto.go      # User DTOs
│   │   ├── license.dto.go    # License DTOs
│   │   ├── recommendation.dto.go  # Recommendation DTOs (6 features)
│   │   ├── template.dto.go   # Purchase template DTOs
│   │   └── request.dto.go    # Approval request DTOs
│   │
│   ├── auth_handler.go        # Authentication endpoints
│   ├── get_users_handler.go   # GET /users handler
│   ├── license_handler.go     # License management endpoints
│   ├── recommendation_handler.go  # AI/LLM recommendation endpoints
│   │   ├── POST /recommendations/jd-match         # Feature 3
│   │   ├── GET  /recommendations/cross-sub        # Feature 1
│   │   ├── GET  /recommendations/consolidation    # Feature 2
│   │   ├── GET  /recommendations/seat-opt         # Feature 5
│   │   └── GET  /recommendations/payg-opt         # Feature 6
│   ├── template_handler.go    # Purchase template endpoints
│   ├── request_handler.go     # Approval workflow endpoints
│   └── route.go              # Route definitions
│
├── repositories/               # Data access layer
│   └── database/
│       └── database_repository.go  # Database operations
│           ├── GetUsers(), GetUserByID()
│           ├── GetApps(), GetAppByID()
│           ├── GetLicenseInventory()
│           ├── GetUsageEvents()
│           ├── GetRecommendations()
│           ├── CreateRecommendation()
│           ├── GetTemplates(), CreateTemplate()
│           ├── GetContracts()
│           └── GetAppSimilarity()
│
├── usecase/                    # Business logic layer
│   ├── models/                # Usecase models
│   │   ├── users.model.go    # User usecase models
│   │   ├── recommendation.model.go  # Recommendation models
│   │   └── license.model.go  # License models
│   │
│   ├── auth_usecase.go        # Authentication business logic
│   ├── get_users.go           # Get users business logic
│   ├── license_usecase.go     # License management logic
│   │
│   ├── recommendation_usecase.go  # AI/LLM Recommendation Engine
│   │   ├── JDMatchUsecase()           # Feature 3: JD → License
│   │   ├── CrossSubMatchUsecase()     # Feature 1: Cross-sub match
│   │   ├── ConsolidationUsecase()     # Feature 2: Group consolidation
│   │   ├── SeatOptimizationUsecase()  # Feature 5: Seat optimization
│   │   └── PaygOptimizationUsecase()  # Feature 6: Pay-per-use
│   │
│   ├── template_usecase.go    # Purchase template logic
│   ├── request_usecase.go     # Approval workflow logic
│   └── usecase.go             # Usecase interface
│
├── utils/                      # Utility packages
│   ├── apperrs/              # Application error handling
│   │   └── errors.go
│   ├── gorm/                 # Database utilities
│   │   └── pgClient.go       # PostgreSQL connection (with pgvector)
│   ├── logger/               # Logging utilities
│   │   └── logger.go
│   ├── llm/                  # LLM client utilities (NEW!)
│   │   ├── openai_client.go  # OpenAI GPT-4o client
│   │   ├── claude_client.go  # Anthropic Claude client
│   │   └── prompt_builder.go # Prompt templates
│   ├── transformer/          # Response transformers
│   │   └── transformer.go
│   └── cache/                # Redis cache utilities (NEW!)
│       └── redis_client.go
│
├── scripts/                    # SQL migration scripts
│   ├── 0001_initial_tables.sql
│   ├── 0002_insert_mockdata.sql
│   └── 0003_create_view_recommend_pack_for_user.sql
│
├── main.go                     # Application entry point
├── go.mod                      # Go module dependencies
├── go.sum                      # Dependency checksums
├── Dockerfile                  # Docker image definition
├── docker-compose.yaml         # Docker compose configuration
├── Makefile                    # Build and run commands
├── .env.example               # Environment variables template
├── .env                       # Environment variables (gitignored)
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

**Architecture Layers**:
1. **Handler Layer** (`handler/`): HTTP request handling, validation, DTOs
2. **Usecase Layer** (`usecase/`): Business logic, LLM integration
3. **Repository Layer** (`repositories/`): Database operations (GORM)
4. **Entities Layer** (`entities/`): GORM models matching SQL schema
5. **Utils Layer** (`utils/`): Shared utilities (LLM, cache, logger, errors)

**Key Design Patterns**:
- **Layered Architecture**: Handler → Usecase → Repository → Database
- **Repository Pattern**: Abstract data access via interfaces
- **DTO Pattern**: Separate API models from database entities
- **Dependency Injection**: Constructor-based DI for testability
- **Error Handling**: Centralized error types in `utils/apperrs`
- **Response Transformer**: Consistent API response format

**Concurrency Strategy**:
- Go routines for parallel LLM API calls in `usecase/recommendation_usecase.go`
- Context propagation throughout all layers
- Redis caching for LLM responses to reduce costs
- Database connection pooling via GORM

---

### 6.3 API Endpoints (To Be Implemented)

**Base URL**: `/api/v1`

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

#### Users
- `GET /users` - List users (existing)
- `GET /users/:id` - Get user by ID (existing)

#### Applications
- `GET /apps` - List all applications
- `GET /apps/:id` - Get application details
- `GET /apps/:id/features` - Get application features

#### Licenses
- `GET /licenses/inventory` - Get license inventory
- `GET /licenses/assignments` - Get license assignments
- `POST /licenses/assign` - Assign license to user
- `DELETE /licenses/revoke/:id` - Revoke license

#### **Recommendations (6 Core Features)**

**Feature 3: JD → License Matching** ⭐ Priority
- `POST /recommendations/jd-match` - Match job description to licenses
  ```json
  Request:
  {
    "job_title": "Senior Data Analyst",
    "job_description": "Responsible for creating dashboards...",
    "department": "Analytics",
    "company_code": "SCB"
  }
  
  Response:
  {
    "recommendations": [
      {
        "app_id": 123,
        "app_name": "Tableau",
        "license_tier": "Pro",
        "relevance_score": 95,
        "rationale": "Required for dashboard creation and data visualization"
      }
    ]
  }
  ```

**Feature 1: Cross-Subsidiary Software Match**
- `GET /recommendations/cross-sub-match` - Find similar apps across subsidiaries
- `GET /recommendations/cross-sub-match/:app_id` - Get matches for specific app

**Feature 2: Group Consolidation**
- `GET /recommendations/consolidation` - Get consolidation opportunities
- `POST /recommendations/consolidation/:id/accept` - Accept consolidation
- `POST /recommendations/consolidation/:id/reject` - Reject consolidation

**Feature 5: Seat Optimization**
- `GET /recommendations/seat-optimization` - Get all optimization recommendations (revoke/downgrade/reallocate)
- `GET /recommendations/seat-optimization/reallocation` - Get reallocation-specific recommendations
- `GET /recommendations/seat-optimization/:company_code` - Per subsidiary
- `GET /recommendations/seat-optimization/department/:dept_code` - Per department
- `POST /recommendations/seat-optimization/:id/apply` - Apply optimization (revoke/reallocate/downgrade)
- `POST /recommendations/seat-optimization/bulk-apply` - Bulk apply multiple recommendations

**Feature 6: Pay-per-Use Optimization**
- `GET /recommendations/payg-optimization` - Get pay-per-use recommendations
- `GET /recommendations/payg-optimization/:user_id` - Per user

**Feature 4: Purchase Templates**
- `GET /templates` - List purchase templates
- `GET /templates/:id` - Get template details
- `POST /templates` - Create new template
- `PUT /templates/:id` - Update template
- `DELETE /templates/:id` - Delete template

#### Approval Workflow
- `GET /requests` - List requests
- `GET /requests/:id` - Get request details
- `POST /requests` - Create new request (license/purchase/memo)
- `POST /requests/:id/approve` - Approve request
- `POST /requests/:id/reject` - Reject request

#### Analytics & Usage
- `GET /usage/events` - Get usage events
- `GET /usage/summary/:app_id` - Usage summary per app
- `GET /analytics/dashboard` - Dashboard metrics

---

### 6.4 System Architecture Diagram

```
┌───────────────────────────────────────────────────────────────┐
│                         Users                                  │
│  (HR, Employee, Dept Manager, CTO, Finance)                   │
└───────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                          │
│  ┌────────────┬────────────┬────────────┬────────────┐       │
│  │  Dashboard │ Recomm.    │  Templates │  Approvals │       │
│  │            │  Engine    │            │            │       │
│  └────────────┴────────────┴────────────┴────────────┘       │
└───────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                   Backend API (Go/Golang)                      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Core Services (Go Packages)                 │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │  • Authentication & Authorization (RBAC)                │ │
│  │  • License Management Service                           │ │
│  │  • Contract Management Service                          │ │
│  │  • Usage Analytics Service                              │ │
│  │  • Request & Approval Workflow Service                  │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │        AI/LLM Recommendation Service (NEW!)             │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │  • JD → License Matcher (Feature 3)                     │ │
│  │  • Cross-Sub Software Matcher (Feature 1)               │ │
│  │  • Consolidation Analyzer (Feature 2)                   │ │
│  │  • Seat Optimization Engine (Feature 5)                 │ │
│  │  • Pay-per-Use Optimizer (Feature 6)                    │ │
│  │  • Memo Generator                                       │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌──────────────────────┐       ┌────────────────────────────┐
│  PostgreSQL + Vector │       │   LLM Provider             │
│  ┌────────────────┐  │       │  ┌──────────────────────┐ │
│  │ Core Tables    │  │       │  │ OpenAI GPT-4o        │ │
│  │ Vector Store   │  │       │  │ Anthropic Claude     │ │
│  └────────────────┘  │       │  │ Embedding API        │ │
└──────────────────────┘       │  └──────────────────────┘ │
                                └────────────────────────────┘
```

---

### 6.5 Authentication & Authorization

**Authentication**:
- Username + Password (stored as bcrypt hash)
- Session-based authentication with JWT tokens
- Session timeout: 8 hours
- Password policy: 8+ chars, mixed case, numbers, symbols

**Authorization (RBAC)**:
- Role-based access control with scope
- Permissions checked at API level
- Scope-based data filtering (user/app/department/subsidiary/group)

---

## 7. Business Rules

### 7.1 License Assignment Rules

| Rule ID | Description |
|---------|-------------|
| BR-LIC-001 | Cannot assign license if inventory exhausted |
| BR-LIC-002 | Cannot assign license from expired contract |
| BR-LIC-003 | User must be active to receive license |
| BR-LIC-004 | One active license per user per app per tier |

### 7.2 Recommendation Rules

| Rule ID | Description |
|---------|-------------|
| BR-RECO-001 | Generate seat_opt recommendation if last_seen > 30 days |
| BR-RECO-001a | Prioritize reallocation over revocation if pending requests exist |
| BR-RECO-001b | Reallocation allowed only if contract scope covers target department/subsidiary |
| BR-RECO-002 | Generate payg_opt recommendation if usage < 20% of seat value |
| BR-RECO-003 | Maximum 10 recommendations per new user (Feature 3) |
| BR-RECO-004 | Cross-sub match requires 2+ subsidiaries using app |
| BR-RECO-005 | Group consolidation requires 20%+ savings to recommend |
| BR-RECO-006 | Seat optimization reallocation: match inactive licenses with pending requests first |

### 7.3 Approval Rules

| Request Value | Approval Chain | SLA |
|--------------|----------------|-----|
| < 10,000 THB | Department Manager | 3 days |
| 10,000 - 100,000 THB | Dept Manager → Finance | 5 days |
| > 100,000 THB | Dept Manager → Finance → CTO | 7 days |

### 7.4 Usage Tracking Rules

| Rule ID | Description |
|---------|-------------|
| BR-USE-001 | Usage events retained for 24 months, then archived |
| BR-USE-002 | Last seen = MAX(event_at) per user per app |
| BR-USE-003 | Inactive threshold = 30 days (configurable) |

---

## 8. Glossary

| Term | Definition |
|------|------------|
| **Cross-Sub Match** | Identifying similar applications used by different subsidiaries |
| **Group Consolidation** | Combining multiple subsidiary contracts into one group contract |
| **Job Description (JD)** | Text description of job responsibilities and requirements |
| **LLM** | Large Language Model (e.g., GPT-4, Claude) |
| **Pay-per-Use (PAYG)** | Pricing model based on actual usage vs. fixed seats |
| **Seat Optimization** | Identifying and revoking unused/underutilized licenses |
| **Purchase Template** | Pre-configured software pack for a role/department |
| **Semantic Similarity** | Meaning-based comparison (vs. keyword matching) |
| **pgvector** | PostgreSQL extension for vector/embedding storage |
| **Scope** | Level of access: user/app/department/subsidiary/group |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-21 | System | Initial specification |
| 2.0 | 2025-10-21 | System | Complete rewrite focused on 6 core features + LLM integration |
| 2.1 | 2025-10-21 | System | Updated backend stack to Go (Golang) with detailed architecture |
| 2.2 | 2025-10-21 | System | Aligned backend architecture with actual implementation (`asset-pulse-api/`) |
| 2.3 | 2025-10-21 | System | Enhanced Feature 5 with license reallocation across departments/subsidiaries |

---

## Appendices

### Appendix A: Database Schema Reference

See `scripts/0001_initial_tables.sql` for complete schema

**Total Tables**: 30+
- Organization: 4 tables
- Users & Roles: 4 tables  
- Applications: 4 tables
- Contracts & Licenses: 7 tables
- Recommendations: 5 tables
- Templates: 2 tables
- Workflow: 4 tables

### Appendix B: SCBX Subsidiaries

SCBX, SCB, SCBAM, INVX, SCB Protect, Abacus Digital, SCB Julius Baer, SCB 10X, Monix, Token X, SCB TechX, Alpha X, Rutchayothin Asset Management, SCB Plus, Mahisorn, SCB Training Center, AUTO X, Card X, Card X AMC, Alpha X Plus, SCB Data X, Akulaku X, Point X, Cambodian Commercial Bank (CCB), Siam Commercial Bank Myanmar

### Appendix C: Application Catalog Sample

**Collaboration**: Slack, Microsoft Teams, Zoom, Miro, Notion  
**DevOps**: Jira, Confluence, GitHub, GitLab, CircleCI  
**Security**: Datadog, New Relic, Sentry  
**ITSM**: ServiceNow, Zendesk  
**CRM**: Salesforce, HubSpot  
**Analytics**: Tableau, Power BI  
**Design**: Figma  

### Appendix D: Implementation Priority

**Current Status**:
- ✅ Database schema completed (`scripts/*.sql`)
- ✅ Backend structure completed (`asset-pulse-api/`)
- ✅ Basic CRUD operations (GET /users, etc.)
- ✅ GORM entities defined
- ✅ Dockerfile + docker-compose ready

**Phase 1 (MVP)** - Target: 4 weeks
1. ✅ Core database setup (done)
2. ✅ Backend project structure (done)
3. 🔨 Authentication & JWT middleware (`handler/auth_handler.go`, middleware)
4. 🔨 **Feature 3: New User Recommendations (LLM)** ⭐ Priority
   - Create `utils/llm/openai_client.go`
   - Create `utils/cache/redis_client.go`
   - Implement `usecase/recommendation_usecase.go` with `JDMatchUsecase()`
   - Create `handler/recommendation_handler.go`
   - API: `POST /recommendations/jd-match`
5. 🔨 **Feature 4: Purchase Templates**
   - Implement `usecase/template_usecase.go`
   - Create `handler/template_handler.go`
   - APIs: GET/POST/PUT/DELETE `/templates`
6. 🔨 Basic approval workflow (HR → Dept Manager)
   - Implement `usecase/request_usecase.go`
   - Create `handler/request_handler.go`
   - APIs: `POST /requests`, `POST /requests/:id/approve`

**Phase 2** - Target: +3 weeks
7. 🔨 **Feature 5: Seat Optimization**
   - Implement `SeatOptimizationUsecase()` in recommendation_usecase
   - Usage event analysis logic (inactive user detection)
   - **Reallocation logic**: Match inactive licenses with pending requests
   - Department/subsidiary utilization analysis
   - APIs: 
     - `GET /recommendations/seat-optimization`
     - `GET /recommendations/seat-optimization/reallocation`
     - `POST /recommendations/seat-optimization/:id/apply`
8. 🔨 **Feature 1: Cross-Sub Software Match**
   - Implement `CrossSubMatchUsecase()` with LLM similarity
   - pgvector integration for embeddings
   - API: `GET /recommendations/cross-sub-match`
9. 🔨 Usage tracking integration
   - Usage event collection endpoints
   - Analytics calculations
10. 🔨 Department Manager Dashboard data APIs

**Phase 3** - Target: +3 weeks
11. 🔨 **Feature 2: Group Consolidation**
    - Implement `ConsolidationUsecase()` 
    - LLM memo generation
    - API: `GET /recommendations/consolidation`
12. 🔨 **Feature 6: Pay-per-Use Optimization**
    - Implement `PaygOptimizationUsecase()`
    - Cost comparison logic
    - API: `GET /recommendations/payg-optimization`
13. 🔨 CTO Dashboard with analytics
14. 🔨 LLM memo generator

**Files to Create** (Priority Order):

1. `utils/llm/openai_client.go` - OpenAI SDK wrapper
2. `utils/cache/redis_client.go` - Redis caching
3. `usecase/recommendation_usecase.go` - All 6 features
4. `handler/recommendation_handler.go` - API handlers
5. `handler/dto/recommendation.dto.go` - Request/Response DTOs
6. `usecase/template_usecase.go` - Template management
7. `usecase/request_usecase.go` - Approval workflow
8. `handler/auth_handler.go` - Authentication
9. `handler/middleware/auth.go` - JWT middleware
10. `handler/middleware/rbac.go` - RBAC middleware

---

**End of Requirements Specification Document v2.3**
