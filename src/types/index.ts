export type UserRole = 'employee' | 'manager' | 'subsidiary-cto' | 'group-cto';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role?: UserRole;
  companyCode?: string;
  departmentCode?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  selectRole: (role: UserRole) => void;
  logout: () => void;
}

export interface App {
  id: string;
  name: string;
  key: string;
  category: string;
  icon?: string;
  description?: string;
}

export interface License {
  id: string;
  userId: string;
  appId: string;
  appName: string;
  tier: string;
  status: 'active' | 'inactive' | 'expiring';
  expiresAt: string;
  category: string;
}

export interface Recommendation {
  id: string;
  appId: string;
  appName: string;
  appKey: string;
  category: string;
  recommendedTier: string;
  relevanceScore: number;
  rationale: string;
  estimatedCost: number;
  featuresMatched?: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  department: string;
  scope: string;
  appsCount: number;
  costPerUser: number;
  budgetLimit: number;
  status: 'active' | 'draft';
  createdAt: string;
  lastUsed: string;
  timesUsed: number;
  icon: string;
  color: string;
}

export interface Request {
  id: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  requester: string;
  appName: string;
  amount: number;
  submittedAt: string;
  approvals?: number;
  totalApprovals?: number;
}

export interface OptimizationOpportunity {
  id: string;
  appId: string;
  appName: string;
  department: string;
  inactiveUsers: number;
  pendingRequests: number;
  canReallocate: number;
  potentialSavings: number;
  icon: string;
  color: string;
}

