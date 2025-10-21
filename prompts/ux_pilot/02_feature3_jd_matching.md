# UX Pilot Prompt 02: Feature 3 - JD → License Matching (AI-Powered)

## Build Screens (3 screens)
1. New Hire Request Form
2. AI Recommendation Results
3. Confirmation Screen

## Feature Overview
HR provides job description → AI analyzes → Recommends software pack → Submit for approval

## Screen 1: New Hire Request Form (/requests/new-hire)

### Breadcrumb
Dashboard > Requests > New Hire Onboarding

### Layout
```
┌────────────────────────────────────────────────────────────┐
│  🆕 New Hire Software Request                              │
│  Get AI-powered software recommendations based on job role │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Step 1 of 3: Employee Information                    │ │
│  │                                                       │ │
│  │ Full Name *                                          │ │
│  │ [____________________________________]               │ │
│  │                                                       │ │
│  │ Job Title *                                          │ │
│  │ [____________________________________]               │ │
│  │                                                       │ │
│  │ Department *                                         │ │
│  │ [IT - Backend Team          ▼]                       │ │
│  │                                                       │ │
│  │ Company                                              │ │
│  │ [SCB Data X                 ▼]                       │ │
│  │                                                       │ │
│  │ Email                                                │ │
│  │ [____________________________________]               │ │
│  │                                                       │ │
│  │ Start Date                                           │ │
│  │ [📅 Select Date]                                      │ │
│  │                                                       │ │
│  │ Job Description *                                    │ │
│  │ ┌─────────────────────────────────────────────────┐ │ │
│  │ │                                                 │ │ │
│  │ │ (Textarea - 5 rows minimum)                     │ │ │
│  │ │                                                 │ │ │
│  │ └─────────────────────────────────────────────────┘ │ │
│  │ 💡 Tip: Provide detailed JD for better AI          │ │
│  │    recommendations                                   │ │
│  │                                                       │ │
│  │                    [Cancel]  [Next: Get AI Recs →]  │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Validation
- All * fields required
- Job Description minimum 50 characters
- Email format validation
- Real-time validation on blur

## Screen 2: AI Recommendation Results (/requests/new-hire/recommendations)

### Layout
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
│  │ ✓ Postman    │  │ ✓ Docker Hub │  │   DataDog    │   │
│  │ API Testing  │  │ DevOps       │  │ Not Selected │   │
│  │ Pro • 98%    │  │ Pro • 95%    │  │ Add?         │   │
│  │ 4k THB/yr    │  │ 5k THB/yr    │  │ 8k THB/yr    │   │
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
└────────────────────────────────────────────────────────────┘
```

### AI Rationale Modal (Click "Why?")
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

### Interactions
- Click checkbox → Select/deselect app, update cost summary
- Click "Why?" → Show AI rationale modal
- Click "Remove" → Deselect app
- Real-time cost calculation as selections change
- Hover on card → Show shadow lift effect

## Screen 3: Confirmation (/requests/confirmation)

### Layout
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

### Components
- Success icon: Large green checkmark, 64px
- Details card: White background, organized in rows
- Status badge: Yellow/pending style
- Action buttons: Secondary style, equal width

### Auto-redirect
After 5 seconds, show countdown: "Redirecting to dashboard in 3... 2... 1..."

