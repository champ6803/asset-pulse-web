# Asset Pulse - UX/UI Specification

## Document Information

- **Application Name**: Asset Pulse
- **Document Type**: UX/UI Specification
- **Version**: 2.0
- **Date**: October 21, 2025
- **Target Platforms**: Web Application (Desktop & Mobile Responsive)
- **Design Tool**: Figma / Adobe XD

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [User Roles & Personas](#2-user-roles--personas)
3. [User Journeys by Role](#3-user-journeys-by-role)
4. [Information Architecture](#4-information-architecture)
5. [Screen Specifications - 6 Core Features](#5-screen-specifications---6-core-features)
6. [Component Library](#6-component-library)
7. [Interaction Patterns](#7-interaction-patterns)
8. [Visual Design System](#8-visual-design-system)
9. [Responsive Design](#9-responsive-design)
10. [Accessibility Guidelines](#10-accessibility-guidelines)

---

## 1. Design Philosophy

### 1.1 Core Principles

**AI-First Experience**
- Prominent AI-powered recommendations
- Smart suggestions at every step
- Transparent AI rationale ("Why this recommendation?")
- Fallback to manual options

**Clarity & Simplicity**
- Clear visual hierarchy
- Minimal cognitive load
- Obvious next actions
- Progressive disclosure of complexity

**Data-Driven Decisions**
- Dashboard-first approach
- Actionable insights prominently displayed
- Visual data representation (charts, graphs)
- Real-time metrics

**Efficiency & Speed**
- Minimal clicks to complete tasks (2-click rule)
- Bulk operations support
- Smart defaults and auto-suggestions
- Keyboard shortcuts for power users

**Trust & Transparency**
- Clear approval workflows
- Visible audit trails
- Cost transparency (always show savings/costs)
- User control over all actions

---

### 1.2 Design Language

**Style**: Modern, Clean, Professional, Enterprise-grade

**Color Palette**:
```
Primary:   #1E3A8A (Deep Blue)
Secondary: #3B82F6 (Bright Blue)
Success:   #10B981 (Green) - Savings, Approvals
Warning:   #F59E0B (Amber) - Pending, Inactive
Danger:    #EF4444 (Red) - Rejections, Critical
Neutral:   #64748B (Slate Gray)

Background: #F8FAFC (Light Gray)
Surface:    #FFFFFF (White)
Text:       #0F172A (Near Black)
```

**Typography**:
- **Headings**: Inter (Bold, 600-700 weight)
- **Body**: Inter (Regular, 400 weight)
- **Monospace**: JetBrains Mono (for IDs, codes)

**Iconography**:
- Style: Heroicons (Outline for navigation, Solid for emphasis)
- Size: 20px (small), 24px (medium), 32px (large)

**Spacing**: 
- Grid: 8px base unit
- Components: 16px, 24px, 32px
- Sections: 48px, 64px

**Shadows**:
- Card: `0 1px 3px rgba(0,0,0,0.1)`
- Hover: `0 4px 6px rgba(0,0,0,0.1)`
- Modal: `0 20px 25px rgba(0,0,0,0.15)`

**Border Radius**:
- Buttons: 8px
- Cards: 12px
- Inputs: 6px
- Modals: 16px

---

## 2. User Roles & Personas

### Persona 1: Sarah - Employee/HR

**Demographics**:
- Age: 28
- Role: Marketing Executive / HR Coordinator
- Department: Marketing, SCB Data X
- Tech Savviness: Medium

**Goals**:
- Request software for myself quickly
- Onboard new hires with correct software
- View my current licenses
- Understand what software I need based on my job

**Pain Points**:
- Complicated approval processes
- Unclear which software to request
- Long waiting times for approvals
- Manual onboarding for each new hire

**Key Features Used**:
- ⭐ **Feature 3**: New User Software Recommendations (JD Matching)
- **Feature 4**: Purchase Templates
- View My Licenses
- Submit Requests

**Success Metrics**:
- Complete onboarding request in < 3 minutes
- 90% acceptance rate of AI recommendations

---

### Persona 2: David - Department Manager

**Demographics**:
- Age: 38
- Role: IT Department Manager
- Department: IT, SCB
- Tech Savviness: High

**Goals**:
- Manage team's software licenses efficiently
- Create and maintain department templates
- Approve team requests quickly
- Optimize department software costs
- View team usage analytics

**Pain Points**:
- Too many approval requests to review individually
- Lack of visibility into team software usage
- Budget overruns due to unused licenses
- Repetitive onboarding tasks

**Key Features Used**:
- **Feature 4**: Purchase Templates (Create/Manage)
- Approval Workflow
- Team License Overview
- Basic usage analytics

**Success Metrics**:
- Reduce onboarding time by 70%
- Process 10+ approvals in < 5 minutes

---

### Persona 3: Alex - Subsidiary CTO

**Demographics**:
- Age: 45
- Role: CTO
- Company: SCB Data X
- Tech Savviness: High

**Goals**:
- Strategic technology decisions
- Optimize software portfolio across subsidiary
- Identify and eliminate underutilized licenses
- Monitor team usage patterns
- Ensure compliance and security

**Pain Points**:
- Fragmented view of software assets
- Difficult to identify cost savings
- No visibility into inactive users
- Can't see which departments need more licenses

**Key Features Used**:
- ⭐ **Feature 5**: License Seat Optimization (with Reallocation)
- **Feature 6**: Pay-per-Use Optimization
- Usage Analytics
- Approval Workflow (high-value)

**Success Metrics**:
- Identify 100k THB/month in savings
- Reduce inactive licenses by 30%
- Approve/reject optimizations in < 10 minutes

---

### Persona 4: Michelle - Group CTO / Finance Manager

**Demographics**:
- Age: 45-50
- Role: Group CTO / Finance Manager
- Organization: SCBX Group (all subsidiaries)
- Tech Savviness: High

**Goals**:
- Group-wide license strategy and optimization
- Identify cross-subsidiary consolidation opportunities
- Find duplicate software across subsidiaries
- Maximize group buying power
- Control software spending across all companies

**Pain Points**:
- No visibility across subsidiaries
- Different subsidiaries using similar/duplicate tools
- Missing group discount opportunities
- Difficult to justify consolidation to subsidiary CTOs

**Key Features Used**:
- ⭐ **Feature 1**: Cross-Subsidiary Software Match
- ⭐ **Feature 2**: Group Contract Consolidation
- Strategic Analytics
- Memo Generation (AI-powered business cases)

**Success Metrics**:
- Identify 500k+ THB/year in consolidation savings
- Reduce software portfolio by 20%
- Generate executive-ready memos in < 2 minutes

---

## 3. User Journeys by Role

### 3.1 Journey 1: HR - Onboard New Employee with AI Recommendations

**Persona**: Sarah (HR)  
**Feature**: **Feature 3 - JD → License Matching** ⭐ Priority  
**Scenario**: New Software Engineer joins the IT department

**Flow**:
```
1. [Login] → Dashboard
   ↓
2. [Click] "New Hire / Onboarding" button
   ↓
3. [Form] Enter new hire information:
   - Full Name: "John Doe"
   - Job Title: "Senior Software Engineer"
   - Department: "IT - Backend Team"
   - Job Description: [Text area with rich text]
     "Responsible for building microservices..."
   ↓
4. [AI Processing] System shows:
   - "🤖 Analyzing job requirements..."
   - Loading animation (3-5 seconds)
   ↓
5. [AI Results] "Recommended Software Pack" screen:
   - Header: "✨ AI-Powered Recommendations for Senior Software Engineer"
   - Confidence Score: 95%
   - Total Cost: 48,000 THB/year
   
   [Recommended Apps Grid - 10 apps]:
   ┌────────────┐ ┌────────────┐ ┌────────────┐
   │ ✓ GitHub   │ │ ✓ Jira     │ │ ✓ Slack    │
   │   Enterprise│ │   Software │ │   Enterprise│
   │   10k THB/y│ │   6k THB/y │ │   4k THB/y │
   │   [Rationale]│ │  [Rationale]│ │  [Rationale]│
   └────────────┘ └────────────┘ └────────────┘
   
   Each card shows:
   - App icon and name
   - Recommended tier
   - Annual cost
   - Relevance score (85-98%)
   - AI Rationale: "Required for code collaboration"
   - [Remove] button
   
   [Actions]:
   - [Edit Package] - Add/remove apps manually
   - [Use Department Template] - Switch to template
   - [Submit for Approval] - Primary button
   ↓
6. [Review] Summary modal:
   - Employee: John Doe
   - Total Apps: 10
   - Total Cost: 48,000 THB/year
   - Approver: David (IT Manager)
   - [Confirm Submit]
   ↓
7. [Success] Confirmation screen:
   - ✅ "Request submitted successfully!"
   - Request ID: #REQ-2024-001234
   - Status: Pending Approval
   - Next Step: "David will review within 3 days"
   - [View Request] [Back to Dashboard]
```

**Success Criteria**: 
- Complete in < 3 minutes
- AI recommendations accepted 90%+
- Clear rationale for each suggestion

---

### 3.2 Journey 2: Department Manager - Create Purchase Template

**Persona**: David (Department Manager)  
**Feature**: **Feature 4 - Purchase Templates**  
**Scenario**: Create standard onboarding template for new developers

**Flow**:
```
1. [Navigate] Dashboard → "Templates" menu
   ↓
2. [Click] "Create New Template" button
   ↓
3. [Form] Template Setup:
   ┌─────────────────────────────────────────┐
   │ Template Name:                          │
   │ [Software Engineer - Backend Team____]  │
   │                                         │
   │ Description:                            │
   │ [Standard tools for backend devs_____]  │
   │                                         │
   │ Target:                                 │
   │ ○ New Hire Onboarding                   │
   │ ○ Role-Based                            │
   │ ● Department Standard                   │
   │                                         │
   │ Scope:                                  │
   │ Department: [IT - Backend Team ▼]      │
   │                                         │
   │ Budget Limit:                           │
   │ [50,000] THB/year per user             │
   └─────────────────────────────────────────┘
   ↓
4. [Add Apps] Select applications:
   
   [Search bar: "Search applications..."]
   
   [Filter buttons]:
   All | DevOps | Collaboration | Security | Analytics
   
   [App Selection Grid]:
   ┌──────────────────────────────────────┐
   │ GitHub Enterprise                     │
   │ Pro Tier        10,000 THB/year      │
   │ ☑ Include       ☐ Required           │
   │ ☑ User can edit                       │
   └──────────────────────────────────────┘
   
   ┌──────────────────────────────────────┐
   │ Jira Software                         │
   │ Standard Tier   6,000 THB/year       │
   │ ☑ Include       ☑ Required           │
   │ ☐ User can edit                       │
   └──────────────────────────────────────┘
   
   [+ Add More Apps]
   
   [Right Sidebar - Summary]:
   Total Apps: 8
   Total Cost: 45,000 THB/year
   Budget: 50,000 THB/year
   Remaining: 5,000 THB ✓
   ↓
5. [Review] Template preview:
   - All selected apps listed
   - Total cost calculation
   - Required vs. optional apps
   - [Save as Draft] [Publish Template]
   ↓
6. [Success] "Template created successfully!"
   - Template ID: TPL-IT-BACKEND-001
   - Status: Active
   - [Test Template] [View All Templates]
```

**Success Criteria**:
- Create template in < 10 minutes
- Reusable across all new hires
- Clear budget visibility

---

### 3.3 Journey 3: Subsidiary CTO - Review Seat Optimization (with Reallocation)

**Persona**: Alex (Subsidiary CTO)  
**Feature**: **Feature 5 - Seat Optimization with Reallocation** ⭐  
**Scenario**: Monthly review of license utilization and optimization opportunities

**Flow**:
```
1. [Login] → Dashboard shows:
   ┌──────────────────────────────────────┐
   │ 💰 Potential Savings                 │
   │                                      │
   │ 85,000 THB/month                     │
   │                                      │
   │ [View Opportunities] ← Click         │
   └──────────────────────────────────────┘
   ↓
2. [Optimization Dashboard] Overview:
   
   [Top Tabs]:
   ● All (45) | Revoke (20) | Reallocate (15) | Downgrade (10)
   
   [Filters]:
   Company: [SCB Data X ▼]
   Department: [All ▼]
   App: [All ▼]
   Sort by: [Savings (High to Low) ▼]
   
   [Summary Cards]:
   ┌────────────┐ ┌────────────┐ ┌────────────┐
   │ Revoke     │ │ Reallocate │ │ Downgrade  │
   │ 20 licenses│ │ 15 licenses│ │ 10 licenses│
   │ 45k THB/mo │ │ 28k avoided│ │ 12k THB/mo │
   └────────────┘ └────────────┘ └────────────┘
   ↓
3. [Click] "Reallocate" tab to see reallocation opportunities:
   
   ┌────────────────────────────────────────────────────┐
   │ 🔄 Reallocation Opportunity                        │
   │                                                    │
   │ From: Marketing Department (7 inactive licenses)   │
   │ To: Analytics Department (2 pending requests)      │
   │                                                    │
   │ Application: Tableau Pro                           │
   │ Licenses to Reallocate: 2                          │
   │                                                    │
   │ 💰 Impact:                                         │
   │ - Cost Avoided: 20,000 THB/year (no new purchase) │
   │ - Requests Fulfilled: 2                            │
   │ - Remaining Inactive: 5 (can be revoked)          │
   │                                                    │
   │ 🤖 AI Rationale:                                   │
   │ "Marketing team has 7 Tableau licenses with no    │
   │  activity in 90+ days. Analytics team has 2 pending│
   │  requests. Transfer 2 licenses to fulfill demand." │
   │                                                    │
   │ Priority: ⭐⭐⭐ High                                │
   │                                                    │
   │ [View Details] [Approve Reallocation] [Dismiss]   │
   └────────────────────────────────────────────────────┘
   ↓
4. [Click] "View Details" → Detailed breakdown:
   
   [Left Column - Source (Inactive Users)]:
   ┌──────────────────────────────────────┐
   │ Marketing Department                 │
   │                                      │
   │ ☑ Sarah Chen                         │
   │   Last active: 120 days ago          │
   │   Job: Marketing Manager             │
   │                                      │
   │ ☑ Mike Wong                          │
   │   Last active: 95 days ago           │
   │   Job: Content Writer                │
   │                                      │
   │ ... 5 more inactive users            │
   └──────────────────────────────────────┘
   
   [Right Column - Target (Pending Requests)]:
   ┌──────────────────────────────────────┐
   │ Analytics Department                 │
   │                                      │
   │ → David Liu                          │
   │   Requested: 5 days ago              │
   │   Job: Senior Data Analyst           │
   │   Justification: "Dashboard creation"│
   │                                      │
   │ → Emma Tan                           │
   │   Requested: 3 days ago              │
   │   Job: BI Analyst                    │
   │   Justification: "Reports & viz"     │
   └──────────────────────────────────────┘
   
   [Bottom Actions]:
   ☑ Notify source users (7-day notice)
   ☑ Auto-assign to target users
   ☐ Send memo to department managers
   
   [Approve Reallocation] [Revoke Instead] [Cancel]
   ↓
5. [Click] "Approve Reallocation"
   ↓
6. [Confirmation Modal]:
   ⚠️ "Confirm License Reallocation"
   
   Action Summary:
   - Revoke from: 2 Marketing users
   - Assign to: 2 Analytics users
   - Notice period: 7 days
   - Cost savings: 20,000 THB/year
   
   [Confirm] [Cancel]
   ↓
7. [Success]:
   ✅ "Reallocation scheduled successfully!"
   
   Timeline:
   - Day 1 (Today): Notifications sent to source users
   - Day 7: Licenses revoked from Marketing
   - Day 7: Licenses assigned to Analytics
   - Analytics requests marked as "Fulfilled"
   
   [View Timeline] [Back to Optimizations]
```

**Success Criteria**:
- Review 10+ recommendations in < 5 minutes
- Clear understanding of reallocation impact
- Bulk actions available

---

### 3.4 Journey 4: Group CTO - Identify Cross-Subsidiary Consolidation

**Persona**: Michelle (Group CTO)  
**Features**: **Feature 1 (Cross-Sub Match)** + **Feature 2 (Consolidation)**  
**Scenario**: Quarterly review of group-wide software portfolio

**Flow**:
```
1. [Login] → Select Role: "Group CTO"
   ↓
2. [Dashboard] Group Overview:
   ┌──────────────────────────────────────┐
   │ 🏢 Group Portfolio Summary           │
   │                                      │
   │ Total Subsidiaries: 25               │
   │ Active Applications: 87              │
   │ Total Cost: 45M THB/year             │
   │                                      │
   │ 💡 Consolidation Opportunities: 12   │
   │    Potential Savings: 5.2M THB/year  │
   │                                      │
   │ [View Opportunities] ← Click         │
   └──────────────────────────────────────┘
   ↓
3. [Select Scope] Modal:
   ○ Subsidiary Level
   ● Group Level
   
   [Continue]
   ↓
4. [Feature 1] Similar Software Detection:
   
   [Tab Navigation]:
   ● Similar Software | Consolidation Opportunities
   
   ┌────────────────────────────────────────────────────┐
   │ 🔍 Similar Software Detected                       │
   │                                                    │
   │ Group 1: Project Management Tools                 │
   │                                                    │
   │ ┌──────────────┐  ┌──────────────┐               │
   │ │ Asana        │  │ Monday.com   │               │
   │ │ SCB Data X   │  │ SCB TechX    │               │
   │ │ 50 users     │  │ 35 users     │               │
   │ │ 180k THB/y   │  │ 140k THB/y   │               │
   │ └──────────────┘  └──────────────┘               │
   │                                                    │
   │ Similarity Score: 87%                              │
   │                                                    │
   │ 🤖 AI Analysis:                                    │
   │ "Both tools provide task management, kanban       │
   │  boards, and team collaboration. 85% feature      │
   │  overlap detected. Consolidation recommended."    │
   │                                                    │
   │ Common Features:                                   │
   │ ✓ Task Management                                  │
   │ ✓ Kanban Boards                                    │
   │ ✓ Team Collaboration                               │
   │ ✓ Integrations (Slack, GitHub)                     │
   │ ✓ Mobile Apps                                      │
   │                                                    │
   │ [View Consolidation] [Dismiss] [Save for Later]   │
   └────────────────────────────────────────────────────┘
   ↓
5. [Click] "View Consolidation" → [Feature 2] Consolidation Opportunity:
   
   ┌────────────────────────────────────────────────────┐
   │ 📊 Group Consolidation Opportunity                 │
   │                                                    │
   │ Application: Project Management                    │
   │ Current State:                                     │
   │                                                    │
   │ [Table]:                                           │
   │ ┌─────────────┬──────┬────────┬──────────┐       │
   │ │ Subsidiary  │ Tool │ Users  │ Cost/Year│       │
   │ ├─────────────┼──────┼────────┼──────────┤       │
   │ │ SCB Data X  │ Asana│ 50     │ 180k     │       │
   │ │ SCB TechX   │Monday│ 35     │ 140k     │       │
   │ │ INVX        │Trello│ 25     │ 60k      │       │
   │ │ ABACUS      │Click │ 20     │ 80k      │       │
   │ └─────────────┴──────┴────────┴──────────┘       │
   │                                                    │
   │ Total: 4 different tools, 130 users, 460k THB/y   │
   │                                                    │
   │ 💡 Recommended Solution:                           │
   │ Consolidate to: Monday.com Enterprise (Group Plan)│
   │                                                    │
   │ [Group Pricing]:                                   │
   │ - 130 users @ 2,500 THB/user/year                 │
   │ - Group discount: 20% off                          │
   │ - Total: 260k THB/year                             │
   │                                                    │
   │ 💰 Financial Impact:                               │
   │ - Current Cost: 460,000 THB/year                   │
   │ - Proposed Cost: 260,000 THB/year                  │
   │ - Savings: 200,000 THB/year (43%)                  │
   │                                                    │
   │ [Generate Business Case Memo] ← Click              │
   └────────────────────────────────────────────────────┘
   ↓
6. [AI Memo Generation] System generates:
   
   "🤖 Generating executive memo..."
   [Loading 3-5 seconds]
   ↓
7. [Memo Preview]:
   
   ┌────────────────────────────────────────────────────┐
   │ 📄 Business Case Memo                              │
   │                                                    │
   │ [Rich Text Editor with AI-generated content]:     │
   │                                                    │
   │ TO: Subsidiary CTOs (SCB Data X, TechX, INVX,     │
   │     ABACUS)                                        │
   │ FROM: Michelle Chen, Group CTO                     │
   │ RE: Project Management Software Consolidation     │
   │ DATE: October 21, 2025                            │
   │                                                    │
   │ EXECUTIVE SUMMARY                                  │
   │                                                    │
   │ This memo proposes consolidating project          │
   │ management tools across 4 subsidiaries to         │
   │ Monday.com Enterprise, resulting in 200k THB      │
   │ annual savings (43% reduction) while improving    │
   │ cross-subsidiary collaboration.                    │
   │                                                    │
   │ CURRENT STATE ANALYSIS                             │
   │ [AI-generated analysis...]                         │
   │                                                    │
   │ PROPOSED SOLUTION                                  │
   │ [AI-generated proposal...]                         │
   │                                                    │
   │ FINANCIAL IMPACT                                   │
   │ [Tables and charts...]                             │
   │                                                    │
   │ IMPLEMENTATION PLAN                                │
   │ [Timeline and milestones...]                       │
   │                                                    │
   │ RECOMMENDATION                                     │
   │ We recommend proceeding with this consolidation.  │
   │                                                    │
   │ [Edit Memo] [Export PDF] [Send for Review]        │
   └────────────────────────────────────────────────────┘
   ↓
8. [Click] "Send for Review" → Approval workflow:
   - Sent to Subsidiary CTOs for review
   - 7-day review period
   - Comments and feedback collected
   - Final decision by Group CTO
```

**Success Criteria**:
- Identify consolidation in < 5 minutes
- Generate executive memo in < 2 minutes
- Clear financial impact presentation

---

## 4. Information Architecture

### 4.1 Site Map (Simplified)

```
Asset Pulse
│
├── 🏠 Dashboard (Role-based)
│   ├── Employee: My Licenses + Recommendations
│   ├── Manager: Team Overview + Approvals
│   ├── Subsidiary CTO: Optimization + Analytics
│   └── Group CTO: Consolidation + Portfolio
│
├── 💡 Recommendations (AI-Powered)
│   ├── [Employee] For Me (Onboarding)
│   ├── [Manager+] Seat Optimization
│   │   ├── All Recommendations
│   │   ├── Revoke
│   │   ├── Reallocate ⭐ NEW
│   │   └── Downgrade
│   ├── [CTO] Pay-per-Use Optimization
│   ├── [Group CTO] Cross-Sub Software Match
│   └── [Group CTO] Group Consolidation
│
├── 📋 Requests & Approvals
│   ├── My Requests
│   ├── New Request (with AI)
│   ├── Pending Approvals
│   └── Request History
│
├── 📦 My Licenses
│   ├── Active Licenses
│   ├── Usage Stats
│   └── Request New
│
├── 👥 Team Management (Managers+)
│   ├── Team Licenses
│   ├── Usage Analytics
│   ├── Purchase Templates ⭐
│   └── Approval Queue
│
├── 📊 Applications
│   ├── App Catalog
│   ├── App Details
│   └── Similar Apps
│
├── 📈 Analytics (CTO+)
│   ├── Usage Dashboard
│   ├── Cost Reports
│   └── Optimization Reports
│
└── ⚙️ Settings
    ├── Profile
    ├── Notifications
    └── Preferences
```

---

### 4.2 Navigation Structure

**Top Navigation Bar** (Fixed, always visible):
```
┌──────────────────────────────────────────────────────────┐
│ [Logo] Asset Pulse    Dashboard  Recommendations  ...    │
│                                                           │
│                        [🔍 Search] [🔔 3] [👤 Profile ▼] │
└──────────────────────────────────────────────────────────┘
```

**Main Navigation** (varies by role):

**Employee/HR**:
- Dashboard
- Recommendations (For Me)
- My Licenses
- Requests

**Department Manager**:
- Dashboard
- Team
- Templates ⭐
- Approvals
- Requests

**Subsidiary CTO**:
- Dashboard
- Recommendations (Optimization)
- Analytics
- Team
- Approvals

**Group CTO**:
- Dashboard
- Consolidation ⭐
- Similar Software ⭐
- Analytics
- Memos

---

## 5. Screen Specifications - 6 Core Features

### 5.1 Feature 3: JD → License Matching (Priority)

#### Screen 1: New Hire Request Form

**URL**: `/requests/new-hire`

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│ Top Navigation                                              │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Breadcrumb: Dashboard > Requests > New Hire Onboarding     │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                                                            │
│  🆕 New Hire Software Request                              │
│  Get AI-powered software recommendations based on job role │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Step 1 of 3: Employee Information                    │ │
│  │                                                       │ │
│  │ Full Name *                                          │ │
│  │ [________________________________]                    │ │
│  │                                                       │ │
│  │ Job Title *                                          │ │
│  │ [________________________________]                    │ │
│  │                                                       │ │
│  │ Department *                                         │ │
│  │ [IT - Backend Team          ▼]                       │ │
│  │                                                       │ │
│  │ Company                                              │ │
│  │ [SCB Data X                 ▼]                       │ │
│  │                                                       │ │
│  │ Email                                                │ │
│  │ [________________________________]                    │ │
│  │                                                       │ │
│  │ Start Date                                           │ │
│  │ [📅 Select Date]                                      │ │
│  │                                                       │ │
│  │ Job Description *                                    │ │
│  │ ┌─────────────────────────────────────────────────┐ │ │
│  │ │ Responsible for building and maintaining       │ │ │
│  │ │ microservices using Go and Python. Will work   │ │ │
│  │ │ on API development, database optimization,     │ │ │
│  │ │ and CI/CD pipelines. Requires experience with  │ │ │
│  │ │ Docker, Kubernetes, and cloud platforms...     │ │ │
│  │ │                                                 │ │ │
│  │ └─────────────────────────────────────────────────┘ │ │
│  │ 💡 Tip: Provide detailed JD for better AI          │ │
│  │    recommendations                                   │ │
│  │                                                       │ │
│  │                    [Cancel]  [Next: Get AI Recs →]  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Validation**:
- All fields marked with * are required
- Job Description minimum 50 characters
- Real-time validation on blur

---

#### Screen 2: AI Recommendation Results

**URL**: `/requests/new-hire/recommendations`

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  🆕 New Hire Software Request                              │
│  Step 2 of 3: Review AI Recommendations                    │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ✨ AI-Powered Recommendations                         │ │
│  │                                                       │ │
│  │ For: John Doe - Senior Software Engineer             │ │
│  │ Confidence: 🟢 95%  •  Total Cost: 48,000 THB/year   │ │
│  │                                                       │ │
│  │ [Filter: All (10) | DevOps (4) | Collaboration (3)]  │ │
│  │ [Sort by: Relevance ▼]                               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ ✓            │  │ ✓            │  │ ✓            │   │
│  │ [GitHub Icon]│  │ [Jira Icon]  │  │ [Slack Icon] │   │
│  │              │  │              │  │              │   │
│  │ GitHub       │  │ Jira         │  │ Slack        │   │
│  │ Enterprise   │  │ Software     │  │ Enterprise   │   │
│  │              │  │              │  │              │   │
│  │ DevOps       │  │ Project Mgmt │  │ Communication│   │
│  │              │  │              │  │              │   │
│  │ Relevance:98%│  │ Relevance:95%│  │ Relevance:92%│   │
│  │ 10k THB/year │  │ 6k THB/year  │  │ 4k THB/year  │   │
│  │              │  │              │  │              │   │
│  │ [Why?]       │  │ [Why?]       │  │ [Why?]       │   │
│  │ [Remove]     │  │ [Remove]     │  │ [Remove]     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ ✓            │  │ ✓            │  │              │   │
│  │ [Postman]    │  │ [Docker Hub] │  │ [DataDog]    │   │
│  │ ...          │  │ ...          │  │ Not Selected │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
│  [+ Add More Apps Manually]                                │
│  [Use Department Template Instead]                         │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📊 Summary                                            │ │
│  │                                                       │ │
│  │ Total Applications: 10                                │ │
│  │ Total Cost: 48,000 THB/year                          │ │
│  │ Budget Limit: 60,000 THB/year ✓                     │ │
│  │ Remaining: 12,000 THB                                │ │
│  │                                                       │ │
│  │ Approval Required: Yes (David Chen, IT Manager)      │ │
│  │ Estimated Approval Time: 2-3 days                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [← Back]  [Save Draft]  [Submit for Approval →]          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**"Why?" Modal** (Click on any card):
```
┌────────────────────────────────────────┐
│ 🤖 AI Rationale                        │
│                                        │
│ GitHub Enterprise                      │
│                                        │
│ Why recommended:                       │
│                                        │
│ • Job description mentions "API        │
│   development" and "CI/CD pipelines"   │
│                                        │
│ • 95% of Senior Software Engineers     │
│   in IT department use GitHub          │
│                                        │
│ • Required for code collaboration      │
│   and version control                  │
│                                        │
│ • Department standard tool             │
│                                        │
│ Tier: Enterprise                       │
│ Reason: Team size (50+ devs) requires  │
│         advanced features              │
│                                        │
│            [Close]                     │
└────────────────────────────────────────┘
```

**Interaction**:
- Click checkbox to select/deselect app
- Click "Why?" to see AI rationale
- Drag to reorder (optional)
- Real-time cost calculation

---

#### Screen 3: Confirmation

**URL**: `/requests/confirmation`

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                 ✅ Request Submitted!                       │
│                                                            │
│  Your software request has been successfully submitted.    │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Request Details                                       │ │
│  │                                                       │ │
│  │ Request ID:     #REQ-2024-001234                     │ │
│  │ Employee:       John Doe                              │ │
│  │ Department:     IT - Backend Team                     │ │
│  │ Applications:   10 apps                               │ │
│  │ Total Cost:     48,000 THB/year                      │ │
│  │ Status:         🟡 Pending Approval                   │ │
│  │                                                       │ │
│  │ Next Steps:                                           │ │
│  │ 1. David Chen (IT Manager) will review               │ │
│  │    Deadline: Oct 24, 2025                            │ │
│  │                                                       │ │
│  │ 2. You will receive email notification               │ │
│  │                                                       │ │
│  │ 3. If approved, licenses will be auto-assigned       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [View Request Details]  [Create Another]  [Back to Home] │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### 5.2 Feature 4: Purchase Templates

#### Screen: Template Management (Manager View)

**URL**: `/templates`

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│ Top Navigation                                              │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  📋 Purchase Templates                                      │
│  Create reusable software packages for common roles         │
│                                                            │
│  [+ Create New Template]                      [Search: ___]│
│                                                            │
│  Filters: [All (12)] [Active (10)] [Draft (2)]            │
│           Department: [IT ▼]  Scope: [All ▼]              │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📦 Software Engineer - Backend                       │ │
│  │                                                       │ │
│  │ Department: IT - Backend Team                         │ │
│  │ Type: New Hire Onboarding                            │ │
│  │                                                       │ │
│  │ Applications: 8                                       │ │
│  │ Cost: 45,000 THB/year per user                       │ │
│  │ Budget: 60,000 THB/year ✓                           │ │
│  │                                                       │ │
│  │ Status: 🟢 Active                                     │ │
│  │ Created: Sep 15, 2025                                │ │
│  │ Last used: 2 hours ago                               │ │
│  │ Times used: 24                                       │ │
│  │                                                       │ │
│  │ [View] [Edit] [Clone] [Deactivate]                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📦 Data Analyst - Standard                           │ │
│  │                                                       │ │
│  │ Department: Analytics                                 │ │
│  │ Type: Role-Based                                     │ │
│  │                                                       │ │
│  │ Applications: 6                                       │ │
│  │ Cost: 32,000 THB/year per user                       │ │
│  │                                                       │ │
│  │ Status: 🟢 Active                                     │ │
│  │ Created: Aug 20, 2025                                │ │
│  │ Times used: 15                                       │ │
│  │                                                       │ │
│  │ [View] [Edit] [Clone] [Deactivate]                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### 5.3 Feature 5: Seat Optimization with Reallocation

#### Screen: Optimization Dashboard (CTO View)

**URL**: `/recommendations/seat-optimization`

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  💰 Seat Optimization                                       │
│  Maximize license utilization across departments            │
│                                                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │ 💸 Revoke   │ │ 🔄 Reallocate│ │ ⬇️ Downgrade │         │
│  │ 20 licenses │ │ 15 licenses │ │ 10 licenses │         │
│  │ 45k THB/mo  │ │ 28k avoided │ │ 12k THB/mo  │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Tabs: [All (45)] [Revoke (20)] [● Reallocate (15)]       │
│        [Downgrade (10)]                                    │
│                                                            │
│  Filters:                                                  │
│  Company: [SCB Data X ▼] Department: [All ▼]              │
│  App: [All ▼] Sort: [Impact (High to Low) ▼]             │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🔄 Reallocation Opportunity            ⭐⭐⭐ High    │ │
│  │                                                       │ │
│  │ Application: Tableau Pro                              │ │
│  │                                                       │ │
│  │ From: Marketing Department                            │ │
│  │ • 7 inactive licenses (90+ days no activity)         │ │
│  │                                                       │ │
│  │ To: Analytics Department                              │ │
│  │ • 2 pending requests                                  │ │
│  │                                                       │ │
│  │ 💡 Recommended Action:                                │ │
│  │ • Transfer: 2 licenses                                │ │
│  │ • Revoke: 5 licenses (return to inventory)           │ │
│  │                                                       │ │
│  │ 💰 Impact:                                            │ │
│  │ • Cost Avoided: 20,000 THB/year (no new purchase)    │ │
│  │ • Savings: 50,000 THB/year (5 revoked licenses)      │ │
│  │ • Requests Fulfilled: 2                               │ │
│  │ • Total Impact: 70,000 THB/year                      │ │
│  │                                                       │ │
│  │ 🤖 AI Rationale:                                      │ │
│  │ "Marketing team has significantly reduced Tableau     │ │
│  │  usage (7 users inactive 90+ days). Analytics has 2   │ │
│  │  pending requests. Reallocate first, then revoke      │ │
│  │  remaining for maximum efficiency."                   │ │
│  │                                                       │ │
│  │ [View Details →] [Approve] [Dismiss] [Save]          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🔄 Cross-Subsidiary Reallocation      ⭐⭐ Medium    │ │
│  │                                                       │ │
│  │ Application: GitHub Enterprise                        │ │
│  │                                                       │ │
│  │ From: SCB Data X (8 inactive, 120+ days)             │ │
│  │ To: SCB TechX (5 pending requests)                   │ │
│  │                                                       │ │
│  │ 💰 Impact: 50,000 THB/year saved                     │ │
│  │                                                       │ │
│  │ ⚠️ Contract scope validation required                 │ │
│  │                                                       │ │
│  │ [View Details →] [Check Contract] [Dismiss]          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘

[Bulk Actions: [Select Multiple] [Apply Selected] [Export]]
```

---

#### Screen: Reallocation Details

**URL**: `/recommendations/seat-optimization/:id/details`

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  ← Back to Optimizations                                   │
│                                                            │
│  🔄 Reallocation Details                                   │
│  Tableau Pro • Marketing → Analytics                       │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌───────────────────────────────┬────────────────────────────┐
│ SOURCE (Inactive Users)       │ TARGET (Pending Requests)  │
├───────────────────────────────┼────────────────────────────┤
│                               │                            │
│ Marketing Department          │ Analytics Department       │
│ Total: 7 inactive licenses    │ Total: 2 pending requests  │
│                               │                            │
│ ☑ Sarah Chen                  │ → David Liu                │
│   Last active: 120 days ago   │   Requested: 5 days ago    │
│   Job: Marketing Manager      │   Job: Senior Data Analyst │
│   Usage: 0 hours (90 days)    │   Justification:           │
│                               │   "Dashboard creation for  │
│                               │    executive reporting"    │
│                               │   Priority: High           │
│                               │                            │
│ ☑ Mike Wong                   │ → Emma Tan                 │
│   Last active: 95 days ago    │   Requested: 3 days ago    │
│   Job: Content Writer         │   Job: BI Analyst          │
│   Usage: 0 hours (90 days)    │   Justification:           │
│                               │   "Data visualization and  │
│                               │    reports creation"       │
│                               │   Priority: Medium         │
│                               │                            │
│ ☐ James Lee                   │                            │
│   Last active: 85 days ago    │ Remaining users can be     │
│   Job: Graphic Designer       │ revoked or kept            │
│                               │                            │
│ ☐ Lisa Park                   │                            │
│   Last active: 110 days ago   │                            │
│                               │                            │
│ ... 3 more                    │                            │
│                               │                            │
│ [Select All] [Deselect All]   │                            │
│                               │                            │
└───────────────────────────────┴────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  📊 Impact Analysis                                         │
│                                                            │
│  Action Summary:                                           │
│  • Transfer: 2 licenses (fulfill pending requests)        │
│  • Revoke: 5 licenses (return to inventory)              │
│  • Keep: 0 licenses                                       │
│                                                            │
│  Financial Impact:                                         │
│  • Cost Avoided: 20,000 THB/year (no new purchase)       │
│  • Cost Saved: 50,000 THB/year (5 revoked)               │
│  • Total: 70,000 THB/year                                 │
│                                                            │
│  Timeline:                                                 │
│  1. Day 1: Notify source users (7-day grace period)       │
│  2. Day 7: Revoke from Marketing                          │
│  3. Day 7: Assign to Analytics                            │
│  4. Day 7: Mark requests as fulfilled                     │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  ⚙️ Configuration                                           │
│                                                            │
│  ☑ Notify source users (7-day notice before revocation)   │
│  ☑ Auto-assign to target users after revocation           │
│  ☐ Send memo to department managers                        │
│  ☑ Track cost savings in analytics                        │
│                                                            │
│  Additional Actions:                                       │
│  ○ Reallocate selected licenses (2)                       │
│  ○ Revoke all inactive licenses (7)                       │
│  ● Reallocate (2) + Revoke remaining (5) [Recommended]   │
│                                                            │
└────────────────────────────────────────────────────────────┘

[Cancel] [Save Draft] [Schedule Execution] [Execute Now]
```

---

### 5.4 Feature 1: Cross-Subsidiary Software Match

#### Screen: Similar Software Detection

**URL**: `/recommendations/cross-sub-match`

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  🔍 Similar Software Detection                              │
│  AI-powered analysis of duplicate tools across subsidiaries│
│                                                            │
│  Scope: [● Group (All 25 subsidiaries)]                   │
│  Category: [All ▼]  Similarity: [>80% ▼]                 │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Found 12 groups of similar software across subsidiaries   │
│  Potential Savings: 5.2M THB/year                          │
│                                                            │
│  [Sort by: Savings (High to Low) ▼]                       │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Group 1: Project Management Tools     Similarity: 87% │ │
│  │                                                       │ │
│  │ ┌────────────────┐  ┌────────────────┐              │ │
│  │ │ Asana          │  │ Monday.com     │              │ │
│  │ │ SCB Data X     │  │ SCB TechX      │              │ │
│  │ │ 50 users       │  │ 35 users       │              │ │
│  │ │ 180k THB/year  │  │ 140k THB/year  │              │ │
│  │ └────────────────┘  └────────────────┘              │ │
│  │                                                       │ │
│  │ ┌────────────────┐  ┌────────────────┐              │ │
│  │ │ Trello         │  │ ClickUp        │              │ │
│  │ │ INVX           │  │ ABACUS         │              │ │
│  │ │ 25 users       │  │ 20 users       │              │ │
│  │ │ 60k THB/year   │  │ 80k THB/year   │              │ │
│  │ └────────────────┘  └────────────────┘              │ │
│  │                                                       │ │
│  │ 🤖 AI Analysis:                                       │ │
│  │ "All tools provide task management, kanban boards,    │ │
│  │  team collaboration. 85% feature overlap detected.    │ │
│  │  Consolidation recommended."                          │ │
│  │                                                       │ │
│  │ Common Features: (8 of 12)                            │ │
│  │ ✓ Task Management  ✓ Kanban Boards  ✓ Collaboration  │ │
│  │ ✓ Time Tracking    ✓ Integrations   ✓ Mobile Apps    │ │
│  │                                                       │ │
│  │ Total: 4 tools, 130 users, 460k THB/year             │ │
│  │                                                       │ │
│  │ 💡 Consolidation Potential: 200k THB/year (43%)      │ │
│  │                                                       │ │
│  │ [View Consolidation Plan →] [Dismiss] [Export]       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Group 2: Communication Tools          Similarity: 92% │ │
│  │                                                       │ │
│  │ Slack (5 subsidiaries) vs Microsoft Teams (3)        │ │
│  │ Total: 8 subsidiaries, 850 users, 1.2M THB/year      │ │
│  │                                                       │ │
│  │ 💡 Consolidation Potential: 300k THB/year (25%)      │ │
│  │                                                       │ │
│  │ [View Details →]                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### 5.5 Feature 2: Group Contract Consolidation

#### Screen: Consolidation Opportunity Details

**URL**: `/recommendations/consolidation/:id`

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  ← Back to Similar Software                                │
│                                                            │
│  📊 Group Consolidation Opportunity                         │
│  Project Management Tools                                   │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  CURRENT STATE                                              │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Subsidiary    │ Tool     │ Users │ Cost/Year         │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ SCB Data X    │ Asana    │ 50    │ 180,000 THB      │ │
│  │ SCB TechX     │ Monday   │ 35    │ 140,000 THB      │ │
│  │ INVX          │ Trello   │ 25    │ 60,000 THB       │ │
│  │ ABACUS        │ ClickUp  │ 20    │ 80,000 THB       │ │
│  │                                                       │ │
│  │ TOTAL         │ 4 tools  │ 130   │ 460,000 THB/year │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  PROPOSED SOLUTION                                          │
│                                                            │
│  Consolidate to: Monday.com Enterprise (Group Plan)        │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🎯 Why Monday.com?                                    │ │
│  │                                                       │ │
│  │ ✓ Best feature coverage (95% of all required)        │ │
│  │ ✓ Already used by SCB TechX (easy expansion)         │ │
│  │ ✓ Group discount available (20% off)                 │ │
│  │ ✓ Enterprise support included                        │ │
│  │ ✓ SCBX-approved vendor                               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Group Pricing:                                            │
│  • 130 users @ 2,500 THB/user/year                        │
│  • Base Cost: 325,000 THB/year                            │
│  • Group Discount (20%): -65,000 THB                      │
│  • Final Cost: 260,000 THB/year                           │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  💰 FINANCIAL IMPACT                                        │
│                                                            │
│  [Chart: Bar graph showing current vs proposed]            │
│                                                            │
│  Current:  460,000 THB/year  ████████████████████          │
│  Proposed: 260,000 THB/year  ██████████                    │
│                                                            │
│  Savings: 200,000 THB/year (43% reduction)                 │
│                                                            │
│  ROI Calculation:                                          │
│  • Migration Cost (one-time): 50,000 THB                  │
│  • Annual Savings: 200,000 THB                            │
│  • Payback Period: 3 months                               │
│  • 3-Year Savings: 550,000 THB                            │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  📅 IMPLEMENTATION PLAN                                     │
│                                                            │
│  Timeline: 8 weeks                                         │
│                                                            │
│  Phase 1 (Weeks 1-2): Approval & Contracting              │
│  • Get subsidiary CTO approvals                            │
│  • Negotiate group contract                                │
│  • Finalize pricing                                        │
│                                                            │
│  Phase 2 (Weeks 3-5): Migration                           │
│  • Set up Monday.com enterprise                            │
│  • Migrate data from current tools                         │
│  • User training sessions                                  │
│                                                            │
│  Phase 3 (Weeks 6-8): Go-Live                             │
│  • Gradual rollout per subsidiary                          │
│  • Decommission old tools                                 │
│  • Monitor adoption                                        │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  ⚠️ RISKS & MITIGATION                                     │
│                                                            │
│  • User resistance: Comprehensive training program         │
│  • Data migration: Dedicated migration support            │
│  • Feature gaps: Custom workflows available               │
│                                                            │
└────────────────────────────────────────────────────────────┘

[← Back] [Generate Business Case Memo →] [Approve Plan] [Reject]
```

---

### 5.6 Feature 2: AI-Generated Business Case Memo

#### Screen: Memo Preview

**URL**: `/memos/generate`

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  📄 Business Case Memo                                      │
│  AI-Generated • Editable                                   │
│                                                            │
│  [Export PDF] [Send for Review] [Save Draft]              │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  [Rich Text Editor - AI Generated Content]                 │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ MEMORANDUM                                            │ │
│  │                                                       │ │
│  │ TO:      Subsidiary CTOs (SCB Data X, SCB TechX,     │ │
│  │          INVX, ABACUS)                                │ │
│  │ FROM:    Michelle Chen, Group CTO                     │ │
│  │ CC:      Finance Team, IT Leadership                  │ │
│  │ DATE:    October 21, 2025                            │ │
│  │ RE:      Proposal for Project Management Software     │ │
│  │          Consolidation                                │ │
│  │                                                       │ │
│  │ ═══════════════════════════════════════════════════  │ │
│  │                                                       │ │
│  │ EXECUTIVE SUMMARY                                     │ │
│  │                                                       │ │
│  │ This memo proposes consolidating project management  │ │
│  │ tools across four SCBX subsidiaries to Monday.com    │ │
│  │ Enterprise, resulting in 200,000 THB annual savings  │ │
│  │ (43% cost reduction) while improving cross-          │ │
│  │ subsidiary collaboration and standardization.        │ │
│  │                                                       │ │
│  │ ─────────────────────────────────────────────────    │ │
│  │                                                       │ │
│  │ CURRENT STATE ANALYSIS                                │ │
│  │                                                       │ │
│  │ Our analysis reveals that 4 subsidiaries are         │ │
│  │ currently using different project management tools   │ │
│  │ with significant feature overlap (87% similarity).   │ │
│  │                                                       │ │
│  │ Current Landscape:                                    │ │
│  │ • SCB Data X: Asana (50 users, 180k THB/year)       │ │
│  │ • SCB TechX: Monday.com (35 users, 140k THB/year)   │ │
│  │ • INVX: Trello (25 users, 60k THB/year)             │ │
│  │ • ABACUS: ClickUp (20 users, 80k THB/year)          │ │
│  │                                                       │ │
│  │ Total Annual Cost: 460,000 THB                       │ │
│  │ User Count: 130 across 4 subsidiaries               │ │
│  │                                                       │ │
│  │ Key Issues:                                           │ │
│  │ • Fragmented collaboration across subsidiaries       │ │
│  │ • Duplicate training and admin overhead              │ │
│  │ • Missed volume discount opportunities               │ │
│  │ • Inconsistent project visibility                    │ │
│  │                                                       │ │
│  │ ─────────────────────────────────────────────────    │ │
│  │                                                       │ │
│  │ PROPOSED SOLUTION                                     │ │
│  │                                                       │ │
│  │ Consolidate to Monday.com Enterprise with group      │ │
│  │ contract covering all 4 subsidiaries.                │ │
│  │                                                       │ │
│  │ Rationale for Monday.com:                            │ │
│  │ 1. Highest feature coverage (95%)                    │ │
│  │ 2. Already deployed in SCB TechX (proven success)    │ │
│  │ 3. Group discount available (20%)                    │ │
│  │ 4. Enterprise support and SLA                        │ │
│  │ 5. SCBX-approved vendor                              │ │
│  │                                                       │ │
│  │ [Continue reading...]                                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [Edit sections with AI assistance]                        │
│  [Add custom sections]                                     │
│  [Change tone: Professional / Concise / Detailed]         │
│                                                            │
└────────────────────────────────────────────────────────────┘

[← Back] [Save Draft] [Preview PDF] [Send for Stakeholder Review →]
```

---

## 6. Component Library

### 6.1 Core Components

#### Button Variants

```
┌─────────────────────────────────────────────────┐
│ Button Styles                                   │
│                                                 │
│ [Primary Button]     - Main actions             │
│ [Secondary Button]   - Secondary actions        │
│ [Danger Button]      - Delete, Reject           │
│ [Ghost Button]       - Tertiary actions         │
│ [Icon Button 🗑]     - Icon only                │
│                                                 │
│ [← Back Button]      - Navigation               │
│ [Button →]           - Forward navigation       │
│                                                 │
│ [Loading Button...]  - Processing state         │
│ [Disabled Button]    - Disabled state           │
└─────────────────────────────────────────────────┘
```

#### Cards

```
┌─────────────────────────────────────────────────┐
│ Standard Card                                   │
│                                                 │
│ Content goes here                               │
│                                                 │
│ [Action Button]                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Card with Icon        [Icon]                    │
│                                                 │
│ Title                                           │
│ Description text                                │
│                                                 │
│ Metric: 1,234                                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Interactive Card (Hover effect)                 │
│                                                 │
│ ✓ Selected state                                │
│ [Action on hover]                               │
└─────────────────────────────────────────────────┘
```

#### Input Fields

```
┌─────────────────────────────────────────────────┐
│ Text Input:                                     │
│ [___________________________________]            │
│                                                 │
│ Text Input with Icon:                           │
│ [🔍 Search...____________________]              │
│                                                 │
│ Dropdown:                                       │
│ [Select option              ▼]                  │
│                                                 │
│ Multi-select:                                   │
│ [x Option 1] [x Option 2] [+ Add]              │
│                                                 │
│ Text Area:                                      │
│ ┌─────────────────────────────────────┐        │
│ │ Multi-line text input               │        │
│ │                                     │        │
│ └─────────────────────────────────────┘        │
│                                                 │
│ Date Picker:                                    │
│ [📅 Select Date]                                │
└─────────────────────────────────────────────────┘
```

#### Status Badges

```
🟢 Active     🟡 Pending    🔴 Rejected
🔵 In Review  ⚫ Inactive    ⚪ Draft
```

#### Progress Indicators

```
Step 1 of 3: ████████░░░░░░░░░░ 40%

Loading: ⟳ Processing...

Timeline:
├─ Completed ✓
├─ In Progress ⟳
└─ Pending ○
```

---

### 6.2 AI-Specific Components

#### AI Recommendation Card

```
┌─────────────────────────────────────────────────┐
│ ✨ AI Recommendation              [95% match]   │
│                                                 │
│ [App Icon]  Application Name                    │
│             Tier: Pro                           │
│                                                 │
│ 💰 12,000 THB/year                              │
│                                                 │
│ 🤖 Why recommended:                             │
│ "Based on job description mentions of API       │
│  development and team size..."                  │
│                                                 │
│ [Why?] [Remove] [✓ Selected]                    │
└─────────────────────────────────────────────────┘
```

#### AI Processing State

```
┌─────────────────────────────────────────────────┐
│           🤖 AI is analyzing...                  │
│                                                 │
│           [Animated spinner]                    │
│                                                 │
│     Analyzing job requirements and              │
│     matching with software catalog              │
│                                                 │
│           Estimated time: 3-5 seconds           │
└─────────────────────────────────────────────────┘
```

#### Confidence Score Indicator

```
🟢 High Confidence: 90-100%
🟡 Medium Confidence: 70-89%
🔴 Low Confidence: < 70%

Visual: ████████░░ 85%
```

---

## 7. Interaction Patterns

### 7.1 AI Recommendation Acceptance Flow

1. **View AI Suggestions**
   - Cards displayed in grid
   - Confidence scores visible
   - "Why?" tooltip available

2. **Review Rationale** (Click "Why?")
   - Modal opens with detailed explanation
   - Feature matching details
   - Peer usage stats
   - Close or accept

3. **Customize Selection**
   - Click to select/deselect
   - Add more apps manually
   - Adjust tiers

4. **See Live Updates**
   - Total cost updates in real-time
   - Budget remaining updates
   - App count updates

5. **Submit**
   - Review summary
   - Confirm submission
   - Get confirmation

---

### 7.2 Reallocation Approval Flow

1. **View Opportunity**
   - See source and target
   - Understand impact

2. **View Details**
   - See all inactive users
   - See all pending requests
   - Review matching logic

3. **Configure Action**
   - Select users to revoke
   - Choose notification settings
   - Set timeline

4. **Confirm**
   - Review summary
   - Approve execution
   - Schedule or execute now

5. **Track Progress**
   - See timeline
   - Monitor notifications
   - View results

---

### 7.3 Bulk Actions

**Pattern**: Select Multiple → Choose Action → Confirm

```
[Checkbox grid of items]

[Select All] [Deselect All] [Select: Top 10]

Selected: 5 items

[Bulk Actions ▼]
  - Approve All
  - Reject All
  - Export Selection
  - Delete Selection

[Apply]
```

---

## 8. Visual Design System

### 8.1 Color Usage

**Primary Actions**: Blue (#3B82F6)
- Submit buttons
- Primary CTAs
- Selected states

**Success**: Green (#10B981)
- Approved status
- Savings indicators
- Success messages

**Warning**: Amber (#F59E0B)
- Pending status
- Inactive users
- Attention needed

**Danger**: Red (#EF4444)
- Reject actions
- Delete buttons
- Critical alerts

**Neutral**: Gray (#64748B)
- Secondary actions
- Disabled states
- Borders

---

### 8.2 Typography Scale

```
H1: 36px / 700 weight - Page titles
H2: 30px / 700 weight - Section titles
H3: 24px / 600 weight - Card titles
H4: 20px / 600 weight - Subsections
Body: 16px / 400 weight - Content
Small: 14px / 400 weight - Metadata
Tiny: 12px / 400 weight - Labels
```

---

### 8.3 Icon System

**Navigation**: Outline icons
**Actions**: Solid icons on hover
**Status**: Solid colored icons

Key Icons:
- 🏠 Dashboard
- 💡 Recommendations
- 📋 Requests
- 📦 Licenses
- 👥 Team
- 📊 Analytics
- ⚙️ Settings
- 🤖 AI Features

---

## 9. Responsive Design

### 9.1 Breakpoints

```
Mobile:  320px - 767px
Tablet:  768px - 1023px
Desktop: 1024px+
```

### 9.2 Mobile Adaptations

**Navigation**:
- Hamburger menu
- Bottom tab bar for key actions
- Swipe gestures

**Cards**:
- Stack vertically
- Full-width on mobile
- Simplified information

**Tables**:
- Horizontal scroll
- Card view alternative
- Show/hide columns

**Forms**:
- Full-width inputs
- Larger touch targets (min 44px)
- Native date/time pickers

---

## 10. Accessibility Guidelines

### 10.1 WCAG 2.1 AA Compliance

**Color Contrast**:
- Text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: Clear focus states

**Keyboard Navigation**:
- All actions accessible via keyboard
- Clear focus indicators
- Logical tab order
- Skip links available

**Screen Reader Support**:
- Semantic HTML
- ARIA labels where needed
- Alt text for all images
- Form labels properly associated

**Responsive Text**:
- Minimum 16px font size
- Allow text resize up to 200%
- No horizontal scrolling

---

## Appendix A: Figma/Adobe XD Design Checklist

### Components to Create:

1. **Navigation**
   - [ ] Top nav bar
   - [ ] Mobile menu
   - [ ] Breadcrumbs

2. **Cards**
   - [ ] Standard card
   - [ ] AI recommendation card
   - [ ] Optimization opportunity card
   - [ ] Stats card

3. **Forms**
   - [ ] Text inputs
   - [ ] Dropdowns
   - [ ] Text areas
   - [ ] Date pickers
   - [ ] Checkboxes/radios

4. **Buttons**
   - [ ] Primary
   - [ ] Secondary
   - [ ] Danger
   - [ ] Ghost
   - [ ] Icon buttons

5. **Modals**
   - [ ] Confirmation
   - [ ] AI rationale
   - [ ] Detail view

6. **Status Indicators**
   - [ ] Badges
   - [ ] Progress bars
   - [ ] Loading states

7. **Data Display**
   - [ ] Tables
   - [ ] Charts (bar, line, pie)
   - [ ] Metrics cards

8. **AI Components**
   - [ ] Processing indicator
   - [ ] Confidence score
   - [ ] Rationale display
   - [ ] Recommendation grid

---

## Appendix B: Screen Priorities

### Phase 1 (MVP):
1. ✅ Login
2. ✅ Dashboard (Employee)
3. ⭐ **Feature 3**: JD → License Matching (3 screens)
4. **Feature 4**: Purchase Templates (2 screens)
5. Basic Request Approval

### Phase 2:
6. **Feature 5**: Seat Optimization with Reallocation (3 screens)
7. Dashboard (Manager & CTO)
8. Analytics screens

### Phase 3:
9. **Feature 1**: Cross-Sub Software Match
10. **Feature 2**: Group Consolidation + Memo Generation
11. Advanced analytics

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-21 | System | Initial UX specification |
| 2.0 | 2025-10-21 | System | Complete rewrite aligned with requirement.md v2.3, focused on 6 Core Features, ready for UX Pilot |

---

**End of UX/UI Specification Document v2.0**
