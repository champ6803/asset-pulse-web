# Asset Pulse - Frontend Application

AI-powered Software Asset Management (SAM) platform for SCBX Group - Frontend Application built with Next.js

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (separate repository)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
asset-pulse-web/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (auth)/
│   │   │   └── login/          # Login page
│   │   ├── dashboard/          # Dashboard pages (by role)
│   │   │   ├── employee/       # Employee/HR dashboard
│   │   │   ├── manager/        # Manager dashboard
│   │   │   ├── cto/            # Subsidiary CTO dashboard
│   │   │   └── group-cto/      # Group CTO dashboard
│   │   ├── requests/           # Request management
│   │   │   ├── new-hire/       # New hire onboarding (Feature 3)
│   │   │   └── confirmation/   # Confirmation page
│   │   ├── templates/          # Purchase templates (Feature 4)
│   │   ├── seat-optimization/  # License optimization (Feature 5)
│   │   ├── similar-software/   # Cross-sub matching (Feature 1)
│   │   ├── consolidation/      # Group consolidation (Feature 2)
│   │   ├── memos/              # AI-generated memos
│   │   ├── approvals/          # Approval queue
│   │   ├── analytics/          # Usage analytics
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page (redirect to login)
│   │
│   ├── components/             # React components
│   │   └── layout/             # Layout components
│   │       ├── Header.tsx      # Shared header with navigation
│   │       └── DashboardLayout.tsx  # Dashboard layout wrapper
│   │
│   ├── lib/                    # Utilities and helpers
│   │   ├── store/              # State management (Zustand)
│   │   │   └── authStore.ts    # Authentication state
│   │   └── utils.ts            # Utility functions
│   │
│   └── types/                  # TypeScript type definitions
│       └── index.ts            # Shared types
│
├── public/                     # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config
└── next.config.js              # Next.js config
```

## 🎨 Design System

### Color Palette

- **Primary Blue**: `#3B82F6` (main actions, navigation)
- **Success Green**: `#10B981` (approvals, savings)
- **Warning Amber**: `#F59E0B` (pending, inactive)
- **Danger Red**: `#EF4444` (rejections, critical)
- **Gray Scale**: `#F9FAFB` to `#111827`

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: 24px-36px, 600-700 weight
- **Body**: 14px-16px, 400 weight
- **Small**: 12px-14px

### Components

All components use Tailwind CSS with a consistent design language matching the original UI designs.

## 🔐 Authentication

The application uses a simple username/password authentication system for demo purposes.

### Demo Accounts

| Username | Password | Role |
|----------|----------|------|
| employee@scb.com | password | Employee/HR |
| manager@scb.com | password | Department Manager |
| cto@scb.com | password | Subsidiary CTO |

### Role-Based Access

After login, users select their role:
- **Employee/HR**: Request software, view licenses
- **Department Manager**: Approve requests, manage templates
- **Subsidiary CTO**: Optimize licenses, view analytics
- **Group CTO**: Cross-subsidiary consolidation, generate memos

## 📄 Pages Overview

### Authentication
- `/login` - Login with username/password + role selection

### Employee/HR Role
- `/dashboard/employee` - Employee dashboard
- `/requests/new-hire` - New hire request form (Feature 3)
- `/requests/new-hire/recommendations` - AI recommendations
- `/requests/new-hire/review` - Review & submit
- `/requests/confirmation` - Confirmation page
- `/dashboard/employee/licenses` - My licenses

### Department Manager Role
- `/dashboard/manager` - Manager dashboard
- `/templates` - Purchase templates list (Feature 4)
- `/templates/create` - Create new template
- `/approvals` - Approval queue

### Subsidiary CTO Role
- `/dashboard/cto` - CTO dashboard
- `/seat-optimization` - Seat optimization (Feature 5)
- `/seat-optimization/[id]` - Reallocation details
- `/analytics` - Usage analytics

### Group CTO Role
- `/dashboard/group-cto` - Group CTO dashboard
- `/similar-software` - Similar software detection (Feature 1)
- `/consolidation/[id]` - Consolidation details (Feature 2)
- `/memos/generate` - AI memo generation

## 🔧 Features Implemented

### Core Features (6 Features from Spec)

1. ✅ **Feature 3**: JD → License Matching (AI-powered recommendations)
2. ✅ **Feature 4**: Purchase Template Management
3. ✅ **Feature 5**: Seat Optimization with Reallocation
4. ✅ **Feature 1**: Cross-Subsidiary Software Match
5. ✅ **Feature 2**: Group Contract Consolidation
6. 🔄 **Feature 6**: Pay-Per-Use Optimization (placeholder)

### Additional Features
- ✅ Role-based dashboards
- ✅ Approval workflow UI
- ✅ Usage analytics dashboard
- ✅ AI memo generation interface
- ✅ Shared layout and navigation

## 🎯 Key UI Patterns

### Shared Components
- **Header**: Logo, navigation, search, notifications, user menu
- **DashboardLayout**: Wraps all authenticated pages
- **Navigation**: Role-specific menu items

### Design Patterns
- **Cards**: Rounded corners (12px), hover effects, shadows
- **Buttons**: Primary (blue), Secondary (gray), Danger (red)
- **Forms**: Rounded inputs (8px), focus states, validation
- **Status Badges**: Color-coded (green=active, yellow=pending, red=rejected)
- **Progress Indicators**: Step indicators, progress bars
- **Stats Cards**: Metric cards with icons and trend indicators

## 🔗 Backend Integration

This frontend is designed to work with a separate backend API (Go/Golang).

### Expected API Base URL

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Key API Endpoints (Expected)

```
# Authentication
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

# Recommendations (Feature 3)
POST   /api/v1/recommendations/jd-match

# Templates (Feature 4)
GET    /api/v1/templates
POST   /api/v1/templates

# Seat Optimization (Feature 5)
GET    /api/v1/recommendations/seat-optimization
POST   /api/v1/recommendations/seat-optimization/:id/apply

# Cross-Sub Match (Feature 1)
GET    /api/v1/recommendations/cross-sub-match

# Consolidation (Feature 2)
GET    /api/v1/recommendations/consolidation
POST   /api/v1/memos/generate
```

## 🧪 Development Notes

### Mock Data
Currently uses mock data in components for demonstration. Replace with API calls when backend is ready.

### State Management
Uses Zustand for lightweight state management (authentication state).

### Styling
100% Tailwind CSS - no custom CSS files except for global styles.

### Icons
Font Awesome 6.4.0 (loaded via CDN in layout.tsx)

## 📝 TODO

- [ ] Connect to real backend API
- [ ] Add loading states and error handling
- [ ] Implement real authentication with JWT
- [ ] Add chart libraries (Recharts or Chart.js)
- [ ] Add form validation
- [ ] Add toast notifications
- [ ] Add pagination logic
- [ ] Add search functionality
- [ ] Add responsive mobile menu
- [ ] Add accessibility improvements (ARIA labels, keyboard navigation)

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Icons**: Font Awesome 6.4.0
- **Font**: Inter (Google Fonts)

## 📚 References

- **Specifications**: See `/spec` folder
- **UI Designs**: See `/ui-design` folder (HTML prototypes)
- **Database Schema**: See `/scripts` folder

## 🏢 Organization

**SCBX Group** - Software Asset Management Platform
- 25+ subsidiaries
- 6 core optimization features
- AI-powered recommendations (GPT-4o)

---

**Version**: 1.0.0  
**Last Updated**: October 21, 2025
