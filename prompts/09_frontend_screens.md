# Frontend: Core Screens Implementation

## Project Structure
```
asset-pulse-web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Dashboard layout with nav
│   │   ├── page.tsx            # Main dashboard
│   │   ├── recommendations/
│   │   │   ├── jd-match/
│   │   │   │   └── page.tsx    # Feature 3: JD Matching
│   │   │   ├── seat-optimization/
│   │   │   │   └── page.tsx    # Feature 5
│   │   ├── templates/
│   │   │   └── page.tsx        # Feature 4
│   │   └── my-licenses/
│   │       └── page.tsx
├── components/
│   ├── ui/                     # UI components (from previous prompt)
│   ├── ai/                     # AI-specific components
│   └── layout/
│       ├── Navbar.tsx
│       └── Sidebar.tsx
├── lib/
│   ├── api.ts                  # API client
│   └── hooks/
│       ├── useAuth.ts
│       └── useRecommendations.ts
└── types/
    └── index.ts
```

## Types
```typescript
// types/index.ts
export interface User {
  user_id: number
  username: string
  email: string
  first_name: string
  last_name: string
  department_code?: string
  company_code?: string
  roles: string[]
}

export interface Recommendation {
  app_id: number
  app_name: string
  app_key: string
  category: string
  license_tier: string
  relevance_score: number
  annual_cost: number
  rationale: string
}

export interface JDMatchRequest {
  job_title: string
  job_description: string
  department: string
  company_code: string
  employee_name: string
  email?: string
  start_date?: string
}
```

## Login Page
```typescript
// app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password
      })
      
      localStorage.setItem('auth_token', response.data.token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Asset Pulse</h1>
            <p className="text-gray-600 mt-2">AI-Powered Software Asset Management</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Username"
              value={username}
              onChange={setUsername}
              placeholder="Enter your username"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              required
            />
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

## Dashboard Layout
```typescript
// app/(dashboard)/layout.tsx
'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

// components/layout/Navbar.tsx
export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Asset Pulse</h1>
        <div className="flex items-center gap-4">
          <button className="relative">
            🔔 <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full w-5 h-5">3</span>
          </button>
          <button className="flex items-center gap-2">
            👤 <span>John Doe</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

// components/layout/Sidebar.tsx
export const Sidebar: React.FC = () => {
  const menuItems = [
    {icon: '🏠', label: 'Dashboard', href: '/dashboard'},
    {icon: '💡', label: 'Recommendations', href: '/recommendations'},
    {icon: '📦', label: 'My Licenses', href: '/my-licenses'},
    {icon: '📋', label: 'Templates', href: '/templates'},
  ]
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <nav className="space-y-2">
        {menuItems.map(item => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}
```

## Feature 3: JD Matching Screen
```typescript
// app/(dashboard)/recommendations/jd-match/page.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/TextArea'
import { Button } from '@/components/ui/Button'
import { RecommendationCard } from '@/components/ai/RecommendationCard'
import { AIProcessing } from '@/components/ai/AIProcessing'
import { ConfidenceScore } from '@/components/ai/ConfidenceScore'
import { apiClient } from '@/lib/api'
import type { Recommendation, JDMatchRequest } from '@/types'

export default function JDMatchPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<JDMatchRequest>({
    job_title: '',
    job_description: '',
    department: '',
    company_code: 'SCB',
    employee_name: ''
  })
  
  // Recommendations state
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [selectedApps, setSelectedApps] = useState<Set<number>>(new Set())
  const [confidence, setConfidence] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  
  const handleSubmitForm = async () => {
    setLoading(true)
    setStep(2)
    
    try {
      const response = await apiClient.post('/recommendations/jd-match', formData)
      
      setRecommendations(response.data.recommendations)
      setConfidence(response.data.confidence)
      setTotalCost(response.data.total_cost)
      
      // Auto-select all recommendations
      const allAppIds = new Set(response.data.recommendations.map((r: Recommendation) => r.app_id))
      setSelectedApps(allAppIds)
      
      setTimeout(() => setStep(3), 2000)
    } catch (error) {
      console.error('Failed to get recommendations', error)
      setLoading(false)
    }
  }
  
  const toggleApp = (appId: number) => {
    const newSelected = new Set(selectedApps)
    if (newSelected.has(appId)) {
      newSelected.delete(appId)
    } else {
      newSelected.add(appId)
    }
    setSelectedApps(newSelected)
    
    // Recalculate cost
    const cost = recommendations
      .filter(r => newSelected.has(r.app_id))
      .reduce((sum, r) => sum + r.annual_cost, 0)
    setTotalCost(cost)
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                {s}
              </div>
              {s < 3 && <div className="w-16 h-1 bg-gray-200 mx-2"></div>}
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Step {step} of 3: {step === 1 && 'Employee Information'}
          {step === 2 && 'AI Processing'}
          {step === 3 && 'Review Recommendations'}
        </div>
      </div>
      
      {/* Step 1: Form */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">🆕 New Hire Software Request</h2>
          <p className="text-gray-600 mb-6">Get AI-powered software recommendations based on job role</p>
          
          <div className="space-y-4">
            <Input
              label="Employee Name"
              value={formData.employee_name}
              onChange={v => setFormData({...formData, employee_name: v})}
              required
            />
            
            <Input
              label="Job Title"
              value={formData.job_title}
              onChange={v => setFormData({...formData, job_title: v})}
              required
            />
            
            <Input
              label="Department"
              value={formData.department}
              onChange={v => setFormData({...formData, department: v})}
              required
            />
            
            <TextArea
              label="Job Description"
              value={formData.job_description}
              onChange={v => setFormData({...formData, job_description: v})}
              rows={6}
              minLength={50}
              required
            />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Provide a detailed job description for better AI recommendations
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <Button variant="ghost" onClick={() => {}}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmitForm}>
              Next: Get AI Recommendations →
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 2: AI Processing */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm p-12">
          <AIProcessing message="Analyzing job requirements..." />
        </div>
      )}
      
      {/* Step 3: Recommendations */}
      {step === 3 && (
        <>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  ✨ AI-Powered Recommendations
                </h2>
                <p className="text-gray-600">
                  For: {formData.employee_name} - {formData.job_title}
                </p>
              </div>
              <ConfidenceScore score={confidence} />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {recommendations.map(rec => (
              <RecommendationCard
                key={rec.app_id}
                appName={rec.app_name}
                category={rec.category}
                licenseTier={rec.license_tier}
                relevanceScore={rec.relevance_score}
                annualCost={rec.annual_cost}
                rationale={rec.rationale}
                selected={selectedApps.has(rec.app_id)}
                onToggle={() => toggleApp(rec.app_id)}
                onViewRationale={() => alert(rec.rationale)}
              />
            ))}
          </div>
          
          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">📊 Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold">{selectedApps.size}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-primary">
                  {totalCost.toLocaleString()} THB/year
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
              <Button variant="primary" onClick={() => alert('Submitted!')}>
                Submit for Approval →
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
```

## Custom Hooks
```typescript
// lib/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { apiClient } from '../api'
import type { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get('/auth/me')
        setUser(response.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUser()
  }, [])
  
  return { user, loading }
}
```

