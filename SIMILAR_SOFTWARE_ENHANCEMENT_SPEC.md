# Similar Software Enhancement Specification

## สรุปการแก้ไข (Summary of Changes)

เอกสารนี้ครอบคลุมการแก้ไขสำหรับหน้า Similar Software Detection ตามความต้องการดังนี้:

1. **เอา export ออก** - Remove export button functionality
2. **เพิ่ม input search** - Add software name search input in the same line as "Sort by"
3. **เพิ่ม dropdown เลือก subsidiary** - Add multi-select dropdown for subsidiaries in Project Management box
4. **App cards เลือกได้** - Make app cards clickable to filter datatable
5. **Datatable แสดง app ที่หลาย subsidiary ซื้อ** - Datatable shows apps purchased by multiple subsidiaries
6. **Total Summary คำนวณจาก datatable** - Total Summary calculates from datatable items

---

## 1. รายละเอียดการแก้ไข Frontend (Web)

### 1.1 เอา Export ออก

**ไฟล์:** `asset-pulse-web/src/app/similar-software/page.tsx`

**การเปลี่ยนแปลง:**
- ลบฟังก์ชัน `handleExport()` (บรรทัด 367-383)
- ลบปุ่ม Export ใน header section (บรรทัด 608-611)
- ลบปุ่ม Export ในแต่ละ cluster card (บรรทัด 869-893)

**บรรทัดที่ต้องแก้:**
- ลบ `handleExport` function
- ลบ button ที่มี text "Export" ทั้งหมด
- ตรวจสอบให้แน่ใจว่าไม่มี export functionality เหลืออยู่

---

### 1.2 เพิ่ม Search Input สำหรับค้นหา Software

**ไฟล์:** `asset-pulse-web/src/app/similar-software/page.tsx`

**การเปลี่ยนแปลง:**
1. เพิ่ม state สำหรับ search query:
   ```typescript
   const [searchQuery, setSearchQuery] = useState<string>('');
   ```

2. เพิ่ม search input ในบรรทัดเดียวกันกับ "Sort by":
   ```tsx
   <div className="flex items-center justify-between mb-6">
     <div className="flex items-center space-x-4">
       <span className="text-sm font-medium text-gray-700">Sort by</span>
       <select
         className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
         value={sortBy}
         onChange={e => setSortBy(e.target.value as any)}
       >
         <option value="savings">Savings (High to Low)</option>
         <option value="apps">Number of Apps</option>
       </select>
       
       {/* เพิ่มส่วนนี้ */}
       <div className="flex items-center space-x-2">
         <span className="text-sm font-medium text-gray-700">Search</span>
         <input
           type="text"
           placeholder="Search software by name..."
           className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
           value={searchQuery}
           onChange={e => setSearchQuery(e.target.value)}
         />
       </div>
     </div>
     {/* ... existing code ... */}
   </div>
   ```

3. กรอง clusters ตาม search query:
   ```typescript
   const filteredAndSorted = useMemo(() => {
     let filtered = enriched;
     
     // Apply search filter
     if (searchQuery.trim()) {
       filtered = filtered.filter(({ cluster }) => 
         cluster.apps.some(app => 
           app.name.toLowerCase().includes(searchQuery.toLowerCase())
         )
       );
     }
     
     // Apply sort
     const arr = [...filtered];
     if (sortBy === 'savings') arr.sort((a, b) => b.saving - a.saving);
     if (sortBy === 'apps') arr.sort((a, b) => b.cluster.apps.length - a.cluster.apps.length);
     
     return arr;
   }, [enriched, sortBy, searchQuery]);
   ```

4. ใช้ `filteredAndSorted` แทน `sorted` ใน JSX

---

### 1.3 เพิ่ม Dropdown เลือก Subsidiary (Multiple Selection)

**ไฟล์:** `asset-pulse-web/src/app/similar-software/page.tsx`

**ข้อมูลที่ต้องดึง:**
- ต้องมี API endpoint สำหรับดึงรายการ companies/subsidiaries ทั้งหมด

**การเปลี่ยนแปลง:**

1. เพิ่ม state สำหรับ:
   - List of subsidiaries
   - Selected subsidiaries
   ```typescript
   const [subsidiaries, setSubsidiaries] = useState<Array<{code: string; name: string}>>([]);
   const [selectedSubsidiaries, setSelectedSubsidiaries] = useState<string[]>([]);
   ```

2. เพิ่ม API call เพื่อดึงรายการ subsidiaries:
   ```typescript
   useEffect(() => {
     const fetchSubsidiaries = async () => {
       try {
         const data = await apiClient.getCompanies(token);
         setSubsidiaries(data);
       } catch (err) {
         console.error("Failed to fetch subsidiaries:", err);
       }
     };
     if (token) {
       fetchSubsidiaries();
     }
   }, [token]);
   ```

3. แก้ไขส่วน "Project Management" header:
   ```tsx
   <div className="flex items-center space-x-4">
     <div className={`h-12 w-12 ${theme.bg} rounded-lg flex items-center justify-center ring-4 ${theme.ring}`}>
       {theme.icon}
     </div>
     <div>
       <div className="flex items-center space-x-2">
         <h3 className="text-lg font-semibold text-gray-900">{cluster.name}</h3>
         <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
           {cluster.apps.length} applications
         </span>
       </div>
       {/* เพิ่มส่วนนี้ */}
       <div className="flex items-center space-x-2 mt-1">
         <span className="text-sm text-gray-500">{cluster.apps.length} applications across</span>
         <select
           multiple
           className="bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[200px] max-w-[400px]"
           value={selectedSubsidiaries}
           onChange={e => {
             const selected = Array.from(e.target.selectedOptions, option => option.value);
             setSelectedSubsidiaries(selected);
           }}
           size={3}
         >
           {subsidiaries.map(sub => (
             <option key={sub.code} value={sub.code}>{sub.name} ({sub.code})</option>
           ))}
         </select>
         <span className="text-sm text-gray-500">subsidiaries</span>
       </div>
     </div>
   </div>
   ```

   หรือใช้ multi-select component ที่ดีกว่า (เช่น react-select):
   ```tsx
   import Select from 'react-select';
   
   <Select
     isMulti
     options={subsidiaries.map(sub => ({ value: sub.code, label: `${sub.name} (${sub.code})` }))}
     value={selectedSubsidiaries.map(code => {
       const sub = subsidiaries.find(s => s.code === code);
       return sub ? { value: sub.code, label: `${sub.name} (${sub.code})` } : null;
     }).filter(Boolean)}
     onChange={(selected) => {
       setSelectedSubsidiaries(selected ? selected.map(s => s.value) : []);
     }}
     placeholder="Select subsidiaries..."
     className="min-w-[200px]"
   />
   ```

---

### 1.4 App Cards เลือกได้ (Clickable to Filter)

**ไฟล์:** `asset-pulse-web/src/app/similar-software/page.tsx`

**การเปลี่ยนแปลง:**

1. เพิ่ม state สำหรับ selected app:
   ```typescript
   const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
   ```

2. แก้ไข app cards ให้เป็น clickable:
   ```tsx
   <div
     key={app.app_id}
     className={`bg-gray-50 rounded-lg p-4 border cursor-pointer transition-all hover:shadow-md ${
       selectedAppId === app.app_id ? 'ring-2 ring-primary-500 border-primary-500 bg-blue-50' : ''
     }`}
     onClick={() => {
       setSelectedAppId(selectedAppId === app.app_id ? null : app.app_id);
     }}
   >
     {/* existing card content */}
   </div>
   ```

3. กรอง datatable ตาม selected app:
   - ดูส่วน 1.5

---

### 1.5 Datatable แสดง App ที่หลาย Subsidiary ซื้อ

**ไฟล์:** `asset-pulse-web/src/app/similar-software/page.tsx`

**การเปลี่ยนแปลง:**

1. สร้าง state สำหรับ filtered datatable rows:
   ```typescript
   const [datatableRows, setDatatableRows] = useState<AppInCluster[]>([]);
   ```

2. สร้าง function สำหรับกรอง rows:
   ```typescript
   useEffect(() => {
     if (!selectedAppId && selectedSubsidiaries.length === 0) {
       // แสดงทั้งหมดถ้าไม่มีการ filter
       setDatatableRows(cluster.apps);
       return;
     }
     
     // กรองตาม selected app (ถ้ามี)
     let filtered = cluster.apps;
     if (selectedAppId) {
       filtered = filtered.filter(app => app.app_id === selectedAppId);
     }
     
     // กรองตาม selected subsidiaries (ต้องเรียก API เพื่อดึงข้อมูล)
     // ตรงนี้ต้องเรียก API เพื่อดึงข้อมูลว่า app ไหนถูกซื้อโดย subsidiary ไหน
     // หรือใช้ข้อมูลจาก backend ที่มี company_code อยู่แล้ว
     
     setDatatableRows(filtered);
   }, [selectedAppId, selectedSubsidiaries, cluster]);
   ```

3. **ปัญหาที่ต้องแก้:** ต้องมีข้อมูลว่าแต่ละ app ถูกซื้อโดย subsidiary ไหน
   - ต้องแก้ backend เพื่อส่งข้อมูล subsidiary สำหรับแต่ละ app
   - หรือสร้าง API endpoint ใหม่ที่ดึงข้อมูล app กับ subsidiary

4. แก้ไข datatable ให้ใช้ `datatableRows` แทน `cluster.apps`:
   ```tsx
   <tbody>
     {datatableRows.map(app => {
       // ... existing row rendering
     })}
   </tbody>
   ```

5. เพิ่มคอลัมน์ Subsidiary ในตาราง:
   ```tsx
   <thead>
     <tr className="text-left text-gray-500">
       <th className="py-2 pr-4">App</th>
       <th className="py-2 pr-4">Vendor</th>
       <th className="py-2 pr-4">Subsidiary</th> {/* เพิ่มคอลัมน์นี้ */}
       <th className="py-2 pr-4">Users</th>
       <th className="py-2 pr-4">Price/Seat</th>
       <th className="py-2 pr-4">Period</th>
       <th className="py-2 pr-4">Cost/Year</th>
     </tr>
   </thead>
   ```

---

### 1.6 Total Summary คำนวณจาก Datatable

**ไฟล์:** `asset-pulse-web/src/app/similar-software/page.tsx`

**การเปลี่ยนแปลง:**

1. สร้าง function สำหรับคำนวณ total summary จาก datatable rows:
   ```typescript
   const calculateSummaryFromDatatable = useMemo(() => {
     if (datatableRows.length === 0) {
       return {
         tools: 0,
         totalUsers: 0,
         currentCost: 0,
         consolidationPotential: 0,
       };
     }
     
     const tools = datatableRows.length;
     const totalUsers = datatableRows.reduce((sum, app) => sum + app.users, 0);
     const currentCost = datatableRows.reduce((sum, app) => {
       const perSeatYear = normalizeToYear(app.price_per_seat, app.billing_period);
       return sum + app.users * perSeatYear;
     }, 0);
     
     // Calculate proposed cost from selected target vendor pricing
     const chosenPricing = cluster.candidate_pricing.find(
       v => v.vendor_id === selectedTarget[cluster.key]
     ) || cluster.candidate_pricing[0];
     
     const proposedLicensesYear = chosenPricing 
       ? calcProposedLicensesCostYear(totalUsers, chosenPricing)
       : 0;
     const switchYear = calcSwitchingCostYear(totalUsers, policy, currentCost);
     const proposedTotal = proposedLicensesYear + switchYear;
     const consolidationPotential = Math.max(currentCost - proposedTotal, 0);
     
     return {
       tools,
       totalUsers,
       currentCost,
       consolidationPotential,
     };
   }, [datatableRows, cluster, selectedTarget, policy]);
   ```

2. แก้ไข Total Summary box ให้ใช้ค่าจาก `calculateSummaryFromDatatable`:
   ```tsx
   <div className="bg-green-50 border border-green-200 rounded-lg p-4">
     <h4 className="font-medium text-green-900 mb-3">Total Summary</h4>
     <div className="space-y-2 text-sm">
       <div className="flex justify-between">
         <span className="text-gray-600">Tools:</span>
         <span className="font-medium">{calculateSummaryFromDatatable.tools}</span>
       </div>
       <div className="flex justify-between">
         <span className="text-gray-600">Total Users:</span>
         <span className="font-medium">{calculateSummaryFromDatatable.totalUsers.toLocaleString()}</span>
       </div>
       <div className="flex justify-between">
         <span className="text-gray-600">Current Cost:</span>
         <span className="font-medium">{thb(calculateSummaryFromDatatable.currentCost)}/year</span>
       </div>
       <div className="border-t border-green-200 pt-2">
         <div className="flex justify-between items-center">
           <span className="text-green-700 font-medium">Consolidation Potential:</span>
           <span className="text-xl font-bold text-green-600">
             {thb(calculateSummaryFromDatatable.consolidationPotential)}
           </span>
         </div>
       </div>
     </div>
   </div>
   ```

---

## 2. รายละเอียดการแก้ไข Backend (API)

### 2.1 API Endpoint สำหรับดึงรายการ Companies/Subsidiaries

**ไฟล์ใหม่:** `asset-pulse-api/handler/get_companies_handler.go`
**ไฟล์:** `asset-pulse-api/repositories/database/database_repository.go`
**ไฟล์:** `asset-pulse-api/usecase/get_companies.go`
**ไฟล์:** `asset-pulse-api/handler/route.go`

#### 2.1.1 Repository Method

เพิ่ม method ใน `DatabaseRepository` interface:
```go
GetCompanies(ctx context.Context) ([]entities.Company, error)
```

Implementation:
```go
func (d *databaseRepository) GetCompanies(ctx context.Context) ([]entities.Company, error) {
    var companies []entities.Company
    result := d.db.WithContext(ctx).Order("code ASC").Find(&companies)
    if result.Error != nil {
        return nil, result.Error
    }
    return companies, nil
}
```

#### 2.1.2 Usecase

สร้างไฟล์ `asset-pulse-api/usecase/get_companies.go`:
```go
package usecase

import (
    "asset-pulse-api/usecase/models"
    "context"
)

func (u *useCase) GetCompanies(ctx context.Context) (*models.GetCompaniesResponse, error) {
    companies, err := u.dbRepo.GetCompanies(ctx)
    if err != nil {
        return nil, err
    }
    
    items := make([]models.CompanyItem, len(companies))
    for i, c := range companies {
        items[i] = models.CompanyItem{
            ID:   c.ID,
            Code: c.Code,
            Name: c.Name,
        }
    }
    
    return &models.GetCompaniesResponse{
        Companies: items,
    }, nil
}
```

เพิ่ม model ใน `asset-pulse-api/usecase/models/companies.model.go`:
```go
package models

type GetCompaniesResponse struct {
    Companies []CompanyItem `json:"companies"`
}

type CompanyItem struct {
    ID   int64  `json:"id"`
    Code string `json:"code"`
    Name string `json:"name"`
}
```

#### 2.1.3 Handler

สร้างไฟล์ `asset-pulse-api/handler/get_companies_handler.go`:
```go
package handler

import (
    "asset-pulse-api/usecase/models"
    "asset-pulse-api/utils/transformer"
    "net/http"
    
    "github.com/gin-gonic/gin"
)

func (h *Handler) GetCompanies(c *gin.Context) {
    ctx := c.Request.Context()
    
    result, err := h.useCase.GetCompanies(ctx)
    if err != nil {
        res := transformer.ExceptionResponse(http.StatusInternalServerError, err)
        c.JSON(http.StatusInternalServerError, res)
        return
    }
    
    output := transformer.SuccessResponse(http.StatusOK, result)
    c.JSON(http.StatusOK, output)
}
```

#### 2.1.4 Route

เพิ่ม route ใน `asset-pulse-api/handler/route.go`:
```go
// ใน protected group
protected.GET("/companies", handler.GetCompanies)
```

---

### 2.2 API Endpoint สำหรับดึง App พร้อม Subsidiary ข้อมูล

**ไฟล์:** `asset-pulse-api/handler/similar_software_handler.go`
**ไฟล์:** `asset-pulse-api/repositories/database/database_repository.go`

#### 2.2.1 แก้ไข Response Structure

ต้องแก้ไข `GetSimilarSoftwareClusters` เพื่อให้ส่งข้อมูล subsidiary สำหรับแต่ละ app

**โครงสร้างข้อมูลใหม่:**
```go
type AppWithSubsidiaries struct {
    AppID        string   `json:"app_id"`
    Name         string   `json:"name"`
    VendorID     string   `json:"vendor_id"`
    VendorName   string   `json:"vendor_name"`
    Users        int      `json:"users"`
    PricePerSeat float64  `json:"price_per_seat"`
    BillingPeriod string  `json:"billing_period"`
    Subsidiaries []string `json:"subsidiaries"` // เพิ่มฟิลด์นี้
}
```

#### 2.2.2 แก้ไข Repository Query

ต้องสร้าง query ใหม่ที่ join กับ license_assignments เพื่อหาว่า app ไหนถูกซื้อโดย subsidiary ไหน:

```go
func (d *databaseRepository) GetSimilarSoftwareWithSubsidiaries(
    ctx context.Context, 
    companyCodes []string, 
    appName *string,
) ([]AppWithSubsidiariesData, error) {
    // Query เพื่อดึง app พร้อมข้อมูล subsidiary
    // ใช้ GROUP BY และ ARRAY_AGG เพื่อรวม subsidiaries
}
```

#### 2.2.3 Handler Update

แก้ไข `GetSimilarSoftwareClusters` handler:
```go
func (h *Handler) GetSimilarSoftwareClusters(c *gin.Context) {
    // ... existing code ...
    
    // เพิ่ม parameter สำหรับ filter โดย subsidiary
    selectedSubsidiaries := c.QueryArray("subsidiaries") // เช่น ?subsidiaries=SCBX&subsidiaries=SCB
    
    // ส่ง parameters ไปยัง repository
    data, err := h.dbRepo.GetSimilarSoftwareClustersWithSubsidiaries(
        ctx, 
        companyCode,
        selectedSubsidiaries,
    )
    
    // ... rest of code ...
}
```

---

### 2.3 แก้ไข GetSimilarSoftwareClusters Query

**ไฟล์:** `asset-pulse-api/repositories/database/database_repository.go`

**Query ใหม่:**
```sql
SELECT 
    a.id as app_id,
    a.name as app_name,
    v.id as vendor_id,
    v.name as vendor_name,
    COUNT(DISTINCT la.user_id) as users,
    AVG(pb.list_price) as price_per_seat,
    MAX(ct.billing_period) as billing_period,
    ARRAY_AGG(DISTINCT la.company_code) FILTER (WHERE la.company_code IS NOT NULL) as subsidiaries
FROM apps a
JOIN license_assignments la ON la.app_id = a.id
LEFT JOIN vendors v ON v.id = a.vendor_id
LEFT JOIN price_books pb ON pb.app_id = a.id
LEFT JOIN contracts ct ON ct.id = la.contract_id
WHERE la.revoked_at IS NULL
  AND (CARDINALITY(:subsidiaries::text[]) = 0 OR la.company_code = ANY(:subsidiaries::text[]))
GROUP BY a.id, a.name, v.id, v.name
ORDER BY a.name
```

---

## 3. Frontend API Client Updates

**ไฟล์:** `asset-pulse-web/src/lib/api/client.ts`

### 3.1 เพิ่ม Method สำหรับดึง Companies

```typescript
async getCompanies(token: string) {
  return this.request<Array<{id: number; code: string; name: string}>>(
    "/companies",
    { token }
  );
}
```

### 3.2 แก้ไข getSimilarSoftwareClusters

```typescript
async getSimilarSoftwareClusters(
  token: string, 
  filters?: {
    company_code?: string;
    subsidiaries?: string[]; // เพิ่ม parameter นี้
    min_similarity?: number;
    category?: string;
    app_name?: string; // เพิ่ม parameter สำหรับ search
  }
) {
  const params = new URLSearchParams();
  if (filters?.company_code) params.append("company_code", filters.company_code);
  if (filters?.subsidiaries) {
    filters.subsidiaries.forEach(code => params.append("subsidiaries", code));
  }
  if (filters?.min_similarity) params.append("min_similarity", filters.min_similarity.toString());
  if (filters?.category) params.append("category", filters.category);
  if (filters?.app_name) params.append("app_name", filters.app_name);
  
  const queryString = params.toString();
  const endpoint = queryString 
    ? `/similar-software/clusters?${queryString}`
    : "/similar-software/clusters";
  return this.request(endpoint, { token });
}
```

---

## 4. Data Structure Updates

### 4.1 Frontend Type Updates

**ไฟล์:** `asset-pulse-web/src/app/similar-software/page.tsx`

```typescript
type AppInCluster = {
  app_id: string;
  name: string;
  vendor_id: string;
  vendor_name: string;
  users: number;
  price_per_seat: number;
  billing_period: "monthly" | "yearly";
  subsidiaries: string[]; // เพิ่มฟิลด์นี้
};
```

---

## 5. Testing Checklist

### 5.1 Frontend Testing
- [ ] ตรวจสอบว่า export button ถูกลบออกทั้งหมด
- [ ] ทดสอบ search input ว่าค้นหา software ได้ถูกต้อง
- [ ] ทดสอบ multi-select dropdown สำหรับ subsidiaries
- [ ] ทดสอบการคลิก app card เพื่อ filter datatable
- [ ] ทดสอบว่า datatable แสดงข้อมูลถูกต้องตาม filter
- [ ] ทดสอบว่า Total Summary คำนวณจาก datatable rows ได้ถูกต้อง

### 5.2 Backend Testing
- [ ] ทดสอบ endpoint `/api/v1/companies` ว่าส่งข้อมูลได้ถูกต้อง
- [ ] ทดสอบ endpoint `/api/v1/similar-software/clusters` กับ parameters ใหม่
- [ ] ทดสอบว่า query ใหม่ดึงข้อมูล subsidiaries ได้ถูกต้อง

---

## 6. Implementation Priority

1. **Phase 1: Remove Export (ง่าย)**
   - ลบ export functionality ทั้งหมด
   - Estimated time: 30 minutes

2. **Phase 2: Add Search Input (ง่าย-กลาง)**
   - เพิ่ม search state และ UI
   - Estimated time: 1 hour

3. **Phase 3: Backend - Get Companies API (กลาง)**
   - สร้าง endpoint สำหรับดึง companies
   - Estimated time: 2 hours

4. **Phase 4: Frontend - Subsidiary Dropdown (กลาง)**
   - เพิ่ม dropdown และ integrate กับ API
   - Estimated time: 2-3 hours

5. **Phase 5: Backend - App with Subsidiaries Data (ยาก)**
   - แก้ไข query เพื่อรวมข้อมูล subsidiaries
   - Estimated time: 3-4 hours

6. **Phase 6: Frontend - Clickable App Cards & Filtered Datatable (ยาก)**
   - Implement clickable cards และ filtering logic
   - Estimated time: 3-4 hours

7. **Phase 7: Total Summary Calculation (กลาง)**
   - แก้ไข calculation ให้ใช้ข้อมูลจาก datatable
   - Estimated time: 2 hours

**Total Estimated Time: 13-16 hours**

---

## 7. Notes

- ต้องแน่ใจว่าข้อมูล subsidiaries สำหรับแต่ละ app มีใน database
- อาจต้อง migrate หรือ seed ข้อมูลถ้าขาด
- ควรพิจารณาใช้ caching สำหรับ list of companies เพื่อลด API calls
- UI/UX: ควรแสดง loading state เมื่อกรองข้อมูล
- ควรแสดง empty state เมื่อไม่มีข้อมูลหลังจากกรอง

