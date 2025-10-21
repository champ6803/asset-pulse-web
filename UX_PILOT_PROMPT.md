# Asset Pulse - SAM Platform UX Prompt

AI-powered Software Asset Management for SCBX Group (25 subs, 1000+ employees, 35+ apps). Reduce costs 20-30% via intelligent recommendations.

## Tech & Design
React/Next.js, Tailwind, Heroicons, Inter | AI-first, dashboard-driven, 2-click rule, cost transparency, enterprise clean UI

**Colors**: Primary #1E3A8A | Secondary #3B82F6 | Success #10B981 | Warning #F59E0B | Danger #EF4444 | BG #F8FAFC
**Spacing**: Cards 12px radius | Buttons 8px | Inputs 6px | Shadow: 0 1px 3px rgba(0,0,0,0.1)

## 4 Roles
1. **Employee/HR**: Dashboard | My Licenses | Requests
2. **Manager**: Dashboard | Team | Templates ⭐ | Approvals
3. **Subsidiary CTO**: Dashboard | Optimization | Analytics
4. **Group CTO**: Consolidation ⭐ | Similar Software ⭐ | Memos

## 6 Core Features (Priority Screens)

### F3: JD→License Matching ⭐⭐⭐ PRIORITY
**Screen 1** (/requests/new-hire): Form with Full Name*, Job Title*, Department*, Company, Email, Start Date, Job Description* (50+ chars) | Tip: "Detailed JD = better AI recs" | [Cancel][Next: Get AI Recs →]

**Screen 2** (/recommendations): Header "✨ AI Recommendations | For: John Doe - Sr SWE | Confidence: 🟢 95% • 48k THB/y" | Filters: [All|DevOps|Collab] Sort [Relevance▼] | Grid 3x4 cards:
```
┌──────────┐
│✓ [Icon]  │
│GitHub    │
│Enterprise│
│DevOps    │
│98%████░  │
│10k THB/y │
│[Why?][X] │
└──────────┘
```
Cards show: icon, name, tier, category, relevance bar, cost, [Why?][Remove] | [+Add More][Use Template] | Sidebar: Total apps, cost, budget✓, remaining, approver, est. time | [←Back][Save][Submit→]

**"Why?" Modal**: AI rationale - "Job mentions API+CI/CD" | "95% of Sr SWEs use this" | "Dept standard"

**Screen 3** (/confirmation): ✅ Submitted! | ID #REQ-123 | Status 🟡 Pending | Next: David reviews (Oct 24), Email notify, Auto-assign | [View][Create Another][Home]

### F4: Purchase Templates
**Screen** (/templates): Header "📋 Purchase Templates" | [+Create][Search] | Filters: [All(12)][Active(10)][Draft(2)] Dept[IT▼] | Cards:
```
┌─────────────────────────┐
│📦 Software Engineer-Backend│
│Dept: IT | Type: New Hire │
│Apps: 8 | 45k THB/y       │
│Budget: 60k✓ | 🟢 Active  │
│Sep 15 | 2h ago (24x)    │
│[View][Edit][Clone][Off] │
└─────────────────────────┘
```
**Create Modal**: Name, Description, Target(radio), Scope, Budget | App grid: search, filters, checkboxes(Include/Required/Editable) | Sidebar: totals | [Save][Publish]

### F5: Seat Optimization ⭐⭐
**Dashboard** (/seat-optimization): Cards [Revoke: 20 lic, 45k/mo][Reallocate: 15 lic, 28k avoid][Downgrade: 10, 12k/mo] | Tabs: [All(45)][Revoke(20)][●Reallocate(15)][Downgrade(10)] | Filters: Company, Dept, App, Sort | Opportunity card:
```
┌────────────────────────┐
│🔄 Reallocation ⭐⭐⭐     │
│Tableau Pro             │
│From: Marketing (7×90d) │
│To: Analytics (2 pending)│
│Transfer:2|Avoid:20k    │
│🤖 "Marketing reduced   │
│usage, Analytics needs" │
│[Details][Approve][X]   │
└────────────────────────┘
```
**Details** (/:id/details): Two-column SOURCE (Marketing, ☑Sarah 120d inactive, ☑Mike 95d) | TARGET (Analytics, →David 5d request "Dashboard", →Emma 3d "Reports") | Impact: Transfer 2, Revoke 5, 70k/y | Timeline: D1 notify→D7 revoke+assign | Config: ☑Notify(7d) ☑Auto-assign | Actions: ●Reallocate(2)+Revoke(5) | [Cancel][Save][Schedule][Execute]

### F1: Cross-Sub Software Match
**Screen** (/cross-sub-match): Scope ●Group(25) | Category[All▼] | Similarity[>80%▼] | "12 groups | 5.2M THB/y potential" | Cards:
```
┌──────────────────────────┐
│PM Tools | 87% match       │
│[Asana DataX 50u 180k]    │
│[Monday TechX 35u 140k]   │
│+Trello(INVX 60k)+ClickUp │
│🤖 "85% overlap"          │
│Common: ✓Task ✓Kanban     │
│4 tools, 130u, 460k/y     │
│💡 Savings: 200k/y (43%)  │
│[View Consolidation→][X]  │
└──────────────────────────┘
```

### F2: Group Consolidation + Memo
**Details** (/consolidation/:id): Current table: Sub|Tool|Users|Cost | Proposed: Monday.com Enterprise 130u@2.5k, discount 20%, Final 260k | Why: ✓Coverage 95% ✓Used ✓Discount ✓Support | Chart: 460k→260k, 200k savings(43%), ROI 3mo | 8wk timeline | Risks+mitigations | [←Back][Generate Memo→][Approve][Reject]

**Memo** (/memos/generate): Rich editor with AI content "MEMORANDUM | TO: CTOs | FROM: Michelle | RE: PM Consolidation | EXECUTIVE SUMMARY: Consolidate 4 tools to Monday.com, 200k savings, improve collab... | CURRENT|PROPOSED|FINANCIAL|IMPLEMENTATION" | [Edit][PDF][Send Review]

### F6: Pay-Per-Use
**Screen** (/payg): Table: Name|App|Freq|Seat$|PAYG$|Savings|Action | Line chart: usage over time | Break-even cards: cost comparison, crossover, recommendation | Risk badges: Low/Med/High | [Switch to PAYG][Keep Seat]

## Components

**Nav**: Fixed top (Logo|Links|🔍|🔔3|👤▼) | Sidebar (role menu)
**Cards**: Standard(white, shadow, 12px) | Stats(icon+metric+trend) | Interactive(hover) | Selectable(checkbox)
**Buttons**: Primary(blue) | Secondary(outline) | Danger(red) | Ghost | Icon(24px) | Loading
**Inputs**: Text[__] | Search[🔍] | Dropdown[▼] | Multi[xTag] | Textarea | Date[📅] | Validation
**Status**: 🟢Active 🟡Pending 🔴Rejected 🔵Review ⚫Inactive ⚪Draft
**Tables**: Sort | Search | Filter | Checkboxes | Pagination | CSV export | 3-dot actions | Hover
**Modals**: Confirm | Detail | Form | Backdrop | [X] | Esc
**AI**: ✨ sparkle | Confidence bar 0-100%(🟢>90 🟡70-89 🔴<70) | 🤖 Rationale tooltips | "🤖 Analyzing..." gradient loader
**Charts**: Bar(cost) | Line(trends) | Pie(distribution) | Area(usage) | Export
**Notifications**: Toast(✅⚠️❌) | Top-right | 5s auto-dismiss
**Progress**: Stepper [✓]→[⏳]→[ ] | Timeline | Loading skeleton

## Key Flows

**A-HR Onboarding(3min)**: Dashboard→New Hire→Form(John Doe, Sr SWE, JD)→[Get AI Recs]→3s loader→10 apps(GitHub 98%,Jira 95%)→[Why?]→Remove 2→Summary 8apps 40k→[Submit]→Modal→[Confirm]→✅ Success(#REQ-123,Pending,David by Oct 24)→[Home]

**B-CTO Reallocation(5min)**: Dashboard→Alert"85k savings"→[View]→Optimization→[Reallocate]→Tableau Card→[Details]→Matrix:Left(7 inactive) Right(2 requests)→Select 2+2→Config☑7d☑Auto→[Approve]→Modal→[Confirm]→✅ Timeline D1 notify, D7 revoke+assign

**C-Manager Template(10min)**: Templates→[Create]→"Data Analyst Pack"|Analytics|50k→[Add Apps]→Search"Tableau"→☑Include☑Required→+Jira,Slack→Sidebar:4apps,32k,18k left✓→[Preview]→[Publish]→✅ TPL-ANA-001→[View All]

**D-Group Consolidation(20min)**: Dashboard→"12 opportunities,5.2M"→[View]→●Group→Similar SW→PM tools 87%(4 tools,460k)→[View Consolidation]→Table→Monday.com 260k(-200k)→Chart→8wk plan→[Generate Memo]→5s→Preview SUMMARY...→[Edit]→[PDF]→[Send]→4 CTOs 7d review→Track

## Responsive
Desktop 1920→1024 (full) | Tablet 1023→768 (collapsed sidebar) | Mobile 767→375 (hamburger, stacked, h-scroll tables)

## Accessibility
WCAG 2.1 AA | Keyboard(Tab/Enter/Esc) | Focus(2px blue) | ARIA | Alt | 4.5:1 contrast | Screen readers

## MVP (Phase 1)
1. Login+Role 2. Employee Dashboard 3. ⭐New Hire Wizard(F3)-3 screens 4. Templates(F4)-2 screens 5. Approval Queue 6. Manager Dashboard 7. License Inventory
**Phase 2**: Seat Opt(F5), CTO dashboards, Analytics | **Phase 3**: Cross-sub(F1), Consolidation+Memo(F2), PAYG(F6)

## Deliverables
18 screens (all roles, 6 features, dashboards, approvals, inventory, settings) | 35+ components (Figma/Sketch) | Responsive(3 breakpoints) | Interactive prototype (4 flows) | Design system doc

**Inspiration**: Tailwind UI, shadcn/ui, Linear, Notion, Stripe Dashboard
