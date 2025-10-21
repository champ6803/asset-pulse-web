# Development Guide - Asset Pulse Frontend

## 🚀 Getting Started

### 1. Setup Development Environment

```bash
# Clone the repository (if not already done)
cd asset-pulse-web

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 2. Project Structure Overview

```
src/
├── app/                    # Next.js 14 App Router (pages)
├── components/             # Reusable React components
│   ├── layout/            # Layout components (Header, DashboardLayout)
│   ├── modals/            # Modal components (AIRationaleModal)
│   └── ui/                # UI primitives (Button, Card, Badge)
├── lib/                   # Utilities and libraries
│   ├── api/               # API client
│   ├── store/             # State management (Zustand)
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript type definitions
```

## 🎨 Design Guidelines

### Color Usage

```typescript
// Primary actions
className="bg-primary-600 hover:bg-primary-700"

// Success states
className="bg-green-100 text-green-800"

// Warning states
className="bg-yellow-100 text-yellow-800"

// Danger states
className="bg-red-100 text-red-800"
```

### Typography

```tsx
// Page titles
<h1 className="text-3xl font-bold text-gray-900">

// Section titles
<h2 className="text-xl font-semibold text-gray-900">

// Card titles
<h3 className="text-lg font-semibold text-gray-900">

// Body text
<p className="text-sm text-gray-600">
```

### Common Components

#### Button

```tsx
import Button from '@/components/ui/Button';

<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
```

#### Badge

```tsx
import Badge from '@/components/ui/Badge';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Rejected</Badge>
```

#### Card

```tsx
import Card from '@/components/ui/Card';

<Card hover>
  {/* Card content */}
</Card>
```

## 🔐 Authentication Flow

### Login Process

1. User visits `/login`
2. Enters username/password
3. System authenticates (mock for now)
4. User selects role (employee, manager, cto, group-cto)
5. Redirects to role-specific dashboard

### Protected Routes

All routes except `/login` are protected by `DashboardLayout`:

```tsx
export default function MyPage() {
  return (
    <DashboardLayout navigation={navigationItems}>
      {/* Page content */}
    </DashboardLayout>
  );
}
```

### Auth Store (Zustand)

```tsx
import { useAuthStore } from '@/lib/store/authStore';

const { user, isAuthenticated, login, logout, selectRole } = useAuthStore();

// Login
await login(username, password);

// Select role
selectRole('manager');

// Logout
logout();
```

## 📱 Responsive Design

### Breakpoints

```
sm: 640px   - Mobile landscape
md: 768px   - Tablet
lg: 1024px  - Desktop
xl: 1280px  - Large desktop
```

### Mobile-First Approach

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
</div>
```

## 🔌 Backend Integration

### API Client

Located at `src/lib/api/client.ts`:

```tsx
import { apiClient } from '@/lib/api/client';

// Generate JD recommendations
const recommendations = await apiClient.generateJDRecommendations({
  job_title: 'Senior Engineer',
  job_description: '...',
  department: 'IT',
  company_code: 'SCB',
}, token);

// Get seat optimization
const optimizations = await apiClient.getSeatOptimization(token);
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## 🧪 Testing

### Run Development Server

```bash
npm run dev
```

### Build Production

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

## 📄 Adding New Pages

### Step 1: Create Page File

```tsx
// src/app/my-new-page/page.tsx
"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';

const navigation = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'My Page', href: '/my-new-page' },
];

export default function MyNewPage() {
  return (
    <DashboardLayout navigation={navigation}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">My New Page</h1>
        {/* Page content */}
      </div>
    </DashboardLayout>
  );
}
```

### Step 2: Add to Navigation

Update the appropriate navigation array for the role that needs access.

## 🎯 Feature Implementation Checklist

When implementing a new feature:

- [ ] Create page in `/app` directory
- [ ] Add to navigation array
- [ ] Create TypeScript types in `/types`
- [ ] Add mock data (or API call)
- [ ] Match UI design from `/ui-design` folder
- [ ] Use shared components from `/components`
- [ ] Test on mobile, tablet, desktop
- [ ] Add loading states
- [ ] Add error handling

## 🐛 Common Issues

### Issue: Font Awesome icons not showing

**Solution**: Icons are loaded via CDN in `layout.tsx`. Make sure script tag is present:

```tsx
<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" />
```

### Issue: Images not loading

**Solution**: Add domain to `next.config.js`:

```js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'storage.googleapis.com',
    },
  ],
}
```

### Issue: Tailwind classes not working

**Solution**: Make sure the file is included in `tailwind.config.ts`:

```ts
content: [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
]
```

## 📦 Adding New Dependencies

```bash
# Install package
npm install package-name

# Install dev dependency
npm install -D package-name
```

## 🔄 State Management

### Global State (Zustand)

For global state like authentication:

```tsx
// lib/store/myStore.ts
import { create } from 'zustand';

export const useMyStore = create((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
```

### Local State (useState)

For component-specific state:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

## 🎨 Styling Best Practices

1. **Use Tailwind utility classes** - Avoid custom CSS
2. **Follow spacing scale** - Use 4px increments (p-4, p-6, p-8)
3. **Consistent colors** - Use design system colors (primary-600, gray-900, etc.)
4. **Hover states** - Add hover:bg-gray-50 for interactive elements
5. **Focus states** - Use focus:ring-2 focus:ring-primary-500
6. **Transitions** - Add transition-colors or transition-all

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [Zustand State Management](https://github.com/pmndrs/zustand)

## 🤝 Contributing

1. Follow existing code patterns
2. Match UI designs in `/ui-design` folder
3. Use TypeScript types from `/types`
4. Test on all screen sizes
5. Keep components small and reusable

---

**Happy Coding! 🚀**

