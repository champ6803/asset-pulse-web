import { User } from "@/lib/api";

export type UserRole = "employee" | "manager" | "subsidiary-cto" | "group-cto";

/**
 * Base API Response wrapper
 * All API responses from the backend follow this structure:
 * {
 *   "message": "success",
 *   "data": T
 * }
 */
export interface BaseResponse<T> {
  message: string;
  data: T;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  initialize: () => Promise<void>;
  login: (username: string, password: string) => Promise<UserRole>;
  selectRole: (role: UserRole) => void;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User>;
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
  license_assignment_id: number;
  license_inventory_id?: number;
  app_id?: number;
  app_name: string;
  app_logo_url?: string;
  app_category?: string;
  app_status?: string;
  license_tier?: string;
  assigned_at: string;
  total_seats?: number;
  reserved_seats?: number;
  effective_date?: string;
  expire_date?: string;
  is_revoked: boolean;
  revoked_at?: string;
  last_used?: string;
  usage_frequency?: number;
}

export interface GetActiveLicensesResponse {
  licenses: License[];
  total: number;
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
  status: "active" | "draft";
  createdAt: string;
  lastUsed: string;
  timesUsed: number;
  icon: string;
  color: string;
}

export interface Request {
  id: string;
  type: string;
  status: "pending" | "approved" | "rejected" | "in_review";
  requester: string;
  appName: string;
  amount: number;
  submittedAt: string;
  approvals?: number;
  totalApprovals?: number;
}

export interface PendingRequest {
  id: number;
  ticket_no: string;
  type: string;
  status: string | null;
  approvals_curr_step: number | null;
  approvals_step: number | null;
  app_id: number | null;
  app_name: string | null;
  created_at: string;
}

export interface GetPendingRequestsResponse {
  requests: PendingRequest[];
  total: number;
}

export interface AIRecommendation {
  id: number;
  app_name: string;
  app_logo_url: string;
  category: string;
  relevance_score: number;
  cost: number;
  rationale: string;
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
