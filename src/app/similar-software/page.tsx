"use client";

import { useMemo, useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/authStore';

type PricingMode = "piecewise" | "progressive";

type PricingTier = {
  threshold_qty: number; // q_k
  unit_price: number; // r_k (THB per seat per period)
};

type VendorPricing = {
  vendor_id: string;
  vendor_name: string;
  feature_cluster_key: string;
  pricing_mode: PricingMode;
  billing_period: "monthly" | "yearly";
  currency: "THB";
  tiers: PricingTier[];
};

type AppInCluster = {
  app_id: string;
  name: string;
  vendor_id: string;
  vendor_name: string;
  users: number; // U_i
  // Current price per seat after contract/list normalization
  price_per_seat: number; // THB per seat per period (normalized to billing period below)
  billing_period: "monthly" | "yearly";
};

type Cluster = {
  key: string; // feature_cluster_key
  name: string;
  description?: string;
  apps: AppInCluster[];
  candidate_pricing: VendorPricing[]; // available target vendor pricing for this cluster
};

type SwitchingPolicy = {
  training_cost_per_user: number; // THB per migrating user
  migration_flat_cost: number; // THB
  early_termination_penalty_rate: number; // 0..1 applied on current cost as proxy
};

function thb(amount: number) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount);
}

function normalizeToYear(price: number, period: "monthly" | "yearly") {
  return period === "monthly" ? price * 12 : price;
}

function normalizeFromYear(priceYear: number, target: "monthly" | "yearly") {
  return target === "monthly" ? priceYear / 12 : priceYear;
}

function calcCurrentCostYear(cluster: Cluster): number {
  // Per spec: sum over apps of U_i * p_i (assuming no existing app-level tier tables)
  return cluster.apps.reduce((sum, app) => {
    const perSeatYear = normalizeToYear(app.price_per_seat, app.billing_period);
    return sum + app.users * perSeatYear;
  }, 0);
}

function calcProgressiveCost(units: number, tiers: PricingTier[]): number {
  // tiers assumed sorted ascending by threshold
  if (tiers.length === 0 || units <= 0) return 0;
  let cost = 0;
  for (let i = 0; i < tiers.length; i++) {
    const qk = tiers[i].threshold_qty;
    const rk = tiers[i].unit_price;
    const nextQ = i + 1 < tiers.length ? tiers[i + 1].threshold_qty : Number.POSITIVE_INFINITY;
    const lower = qk;
    const upper = Math.min(units, nextQ - 1);
    const qty = Math.max(upper - lower + 1, 0);
    if (qty > 0) cost += qty * rk;
  }
  return cost;
}

function calcPiecewiseCost(units: number, tiers: PricingTier[]): number {
  if (tiers.length === 0 || units <= 0) return 0;
  let chosen = tiers[0].unit_price;
  for (const t of tiers) {
    if (units >= t.threshold_qty) chosen = t.unit_price;
  }
  return units * chosen;
}

function calcProposedLicensesCostYear(totalUnits: number, pricing: VendorPricing): number {
  const sorted = [...pricing.tiers].sort((a, b) => a.threshold_qty - b.threshold_qty);
  const raw = pricing.pricing_mode === "progressive"
    ? calcProgressiveCost(totalUnits, sorted)
    : calcPiecewiseCost(totalUnits, sorted);
  // tiers are in the pricing.billing_period; normalize to yearly for comparison
  return normalizeToYear(raw, pricing.billing_period);
}

function calcSwitchingCostYear(unitsMigrating: number, policy: SwitchingPolicy, currentCostYear: number): number {
  const train = unitsMigrating * policy.training_cost_per_user;
  const mig = policy.migration_flat_cost;
  const pen = policy.early_termination_penalty_rate * currentCostYear;
  return train + mig + pen;
}

// UI helpers
function getClusterTheme(name: string): { color: string; bg: string; text: string; ring: string; bar: string; icon: JSX.Element } {
  const lower = name.toLowerCase();
  if (lower.includes('design')) {
    return {
      color: 'orange-600',
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      ring: 'ring-orange-200',
      bar: 'bg-orange-500',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-orange-600" fill="currentColor"><path d="M12 2a1 1 0 0 1 1 1v3l6 6-7 7-6-6 6-6V3a1 1 0 0 1 1-1z"/></svg>
      ),
    };
  }
  if (lower.includes('analytics') || lower.includes('bi')) {
    return {
      color: 'purple-600',
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      ring: 'ring-purple-200',
      bar: 'bg-purple-500',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-purple-600" fill="currentColor"><path d="M4 13h3v7H4v-7zm6-6h3v13h-3V7zm6 3h3v10h-3V10z"/></svg>
      ),
    };
  }
  if (lower.includes('project')) {
    return {
      color: 'blue-600',
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      ring: 'ring-blue-200',
      bar: 'bg-blue-500',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600" fill="currentColor"><path d="M6 3h12a2 2 0 0 1 2 2v4H4V5a2 2 0 0 1 2-2zm-2 8h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8z"/></svg>
      ),
    };
  }
  return {
    color: 'emerald-600',
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    ring: 'ring-emerald-200',
    bar: 'bg-emerald-500',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" fill="currentColor"><path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7z"/></svg>
    ),
  };
}

function getCommonFeatures(clusterName: string): string[] {
  const lower = clusterName.toLowerCase();
  if (lower.includes('design')) return ['Vector Graphics Editing', 'Team Collaboration', 'Brand Asset Libraries', 'Template Management'];
  if (lower.includes('project')) return ['Task Tracking', 'Agile Boards', 'Sprint Management', 'Integrations'];
  if (lower.includes('analytics')) return ['Interactive Dashboards', 'Data Visualization', 'SQL Query Interface', 'Report Scheduling'];
  return ['Collaboration', 'Admin Console', 'SSO', 'APIs'];
}

// Generate app logo URL (fallback to UI Avatars if no real logo available)
function getAppLogoURL(appName: string): string {
  // Try to map known apps to their logo URLs from the design
  const logoMap: Record<string, string> = {
    'Adobe Creative Cloud': 'https://storage.googleapis.com/uxpilot-auth.appspot.com/8154310be6-a5c24746d6c6d1f4217a.png',
    'Figma': 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2a6bda910a-be7814f04383f4df1120.png',
    'Sketch': 'https://storage.googleapis.com/uxpilot-auth.appspot.com/66306c90ce-9235e597d319aea37a7b.png',
    'Canva': 'https://storage.googleapis.com/uxpilot-auth.appspot.com/7cf90dfdc0-3c05cb1260e7b5783352.png',
    'Tableau': 'https://storage.googleapis.com/uxpilot-auth.appspot.com/b86d32c4f9-a868c6a89ce153754f25.png',
    'Power BI': 'https://storage.googleapis.com/uxpilot-auth.appspot.com/a84df924ba-351928575ce040e1577e.png',
    'Looker': 'https://storage.googleapis.com/uxpilot-auth.appspot.com/fc1d8c5ce1-1da3ba9f9273b6d71815.png',
    'Slack': 'https://storage.googleapis.com/uxpilot-auth.appspot.com/53ada5b98a-37a75b7429573ff874ae.png',
  };
  
  const normalizedName = appName.toLowerCase();
  for (const [key, url] of Object.entries(logoMap)) {
    if (normalizedName.includes(key.toLowerCase().split(' ')[0])) {
      return url;
    }
  }
  
  // Fallback to UI Avatars
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(appName)}&background=random&size=128`;
}

function formatTimeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Backend response types
type BackendGroupConsolidationOpp = {
  id: number;
  company_code?: string;
  app_id?: number;
  app?: {
    id: number;
    name: string;
    vendor_id?: number;
    vendor?: {
      id: number;
      name: string;
    };
  };
  current_contract_ids?: number[];
  potential_saving_amt?: number;
  rationale?: string;
  snapshot_json?: any;
  status?: string;
};

// Transform backend data to frontend cluster format
function transformBackendDataToClusters(backendData: BackendGroupConsolidationOpp[]): Cluster[] {
  // Group by app similarity or use snapshot_json if available
  const clustersMap = new Map<string, Cluster>();

  backendData.forEach((opp) => {
    if (!opp.app) return;

    // Use app name as cluster key for now (can be enhanced with feature_cluster_key later)
    const clusterKey = opp.app.name.toLowerCase().replace(/\s+/g, '_');
    const vendorName = opp.app.vendor?.name || 'Unknown Vendor';
    const vendorId = opp.app.vendor?.id?.toString() || opp.app.vendor_id?.toString() || 'unknown';

    if (!clustersMap.has(clusterKey)) {
      clustersMap.set(clusterKey, {
        key: clusterKey,
        name: `${opp.app.name} Group`,
        description: opp.rationale || undefined,
        apps: [],
        candidate_pricing: [],
      });
    }

    const cluster = clustersMap.get(clusterKey)!;
    
    // Add app to cluster
    // Note: This is simplified - real implementation should get user counts and pricing from contracts
    cluster.apps.push({
      app_id: opp.app.id.toString(),
      name: opp.app.name,
      vendor_id: vendorId,
      vendor_name: vendorName,
      users: 50, // TODO: Get from license_assignments or contracts
      price_per_seat: 500, // TODO: Get from contract_terms or price_books
      billing_period: "monthly",
    });

    // Add default pricing as candidate (will be fetched separately if endpoint exists)
    if (!cluster.candidate_pricing.find(p => p.vendor_id === vendorId)) {
      cluster.candidate_pricing.push({
        vendor_id: vendorId,
        vendor_name: vendorName,
        feature_cluster_key: clusterKey,
        pricing_mode: "piecewise",
        billing_period: "monthly",
        currency: "THB",
        tiers: [
          { threshold_qty: 1, unit_price: 600 },
          { threshold_qty: 50, unit_price: 500 },
          { threshold_qty: 200, unit_price: 400 },
        ],
      });
    }
  });

  return Array.from(clustersMap.values());
}

// Mock data fallback (non-hook version for use in callbacks)
function getMockClusters(): Cluster[] {
    const designCluster: Cluster = {
      key: "design_tools",
      name: "Design & Creative Tools",
      description: "UI/UX design, prototyping, collaboration",
      apps: [
        { app_id: "figma-a", name: "Figma", vendor_id: "figma", vendor_name: "Figma Inc.", users: 70, price_per_seat: 450, billing_period: "monthly" },
        { app_id: "adobe-xd", name: "Adobe XD", vendor_id: "adobe", vendor_name: "Adobe", users: 30, price_per_seat: 11000, billing_period: "yearly" },
        { app_id: "sketch", name: "Sketch", vendor_id: "sketch", vendor_name: "Sketch B.V.", users: 20, price_per_seat: 9, billing_period: "monthly" },
      ],
      candidate_pricing: [
        {
          vendor_id: "figma",
          vendor_name: "Figma Inc.",
          feature_cluster_key: "design_tools",
          pricing_mode: "piecewise",
          billing_period: "monthly",
          currency: "THB",
          tiers: [
            { threshold_qty: 1, unit_price: 600 },
            { threshold_qty: 50, unit_price: 500 },
            { threshold_qty: 200, unit_price: 400 },
          ],
        },
        {
          vendor_id: "adobe",
          vendor_name: "Adobe",
          feature_cluster_key: "design_tools",
          pricing_mode: "progressive",
          billing_period: "yearly",
          currency: "THB",
          tiers: [
            { threshold_qty: 1, unit_price: 12000 },
            { threshold_qty: 100, unit_price: 10000 },
          ],
        },
      ],
    };

    const pmCluster: Cluster = {
      key: "project_mgmt",
      name: "Project Management",
      description: "Planning, tracking, and sprint management",
      apps: [
        { app_id: "jira", name: "Jira Software", vendor_id: "atlassian", vendor_name: "Atlassian", users: 180, price_per_seat: 400, billing_period: "monthly" },
        { app_id: "asana", name: "Asana", vendor_id: "asana", vendor_name: "Asana", users: 60, price_per_seat: 300, billing_period: "monthly" },
      ],
      candidate_pricing: [
        {
          vendor_id: "atlassian",
          vendor_name: "Atlassian",
          feature_cluster_key: "project_mgmt",
          pricing_mode: "piecewise",
          billing_period: "monthly",
          currency: "THB",
          tiers: [
            { threshold_qty: 1, unit_price: 450 },
            { threshold_qty: 50, unit_price: 350 },
            { threshold_qty: 200, unit_price: 300 },
          ],
        },
      ],
    };

    return [designCluster, pmCluster];
}

export default function SimilarSoftwarePage() {
  const { token } = useAuthStore();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'savings' | 'apps' | 'subs'>('savings');
  const [policy, setPolicy] = useState<SwitchingPolicy>({
    training_cost_per_user: 500,
    migration_flat_cost: 50000,
    early_termination_penalty_rate: 0.0,
  });
  const [selectedTarget, setSelectedTarget] = useState<Record<string, string>>({});
  const [companyCode, setCompanyCode] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [minSimilarity, setMinSimilarity] = useState<number>(80);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  function handleExport() {
    const payload = clusters.map(c => ({
      key: c.key,
      name: c.name,
      apps: c.apps.map(a => ({ name: a.name, vendor: a.vendor_name, users: a.users })),
      candidate_pricing: c.candidate_pricing.map(p => ({ vendor: p.vendor_name, mode: p.pricing_mode, period: p.billing_period, tiers: p.tiers })),
    }));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'similar_software_clusters.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  // Fetch clusters from API with filters and enrich pricing tiers
  useEffect(() => {
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    const fetchClusters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API
        const backendData = await apiClient.getSimilarSoftwareClusters(token, {
          company_code: companyCode,
          category: category,
          min_similarity: minSimilarity,
        });
        
        if (Array.isArray(backendData) && backendData.length > 0) {
          let transformed = transformBackendDataToClusters(backendData as any);
          // fetch vendor pricing tiers per cluster and merge
          try {
            const tierLists = await Promise.all(
              transformed.map(c => apiClient.getVendorPricingTiers(token, c.key))
            );
            transformed = transformed.map((c, idx) => {
              const tiers = tierLists[idx] as unknown as VendorPricing[];
              return {
                ...c,
                candidate_pricing: (tiers && Array.isArray(tiers) && tiers.length > 0) ? tiers : c.candidate_pricing,
              };
            });
          } catch (e) {
            // keep existing candidate_pricing if vendor tiers fetch fails
          }
          setClusters(transformed);
          
          // Initialize selected targets
          const initial: Record<string, string> = {};
          transformed.forEach(c => {
            initial[c.key] = c.candidate_pricing[0]?.vendor_id || '';
          });
          setSelectedTarget(initial);
        } else {
          // Fallback to mock data if API returns empty
          const mockClusters = getMockClusters();
          setClusters(mockClusters);
          const initial: Record<string, string> = {};
          mockClusters.forEach(c => {
            initial[c.key] = c.candidate_pricing[0]?.vendor_id || '';
          });
          setSelectedTarget(initial);
          setLastUpdated(new Date());
        }
      } catch (err) {
        console.error("Failed to fetch clusters:", err);
        // Fallback to mock data on error
        const mockClusters = getMockClusters();
        setClusters(mockClusters);
        const initial: Record<string, string> = {};
        mockClusters.forEach(c => {
          initial[c.key] = c.candidate_pricing[0]?.vendor_id || '';
        });
        setSelectedTarget(initial);
        setLastUpdated(new Date());
        setError("Failed to load data. Using sample data.");
      } finally {
        setLoading(false);
      }
    };

    fetchClusters();
  }, [token, companyCode, category, minSimilarity]);

  const enriched = useMemo(() => {
    return clusters.map(cluster => {
      const currentYear = calcCurrentCostYear(cluster);
      const totalUnits = cluster.apps.reduce((n, a) => n + a.users, 0);
      const chosenVendorId = selectedTarget[cluster.key];
      const chosenPricing = cluster.candidate_pricing.find(v => v.vendor_id === chosenVendorId) || cluster.candidate_pricing[0];
      const licensesYear = chosenPricing ? calcProposedLicensesCostYear(totalUnits, chosenPricing) : 0;
      const switchYear = calcSwitchingCostYear(totalUnits, policy, currentYear);
      const proposedYear = licensesYear + switchYear;
      const saving = Math.max(currentYear - proposedYear, 0);
      const savingPct = currentYear > 0 ? (saving / currentYear) * 100 : 0;
      return {
        cluster,
        currentYear,
        proposedYear,
        licensesYear,
        switchYear,
        saving,
        savingPct,
        totalUnits,
        chosenPricing,
      };
    });
  }, [clusters, policy, selectedTarget]);

  const sorted = useMemo(() => {
    const arr = [...enriched];
    if (sortBy === 'savings') arr.sort((a, b) => b.saving - a.saving);
    if (sortBy === 'apps') arr.sort((a, b) => b.cluster.apps.length - a.cluster.apps.length);
    return arr;
  }, [enriched, sortBy]);

  const totals = useMemo(() => {
    const totalGroups = clusters.length;
    const totalApps = clusters.reduce((n, c) => n + c.apps.length, 0);
    const totalSavings = enriched.reduce((n, e) => n + e.saving, 0);
    const totalSubs = 0; // placeholder: requires assignment mapping to subsidiaries
    return { totalGroups, totalApps, totalSavings, totalSubs };
  }, [clusters, enriched]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <div className="text-gray-600">Loading similar software clusters...</div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-yellow-800">{error}</span>
            </div>
          </div>
        )}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor"><path d="M12 2a1 1 0 0 1 1 1v3l6 6-7 7-6-6 6-6V3a1 1 0 0 1 1-1z"/></svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Similar Software Detection</h1>
                <p className="text-gray-600 mt-1">AI-powered matching • Consolidation savings with tiered pricing</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center space-x-2 shadow-sm">
                <span className="text-sm font-medium text-gray-700">Scope</span>
                <select
                  className="bg-transparent border-none text-sm focus:outline-none"
                  value={companyCode || ''}
                  onChange={e => setCompanyCode(e.target.value || undefined)}
                >
                  <option value="">Group - All subsidiaries</option>
                  <option value="SCBX">SCBX</option>
                  <option value="SCBT">SCB Tech</option>
                </select>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center space-x-2 shadow-sm">
                <span className="text-sm font-medium text-gray-700">Category</span>
                <select
                  className="bg-transparent border-none text-sm focus:outline-none"
                  value={category || ''}
                  onChange={e => setCategory(e.target.value || undefined)}
                >
                  <option value="">All Categories</option>
                  <option value="Design">Design</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Project Management">Project Management</option>
                </select>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center space-x-2 shadow-sm">
                <span className="text-sm font-medium text-gray-700">Similarity</span>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={minSimilarity}
                  onChange={e => setMinSimilarity(Number(e.target.value))}
                  className="w-24 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium text-primary-600">&gt;{minSimilarity}%</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center space-x-2 shadow-sm">
                <span className="text-sm font-medium text-gray-700">Training/คน</span>
                <input
                  type="number"
                  className="w-24 bg-transparent border-none text-sm focus:outline-none"
                  value={policy.training_cost_per_user}
                  onChange={e => setPolicy(p => ({ ...p, training_cost_per_user: Number(e.target.value || 0) }))}
                />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center space-x-2 shadow-sm">
                <span className="text-sm font-medium text-gray-700">Migration Flat</span>
                <input
                  type="number"
                  className="w-28 bg-transparent border-none text-sm focus:outline-none"
                  value={policy.migration_flat_cost}
                  onChange={e => setPolicy(p => ({ ...p, migration_flat_cost: Number(e.target.value || 0) }))}
                />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center space-x-2 shadow-sm">
                <span className="text-sm font-medium text-gray-700">Penalty</span>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-20 bg-transparent border-none text-sm focus:outline-none"
                  value={policy.early_termination_penalty_rate}
                  onChange={e => setPolicy(p => ({ ...p, early_termination_penalty_rate: Number(e.target.value || 0) }))}
                />
              </div>
              <button onClick={handleExport} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-sm flex items-center">
                <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2" fill="currentColor"><path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.84v4h4.66V9h3.84L12 2z"/></svg>
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totals.totalGroups}</div>
              <div className="text-sm text-gray-600 mt-1">Similar Software Groups</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totals.totalApps}</div>
              <div className="text-sm text-gray-600 mt-1">Applications Identified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{thb(totals.totalSavings)}</div>
              <div className="text-sm text-gray-600 mt-1">Total Potential Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{totals.totalSubs}</div>
              <div className="text-sm text-gray-600 mt-1">Subsidiaries Affected</div>
            </div>
          </div>
        </div>

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
          </div>
          <div className="text-sm text-gray-500">
            Showing {sorted.length} groups{lastUpdated && ` • Updated ${formatTimeAgo(Math.floor((new Date().getTime() - lastUpdated.getTime()) / 60000))}`}
          </div>
        </div>

        <div className="space-y-6">
          {sorted.map(({ cluster, currentYear, proposedYear, saving, savingPct, totalUnits, chosenPricing, licensesYear, switchYear }) => {
            const theme = getClusterTheme(cluster.name);
            const features = getCommonFeatures(cluster.name);
            const similarity = Math.min(95, 60 + cluster.apps.length * 8);
            return (
              <div key={cluster.key} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow shadow-sm">
                <div className="flex items-center justify-between mb-5">
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
                      <p className="text-sm text-gray-500">{cluster.apps.length} applications across {Math.max(1, Math.floor(cluster.apps.length / 2))} subsidiaries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 justify-end mb-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className={`${theme.bar} h-2 rounded-full`} style={{ width: `${similarity}%` }} />
                      </div>
                      <span className={`text-sm font-semibold ${theme.text}`}>{similarity}% Similar</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{thb(saving)}</div>
                    <div className="text-xs text-gray-500">potential savings ({savingPct.toFixed(0)}%)</div>
                  </div>
                </div>

                {/* App tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {cluster.apps.slice(0, 4).map(app => {
                    const perSeatYear = normalizeToYear(app.price_per_seat, app.billing_period);
                    const logoURL = getAppLogoURL(app.name);
                    return (
                      <div key={app.app_id} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex items-center space-x-3 mb-2">
                          <img 
                            src={logoURL} 
                            alt={`${app.name} logo`}
                            className="h-8 w-8 rounded object-contain"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) {
                                fallback.classList.remove('hidden');
                                fallback.classList.add('flex');
                              }
                            }}
                          />
                          <div className="h-8 w-8 rounded bg-white border items-center justify-center text-xs font-semibold text-gray-700 hidden">
                            {app.name.substring(0,1)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{app.name}</h4>
                            <p className="text-xs text-gray-500">{app.vendor_name}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          <div>{app.users.toLocaleString()} users</div>
                          <div className="font-semibold text-gray-900">{thb(perSeatYear * app.users)}/year</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* AI Analysis */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-blue-900">AI Analysis</h4>
                    </div>
                    <p className="text-sm text-blue-800 mb-2">{cluster.description || 'High feature overlap detected in vector editing, collaborative design, and brand asset management capabilities.'}</p>
                    <p className="text-sm font-medium text-blue-900">Recommendation: {chosenPricing ? `Consolidate to ${chosenPricing.vendor_name} with group pricing.` : 'Consolidate to the best vendor tier with group pricing.'}</p>
                  </div>

                  {/* Common Features */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Common Features</h4>
                    <div className="space-y-2">
                      {features.map(f => (
                        <div key={f} className="flex items-center text-sm text-gray-700">
                          <svg className="h-3.5 w-3.5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Summary */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-3">Total Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tools:</span>
                        <span className="font-medium">{cluster.apps.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Users:</span>
                        <span className="font-medium">{totalUnits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Cost:</span>
                        <span className="font-medium">{thb(currentYear)}/year</span>
                      </div>
                      <div className="border-t border-green-200 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-green-700 font-medium">Consolidation Potential:</span>
                          <span className="text-xl font-bold text-green-600">{thb(saving)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500">
                            <th className="py-2 pr-4">App</th>
                            <th className="py-2 pr-4">Vendor</th>
                            <th className="py-2 pr-4">Users</th>
                            <th className="py-2 pr-4">Price/Seat</th>
                            <th className="py-2 pr-4">Period</th>
                            <th className="py-2 pr-4">Cost/Year</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cluster.apps.map(app => {
                            const perSeatYear = normalizeToYear(app.price_per_seat, app.billing_period);
                            return (
                              <tr key={app.app_id} className="border-t">
                                <td className="py-2 pr-4">{app.name}</td>
                                <td className="py-2 pr-4">{app.vendor_name}</td>
                                <td className="py-2 pr-4">{app.users.toLocaleString()}</td>
                                <td className="py-2 pr-4">{thb(app.price_per_seat)}</td>
                                <td className="py-2 pr-4">{app.billing_period}</td>
                                <td className="py-2 pr-4">{thb(perSeatYear * app.users)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Target Vendor</div>
                      <select
                        className="w-full bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={selectedTarget[cluster.key]}
                        onChange={e => setSelectedTarget(prev => ({ ...prev, [cluster.key]: e.target.value }))}
                      >
                        {cluster.candidate_pricing.map(v => (
                          <option key={v.vendor_id} value={v.vendor_id}>{v.vendor_name}</option>
                        ))}
                      </select>
                    </div>
                    {chosenPricing && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="text-sm font-medium text-gray-700">Selected Pricing</div>
                        <div className="text-xs text-gray-500">Mode: {chosenPricing.pricing_mode} • Period: {chosenPricing.billing_period}</div>
                        <div className="mt-2 text-xs text-gray-600">
                          <div className="font-medium mb-1">Tiers</div>
                          <div className="space-y-1">
                            {[...chosenPricing.tiers].sort((a, b) => a.threshold_qty - b.threshold_qty).map(t => (
                              <div key={t.threshold_qty} className="flex justify-between">
                                <span>≥ {t.threshold_qty} seats</span>
                                <span>{thb(normalizeToYear(t.unit_price, chosenPricing.billing_period))}/yr</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 pt-1">
                      <button 
                        onClick={() => {
                          // TODO: Navigate to consolidation plan page or show modal
                          console.log('View consolidation plan for cluster:', cluster.key);
                        }}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-sm flex items-center"
                      >
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        View Consolidation Plan
                      </button>
                      <button 
                        onClick={() => {
                          // TODO: Dismiss/hide this cluster
                          console.log('Dismiss cluster:', cluster.key);
                        }}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
                      >
                        Dismiss
                      </button>
                      <button 
                        onClick={() => {
                          const payload = {
                            cluster_key: cluster.key,
                            cluster_name: cluster.name,
                            apps: cluster.apps,
                            savings: { current: currentYear, proposed: proposedYear, potential: saving },
                            target_vendor: chosenPricing?.vendor_name,
                          };
                          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `cluster_${cluster.key}_export.json`;
                          link.click();
                          link.remove();
                          URL.revokeObjectURL(url);
                        }}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors shadow-sm flex items-center"
                      >
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Export
                      </button>
                    </div>
                    <div className="text-sm text-gray-500 pt-1">
                      Last updated: {formatTimeAgo(Math.floor((new Date().getTime() - lastUpdated.getTime()) / 60000))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

