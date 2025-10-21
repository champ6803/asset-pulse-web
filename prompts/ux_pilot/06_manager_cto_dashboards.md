# UX Pilot Prompt 06: Manager & CTO Dashboards

## Build Screens (3 screens)
1. Department Manager Dashboard
2. Subsidiary CTO Dashboard
3. Group CTO Dashboard

## Screen 1: Department Manager Dashboard (/dashboard/manager)

### Top Navigation
```
┌──────────────────────────────────────────────────────────┐
│ [Asset Pulse]  Dashboard  Team  Templates  Approvals     │
│                                    [🔍] [🔔 5] [👤 David ▼]│
└──────────────────────────────────────────────────────────┘
```

### Main Content
```
┌────────────────────────────────────────────────────────────┐
│  👋 Welcome back, David                                    │
│  IT Department Manager • SCB Data X                        │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ 👥 Team Size │  │ 💰 Total Cost│  │ ⏳ Pending   │   │
│  │   45 Members │  │   2.4M THB/yr│  │   5 Approvals│   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
│  Quick Actions                                             │
│  [View Pending Approvals (5)]  [Create Template]          │
│  [View Team Usage]             [Generate Report]          │
│                                                            │
│  ──────────────────────────────────────────────────────  │
│                                                            │
│  Pending Approvals (5)                     [View All →]   │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📝 New Hire Request                                   │ │
│  │                                                       │ │
│  │ Employee: John Doe (Senior Software Engineer)        │ │
│  │ Requested by: Sarah Chen (HR)                        │ │
│  │ Applications: 10 apps                                 │ │
│  │ Total Cost: 48,000 THB/year                          │ │
│  │ Submitted: 2 days ago                                │ │
│  │                                                       │ │
│  │ [Review & Approve] [Reject] [Request Changes]        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📝 License Request                                    │ │
│  │                                                       │ │
│  │ Employee: Emma Wilson (Backend Developer)             │ │
│  │ Application: Postman Pro                              │ │
│  │ Cost: 18,000 THB/year                                │ │
│  │ Justification: "API testing for microservices"       │ │
│  │ Submitted: 1 day ago                                 │ │
│  │                                                       │ │
│  │ [Approve] [Reject] [Contact Employee]                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ──────────────────────────────────────────────────────  │
│                                                            │
│  Team License Overview                     [View All →]   │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Application       Active  Inactive  Cost/Month       │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ GitHub Enterprise  42      3        35,000 THB       │ │
│  │ Jira Software      38      7        22,000 THB       │ │
│  │ Slack Enterprise   45      0        18,000 THB       │ │
│  │ Postman Pro        25      5        15,000 THB       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ──────────────────────────────────────────────────────  │
│                                                            │
│  My Templates (3)                          [View All →]   │
│                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Backend Eng │  │ Frontend Dev│  │ DevOps Eng  │     │
│  │ 8 apps      │  │ 7 apps      │  │ 10 apps     │     │
│  │ Used: 24x   │  │ Used: 18x   │  │ Used: 12x   │     │
│  │ [Use]       │  │ [Use]       │  │ [Use]       │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└────────────────────────────────────────────────────────────┘
```

### Components
- Stat cards: 3 columns, large numbers, icons
- Approval cards: Expandable, show key info, action buttons
- License table: Sortable columns, color-coded status
- Template cards: Quick access, usage stats
- Quick action buttons: Primary and secondary styles

### Interactions
- Click "Review & Approve" → Open approval detail modal
- Click "View Team Usage" → Navigate to usage analytics
- Click template "Use" → Apply to new request
- Hover on inactive licenses → Show warning tooltip

## Screen 2: Subsidiary CTO Dashboard (/dashboard/cto)

### Main Content
```
┌────────────────────────────────────────────────────────────┐
│  👋 Welcome, Alex                                          │
│  CTO • SCB Data X                                          │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ 💰 Potential │  │ 📊 Total Apps│  │ 👥 Total Users│  │
│  │   Savings    │  │   87 Active  │  │   1,240       │  │
│  │ 85k THB/mo   │  │              │  │               │  │
│  │ [View Opps]  │  │              │  │               │  │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📈 Cost Trend (Last 6 Months)                        │ │
│  │                                                       │ │
│  │ [Line Chart showing monthly cost]                    │ │
│  │                                                       │ │
│  │ May   Jun   Jul   Aug   Sep   Oct                   │ │
│  │ 2.1M  2.3M  2.2M  2.4M  2.5M  2.4M                   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ──────────────────────────────────────────────────────  │
│                                                            │
│  Top Optimization Opportunities (3)        [View All →]   │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🔄 Reallocation Opportunity            ⭐⭐⭐         │ │
│  │                                                       │ │
│  │ Tableau Pro: Marketing (7 inactive) → Analytics (2)  │ │
│  │ Impact: 70,000 THB/year                              │ │
│  │                                                       │ │
│  │ [Review] [Quick Approve]                             │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 💸 Revoke Opportunity                  ⭐⭐⭐         │ │
│  │                                                       │ │
│  │ 15 inactive licenses (90+ days)                      │ │
│  │ Savings: 45,000 THB/year                             │ │
│  │                                                       │ │
│  │ [View Details] [Quick Approve]                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ⬇️ Downgrade Opportunity                ⭐⭐           │ │
│  │                                                       │ │
│  │ 8 users eligible for lower tier                      │ │
│  │ Savings: 12,000 THB/year                             │ │
│  │                                                       │ │
│  │ [View Details]                                        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ──────────────────────────────────────────────────────  │
│                                                            │
│  Department Breakdown                      [View Report →]│
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Department      Users  Apps  Cost/Month  Utilization │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ IT              450    32    800k THB    92%         │ │
│  │ Marketing       280    18    420k THB    78%         │ │
│  │ Analytics       220    15    380k THB    85%         │ │
│  │ HR              150    12    220k THB    88%         │ │
│  │ Finance         140    10    180k THB    91%         │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Components
- Savings card: Highlighted with CTA button
- Cost trend chart: Line graph, 6-month view
- Opportunity cards: Priority ranking, quick actions
- Department table: Utilization percentage with color coding
- Charts: Recharts library, responsive

### Key Interactions
- Click "View Opps" → Navigate to seat optimization
- Click "Quick Approve" → Show confirmation, execute
- Hover on department row → Show drill-down option
- Click department → Navigate to department details

## Screen 3: Group CTO Dashboard (/dashboard/group-cto)

### Main Content
```
┌────────────────────────────────────────────────────────────┐
│  👋 Welcome, Michelle                                      │
│  Group CTO • SCBX Group                                    │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ 🏢 Subsidiaries│ │ 💡 Consolidation│ │ 💰 Potential│  │
│  │   25 Active  │  │   12 Opportunities│ │   Savings  │  │
│  │              │  │              │  │ 5.2M THB/yr  │  │
│  │              │  │   [Review]   │  │   [Explore]  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📊 Group Portfolio Summary                            │ │
│  │                                                       │ │
│  │ Total Applications: 87                                │ │
│  │ Total Users: 12,450                                   │ │
│  │ Total Cost: 45M THB/year                             │ │
│  │                                                       │ │
│  │ [Pie Chart: Cost by Category]                        │ │
│  │ - Collaboration: 35%                                  │ │
│  │ - DevOps: 25%                                         │ │
│  │ - Security: 20%                                       │ │
│  │ - Analytics: 15%                                      │ │
│  │ - Other: 5%                                           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ──────────────────────────────────────────────────────  │
│                                                            │
│  Top Consolidation Opportunities (3)       [View All →]   │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🔍 Similar Software: Project Management               │ │
│  │                                                       │ │
│  │ 4 subsidiaries using different tools                  │ │
│  │ Similarity: 87%                                       │ │
│  │ Potential Savings: 200,000 THB/year (43%)            │ │
│  │                                                       │ │
│  │ [View Consolidation Plan] [Generate Memo]            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🔍 Similar Software: Communication Tools              │ │
│  │                                                       │ │
│  │ 8 subsidiaries: Slack (5) vs Teams (3)               │ │
│  │ Similarity: 92%                                       │ │
│  │ Potential Savings: 300,000 THB/year (25%)            │ │
│  │                                                       │ │
│  │ [View Details] [Generate Memo]                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ──────────────────────────────────────────────────────  │
│                                                            │
│  Top Subsidiaries by Spend                 [View All →]   │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [Bar Chart: Top 10 subsidiaries by annual cost]      │ │
│  │                                                       │ │
│  │ SCB:           12M THB/year                           │ │
│  │ SCB Data X:    8M THB/year                           │ │
│  │ INVX:          5M THB/year                           │ │
│  │ SCB TechX:     4M THB/year                           │ │
│  │ ...                                                   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ──────────────────────────────────────────────────────  │
│                                                            │
│  Recent Memos (2)                          [View All →]   │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📄 Project Management Consolidation                   │ │
│  │                                                       │ │
│  │ Status: ⏳ Pending Review (3/4 CTOs approved)        │ │
│  │ Savings: 200,000 THB/year                            │ │
│  │ Created: Oct 18, 2025                                │ │
│  │                                                       │ │
│  │ [View Memo] [Track Progress]                         │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Components
- Group-level stats: Large cards with strategic metrics
- Portfolio pie chart: Interactive, click to drill down
- Consolidation cards: High-level opportunities with CTAs
- Spend bar chart: Top 10 subsidiaries
- Memo tracking: Status with approval progress
- Strategic focus: Emphasis on savings and consolidation

### Interactions
- Click "Review" on consolidations → Navigate to cross-sub match
- Click "Generate Memo" → Open AI memo generator
- Click subsidiary in chart → View subsidiary details
- Click "Track Progress" → Show approval timeline
- Hover on pie chart segment → Show detailed breakdown

