# UX Pilot Prompt 07: Approval Workflow & Common Components

## Build Screens (4 screens)
1. My Requests List
2. Request Detail View
3. Approval Review Modal
4. Common Modals & Components

## Screen 1: My Requests (/requests)

### Layout
```
┌────────────────────────────────────────────────────────────┐
│  📋 My Requests                                             │
│  Track your license requests and approvals                  │
│                                                            │
│  [+ New Request]                              [Search: ___]│
│                                                            │
│  Filters: [All (24)] [Pending (5)] [Approved (15)]        │
│           [Rejected (3)] [Draft (1)]                       │
│                                                            │
│  Sort: [Recent First ▼]                                    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📝 New Hire: John Doe                🟡 Pending      │ │
│  │                                                       │ │
│  │ Request ID: #REQ-2024-001234                         │ │
│  │ Type: New Hire Onboarding                            │ │
│  │ Applications: 10 apps                                 │ │
│  │ Total Cost: 48,000 THB/year                          │ │
│  │ Submitted: 2 days ago                                │ │
│  │                                                       │ │
│  │ Approval Chain:                                       │ │
│  │ ⏳ David Chen (IT Manager) - Pending                 │ │
│  │ ⏸️ Finance Team - Not started                         │ │
│  │                                                       │ │
│  │ [View Details] [Edit Draft] [Cancel Request]        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📝 License Request: Postman Pro      🟢 Approved     │ │
│  │                                                       │ │
│  │ Request ID: #REQ-2024-001220                         │ │
│  │ Type: License Request                                 │ │
│  │ Application: Postman Pro                              │ │
│  │ Cost: 18,000 THB/year                                │ │
│  │ Submitted: 5 days ago                                │ │
│  │                                                       │ │
│  │ Approved by: David Chen (IT Manager)                 │ │
│  │ License assigned: ✅ Active                           │ │
│  │                                                       │ │
│  │ [View Details] [Use License]                         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 📝 Template Request: Frontend Dev     🔴 Rejected    │ │
│  │                                                       │ │
│  │ Request ID: #REQ-2024-001210                         │ │
│  │ Type: Department Template                             │ │
│  │ Applications: 7 apps                                  │ │
│  │ Cost: 38,000 THB/year                                │ │
│  │ Submitted: 8 days ago                                │ │
│  │                                                       │ │
│  │ Rejected by: David Chen                              │ │
│  │ Reason: "Budget exceeded for Q4"                     │ │
│  │                                                       │ │
│  │ [View Details] [Resubmit with Changes]               │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Components
- Request cards: Status badge, timeline, action buttons
- Status badges: Color-coded (Pending=Yellow, Approved=Green, Rejected=Red)
- Approval chain: Visual timeline with icons
- Search: Real-time filtering by request ID or description

## Screen 2: Request Detail View (/requests/:id)

### Layout
```
┌────────────────────────────────────────────────────────────┐
│  ← Back to Requests                                        │
│                                                            │
│  Request #REQ-2024-001234                  🟡 Pending      │
│  New Hire: John Doe                                        │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Request Information                                   │ │
│  │                                                       │ │
│  │ Employee:        John Doe                             │ │
│  │ Job Title:       Senior Software Engineer             │ │
│  │ Department:      IT - Backend Team                    │ │
│  │ Company:         SCB Data X                           │ │
│  │ Start Date:      Oct 25, 2025                        │ │
│  │                                                       │ │
│  │ Requested By:    Sarah Chen (HR)                      │ │
│  │ Submitted:       Oct 19, 2025 at 2:30 PM            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Requested Applications (10)                           │ │
│  │                                                       │ │
│  │ [GitHub Icon]  GitHub Enterprise                      │ │
│  │                Pro Tier • 10,000 THB/year            │ │
│  │                Relevance: 98%                         │ │
│  │                Rationale: "Required for code..."      │ │
│  │                                                       │ │
│  │ [Jira Icon]    Jira Software                          │ │
│  │                Standard • 6,000 THB/year              │ │
│  │                Relevance: 95%                         │ │
│  │                                                       │ │
│  │ [Slack Icon]   Slack Enterprise                       │ │
│  │                Enterprise • 4,000 THB/year            │ │
│  │                Relevance: 92%                         │ │
│  │                                                       │ │
│  │ ... 7 more apps                       [Expand All]   │ │
│  │                                                       │ │
│  │ Total Cost: 48,000 THB/year                          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Approval Timeline                                     │ │
│  │                                                       │ │
│  │ ✅ Submitted                                          │ │
│  │    Oct 19, 2025 at 2:30 PM                          │ │
│  │    by Sarah Chen                                      │ │
│  │    │                                                  │ │
│  │ ⏳ Pending - Level 1                                  │ │
│  │    Waiting for: David Chen (IT Manager)              │ │
│  │    Deadline: Oct 22, 2025 (in 1 day)               │ │
│  │    │                                                  │ │
│  │ ⏸️ Not Started - Level 2                              │ │
│  │    Finance Team approval required                     │ │
│  │    Will start after Level 1 approval                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Comments & History (2)                                │ │
│  │                                                       │ │
│  │ Sarah Chen - Oct 19, 2025 at 2:35 PM                │ │
│  │ "Urgent request for new hire starting next week"     │ │
│  │                                                       │ │
│  │ System - Oct 19, 2025 at 2:30 PM                    │ │
│  │ "Request created with AI recommendations"            │ │
│  │                                                       │ │
│  │ [Add Comment]                                         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [Edit Request] [Cancel Request] [Send Reminder]          │
└────────────────────────────────────────────────────────────┘
```

### Components
- Request info card: Key details, clean layout
- Application list: Expandable, show AI rationale
- Approval timeline: Vertical timeline with status icons
- Comments: Chat-like interface, timestamps
- Action buttons: Context-aware based on status

## Screen 3: Approval Review Modal (For Approvers)

### Layout
```
┌────────────────────────────────────────────────────────────┐
│  Review Request #REQ-2024-001234                           │
│                                                     [✕]    │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Request Summary                                       │ │
│  │                                                       │ │
│  │ Employee: John Doe (Senior Software Engineer)        │ │
│  │ Department: IT - Backend Team                         │ │
│  │ Requested By: Sarah Chen (HR)                        │ │
│  │                                                       │ │
│  │ Applications: 10                                      │ │
│  │ Total Cost: 48,000 THB/year                          │ │
│  │ Budget Available: ✅ Yes (12k remaining)             │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Applications Breakdown                                │ │
│  │                                                       │ │
│  │ [Expandable list of apps with details]               │ │
│  │                                                       │ │
│  │ ☑ GitHub Enterprise - Pro (10k THB/yr)               │ │
│  │ ☑ Jira Software - Standard (6k THB/yr)              │ │
│  │ ☑ Slack Enterprise (4k THB/yr)                       │ │
│  │ ☐ Postman Pro (remove from pack?)                    │ │
│  │ ... [show all 10]                                     │ │
│  │                                                       │ │
│  │ Updated Total: 44,000 THB/year                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Decision:                                                 │
│  ● Approve all applications                                │
│  ○ Approve with modifications (uncheck apps above)        │
│  ○ Reject request                                         │
│                                                            │
│  Comments (Optional):                                      │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [Add notes for requester...]                         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  If rejected, reason (Required):                           │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [Explain why request is rejected...]                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [Cancel] [Submit Decision]                                │
└────────────────────────────────────────────────────────────┘
```

### Components
- Modal overlay: Dark semi-transparent background
- Summary card: Key metrics, budget check
- App checklist: Allow modifications
- Decision radio buttons: Clear options
- Comment textarea: Optional for approve, required for reject
- Validation: Require reason if rejected

## Screen 4: Common Modals & Components

### Loading Modal
```
┌────────────────────────────────────────┐
│                                        │
│     🤖 AI is analyzing...              │
│                                        │
│     [Animated spinner]                 │
│                                        │
│     Analyzing job requirements and     │
│     matching with software catalog     │
│                                        │
│     Estimated time: 3-5 seconds        │
│                                        │
└────────────────────────────────────────┘
```

### Confirmation Dialog
```
┌────────────────────────────────────────┐
│  ⚠️ Confirm Action                     │
│                                        │
│  Are you sure you want to cancel       │
│  this request?                         │
│                                        │
│  This action cannot be undone.         │
│                                        │
│  [No, Go Back] [Yes, Cancel Request]  │
└────────────────────────────────────────┘
```

### Success Toast (Top-right corner)
```
┌────────────────────────────────────┐
│ ✅ Request approved successfully!  │
│                               [✕] │
└────────────────────────────────────┘
```

### Error Toast
```
┌────────────────────────────────────┐
│ ❌ Failed to submit request        │
│    Please try again               │
│                               [✕] │
└────────────────────────────────────┘
```

### Notification Dropdown
```
┌────────────────────────────────────────┐
│  🔔 Notifications                  [✕] │
│                                        │
│  [Mark all as read]                    │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ 🟢 Request Approved               │ │
│  │    Your request #REQ-001234       │ │
│  │    has been approved              │ │
│  │    2 hours ago                    │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ 🟡 Pending Approval               │ │
│  │    New request waiting for        │ │
│  │    your review                    │ │
│  │    1 day ago                      │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ 🔴 Request Rejected               │ │
│  │    Your template request          │ │
│  │    was rejected                   │ │
│  │    3 days ago [Read]              │ │
│  └──────────────────────────────────┘ │
│                                        │
│  [View All Notifications]              │
└────────────────────────────────────────┘
```

### Profile Dropdown Menu
```
┌────────────────────────────────────┐
│  👤 Sarah Chen                     │
│     Marketing Executive            │
│     SCB Data X                     │
│                                    │
│  ────────────────────────────────  │
│                                    │
│  My Profile                        │
│  My Licenses                       │
│  My Requests                       │
│  Settings                          │
│  Help & Support                    │
│                                    │
│  ────────────────────────────────  │
│                                    │
│  Logout                            │
└────────────────────────────────────┘
```

### Empty State
```
┌────────────────────────────────────────┐
│                                        │
│         [Empty box icon]               │
│                                        │
│    No requests found                   │
│                                        │
│  You haven't created any requests yet. │
│  Click "New Request" to get started.   │
│                                        │
│      [+ Create First Request]          │
│                                        │
└────────────────────────────────────────┘
```

### Component Guidelines
- Modals: 16px border radius, centered, max-width 600px
- Toasts: Auto-dismiss after 5 seconds, closeable
- Notifications: Max 5 shown, scroll for more
- Dropdowns: Shadow on hover, smooth animation
- Empty states: Helpful message + primary action
- Loading states: Clear messaging, estimated time

