# UX Pilot Prompt 04: Feature 5 - Seat Optimization with Reallocation

## Build Screens (3 screens)
1. Optimization Dashboard Overview
2. Reallocation Details Modal
3. Execution Confirmation

## Feature Overview
CTO identifies inactive licenses and can revoke, reallocate, or downgrade them

## Screen 1: Optimization Dashboard (/recommendations/seat-optimization)

### Header Section
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
└────────────────────────────────────────────────────────────┘
```

### Tabs and Filters
```
┌────────────────────────────────────────────────────────────┐
│  Tabs: [All (45)] [Revoke (20)] [● Reallocate (15)]       │
│        [Downgrade (10)]                                    │
│                                                            │
│  Filters:                                                  │
│  Company: [SCB Data X ▼] Department: [All ▼]              │
│  App: [All ▼] Sort: [Impact (High to Low) ▼]             │
└────────────────────────────────────────────────────────────┘
```

### Reallocation Opportunity Cards
```
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
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 💸 Revoke Opportunity                  ⭐⭐⭐ High    │ │
│  │                                                       │ │
│  │ Application: Figma Pro                                │ │
│  │                                                       │ │
│  │ User: James Lee (Marketing)                           │ │
│  │ • Last active: 150 days ago                           │ │
│  │ • No activity in 90+ days                             │ │
│  │                                                       │ │
│  │ 💰 Savings: 8,000 THB/year                           │ │
│  │                                                       │ │
│  │ [Revoke] [Contact User First] [Dismiss]             │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘

[Bulk Actions: [Select Multiple] [Apply Selected] [Export]]
```

### Components
- Summary cards: Large numbers, colored icons, click to filter
- Tabs: Show counts, active tab highlighted
- Opportunity cards: White background, priority stars, action buttons
- Priority indicators: ⭐⭐⭐ High, ⭐⭐ Medium, ⭐ Low
- Impact metrics: Bold numbers with currency

## Screen 2: Reallocation Details Modal (/recommendations/seat-optimization/:id/details)

### Layout (Full page or large modal)
```
┌────────────────────────────────────────────────────────────┐
│  ← Back to Optimizations                                   │
│                                                            │
│  🔄 Reallocation Details                                   │
│  Tableau Pro • Marketing → Analytics                       │
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
│                               │   "Data viz & reports"     │
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
└────────────────────────────────────────────────────────────┘

[Cancel] [Save Draft] [Schedule Execution] [Execute Now]
```

### Components
- Two-column layout: Source | Target
- User cards: Checkboxes, user info, activity data
- Match indicators: Arrows showing reallocation flow
- Impact summary: Key metrics highlighted
- Configuration checkboxes: Options for execution
- Timeline: Step-by-step with dates

## Screen 3: Execution Confirmation Modal

```
┌────────────────────────────────────────────────────────────┐
│  ⚠️ Confirm License Reallocation                           │
│                                                            │
│  You are about to execute the following actions:          │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Action Summary:                                       │ │
│  │                                                       │ │
│  │ Revoke from:                                          │ │
│  │ • Sarah Chen (Marketing)                              │ │
│  │ • Mike Wong (Marketing)                               │ │
│  │ • 3 more users...                                     │ │
│  │                                                       │ │
│  │ Assign to:                                            │ │
│  │ • David Liu (Analytics)                               │ │
│  │ • Emma Tan (Analytics)                                │ │
│  │                                                       │ │
│  │ Notice period: 7 days                                 │ │
│  │ Total cost savings: 70,000 THB/year                   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ⚠️ This action cannot be undone after execution           │
│                                                            │
│  [Cancel] [Confirm Execution]                              │
└────────────────────────────────────────────────────────────┘
```

After confirmation, show success message:
```
┌────────────────────────────────────────────────────────────┐
│  ✅ Reallocation Scheduled Successfully!                   │
│                                                            │
│  Timeline:                                                 │
│  • Day 1 (Today): Notifications sent to source users      │
│  • Day 7: Licenses revoked from Marketing                 │
│  • Day 7: Licenses assigned to Analytics                  │
│  • Analytics requests marked as "Fulfilled"               │
│                                                            │
│  [View Timeline] [Back to Optimizations]                   │
└────────────────────────────────────────────────────────────┘
```

### Interactions
- Click "View Details" on card → Open Screen 2
- Select/deselect users → Update impact calculation
- Click "Execute Now" → Show confirmation modal
- After confirm → Show success + timeline
- Click "Save Draft" → Save for later review

