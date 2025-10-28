export interface License {
  id: string;
  name: string;
  tier: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  tierColor: string;
  status: 'active' | 'expiring' | 'expired';
  assignedAt: string;
  expiresAt: string;
  lastUsed: string;
  usageFrequency: 'High' | 'Medium' | 'Low';
  usagePercent: number;
  usageColor: string;
  cost: number;
}

