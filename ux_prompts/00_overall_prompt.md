# Asset Pulse - Overall UX Pilot Prompt

## Project Overview
Asset Pulse is an AI-powered Software Asset Management (SAM) platform for SCBX Group (25+ subsidiaries). The system uses LLM/AI to optimize software licensing costs, automate provisioning, and provide intelligent recommendations across 6 core features.

## Design Language
**Style**: Modern, clean, professional, enterprise-grade web application

**Colors**:
- Primary: #1E3A8A (Deep Blue) - Main actions, navigation
- Secondary: #3B82F6 (Bright Blue) - Highlights, links
- Success: #10B981 (Green) - Approvals, savings
- Warning: #F59E0B (Amber) - Pending, attention needed
- Danger: #EF4444 (Red) - Rejections, critical alerts
- Neutral: #64748B (Slate Gray) - Secondary elements
- Background: #F8FAFC (Light Gray)
- Surface: #FFFFFF (White cards)
- Text: #0F172A (Near Black)

**Typography**: Inter font family
- Headings: Bold 600-700 weight
- Body: Regular 400 weight
- Sizes: H1 36px, H2 30px, H3 24px, Body 16px, Small 14px

**Layout**:
- Grid: 8px base unit spacing
- Border radius: Buttons 8px, Cards 12px, Modals 16px
- Shadows: Subtle on cards, stronger on modals
- Icons: Heroicons style (20px, 24px, 32px)

## Core Design Principles
1. **AI-First Experience**: Prominent AI recommendations with transparent rationale
2. **Clarity & Simplicity**: Clear hierarchy, minimal cognitive load, obvious next actions
3. **Data-Driven**: Dashboard-first, actionable insights, visual data representation
4. **Efficiency**: 2-click rule, bulk operations, smart defaults
5. **Trust & Transparency**: Clear workflows, audit trails, cost transparency

## User Roles (4 Types)
1. **Employee/HR**: Request software, view licenses, onboard new hires
2. **Department Manager**: Create templates, approve requests, view team usage
3. **Subsidiary CTO**: Optimize licenses, seat optimization, analytics
4. **Group CTO/Finance**: Cross-subsidiary consolidation, group strategy

## Navigation Structure
**Top Bar** (Fixed): Logo | Main Menu | Search | Notifications | Profile

**Main Menu** (Role-based):
- Employee: Dashboard, Recommendations, My Licenses, Requests
- Manager: Dashboard, Team, Templates, Approvals, Requests
- Sub CTO: Dashboard, Recommendations, Analytics, Team, Approvals
- Group CTO: Dashboard, Consolidation, Similar Software, Analytics, Memos

## 6 Core Features (Priority Order)

### Feature 3: AI Job Description → License Matching ⭐ PRIORITY
**Screens**: New Hire Form → AI Recommendations → Confirmation
**Flow**: HR enters job description → AI analyzes → Shows 10 recommended apps with rationale → Review/edit → Submit for approval
**AI Element**: Show confidence score (95%), relevance per app, "Why?" tooltip with reasoning
**Key Components**: Form with rich text area, AI recommendation cards grid, cost summary sidebar

### Feature 4: Purchase Templates
**Screens**: Template List → Create/Edit Template
**Flow**: Manager creates reusable software pack → Defines apps + tiers + budget → Save → Reuse for new hires
**Key Components**: Template cards, app selection grid, budget tracker, preview

### Feature 5: Seat Optimization with Reallocation ⭐ NEW
**Screens**: Optimization Dashboard → Reallocation Details
**Flow**: CTO views inactive licenses → See reallocation opportunities (source dept → target dept) → View details → Configure → Approve
**Tabs**: All | Revoke | Reallocate | Downgrade
**AI Element**: Smart matching of inactive licenses with pending requests
**Key Components**: Opportunity cards, two-column comparison (source vs target), impact analysis, timeline

### Feature 1: Cross-Subsidiary Software Match
**Screens**: Similar Software Detection
**Flow**: Group CTO views similar apps across subsidiaries → AI shows similarity scores → View consolidation potential
**AI Element**: Semantic analysis, similarity percentage, feature overlap detection
**Key Components**: App groups, similarity cards, feature comparison

### Feature 2: Group Consolidation + AI Memo
**Screens**: Consolidation Details → AI-Generated Memo
**Flow**: View consolidation opportunity → Financial analysis → Generate business case memo with AI → Edit → Send for review
**AI Element**: Auto-generate professional memo with executive summary, analysis, recommendations
**Key Components**: Current vs proposed comparison table, ROI calculator, rich text editor with AI content

### Feature 6: Pay-per-Use Optimization
**Screens**: Pay-per-Use Recommendations
**Flow**: CTO views low-usage users → See cost comparison (seat vs usage-based) → Approve switch
**Key Components**: Usage charts, break-even analysis, savings calculator

## Key Components Library

### AI Recommendation Card
```
┌────────────────────────────┐
│ ✨ 95% Match               │
│ [Icon] GitHub Enterprise   │
│ DevOps • 10,000 THB/year  │
│                            │
│ 🤖 Why: "Job mentions      │
│    CI/CD and code review"  │
│                            │
│ [Why?] [Remove] [✓]       │
└────────────────────────────┘
```

### Optimization Opportunity Card
```
┌────────────────────────────┐
│ 🔄 Reallocation ⭐⭐⭐     │
│                            │
│ Tableau Pro                │
│ From: Marketing (7 idle)   │
│ To: Analytics (2 requests) │
│                            │
│ 💰 Impact: 70k THB/year    │
│                            │
│ [Details] [Approve]        │
└────────────────────────────┘
```

### Status Badges
- 🟢 Active | 🟡 Pending | 🔴 Rejected | 🔵 In Review | ⚫ Inactive

### AI Processing State
```
┌────────────────────────────┐
│   🤖 AI is analyzing...     │
│   [Spinner animation]       │
│   Estimated: 3-5 seconds    │
└────────────────────────────┘
```

## Dashboard Layouts (Role-based)

### Employee Dashboard
- Top: Welcome message + Quick actions (Request Software, View Licenses)
- Cards: My Active Licenses (list), Pending Requests (status), AI Recommendations for Me

### Manager Dashboard
- Top: Team overview stats (Total licenses, Cost, Active users)
- Cards: Pending Approvals (queue), Team Usage (chart), Purchase Templates (quick access)

### CTO Dashboard
- Top: Optimization metrics (Potential savings, Inactive licenses, Pending optimizations)
- Cards: Seat Optimization (opportunities), Usage Analytics (charts), Approvals (high-value)

### Group CTO Dashboard
- Top: Group portfolio stats (25 subsidiaries, 87 apps, 45M THB/year)
- Cards: Consolidation Opportunities (list), Similar Software (groups), Strategic Analytics

## Interaction Patterns

### AI Recommendation Flow
1. View suggestions → 2. Click "Why?" for rationale → 3. Select/deselect → 4. Real-time cost update → 5. Submit

### Approval Flow
1. View request → 2. Review details → 3. Check budget → 4. Approve/Reject with comment → 5. Notification sent

### Reallocation Flow
1. View opportunity → 2. See source/target → 3. View details → 4. Configure settings → 5. Confirm → 6. Track timeline

### Bulk Actions
[Checkbox grid] → [Select multiple] → [Bulk Actions dropdown] → [Apply] → [Confirm]

## Mobile Responsive
- Breakpoints: Mobile (<768px), Tablet (768-1023px), Desktop (1024px+)
- Mobile: Hamburger menu, bottom tab bar, vertical stacking, full-width cards
- Touch targets: Minimum 44px height

## Accessibility
- WCAG 2.1 AA compliant
- Color contrast: Text 4.5:1, Large text 3:1
- Keyboard navigation: Tab order, focus states, skip links
- Screen reader: Semantic HTML, ARIA labels, alt text

## Animation & Micro-interactions
- Button hover: Slight scale + shadow
- Card hover: Lift effect with shadow
- Loading: Spinner with label
- Success: Check mark animation + green highlight
- Transition: 200-300ms ease timing

## Data Visualization
- Charts: Recharts library style
- Colors: Match design system
- Types: Bar (comparison), Line (trends), Pie (distribution), Area (usage over time)
- Interactive: Tooltips, legends, zoom/pan

## Form Validation
- Inline validation on blur
- Required fields marked with *
- Error messages below field in red
- Success state with green border
- Real-time validation for complex fields

## Empty States
- Icon + message + CTA button
- Example: "No recommendations yet. Create your first request to get AI suggestions."

## Error States
- Toast notifications for system errors
- Inline errors for form validation
- 404 page with navigation back
- Offline state with retry button

## Success States
- Confirmation screen with summary
- Next steps clearly stated
- Actions: View details, Create another, Back to home

## Implementation Notes
- Framework: React/Next.js with Tailwind CSS
- Component library: Headless UI or Radix UI
- Icons: Heroicons
- Charts: Recharts
- Tables: React Table
- Forms: React Hook Form + Zod validation
- State: React Query for API data
- Design handoff: Figma with Auto Layout and Components

## Character Count: ~6,800

