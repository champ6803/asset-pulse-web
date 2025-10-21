# UX Pilot Prompt 03: Feature 4 - Purchase Templates

## Build Screens (2 screens)
1. Template Management List
2. Create/Edit Template Form

## Feature Overview
Department Managers create reusable software packages for common roles

## Screen 1: Template Management (/templates)

### Layout
```
┌────────────────────────────────────────────────────────────┐
│  📋 Purchase Templates                                      │
│  Create reusable software packages for common roles         │
│                                                            │
│  [+ Create New Template]                      [Search: ___]│
│                                                            │
│  Filters: [All (12)] [Active (10)] [Draft (2)]            │
│           Department: [IT ▼]  Scope: [All ▼]              │
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
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📦 Marketing Team - Essential                        │ │
│  │                                                       │ │
│  │ Department: Marketing                                 │ │
│  │ Type: Department Standard                            │ │
│  │                                                       │ │
│  │ Applications: 5                                       │ │
│  │ Cost: 28,000 THB/year per user                       │ │
│  │                                                       │ │
│  │ Status: ⚪ Draft                                      │ │
│  │ Created: Oct 18, 2025                                │ │
│  │ Times used: 0                                        │ │
│  │                                                       │ │
│  │ [View] [Edit] [Clone] [Publish]                     │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Components
- Template cards: White background, 12px radius, hover shadow
- Status badges: Green (Active), White (Draft)
- Action buttons: Ghost style, same height
- Search: Real-time filtering
- Filters: Chip-style toggles

### Interactions
- Click "Create New Template" → Navigate to Screen 2
- Click "Edit" → Navigate to Screen 2 with template data
- Click "Clone" → Duplicate template, open in edit mode
- Click "Deactivate" → Show confirmation modal
- Search → Filter templates by name/department

## Screen 2: Create/Edit Template (/templates/new or /templates/:id/edit)

### Step 1: Template Setup
```
┌────────────────────────────────────────────────────────────┐
│  ← Back to Templates                                       │
│                                                            │
│  Create Purchase Template                                  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Step 1 of 2: Template Information                    │ │
│  │                                                       │ │
│  │ Template Name *                                       │ │
│  │ [Software Engineer - Backend Team______________]     │ │
│  │                                                       │ │
│  │ Description                                           │ │
│  │ [Standard tools for backend developers________]     │ │
│  │                                                       │ │
│  │ Template Type *                                       │ │
│  │ ○ New Hire Onboarding                                 │ │
│  │ ○ Role-Based                                          │ │
│  │ ● Department Standard                                 │ │
│  │                                                       │ │
│  │ Target Department *                                   │ │
│  │ [IT - Backend Team          ▼]                       │ │
│  │                                                       │ │
│  │ Budget Limit (per user)                              │ │
│  │ [50,000] THB/year                                    │ │
│  │                                                       │ │
│  │                              [Cancel]  [Next Step →] │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Step 2: Select Applications
```
┌────────────────────────────────────────────────────────────┐
│  Create Purchase Template                                  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Step 2 of 2: Select Applications                     │ │
│  │                                                       │ │
│  │ [Search applications..._______________] [🔍]         │ │
│  │                                                       │ │
│  │ [All] [DevOps] [Collaboration] [Security] [Analytics]│ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ GitHub Enterprise                                     │ │
│  │ Pro Tier        10,000 THB/year                      │ │
│  │ ☑ Include       ☐ Required                           │ │
│  │ ☑ User can edit tier before approval                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Jira Software                                         │ │
│  │ Standard Tier   6,000 THB/year                       │ │
│  │ ☑ Include       ☑ Required                           │ │
│  │ ☐ User can edit tier before approval                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Slack Enterprise                                      │ │
│  │ Enterprise Tier 4,000 THB/year                       │ │
│  │ ☑ Include       ☐ Required                           │ │
│  │ ☑ User can edit tier before approval                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [+ Add More Apps]                                         │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📊 Summary                    │                       │ │
│  │                               │  [Sticky sidebar]     │ │
│  │ Total Apps: 8                 │                       │ │
│  │ Required: 3                   │                       │ │
│  │ Optional: 5                   │                       │ │
│  │                               │                       │ │
│  │ Total Cost: 45,000 THB/year   │                       │ │
│  │ Budget: 50,000 THB/year       │                       │ │
│  │ Remaining: 5,000 THB ✓        │                       │ │
│  │                               │                       │ │
│  │ [← Back]                      │                       │ │
│  │ [Save as Draft]               │                       │ │
│  │ [Publish Template]            │                       │ │
│  └──────────────────────────────┘                       │ │
└────────────────────────────────────────────────────────────┘
```

### Components
- Application cards: Expandable, checkboxes for include/required/editable
- Tier dropdown: Show available tiers per app
- Summary sidebar: Fixed position, always visible
- Budget indicator: Green if under budget, red if over
- Category filters: Chip-style, multi-select

### Validation
- Template name required, max 100 chars
- At least 1 application required
- Total cost must not exceed budget (warning, not blocking)
- Required apps automatically included

### Interactions
- Click "Include" → Add app to template, update cost
- Click "Required" → Mark as mandatory (cannot be removed by user)
- Click "User can edit" → Allow tier changes during request
- Search → Filter applications real-time
- Category filters → Show only apps in category
- Budget exceeded → Show warning badge, but allow save

