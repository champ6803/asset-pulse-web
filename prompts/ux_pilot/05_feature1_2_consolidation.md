# UX Pilot Prompt 05: Feature 1 & 2 - Cross-Sub Match + Consolidation

## Build Screens (4 screens)
1. Similar Software Detection (Feature 1)
2. Consolidation Opportunity Details (Feature 2)
3. AI-Generated Business Case Memo (Feature 2)
4. Approval Success

## Feature Overview
Group CTO identifies similar apps across subsidiaries → Recommends consolidation → Generates business memo

## Screen 1: Similar Software Detection (/recommendations/cross-sub-match)

### Layout
```
┌────────────────────────────────────────────────────────────┐
│  🔍 Similar Software Detection                              │
│  AI-powered analysis of duplicate tools across subsidiaries│
│                                                            │
│  Scope: [● Group (All 25 subsidiaries)]                   │
│  Category: [All ▼]  Similarity: [>80% ▼]                 │
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
└────────────────────────────────────────────────────────────┘
```

### Components
- Similarity groups: Large cards with nested app cards
- App mini-cards: Grid layout, show key info (company, users, cost)
- AI analysis: Highlighted section with rationale
- Feature checkmarks: Visual indicators of overlap
- Savings badge: Large number, green background

## Screen 2: Consolidation Opportunity Details (/recommendations/consolidation/:id)

### Layout
```
┌────────────────────────────────────────────────────────────┐
│  ← Back to Similar Software                                │
│                                                            │
│  📊 Group Consolidation Opportunity                         │
│  Project Management Tools                                   │
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
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  📅 IMPLEMENTATION PLAN                                     │
│                                                            │
│  Timeline: 8 weeks                                         │
│                                                            │
│  Phase 1 (Weeks 1-2): Approval & Contracting              │
│  • Get subsidiary CTO approvals                            │
│  • Negotiate group contract                                │
│                                                            │
│  Phase 2 (Weeks 3-5): Migration                           │
│  • Set up Monday.com enterprise                            │
│  • Migrate data from current tools                         │
│                                                            │
│  Phase 3 (Weeks 6-8): Go-Live                             │
│  • Gradual rollout per subsidiary                          │
│  • Decommission old tools                                 │
└────────────────────────────────────────────────────────────┘

[← Back] [Generate Business Case Memo →] [Approve Plan] [Reject]
```

### Components
- Current state table: Clear data presentation
- Proposed solution card: Highlighted with checkmarks
- Financial chart: Visual comparison bars
- ROI metrics: Key numbers highlighted
- Timeline: Phased approach with milestones

## Screen 3: AI-Generated Business Case Memo (/memos/generate)

### Layout
```
┌────────────────────────────────────────────────────────────┐
│  📄 Business Case Memo                                      │
│  AI-Generated • Editable                                   │
│                                                            │
│  [Export PDF] [Send for Review] [Save Draft]              │
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
│  │ [Scroll for more content...]                         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [Edit with AI] [Regenerate Section] [Add Custom Section] │
│  [Change Tone: Professional / Concise / Detailed]         │
└────────────────────────────────────────────────────────────┘

[← Back] [Save Draft] [Preview PDF] [Send for Review →]
```

### Components
- Rich text editor: Full formatting toolbar
- Memo template: Professional business format
- AI assistance buttons: Regenerate, edit tone
- Export options: PDF, Word, Email

## Screen 4: Approval Success

```
┌────────────────────────────────────────────────────────────┐
│                 ✅ Memo Sent for Review!                    │
│                                                            │
│  Your consolidation proposal has been sent to:             │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Recipients:                                           │ │
│  │ • CTO, SCB Data X                                     │ │
│  │ • CTO, SCB TechX                                      │ │
│  │ • CTO, INVX                                           │ │
│  │ • CTO, ABACUS                                         │ │
│  │ • Finance Team                                        │ │
│  │                                                       │ │
│  │ Review Period: 7 days                                 │ │
│  │ Deadline: Oct 28, 2025                               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [Track Approvals] [View Memo] [Back to Dashboard]        │
└────────────────────────────────────────────────────────────┘
```

