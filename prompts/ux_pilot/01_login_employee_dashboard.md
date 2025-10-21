# UX Pilot Prompt 01: Login + Employee Dashboard

## Build Screens (2 screens)
1. Login Screen
2. Employee/HR Dashboard

## Design System
- **Colors**: Primary #1E3A8A, Secondary #3B82F6, Success #10B981, Warning #F59E0B, Danger #EF4444, Neutral #64748B
- **Typography**: Inter font, Headings 600-700 weight, Body 400 weight
- **Spacing**: 8px base unit, Components 16px/24px/32px
- **Border Radius**: Buttons 8px, Cards 12px, Inputs 6px
- **Shadows**: Card `0 1px 3px rgba(0,0,0,0.1)`, Hover `0 4px 6px rgba(0,0,0,0.1)`

## Screen 1: Login (/login)

### Layout
```
┌────────────────────────────────────────┐
│                                        │
│         [Asset Pulse Logo]             │
│                                        │
│     Software Asset Management          │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Username                          │ │
│  │ [________________________]        │ │
│  │                                   │ │
│  │ Password                          │ │
│  │ [________________________]  👁    │ │
│  │                                   │ │
│  │ ☐ Remember me                     │ │
│  │                                   │ │
│  │        [Login Button]             │ │
│  │                                   │ │
│  │     Forgot password?              │ │
│  └──────────────────────────────────┘ │
│                                        │
│   © 2025 SCBX Group. All rights reserved │
└────────────────────────────────────────┘
```

### Components
- Logo: 120px height, centered
- Card: 400px width, white background, 16px border radius, shadow
- Input fields: Full width, 48px height, 6px border radius
- Login button: Primary blue, full width, 48px height
- Forgot password: Text link, secondary color

### States
- Empty state: Placeholder text shown
- Error state: Red border on input, error message below
- Loading state: Button shows spinner
- Success: Redirect to dashboard

## Screen 2: Employee/HR Dashboard (/dashboard)

### Top Navigation
```
┌──────────────────────────────────────────────────────────┐
│ [Asset Pulse]  Dashboard  My Licenses  Requests          │
│                                    [🔍] [🔔 3] [👤 Sarah ▼]│
└──────────────────────────────────────────────────────────┘
```

### Main Content
```
┌────────────────────────────────────────────────────────────┐
│  👋 Welcome back, Sarah                                    │
│  Marketing Executive • SCB Data X                          │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ 📦 My Licenses│  │ 📝 Requests  │  │ 💡 For You   │   │
│  │   8 Active    │  │   2 Pending  │  │   1 New      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
│  Quick Actions                                             │
│  [+ New Hire Onboarding]  [View My Licenses]              │
│                                                            │
│  ──────────────────────────────────────────────────────  │
│                                                            │
│  My Active Licenses (8)                                    │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [GitHub Icon]  GitHub Enterprise                      │ │
│  │                Pro Tier  •  Active                     │ │
│  │                Last used: 2 hours ago                  │ │
│  │                [View Details]                          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [Slack Icon]   Slack Enterprise                       │ │
│  │                Enterprise  •  Active                   │ │
│  │                Last used: 5 minutes ago                │ │
│  │                [View Details]                          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [Jira Icon]    Jira Software                          │ │
│  │                Standard  •  Active                     │ │
│  │                Last used: 1 day ago                    │ │
│  │                [View Details]                          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [View All Licenses →]                                     │
└────────────────────────────────────────────────────────────┘
```

### Components
- Stats cards: 3 columns, white background, rounded corners, icons with color
- Quick action buttons: Primary style, icon + text
- License cards: White background, 12px radius, hover effect with shadow
- License status badges: Green dot + "Active" text

### Interactions
- Click "New Hire Onboarding" → Navigate to Feature 3 (JD Matching)
- Click "View My Licenses" → Navigate to /licenses/my
- Click license card → Expand to show full details
- Notification bell → Show dropdown with recent notifications
- Profile dropdown → Show settings, logout

### Responsive
- Mobile: Stack stats cards vertically
- Mobile: Hamburger menu for navigation
- Tablet: 2-column layout for stats cards

