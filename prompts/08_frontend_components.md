# Frontend: Component Library & Design System

## Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **State**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Heroicons

## Design System

### Color Palette
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // Deep Blue
          light: '#3B82F6',   // Bright Blue
        },
        success: '#10B981',   // Green
        warning: '#F59E0B',   // Amber
        danger: '#EF4444',    // Red
        neutral: '#64748B',   // Slate Gray
        background: '#F8FAFC',
      }
    }
  }
}
```

### Typography
```typescript
// components/ui/Typography.tsx
export const H1: React.FC<{children: React.ReactNode}> = ({children}) => (
  <h1 className="text-4xl font-bold text-gray-900">{children}</h1>
)

export const H2: React.FC<{children: React.ReactNode}> = ({children}) => (
  <h2 className="text-3xl font-bold text-gray-900">{children}</h2>
)

export const H3: React.FC<{children: React.ReactNode}> = ({children}) => (
  <h3 className="text-2xl font-semibold text-gray-900">{children}</h3>
)

export const Body: React.FC<{children: React.ReactNode}> = ({children}) => (
  <p className="text-base text-gray-700">{children}</p>
)
```

### Button Components
```typescript
// components/ui/Button.tsx
import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit'
  icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled,
  loading,
  type = 'button',
  icon
}) => {
  const baseClasses = 'rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center'
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-light disabled:bg-gray-300',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary-light hover:text-white',
    danger: 'bg-danger text-white hover:bg-red-600 disabled:bg-gray-300',
    ghost: 'bg-transparent text-primary hover:bg-gray-100'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {loading && <LoadingSpinner size="sm" />}
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}

const LoadingSpinner: React.FC<{size: 'sm' | 'md'}> = ({size}) => (
  <svg className={`animate-spin ${size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
  </svg>
)
```

### Card Component
```typescript
// components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({children, className = '', hover = false, onClick}) => {
  const hoverClass = hover ? 'hover:shadow-lg cursor-pointer' : ''
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
```

### Input Components
```typescript
// components/ui/Input.tsx
interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password' | 'number'
  error?: string
  required?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  required,
  disabled,
  icon
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-danger' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
        />
      </div>
      
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  )
}

// components/ui/TextArea.tsx
interface TextAreaProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  rows?: number
  error?: string
  required?: boolean
  minLength?: number
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  error,
  required,
  minLength
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        minLength={minLength}
        className={`
          w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent
          ${error ? 'border-danger' : 'border-gray-300'}
        `}
      />
      
      {minLength && (
        <p className="mt-1 text-xs text-gray-500">
          {value.length}/{minLength} characters minimum
        </p>
      )}
      
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  )
}
```

### Badge Component
```typescript
// components/ui/Badge.tsx
type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface BadgeProps {
  children: React.ReactNode
  variant: BadgeVariant
}

export const Badge: React.FC<BadgeProps> = ({children, variant}) => {
  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800'
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  )
}
```

### AI-Specific Components

#### AI Recommendation Card
```typescript
// components/ai/RecommendationCard.tsx
interface RecommendationCardProps {
  appName: string
  appIcon?: string
  category: string
  licenseTier: string
  relevanceScore: number
  annualCost: number
  rationale: string
  selected: boolean
  onToggle: () => void
  onViewRationale: () => void
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  appName,
  category,
  licenseTier,
  relevanceScore,
  annualCost,
  rationale,
  selected,
  onToggle,
  onViewRationale
}) => {
  return (
    <div className={`
      relative border-2 rounded-xl p-4 cursor-pointer transition-all
      ${selected ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-primary-light'}
    `} onClick={onToggle}>
      {/* Checkbox */}
      <div className="absolute top-4 right-4">
        <input type="checkbox" checked={selected} readOnly className="w-5 h-5" />
      </div>
      
      {/* App Icon & Name */}
      <div className="mb-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg mb-2"></div>
        <h3 className="font-semibold text-lg">{appName}</h3>
        <p className="text-sm text-gray-600">{licenseTier}</p>
      </div>
      
      {/* Category */}
      <Badge variant="info">{category}</Badge>
      
      {/* Relevance Score */}
      <div className="mt-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{width: `${relevanceScore}%`}}
            ></div>
          </div>
          <span className="text-sm font-medium">{relevanceScore}%</span>
        </div>
      </div>
      
      {/* Cost */}
      <p className="text-lg font-bold text-primary mb-2">
        {annualCost.toLocaleString()} THB/year
      </p>
      
      {/* Rationale Button */}
      <button 
        className="text-sm text-primary hover:underline"
        onClick={(e) => {
          e.stopPropagation()
          onViewRationale()
        }}
      >
        🤖 Why recommended?
      </button>
    </div>
  )
}
```

#### AI Processing Indicator
```typescript
// components/ai/AIProcessing.tsx
export const AIProcessing: React.FC<{message?: string}> = ({message = "AI is analyzing..."}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute inset-0 border-4 border-primary-light rounded-full animate-pulse"></div>
        <div className="absolute inset-2 border-4 border-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          🤖
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-600">Estimated time: 3-5 seconds</p>
    </div>
  )
}
```

#### Confidence Score Display
```typescript
// components/ai/ConfidenceScore.tsx
interface ConfidenceScoreProps {
  score: number // 0-100
}

export const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({score}) => {
  const getColor = () => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  const getIcon = () => {
    if (score >= 90) return '🟢'
    if (score >= 70) return '🟡'
    return '🔴'
  }
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">{getIcon()}</span>
      <div>
        <p className="text-sm text-gray-600">AI Confidence</p>
        <p className={`text-xl font-bold ${getColor()}`}>{score}%</p>
      </div>
    </div>
  )
}
```

### Modal Component
```typescript
// components/ui/Modal.tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({isOpen, onClose, title, children, footer}) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="p-6 border-t bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
```

### API Client Setup
```typescript
// lib/api.ts
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

