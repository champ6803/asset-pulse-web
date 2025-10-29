# Design: My Licenses Page - Database Integration

## Overview
This document outlines how to fetch and display license data from the database for the "My Licenses" page.

## Database Schema Analysis

### Key Tables
1. **license_assignments** - User license assignments (active when `revoked_at IS NULL`)
2. **apps** - Application details (name, category, icon)
3. **license_inventories** - License inventory with expiry dates
4. **usage_events** - Usage tracking for licenses
5. **price_books** - Pricing information
6. **contracts** - Contract details

### Database Structure
```sql
license_assignments:
  - id
  - user_id
  - app_id
  - license_tier
  - license_id        ⭐ FK to license_inventories(id)
  - assigned_at
  - revoked_at (NULL = active)

apps:
  - id
  - name
  - alias
  - category
  - status

license_inventories:
  - id
  - app_id
  - license_tier
  - expire_date
  - effective_date

usage_events:
  - id
  - app_id
  - user_id
  - event_at

price_books:
  - app_id
  - tier
  - list_price
  - currency
```

## API Design

### Endpoint
```
GET /api/v1/employee/licenses?user_id={userId}
```

### Backend Handler (Go)
Create: `asset-pulse-api/handler/get_user_licenses_handler.go`

```go
func (h *Handler) GetUserLicenses(c *gin.Context) {
    ctx := c.Request.Context()
    userID, _ := c.Get("user_id") // from JWT
    
    // Get all active licenses for user
    resp, err := h.useCase.GetUserLicenses(ctx, userID.(int64))
    
    // Transform to DTO and return
    c.JSON(http.StatusOK, transformer.SuccessResponse(http.StatusOK, resp))
}
```

### Usecase
Create: `asset-pulse-api/usecase/get_user_licenses.go`

```go
func (u *UseCase) GetUserLicenses(ctx context.Context, userID int64) (*models.UserLicensesResponse, error) {
    // Get license assignments with app details
    assignments, err := u.repo.GetUserLicenseAssignments(ctx, userID)
    
    // For each assignment, get:
    // 1. Usage frequency from usage_events
    // 2. Last used date from usage_events
    // 3. Expiry date from license_inventories
    // 4. Price from price_books
    
    return &models.UserLicensesResponse{
        Licenses: licenses,
    }, nil
}
```

### Repository Query
```sql
SELECT 
    la.id,
    la.app_id,
    la.license_tier,
    la.assigned_at,
    la.revoked_at,
    a.name as app_name,
    a.alias as app_alias,
    a.category,
    li.expire_date,
    pb.list_price,
    pb.currency,
    -- Usage stats
    (SELECT COUNT(*) FROM usage_events ue 
     WHERE ue.app_id = la.app_id 
     AND ue.user_id = la.user_id 
     AND ue.event_at > NOW() - INTERVAL '30 days') as usage_count_30d,
    (SELECT MAX(event_at) FROM usage_events ue 
     WHERE ue.app_id = la.app_id 
     AND ue.user_id = la.user_id) as last_used_at
FROM license_assignments la
JOIN apps a ON a.id = la.app_id
LEFT JOIN license_inventories li ON li.id = la.license_id     -- ⭐ ใช้ license_id
LEFT JOIN price_books pb ON pb.app_id = la.app_id AND pb.tier = la.license_tier
WHERE la.user_id = $1 
  AND la.revoked_at IS NULL  -- Active licenses only
ORDER BY la.assigned_at DESC;
```

## Data Transformation

### Frontend Type
```typescript
interface License {
  id: string;
  name: string;              // from apps.name
  tier: string;              // from license_assignments.license_tier
  icon: string;              // derived from app name/alias
  bgColor: string;           // derived from app category
  iconColor: string;         // derived from app category
  tierColor: string;         // derived from tier
  status: 'active' | 'expiring' | 'expired';
  assignedAt: string;        // from license_assignments.assigned_at
  expiresAt: string;         // from license_inventories.expire_date
  lastUsed: string;          // from usage_events last event
  usageFrequency: 'High' | 'Medium' | 'Low';
  usagePercent: number;      // calculated from usage_count_30d
  usageColor: string;        // derived from usagePercent
  cost: number;              // from price_books.list_price
}
```

### Status Calculation
```typescript
function calculateStatus(expireDate: Date): 'active' | 'expiring' | 'expired' {
  const daysUntilExpiry = Math.ceil((expireDate - new Date()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring';
  return 'active';
}
```

### Usage Frequency Calculation
```typescript
function calculateUsageFrequency(usageCount: number): 'High' | 'Medium' | 'Low' {
  if (usageCount > 20) return 'High';
  if (usageCount > 10) return 'Medium';
  return 'Low';
}

function calculateUsagePercent(usageCount: number): number {
  return Math.min(usageCount * 5, 100); // Max at 100%
}
```

## Frontend Integration

### API Client Method
Add to `src/lib/api.ts`:

```typescript
async getUserLicenses(token: string) {
  return this.request('/employee/licenses', {
    method: 'GET',
    token,
  });
}
```

### Component Update
Replace `page.tsx`:

```typescript
"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';

interface License {
  // ... type definition above
}

export default function MyLicensesPage() {
  const { token, user } = useAuthStore();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLicenses() {
      try {
        const response = await apiClient.getUserLicenses(token!);
        setLicenses(transformToLicenses(response.data));
      } catch (error) {
        console.error('Failed to fetch licenses:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (token) {
      fetchLicenses();
    }
  }, [token]);

  if (loading) {
    return <DashboardLayout>Loading...</DashboardLayout>;
  }

  // ... rest of component
}
```

## Statistics Calculation

### 1. Total Active Licenses
```typescript
const activeCount = licenses.filter(l => l.status === 'active').length;
```

### 2. Total Annual Cost
```typescript
const totalCost = licenses
  .filter(l => l.status === 'active')
  .reduce((sum, l) => sum + l.cost, 0);
```

### 3. Most Used App
```typescript
const mostUsedApp = licenses
  .sort((a, b) => b.usagePercent - a.usagePercent)[0];
```

### 4. Expiring in 30 Days
```typescript
const expiringCount = licenses.filter(l => l.status === 'expiring').length;
```

## Filters and Search

### Status Filter
```typescript
const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');

const filteredLicenses = licenses.filter(license => {
  if (statusFilter === 'all') return true;
  return license.status === statusFilter;
});
```

### Search
```typescript
const [searchQuery, setSearchQuery] = useState('');

const searchedLicenses = filteredLicenses.filter(license =>
  license.name.toLowerCase().includes(searchQuery.toLowerCase())
);
```

## Implementation Checklist

### Backend
- [ ] Create repository method `GetUserLicenseAssignments`
- [ ] Create usecase method `GetUserLicenses`
- [ ] Create handler `GetUserLicenses`
- [ ] Add route to router
- [ ] Add DTO for response

### Frontend
- [ ] Add API method `getUserLicenses`
- [ ] Create transformation utility
- [ ] Update component to use API
- [ ] Add loading state
- [ ] Add error handling
- [ ] Implement filters
- [ ] Implement search

### Testing
- [ ] Test API endpoint
- [ ] Test data transformation
- [ ] Test status calculations
- [ ] Test filters
- [ ] Test search

