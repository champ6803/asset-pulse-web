# New Hire Step 2 - AI Recommendations API Specification

## Overview
API specification สำหรับ Step 2 ของ New Hire Request flow ที่ใช้ AI เพื่อแนะนำ software licenses สำหรับพนักงานใหม่ โดยรับข้อมูลจาก Step 1 และเพิ่ม optional filtering ด้วย app_name

## Current Flow Analysis

### Step 1: Basic Information Form
หน้า `/requests/new-hire` รับข้อมูลต่อไปนี้:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | string | ✅ Yes | ชื่อ-นามสกุลของพนักงาน |
| `jobTitle` | string | ✅ Yes | ตำแหน่งงาน (e.g., Senior Software Engineer) |
| `department` | string | ✅ Yes | แผนก (engineering, product, design, marketing, sales, hr, finance, operations) |
| `company` | string | ✅ Yes | บริษัท (scbx, scb, scb-tech, scb-securities, scb-asset, scb-life) |
| `email` | string | ✅ Yes | อีเมลของพนักงาน |
| `startDate` | string (date) | ✅ Yes | วันที่เริ่มงาน |
| `jobDescription` | string | ✅ Yes | รายละเอียดตำแหน่งงาน (สูงสุด 2000 ตัวอักษร) |

**Note:** ข้อมูลเหล่านี้จะถูกส่งผ่านจาก Step 1 ไป Step 2 โดยอาจใช้:
- URL query parameters
- Session storage / Local storage
- React state management

### Step 2: AI Recommendations
หน้า `/requests/new-hire/recommendations` ต้อง:
1. แสดง AI-powered software license recommendations
2. ใช้ข้อมูลจาก Step 1 เพื่อสร้าง recommendations
3. รองรับการ filter ด้วย `app_name` (optional)
4. แสดง relevance score, cost, rationale สำหรับแต่ละ recommendation

## API Specification

### Endpoint
```
POST /api/v1/ai/recommendations/new-hire
```

### Authentication
- ต้องมี JWT token ใน Authorization header
- ต้องผ่าน authentication middleware

### Request

#### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Body Parameters

**All parameters are OPTIONAL** - หากไม่ได้ส่งจะใช้ข้อมูลจาก context หรือใช้ default values

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `job_title` | string | ❌ No | `null` | ตำแหน่งงาน (จาก Step 1) |
| `job_description` | string | ❌ No | `null` | รายละเอียดงาน (จาก Step 1) |
| `department` | string | ❌ No | `null` | แผนก (จาก Step 1) |
| `company_code` | string | ❌ No | จาก user context | รหัสบริษัท (จาก Step 1) |
| `app_name` | string | ❌ No | `null` | **NEW:** ชื่อแอปพลิเคชันที่ต้องการหา similar apps (ใช้ CatalogSearchService เพื่อหา apps ที่คล้ายกัน แล้วแนะนำจาก apps เหล่านั้น) |
| `limit` | integer | ❌ No | `10` | จำนวน recommendations ที่ต้องการ (default 10) |
| `experience` | string | ❌ No | `null` | ระดับประสบการณ์ (optional) |
| `skills` | array[string] | ❌ No | `[]` | รายการทักษะ (optional) |

#### Request Body Example

**Minimal Request (ใช้ข้อมูลจาก context)**
```json
{}
```

**Request with Job Data (จาก Step 1)**
```json
{
  "job_title": "Senior Software Engineer",
  "job_description": "Develop and maintain web applications using React and Node.js. Experience with cloud platforms and CI/CD pipelines required.",
  "department": "engineering",
  "company_code": "scb-tech"
}
```

**Request with Similar Apps Search (NEW)**
```json
{
  "job_title": "Senior Software Engineer",
  "job_description": "Develop web applications...",
  "department": "engineering",
  "company_code": "scb-tech",
  "app_name": "GitHub Enterprise",
  "limit": 20
}
```

**Note:** เมื่อ Keyword `app_name` ถูกส่งมา:
- ระบบจะใช้ `CatalogSearchService` เพื่อค้นหา apps ที่คล้ายกันกับ `app_name` ที่ระบุ
- ใช้ embedding และ cosine similarity เพื่อหา similar apps (Top K, default 5-10 apps)
- จากนั้น AI จะแนะนำ software licenses จาก apps ที่คล้ายกันนั้น + ร่วมกับ job description เพื่อคำนวณ relevance score

**Request with Skills**
```json
{
  "job_title": "Frontend Developer",
  "job_description": "Build responsive user interfaces...",
  "department": "product",
  "company_code": "scb-tech",
  "experience": "Mid-level",
  "skills": ["React", "TypeScript", "Figma", "Jest"]
}
```

### Response

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "app_name": "GitHub Enterprise",
        "category": "DevOps",
        "tier": "Pro License",
        "relevance_score": 96.5,
        "cost": 12000.0,
        "rationale": "Job mentions version control, CI/CD pipelines, and code collaboration. Essential for software development workflow.",
        "features": [
          "Private repositories",
          "Advanced security",
          "Team management",
          "CI/CD integration"
        ],
        "alternatives": ["GitLab", "Bitbucket"],
        "icon": "fab fa-github",
        "selected": false
      },
      {
        "app_name": "Slack Pro",
        "category": "Collaboration",
        "tier": "Pro License",
        "relevance_score": 92.0,
        "cost": 8500.0,
        "rationale": "Engineering role requires team communication and file sharing capabilities.",
        "features": [
          "Unlimited message history",
          "File sharing",
          "Integrations",
          "Video calls"
        ],
        "alternatives": ["Microsoft Teams", "Discord"],
        "icon": "fab fa-slack",
        "selected": false
      }
    ],
    "confidence": 92.5,
    "processing_time": "1.23s",
    "total_recommendations": 2,
    "metadata": {
      "job_title": "Senior Software Engineer",
      "department": "engineering",
      "company_code": "scb-tech",
      "app_name_used": false,
      "similar_apps_searched": null
    }
  }
}
```

**Response with app_name similarity search:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "app_name": "GitLab Enterprise",
        "category": "DevOps",
        "tier": "Premium License",
        "relevance_score": 94.2,
        "similarity_score": 87.5,
        "cost": 11500.0,
        "rationale": "Similar to GitHub Enterprise with additional DevOps features. Suitable for engineering team.",
        "features": [
          "Git repository management",
          "CI/CD pipelines",
          "Container registry",
          "Security scanning"
        ],
        "alternatives": ["GitHub Enterprise", "Bitbucket"],
        "icon": "fab fa-gitlab",
        "selected": false
      },
      {
        "app_name": "Bitbucket Cloud",
        "category": "DevOps",
        "tier": "Standard",
        "relevance_score": 88.7,
        "similarity_score": 82.3,
        "cost": 9800.0,
        "rationale": "Version control platform similar to GitHub, integrates well with Atlassian ecosystem.",
        "features": [
          "Git repositories",
          "Pull requests",
          "Code review",
          "Jira integration"
        ],
        "alternatives": ["GitHub", "GitLab"],
        "icon": "fab fa-bitbucket",
        "selected": false
      }
    ],
    "confidence": 90.5,
    "processing_time": "2.15s",
    "total_recommendations": 2,
    "metadata": {
      "job_title": "Senior Software Engineer",
      "department": "engineering",
      "company_code": "scb-tech",
      "app_name_used": true,
      "app_name_searched": "GitHub Enterprise",
      "similar_apps_searched": [
        {
          "app_name": "GitLab Enterprise",
          "similarity": 87.5,
          "vendor": "GitLab",
          "product_name": "GitLab DevOps Platform"
        },
        {
          "app_name": "Bitbucket Cloud",
          "similarity": 82.3,
          "vendor": "Atlassian",
          "product_name": "Bitbucket"
        }
      ]
    }
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `recommendations` | array | รายการ recommendations |
| `recommendations[].app_name` | string | ชื่อแอปพลิเคชัน |
| `recommendations[].category` | string | หมวดหมู่ (DevOps, Collaboration, Design, etc.) |
| `recommendations[].tier` | string | ระดับ license (Pro License, Enterprise, Standard, etc.) |
| `recommendations[].relevance_score` | float | คะแนนความเกี่ยวข้อง (0-100) - รวม similarity score + job match score |
| `recommendations[].similarity_score` | float | **NEW:** คะแนน similarity กับ app_name ที่ผู้ใช้พิมพ์ (0-100) |
| `recommendations[].cost` | float | ราคาต่อปี (THB) |
| `recommendations[].rationale` | string | เหตุผลที่แนะนำ (AI-generated) |
| `recommendations[].features` | array[string] | คุณสมบัติสำคัญ |
| `recommendations[].alternatives` | array[string] | แอปทางเลือก |
| `recommendations[].icon` | string | Font Awesome icon class (สำหรับ UI) |
| `recommendations[].selected` | boolean | สถานะการเลือก (default: false) |
| `confidence` | float | ระดับความมั่นใจของ AI (0-100) |
| `processing_time` | string | เวลาที่ใช้ในการประมวลผล |
| `total_recommendations` | integer | จำนวน recommendations ทั้งหมด |
| `metadata` | object | ข้อมูลเพิ่มเติม |
| `metadata.app_name_used` | boolean | ระบุว่ามีการใช้ app_name search หรือไม่ |
| `metadata.similar_apps_searched` | array[object] | **NEW:** รายละเอียด apps ที่คล้ายกัน (เมื่อใช้ app_name) |
| `metadata.similar_apps_searched[].app_name` | string | ชื่อ app ที่คล้ายกัน |
| `metadata.similar_apps_searched[].similarity` | float | คะแนน similarity (0-100) |
| `metadata.similar_apps_searched[].vendor` | string | Vendor ของ app |
| `metadata.similar_apps_searched[].product_name` | string | ชื่อ product ที่ normalize แล้ว |
| `metadata.app_name_searched` | string | **NEW:** app_name ที่ผู้ใช้พิมพ์เข้าไป (สำหรับ similarity search) |

#### Error Responses

**400 Bad Request** - Missing required context data
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Job title and job description are required. Please provide via request body or ensure they are available in the session context."
  }
}
```

**401 Unauthorized** - Invalid or missing token
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

**500 Internal Server Error** - AI service error
```json
{
  "success": false,
  "error": {
    "code": "AI_SERVICE_ERROR",
    "message": "Failed to generate recommendations. Please try again later."
  }
}
```

## Implementation Details

### Backend Handler Logic

```go
// Handler function signature
func (h *Handler) GetNewHireRecommendations(c *gin.Context) {
    // 1. Get user context (user_id, company_code from JWT)
    // 2. Parse optional request body
    // 3. Try to get missing data from:
    //    - Request body (priority)
    //    - Session/Context (if available)
    //    - User's default company_code from JWT
    // 4. If job_title and job_description are still missing, return 400
    // 5. หากมี app_name:
    //    a. ตรวจสอบว่า CatalogSearchService initialized หรือยัง
    //    b. เรียก CatalogSearchService.Search() เพื่อหา similar apps
    //    c. ดึง app names จาก search results (Top K results)
    //    d. เก็บ similarity scores สำหรับ metadata
    // 6. Call AI service to generate recommendations:
    //    - หากมี app_name: ส่ง similar apps + job description ไปให้ AI
    //    - หากไม่มี app_name: ส่ง job description เท่านั้น (ใช้ all available apps)
    // 7. Combine recommendations with similarity scores (if app_name provided)
    // 8. Return recommendations พร้อม metadata เกี่ยวกับ similar apps (ถ้ามี)
}
```

### Data Flow

1. **Step 1 → Step 2 Data Passing:**
   - Option A: URL Query Parameters (recommended)
     ```
     /requests/new-hire/recommendations?job_title=Senior%20Engineer&department=engineering&...
     ```
   - Option B: Session Storage / Local Storage
   - Option C: React State Management (Redux/Zustand)

2. **API Request Flow:**

   **เมื่อไม่มี app_name:**
   ```
   Frontend (Step 2)
     ↓
   POST /api/v1/ai/recommendations/new-hire
     ↓
   Handler: GetNewHireRecommendations
     ↓
   UseCase: GetNewHireRecommendations
     ↓
   Database: Get all available apps
     ↓
   AI Service: GenerateJDRecommendations (with all apps)
     ↓
   OpenAI API: Generate recommendations
     ↓
   Response: Recommendations with scores
   ```

   **เมื่อมี app_name (NEW):**
   ```
   Frontend (Step 2)
     ↓
   POST /api/v1/ai/recommendations/new-hire
     { ..., app_name: "GitHub Enterprise" }
     ↓
   Handler: GetNewHireRecommendations
     ↓
   UseCase: GetNewHireRecommendations
     ↓
   CatalogSearchService: Search(app_name)
     - Normalize app_name
     - Create embedding
     - Find similar apps (cosine similarity)
     - Return Top K similar apps (e.g., 5-10 apps)
     ↓
   Extract similar app names from search results
     ↓
   Database: Get apps matching similar app names
     ↓
   AI Service: GenerateJDRecommendations 
     (with similar apps + job description)
     ↓
   OpenAI API: Generate recommendations for similar apps
     ↓
   Response: Recommendations + metadata about similar apps
   ```

### App Name Similarity Search Logic

เมื่อ `app_name` ถูกส่งมา:

1. **ใช้ CatalogSearchService เพื่อหา Similar Apps:**
   ```go
   // ใน UseCase หรือ Handler
   if req.AppName != "" {
       // Initialize catalog search service (if not already initialized)
       if !catalogSearchService.IsInitialized() {
           catalogSearchService.Initialize(ctx)
       }
       
       // Search for similar apps
       searchReq := &ai.CatalogSearchRequest{
           Query: req.AppName,
           TopK:  10, // Get top 10 similar apps
       }
       
       searchResults, err := catalogSearchService.Search(ctx, searchReq)
       if err != nil {
           // Fallback: continue without app_name filter
           log.Warn("Catalog search failed, continuing without app_name filter")
       } else {
           // Extract app names from search results
           similarAppNames := []string{}
           similarityMap := make(map[string]float64)
           for _, result := range searchResults.Results {
               similarAppNames = append(similarAppNames, result.InputName)
               similarityMap[result.InputName] = result.Similarity
           }
           // Use similarAppNames as candidates for AI recommendations
           // Store similarityMap for later use in response metadata
       }
   }
   ```

2. **Process Flow:**
   - **Step 1:** Normalize `app_name` (e.g., "GitHub Enterprise" → extract vendor, product, functionalities)
   - **Step 2:** Create embedding vector สำหรับ normalized `app_name` (ใช้ `text-embedding-3-large` model)
   - **Step 3:** คำนวณ cosine similarity กับ apps ทั้งหมดใน catalog (ใช้ dot product ของ normalized vectors)
   - **Step 4:** เลือก Top K apps ที่มี similarity score สูงสุด (e.g., Top 10, default)
   - **Step 5:** ใช้ app names เหล่านี้เป็น candidates สำหรับ AI recommendations
   - **Step 6:** AI จะคำนวณ relevance score โดยพิจารณา:
     - Similarity กับ app ที่ user พิมพ์ (base score จาก CatalogSearchService)
     - ความเหมาะสมกับ job description (job match score จาก AI)
     - รวมเป็น final relevance_score (weighted average หรือ hybrid score)

3. **Response Enhancement:**
   - เพิ่ม metadata เกี่ยวกับ similar apps ที่ถูกค้นหา
   - แสดง similarity score ของแต่ละ app กับ `app_name` ที่ผู้ใช้พิมพ์
   - Recommendations จะเรียงตามความเกี่ยวข้อง (relevance_score ที่รวม similarity + job match)
   - แต่ละ recommendation จะมีทั้ง `relevance_score` และ `similarity_score` แยกกัน

### Comparison with Existing Endpoint

| Feature | `/api/v1/ai/recommendations/jd-match` | `/api/v1/ai/recommendations/new-hire` (NEW) |
|---------|---------------------------------------|---------------------------------------------|
| Method | POST | POST |
| Parameters | All required | All optional |
| Similar Apps Search | ❌ No | ✅ Yes (`app_name` → CatalogSearchService) |
| Use Case | General JD matching | Specific to New Hire flow |
| Data Source | Request body only | Request body + Context |

## Frontend Integration

### API Client Method

```typescript
// src/lib/api/client.ts
async getNewHireRecommendations(
  data: {
    job_title?: string;
    job_description?: string;
    department?: string;
    company_code?: string;
    app_name?: string;
    limit?: number;
    experience?: string;
    skills?: string[];
  },
  token: string
) {
  return this.request("/ai/recommendations/new-hire", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}
```

### React Hook

```typescript
// src/lib/hooks/useNewHireRecommendations.ts
export function useNewHireRecommendations(
  step1Data?: {
    jobTitle?: string;
    jobDescription?: string;
    department?: string;
    company?: string;
  },
  appName?: string
) {
  const { token } = useAuthStore();

  return useQuery<AIRecommendation[]>({
    queryKey: ["recommendations", "new-hire", step1Data, appName],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }
      
      return apiClient.getNewHireRecommendations(
        {
          job_title: step1Data?.jobTitle,
          job_description: step1Data?.jobDescription,
          department: step1Data?.department,
          company_code: step1Data?.company,
          app_name: appName,
        },
        token
      );
    },
    enabled: !!token,
  });
}
```

### Usage in Recommendations Page

```typescript
// src/app/requests/new-hire/recommendations/page.tsx
export default function RecommendationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get data from Step 1 via URL params or storage
  const jobTitle = searchParams.get('job_title') || '';
  const jobDescription = searchParams.get('job_description') || '';
  const department = searchParams.get('department') || '';
  const company = searchParams.get('company') || '';
  
  const { data: recommendations, isLoading, error } = 
    useNewHireRecommendations(
      { jobTitle, jobDescription, department, company },
      undefined // appName filter (optional)
    );
  
  // ... rest of component
}
```

## Database Considerations

### Required Tables/Views
- `apps` - รายการแอปพลิเคชันที่มี
- `app_catalog` - หมวดหมู่แอปพลิเคชัน
- `volume_pricing` - ราคาตามจำนวน (ถ้ามี)

### Query Example (when app_name filter is applied)

```sql
-- Get app by name for filtering
SELECT 
    id,
    app_name,
    category,
    description,
    base_price
FROM apps
WHERE app_name ILIKE '%GitHub Enterprise%'
  AND status = 'active'
  AND company_code = 'scb-tech';
```

## Testing Strategy

### Unit Tests
1. Handler tests - ตรวจสอบ parameter parsing
2. UseCase tests - ตรวจสอบ business logic
3. AI Service tests - ตรวจสอบ AI integration

### Integration Tests
1. Test with all parameters provided
2. Test with minimal parameters (use context)
3. Test with `app_name` similarity search (calls CatalogSearchService)
4. Test error cases (missing data, AI service failure, CatalogSearchService failure)
5. Test fallback behavior when CatalogSearchService returns no results

### Test Cases

| Test Case | Input | Expected Result |
|-----------|-------|----------------|
| All parameters provided | Full request body | Success with recommendations |
| Minimal request | Empty body (use context) | Success if context available |
| App name similarity search | `app_name: "GitHub"` | Recommendations from apps similar to GitHub (e.g., GitLab, Bitbucket, etc.) with similarity scores in metadata |
| App name with job description | `app_name: "Slack"` + job_description | Recommendations that match both similar to Slack AND job requirements, ordered by combined relevance_score |
| Missing context | Empty body + no context | 400 Bad Request |
| Invalid app name | `app_name: "NonExistentXYZ123"` | May return empty or fallback to general recommendations (depends on CatalogSearchService behavior) |
| App name with no matches | `app_name: "MailChimp"` (not in catalog) | Return apps with low similarity scores OR fallback to general recommendations |
| App name + limit | `app_name: "Figma"`, `limit: 5` | Top 5 recommendations from similar apps to Figma |

## Security Considerations

1. **Authentication**: ต้องมี valid JWT token
2. **Authorization**: ตรวจสอบว่า user มีสิทธิ์เข้าถึง company_code
3. **Rate Limiting**: จำกัดจำนวน requests เพื่อป้องกัน abuse
4. **Input Validation**: Sanitize และ validate ทุก input
5. **Data Privacy**: ไม่ส่งข้อมูล sensitive ไปยัง AI service โดยไม่จำเป็น

## Performance Considerations

1. **Caching**: 
   - Cache recommendations สำหรับ JD ที่เหมือนกัน (24 hours)
     - Cache key: `new_hire_recs:{company_code}:{department}:{hash(job_description)}`
   - Cache similarity search results (12 hours) - เมื่อใช้ `app_name`
     - Cache key: `similar_apps:{app_name}:{hash(app_name)}`
     - CatalogSearchService initialization สามารถ cache embeddings ไว้ใน memory
2. **AI Service**: ใช้ async processing ถ้า processing time > 5 seconds
3. **Database Indexing**: 
   - Index `app_name` ใน apps table
   - Index `company_code` และ `status` สำหรับ filtering
4. **Limit Default**: Default limit = 10 เพื่อลด response size
5. **CatalogSearchService Optimization**:
   - Initialize service once at startup (load all embeddings into memory)
   - Similarity search ใช้ in-memory vector operations (เร็วมาก)
   - TopK default = 10 เพื่อ balance ระหว่าง accuracy และ performance

## Future Enhancements

1. **Pagination**: Support offset/limit สำหรับ recommendations จำนวนมาก
2. **Sorting**: Sort by relevance_score, cost, category
3. **Bulk Recommendations**: รองรับหลาย positions พร้อมกัน
4. **Recommendation History**: บันทึกประวัติ recommendations
5. **A/B Testing**: ทดสอบ prompts ต่างๆ เพื่อปรับปรุง quality

IA-generated rationale for each recommendation

