export interface LicenseFromAPI {
  id: number;
  app_id: number | null;
  app_name: string | null;
  app_alias: string | null;
  category: string | null;
  license_tier: string | null;
  assigned_at: string;
  expire_date: string | null;
  effective_date: string | null;
  cost: number | null;
  currency: string | null;
  usage_count_30d: number;
  last_used_at: string | null;
}

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

const iconMap: Record<string, string> = {
  'figma': 'fab fa-figma',
  'slack': 'fab fa-slack',
  'github': 'fab fa-github',
  'adobe': 'fab fa-adobe',
  'tableau': 'fas fa-table',
  'linkedin': 'fab fa-linkedin',
  'microsoft': 'fab fa-microsoft',
};

const colorMap: Record<string, {bg: string, icon: string, tier: string}> = {
  'Design': { bg: 'bg-purple-100', icon: 'text-purple-600', tier: 'bg-purple-100 text-purple-800' },
  'Communication': { bg: 'bg-blue-100', icon: 'text-blue-600', tier: 'bg-blue-100 text-blue-800' },
  'Development': { bg: 'bg-indigo-100', icon: 'text-indigo-600', tier: 'bg-indigo-100 text-indigo-800' },
  'Creative': { bg: 'bg-red-100', icon: 'text-red-600', tier: 'bg-red-100 text-red-800' },
  'Analytics': { bg: 'bg-green-100', icon: 'text-green-600', tier: 'bg-green-100 text-green-800' },
};

function getAppIcon(appName: string | null): string {
  if (!appName) return 'fas fa-box';
  const key = appName.toLowerCase();
  return iconMap[key] || 'fas fa-box';
}

function getAppStyle(category: string | null): {bgColor: string, iconColor: string, tierColor: string} {
  const defaultStyle = { bgColor: 'bg-gray-100', iconColor: 'text-gray-600', tierColor: 'bg-gray-100 text-gray-800' };
  if (!category) return defaultStyle;
  return colorMap[category] || defaultStyle;
}

function getStatus(expireDate: string | null): 'active' | 'expiring' | 'expired' {
  if (!expireDate) return 'active';
  
  const expiry = new Date(expireDate);
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring';
  return 'active';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 2) return '1 day ago';
  return `${diffDays} days ago`;
}

function getUsageFrequency(usageCount: number): 'High' | 'Medium' | 'Low' {
  if (usageCount > 20) return 'High';
  if (usageCount > 10) return 'Medium';
  return 'Low';
}

function getUsagePercent(usageCount: number): number {
  return Math.min(usageCount * 5, 100); // Max 100%
}

function getUsageColor(usagePercent: number): string {
  if (usagePercent > 70) return 'bg-green-500';
  if (usagePercent > 40) return 'bg-yellow-500';
  return 'bg-gray-400';
}

export function transformLicenses(licenses: LicenseFromAPI[]): License[] {
  return licenses.map(license => {
    const status = getStatus(license.expire_date);
    const usagePercent = getUsagePercent(license.usage_count_30d);
    const style = getAppStyle(license.category);
    
    return {
      id: license.id.toString(),
      name: license.app_name || 'Unknown',
      tier: license.license_tier || 'Standard',
      icon: getAppIcon(license.app_name),
      bgColor: style.bgColor,
      iconColor: style.iconColor,
      tierColor: style.tierColor,
      status,
      assignedAt: formatDate(license.assigned_at),
      expiresAt: license.expire_date ? formatDate(license.expire_date) : 'No expiry',
      lastUsed: formatRelativeTime(license.last_used_at),
      usageFrequency: getUsageFrequency(license.usage_count_30d),
      usagePercent,
      usageColor: getUsageColor(usagePercent),
      cost: license.cost || 0,
    };
  });
}

