# สรุปการออกแบบการดึงข้อมูล My Licenses

## แหล่งข้อมูลหลัก (Database Tables)

### 1. **license_assignments** - ข้อมูลหลักที่ Assign ให้ user
```sql
- id
- user_id              → Filter by User
- app_id               → Join ไปหาข้อมูล App
- license_tier         → Tier ของ license (Pro, Basic, Enterprise)
- license_id           → FK to license_inventories(id) ⭐ สำคัญ!
- assigned_at          → วันที assign
- revoked_at           → NULL = ยัง active, มีค่า = revoked แล้ว
- assignment_source    → manual/template/auto
```

### 2. **apps** - ข้อมูล Application
```sql
- id
- name                 → ชื่อแอพ (ใช้แสดงในหน้า)
- alias
- category             → หมวดหมู่ (DevOps, Design, Analytics)
- status
```

### 3. **license_inventories** - ข้อมูล Inventory
```sql
- id
- app_id               → Join with apps
- license_tier         → Join with assignments
- expire_date          → วันหมดอายุ
- effective_date       → วันมีผล
```

### 4. **usage_events** - ข้อมูลการใช้งาน
```sql
- id
- app_id
- user_id
- event_at             → วันเวลาที่ใช้ (เอา MAX = last used)
- event_type           → signin/edit/call
```

### 5. **price_books** - ข้อมูลราคา
```sql
- id
- app_id
- tier                 → ตรงกับ license_tier
- list_price           → ราคา
- currency             → สกุลเงิน (THB)
```

## การดึงข้อมูล (Query Strategy)

### SQL Query หลัก
```sql
SELECT 
    la.id,
    la.app_id,
    la.license_tier,
    la.assigned_at,
    a.name as app_name,
    a.category,
    li.expire_date,
    li.effective_date,
    pb.list_price as cost,
    pb.currency,
    
    -- นับจำนวนการใช้งาน 30 วันล่าสุด
    (SELECT COUNT(*) 
     FROM usage_events ue 
     WHERE ue.app_id = la.app_id 
       AND ue.user_id = la.user_id 
       AND ue.event_at > NOW() - INTERVAL '30 days') as usage_count_30d,
    
    -- วันสุดท้ายที่ใช้งาน
    (SELECT MAX(event_at) 
     FROM usage_events ue 
     WHERE ue.app_id = la.app_id 
       AND ue.user_id = la.user_id) as last_used_at

FROM license_assignments la
JOIN apps a ON a.id = la.app_id
LEFT JOIN license_inventories li ON li.id = la.license_id     -- ⭐ ใช้ license_id แทนการ join หลายเงื่อนไข
LEFT JOIN price_books pb ON pb.app_id = la.app_id 
                         AND pb.tier = la.license_tier
WHERE la.user_id = $1           -- User ID จาก JWT
  AND la.revoked_at IS NULL     -- เฉพาะ license ที่ยัง active
ORDER BY la.assigned_at DESC;
```

## การ Transform ข้อมูล

### 1. Status (Active, Expiring, Expired)
```typescript
function getStatus(expireDate: Date) {
  const days = (expireDate - new Date()) / (1000 * 60 * 60 * 24);
  
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring';
  return 'active';
}
```

### 2. Usage Frequency (High, Medium, Low)
```typescript
function getUsageFrequency(usageCount30d: number) {
  if (usageCount30d > 20) return 'High';      // > 20 times/month
  if (usageCount30d > 10) return 'Medium';    // 10-20 times/month
  return 'Low';                                // < 10 times/month
}

function getUsagePercent(usageCount30d: number) {
  return Math.min(usageCount30d * 5, 100);  // ใช้ count * 5 หรือ มากสุด 100%
}
```

### 3. Last Used (Format: "X hours/days ago")
```typescript
function formatLastUsed(lastUsedAt: Date) {
  const hours = (Date.now() - lastUsedAt.getTime()) / (1000 * 60 * 60);
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${Math.floor(hours)} hours ago`;
  if (hours < 48) return '1 day ago';
  return `${Math.floor(hours / 24)} days ago`;
}
```

### 4. Icon & Color (derive from app name/category)
```typescript
function getAppStyle(appName: string, category: string) {
  const iconMap: Record<string, string> = {
    'Figma': 'fab fa-figma',
    'Slack': 'fab fa-slack',
    'GitHub': 'fab fa-github',
    'Adobe': 'fab fa-adobe',
    'Tableau': 'fas fa-table',
  };
  
  const colorMap: Record<string, {bg: string, icon: string}> = {
    'linkedin': {bg: 'bg-blue-100', icon: 'text-blue-600'},
    'microsoft': {bg: 'bg-indigo-100', icon: 'text-indigo-600'},
    'DevOps': {bg: 'bg-purple-100', icon: 'text-purple-600'},
    'Design': {bg: 'bg-pink-100', icon: 'text-pink-600'},
  };
  
  return {
    icon: iconMap[appName] || 'fas fa-box',
    ...(colorMap[category] || {bg: 'bg-gray-100', icon: 'text-gray-600'})
  };
}
```

## Statistics ที่ต้องคำนวณ

### 1. Total Active Licenses
```typescript
const activeCount = licenses.filter(l => 
  l.status === 'active' || l.status === 'expiring'
).length;
```

### 2. Total Annual Cost
```typescript
const totalCost = licenses
  .filter(l => l.status !== 'expired')
  .reduce((sum, l) => sum + l.cost, 0);
```

### 3. Most Used App
```typescript
const mostUsedApp = licenses
  .sort((a, b) => b.usagePercent - a.usagePercent)[0];
```

### 4. Expiring in 30 Days
```typescript
const expiringCount = licenses.filter(l => 
  l.status === 'expiring'
).length;
```

## API Endpoint Design

### Endpoint
```
GET /api/v1/employee/licenses
```

### Request Headers
```
Authorization: Bearer {JWT_TOKEN}
```

### Response
```json
{
  "success": true,
  "data": {
    "licenses": [
      {
        "id": 1,
        "app_id": 5,
        "app_name": "Figma",
        "license_tier": "Professional",
        "category": "Design",
        "assigned_at": "2024-03-15T00:00:00Z",
        "expire_date": "2025-03-15",
        "cost": 4800,
        "usage_count_30d": 25,
        "last_used_at": "2024-03-20T10:00:00Z"
      }
    ]
  }
}
```

## Implementation Flow

```
┌─────────────────┐
│   Frontend      │
│  (page.tsx)     │
└────────┬────────┘
         │ 1. useEffect() calls API
         ▼
┌─────────────────┐
│   API Client    │
│  (api.ts)       │
└────────┬────────┘
         │ 2. GET /employee/licenses + JWT
         ▼
┌─────────────────┐
│   Backend       │
│  Handler        │
└────────┬────────┘
         │ 3. Extract user_id from JWT
         ▼
┌─────────────────┐
│   Usecase       │
│  (usecase)      │
└────────┬────────┘
         │ 4. GetUserLicenses(userID)
         ▼
┌─────────────────┐
│   Repository    │
│  (database)     │
└────────┬────────┘
         │ 5. SQL Query (as above)
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   Database      │
└────────┬────────┘
         │
         └─► Return transformed data back
```

## สรุป Checklist

### Backend (Go)
- [ ] สร้าง Repository method `GetUserLicenseAssignments`
- [ ] สร้าง Usecase method `GetUserLicenses` 
- [ ] สร้าง Handler `GetUserLicenses`
- [ ] เพิ่ม route ใน router: `employee.GET("/licenses", handler.GetUserLicenses)`
- [ ] สร้าง DTO สำหรับ response

### Frontend (TypeScript/React)
- [ ] เพิ่ม API method ใน `api.ts`: `getUserLicenses(token)`
- [ ] สร้าง utility function สำหรับ transform ข้อมูล
- [ ] แก้ไข `page.tsx` ให้ fetch ข้อมูลจาก API
- [ ] เพิ่ม loading state
- [ ] เพิ่ม error handling
- [ ] Implement filters (All, Active, Expiring, Expired)
- [ ] Implement search

### Database Optimization
- [ ] เพิ่ม index: `CREATE INDEX idx_usage_user_time ON usage_events(user_id, app_id, event_at DESC)`
- [ ] เพิ่ม index: `CREATE INDEX idx_assign_user ON license_assignments(user_id, revoked_at) WHERE revoked_at IS NULL`

