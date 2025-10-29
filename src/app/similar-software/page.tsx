"use client";

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/authStore';
import toast, { Toaster } from 'react-hot-toast';

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
  subsidiaries: string[]; // เพิ่มฟิลด์นี้
};

type Cluster = {
  key: string; // feature_cluster_key
  name: string;
  description?: string;
  apps: AppInCluster[];
  candidate_pricing: VendorPricing[]; // available target vendor pricing for this cluster
  subsidiaries?: string[]; // All subsidiaries using apps in this cluster (from backend)
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

// Backend response types (matching new API structure)
type BackendSimilarSoftwareCluster = {
  key: string;
  name: string;
  description: string;
  common_features: string[];
  apps: BackendSimilarSoftwareApp[];
  total_users: number;
  current_cost_year: number;
  potential_saving?: number;
  subsidiaries: string[];
};

type BackendSimilarSoftwareApp = {
  app_id: number;
  name: string;
  vendor_id?: number;
  vendor_name?: string;
  category?: string;
  users: number;
  price_per_seat: number;
  billing_period: "monthly" | "yearly";
  currency: string;
  cost_year: number;
  subsidiaries: string[];
  details: BackendSimilarSoftwareAppDetail[];
};

type BackendSimilarSoftwareAppDetail = {
  subsidiary: string;
  users: number;
  price_per_seat: number;
  billing_period: "monthly" | "yearly";
  cost_year: number;
};

// Transform backend data to frontend cluster format
async function transformBackendDataToClusters(
  backendData: BackendSimilarSoftwareCluster[],
  token: string
): Promise<Cluster[]> {
  const clusters: Cluster[] = [];

  for (const backendCluster of backendData) {
    const cluster: Cluster = {
      key: backendCluster.key,
      name: backendCluster.name,
      description: backendCluster.description,
      apps: [],
      candidate_pricing: [],
    };

    // Transform apps
    for (const backendApp of backendCluster.apps) {
      const app: AppInCluster = {
        app_id: backendApp.app_id.toString(),
        name: backendApp.name,
        vendor_id: backendApp.vendor_id?.toString() || 'unknown',
        vendor_name: backendApp.vendor_name || 'Unknown Vendor',
        users: backendApp.users,
        price_per_seat: backendApp.price_per_seat,
        billing_period: backendApp.billing_period,
        subsidiaries: backendApp.subsidiaries,
      };
      // Store details on app object for datatable rendering
      (app as any).details = backendApp.details;
      cluster.apps.push(app);
    }
    
    // Store cluster-level subsidiaries
    cluster.subsidiaries = backendCluster.subsidiaries;

    // Fetch vendor pricing tiers for this cluster
    try {
      const tiers = await apiClient.getVendorPricingTiers(token, backendCluster.key);
      if (tiers && Array.isArray(tiers) && tiers.length > 0) {
        cluster.candidate_pricing = tiers as unknown as VendorPricing[];
      }
    } catch (e) {
      // Keep empty if fetch fails
      console.error("Failed to fetch pricing tiers:", e);
    }

    clusters.push(cluster);
  }

  return clusters;
}

// Mock data fallback (non-hook version for use in callbacks)
function getMockClusters(): Cluster[] {
    const designCluster: Cluster = {
      key: "design_tools",
      name: "Design & Creative Tools",
      description: "UI/UX design, prototyping, collaboration",
      apps: [
        { app_id: "figma-a", name: "Figma", vendor_id: "figma", vendor_name: "Figma Inc.", users: 70, price_per_seat: 450, billing_period: "monthly", subsidiaries: ["SCBX", "SCB"] },
        { app_id: "adobe-xd", name: "Adobe XD", vendor_id: "adobe", vendor_name: "Adobe", users: 30, price_per_seat: 11000, billing_period: "yearly", subsidiaries: ["SCBX"] },
        { app_id: "sketch", name: "Sketch", vendor_id: "sketch", vendor_name: "Sketch B.V.", users: 20, price_per_seat: 9, billing_period: "monthly", subsidiaries: ["SCB"] },
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
        { app_id: "jira", name: "Jira Software", vendor_id: "atlassian", vendor_name: "Atlassian", users: 180, price_per_seat: 400, billing_period: "monthly", subsidiaries: ["SCBX", "SCB", "DATAX"] },
        { app_id: "asana", name: "Asana", vendor_id: "asana", vendor_name: "Asana", users: 60, price_per_seat: 300, billing_period: "monthly", subsidiaries: ["SCBX", "SCB"] },
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
  const router = useRouter();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'savings' | 'apps' | 'subs'>('savings');
  const [policy, setPolicy] = useState<SwitchingPolicy>({
    training_cost_per_user: 500,
    migration_flat_cost: 50000,
    early_termination_penalty_rate: 0.0,
  });
  // Removed: companyCode, category, minSimilarity filters (as per requirement)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [searchInput, setSearchInput] = useState<string>(''); // Input field value
  const [searchQuery, setSearchQuery] = useState<string>(''); // Actual search query used for API
  const [subsidiaries, setSubsidiaries] = useState<Array<{code: string; name: string}>>([]);
  const [selectedSubsidiaries, setSelectedSubsidiaries] = useState<Record<string, string[]>>({}); // Array of selected subsidiaries per cluster
  const [selectedAppId, setSelectedAppId] = useState<Record<string, string | null>>({}); // Selected app per cluster
  const [datatableData, setDatatableData] = useState<Record<string, any[]>>({}); // Datatable rows per cluster key
  const [previousResponseLength, setPreviousResponseLength] = useState<Record<string, number>>({}); // Previous API response length per cluster key
  const [failedSubsidiaries, setFailedSubsidiaries] = useState<Record<string, string[]>>({}); // Subsidiaries that returned 500 error per cluster key (to hide from dropdown)

  // Function to fetch datatable data for a specific app and subsidiaries
  // Returns: { success: boolean, newRowCount: number }
  const fetchDatatableData = async (clusterKey: string, appId: string | null, subsidiaryList: string[], previousRowCount?: number) => {
    if (!token || !appId) {
      setDatatableData(prev => ({ ...prev, [clusterKey]: [] }));
      return { success: false, newRowCount: 0 };
    }

    try {
      console.log(`Fetching datatable data for app ${appId} with subsidiaries:`, subsidiaryList);
      const backendData = await apiClient.getSimilarSoftwareClusters(token, {
        app_id: appId,
        subsidiaries: subsidiaryList.length > 0 ? subsidiaryList : undefined,
      }) as BackendSimilarSoftwareCluster[];

      console.log(`Received backend data:`, backendData);
      
      // Extract datatable rows from response
      // If API returns 200, no alert should be shown
      if (Array.isArray(backendData) && backendData.length > 0) {
        const allRows: any[] = [];
        backendData.forEach(cluster => {
          cluster.apps.forEach(app => {
            if (app.details && app.details.length > 0) {
              app.details.forEach(detail => {
                if (subsidiaryList.length === 0 || subsidiaryList.includes(detail.subsidiary)) {
                  allRows.push({
                    app_id: app.app_id.toString(),
                    name: app.name,
                    vendor_name: app.vendor_name || 'Unknown',
                    subsidiary: detail.subsidiary,
                    users: detail.users,
                    price_per_seat: detail.price_per_seat,
                    billing_period: detail.billing_period,
                  });
                }
              });
            }
          });
        });
        console.log(`Extracted ${allRows.length} rows for datatable`);
        
        // Update previous response length and datatable
        const currentResponseLength = backendData.length;
        setPreviousResponseLength(prev => ({ ...prev, [clusterKey]: currentResponseLength }));
        setDatatableData(prev => ({ ...prev, [clusterKey]: allRows }));
        return { success: true, newRowCount: allRows.length };
      } else {
        console.log("No backend data received or empty array");
        
        // If API returns 200 with empty array, no alert (200 means success)
        const currentResponseLength = 0;
        setPreviousResponseLength(prev => ({ ...prev, [clusterKey]: currentResponseLength }));
        setDatatableData(prev => ({ ...prev, [clusterKey]: [] }));
        return { success: true, newRowCount: 0 };
      }
    } catch (err: any) {
      console.error("Failed to fetch datatable data:", err);
      
      // Check if it's a 500 error (no data found for requested subsidiaries)
      if (err?.response?.status === 500) {
        console.warn(`No data found for app ${appId} with subsidiaries:`, subsidiaryList);
        // Show toast error
        if (subsidiaryList.length > 0) {
          const subNames = subsidiaryList.map(code => {
            const sub = subsidiaries.find(s => s.code === code);
            return sub ? sub.name : code;
          }).join(', ');
          toast.error(`No data found for ${subNames}`, {
            duration: 4000,
            icon: '⚠️',
          });
        }
        // Remove the last selected subsidiary from the list
        if (subsidiaryList.length > 0) {
          const lastSub = subsidiaryList[subsidiaryList.length - 1];
          setSelectedSubsidiaries(prev => ({
            ...prev,
            [clusterKey]: (prev[clusterKey] || []).filter(c => c !== lastSub)
          }));
          // Add to failed subsidiaries list to hide from dropdown
          setFailedSubsidiaries(prev => {
            const currentFailed = prev[clusterKey] || [];
            if (!currentFailed.includes(lastSub)) {
              return {
                ...prev,
                [clusterKey]: [...currentFailed, lastSub]
              };
            }
            return prev;
          });
        }
        // Keep existing data, don't clear on 500
        return { success: false, newRowCount: previousRowCount || 0 };
      } else if (err?.response?.status === 404) {
        console.warn(`API endpoint not found for app ${appId} with subsidiaries:`, subsidiaryList);
        // Keep existing data, don't clear on 404
      } else if (err?.response?.status >= 500) {
        console.error("Server error:", err.response?.data);
        // On server error, keep existing data
      } else {
        // Other errors - might be network issues
        console.error("Request failed:", err.message);
      }
      
      // Don't clear datatable on error - keep existing data
      // Only clear if this is the initial load (subsidiaryList is empty)
      if (subsidiaryList.length === 0) {
        setDatatableData(prev => ({ ...prev, [clusterKey]: [] }));
      }
      return { success: false, newRowCount: previousRowCount || 0 };
    }
  };

  // Fetch subsidiaries
  useEffect(() => {
    if (!token) return;
    
    const fetchSubsidiaries = async () => {
      try {
        const data = await apiClient.getCompanies(token);
        setSubsidiaries(data.map(c => ({ code: c.code, name: c.name })));
      } catch (err) {
        console.error("Failed to fetch subsidiaries:", err);
      }
    };
    
    fetchSubsidiaries();
  }, [token]);

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
          app_name: searchQuery || undefined,
        }) as BackendSimilarSoftwareCluster[];
        
        if (Array.isArray(backendData) && backendData.length > 0) {
          // Backend should already include subsidiaries in response
          let transformed = await transformBackendDataToClusters(backendData, token);
          
          // Post-process: get actual subsidiaries from license assignments if possible
          // This would require a new API endpoint: GET /similar-software/apps/{app_id}/subsidiaries
          // For now, we'll use mock/default data
          // fetch vendor pricing tiers per cluster and merge (if not already fetched)
          try {
            for (const cluster of transformed) {
              if (cluster.candidate_pricing.length === 0) {
                const tiers = await apiClient.getVendorPricingTiers(token, cluster.key);
                if (tiers && Array.isArray(tiers) && tiers.length > 0) {
                  cluster.candidate_pricing = tiers as unknown as VendorPricing[];
                }
              }
            }
          } catch (e) {
            // keep existing candidate_pricing if vendor tiers fetch fails
            console.error("Failed to fetch pricing tiers:", e);
          }
          setClusters(transformed);
        } else {
          // Fallback to mock data if API returns empty
          const mockClusters = getMockClusters();
          setClusters(mockClusters);
          setLastUpdated(new Date());
        }
      } catch (err) {
        console.error("Failed to fetch clusters:", err);
        // Fallback to mock data on error
        const mockClusters = getMockClusters();
        setClusters(mockClusters);
        setLastUpdated(new Date());
        setError("Failed to load data. Using sample data.");
      } finally {
        setLoading(false);
      }
    };

    fetchClusters();
  }, [token, searchQuery]); // Only fetch when searchQuery changes (not searchInput)

  const enriched = useMemo(() => {
    return clusters.map(cluster => {
      const currentYear = calcCurrentCostYear(cluster);
      const totalUnits = cluster.apps.reduce((n, a) => n + a.users, 0);
      // Use first pricing as default (no Target Vendor selection)
      const chosenPricing = cluster.candidate_pricing[0];
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
  }, [clusters, policy]);

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
        <Toaster position="top-right" />
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
      <Toaster position="top-right" />
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

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Find existing or similar software"
                className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    // Trigger search on Enter
                    setSearchQuery(searchInput.trim());
                  }
                }}
              />
              <button
                onClick={() => {
                  // Trigger search when button is clicked
                  setSearchQuery(searchInput.trim());
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-sm flex items-center"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
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
          </div>
          <div className="flex justify-end">
            <div className="text-sm text-gray-500">
              Showing {filteredAndSorted.length} groups{lastUpdated && ` • Updated ${formatTimeAgo(Math.floor((new Date().getTime() - lastUpdated.getTime()) / 60000))}`}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredAndSorted.map(({ cluster, currentYear, proposedYear, saving, savingPct, totalUnits, chosenPricing, licensesYear, switchYear }) => {
            const theme = getClusterTheme(cluster.name);
            const features = getCommonFeatures(cluster.name);
            const similarity = Math.min(95, 60 + cluster.apps.length * 8);
            const clusterSelectedApp = selectedAppId[cluster.key] || null;
            const clusterSelectedSubsidiaries = selectedSubsidiaries[cluster.key] || [];
            
            // Use datatable data from API (only shows selected app + selected subsidiaries)
            const uniqueDatatableRows = datatableData[cluster.key] || [];
            
            // Calculate summary from datatable
            let summaryFromDatatable = {
              tools: 0,
              totalUsers: 0,
              currentCost: 0,
              consolidationPotential: 0,
            };
            
            if (uniqueDatatableRows.length > 0) {
              // Count unique apps
              const uniqueApps = new Set(uniqueDatatableRows.map(r => r.app_id));
              const tools = uniqueApps.size;
              const totalUsers = uniqueDatatableRows.reduce((sum, row) => sum + row.users, 0);
              const currentCost = uniqueDatatableRows.reduce((sum, row) => {
                const perSeatYear = normalizeToYear(row.price_per_seat, row.billing_period);
                return sum + row.users * perSeatYear;
              }, 0);
              
              const proposedLicensesYear = chosenPricing 
                ? calcProposedLicensesCostYear(totalUsers, chosenPricing)
                : 0;
              const switchYear = calcSwitchingCostYear(totalUsers, policy, currentCost);
              const proposedTotal = proposedLicensesYear + switchYear;
              const consolidationPotential = Math.max(currentCost - proposedTotal, 0);
              
              summaryFromDatatable = {
                tools,
                totalUsers,
                currentCost,
                consolidationPotential,
              };
            }
            
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
                    const isSelected = clusterSelectedApp === app.app_id;
                    return (
                      <div
                        key={app.app_id}
                        className={`bg-gray-50 rounded-lg p-4 border cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'ring-2 ring-primary-500 border-primary-500 bg-blue-50' : ''
                        }`}
                        onClick={async () => {
                          const newAppId = isSelected ? null : app.app_id;
                          setSelectedAppId(prev => ({
                            ...prev,
                            [cluster.key]: newAppId
                          }));
                          // Clear selected subsidiaries when app changes
                          setSelectedSubsidiaries(prev => {
                            const newState = { ...prev };
                            delete newState[cluster.key];
                            return newState;
                          });
                          // Fetch datatable data for selected app
                          if (newAppId) {
                            await fetchDatatableData(cluster.key, newAppId, [], undefined);
                          } else {
                            setDatatableData(prev => ({ ...prev, [cluster.key]: [] }));
                          }
                        }}
                      >
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
                        <span className="font-medium">{summaryFromDatatable.tools}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Users:</span>
                        <span className="font-medium">{summaryFromDatatable.totalUsers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Cost:</span>
                        <span className="font-medium">{thb(summaryFromDatatable.currentCost)}/year</span>
                      </div>
                      <div className="border-t border-green-200 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-green-700 font-medium">Consolidation Potential:</span>
                          <span className="text-xl font-bold text-green-600">{thb(summaryFromDatatable.consolidationPotential)}</span>
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
                            <th className="py-2 pr-4">Subsidiary</th>
                            <th className="py-2 pr-4">Users</th>
                            <th className="py-2 pr-4">Price/Seat</th>
                            <th className="py-2 pr-4">Period</th>
                            <th className="py-2 pr-4">Cost/Year</th>
                            <th className="py-2 pr-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uniqueDatatableRows.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-4 text-center text-gray-500">
                                {clusterSelectedApp 
                                  ? "Select subsidiaries to add to the datatable" 
                                  : "Select an app from above to view details"}
                              </td>
                            </tr>
                          ) : (
                            uniqueDatatableRows.map((row, idx) => {
                              const perSeatYear = normalizeToYear(row.price_per_seat, row.billing_period);
                              return (
                                <tr key={`${row.app_id}-${row.subsidiary}-${idx}`} className="border-t">
                                  <td className="py-2 pr-4">{row.name}</td>
                                  <td className="py-2 pr-4">{row.vendor_name}</td>
                                  <td className="py-2 pr-4">{row.subsidiary}</td>
                                  <td className="py-2 pr-4">{row.users.toLocaleString()}</td>
                                  <td className="py-2 pr-4">{thb(row.price_per_seat)}</td>
                                  <td className="py-2 pr-4">{row.billing_period}</td>
                                  <td className="py-2 pr-4">{thb(perSeatYear * row.users)}</td>
                                  <td className="py-2 pr-4">
                                    <button
                                      onClick={async () => {
                                        // Remove subsidiary from selected list
                                        const newList = clusterSelectedSubsidiaries.filter(c => c !== row.subsidiary);
                                        setSelectedSubsidiaries(prev => ({ ...prev, [cluster.key]: newList }));
                                        // Refresh datatable data
                                        if (clusterSelectedApp) {
                                          const prevCount = datatableData[cluster.key]?.length || 0;
                                          await fetchDatatableData(cluster.key, clusterSelectedApp, newList, prevCount);
                                        }
                                      }}
                                      className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded px-2 py-1 transition-colors"
                                      title="Remove from datatable"
                                    >
                                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Add Subsidiary</div>
                      <select
                        className="w-full bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value=""
                        onChange={async (e) => {
                          const selected = e.target.value;
                          if (selected && clusterSelectedApp) {
                            // Add subsidiary to the list (avoid duplicates)
                            const currentList = selectedSubsidiaries[cluster.key] || [];
                            if (!currentList.includes(selected)) {
                              // Get current row count before fetching
                              const previousRowCount = datatableData[cluster.key]?.length || 0;
                              const newList = [...currentList, selected];
                              setSelectedSubsidiaries(prev => ({ ...prev, [cluster.key]: newList }));
                              
                              try {
                                // Fetch datatable data with new subsidiary list
                                // Toast will be shown in fetchDatatableData if no new data found
                                await fetchDatatableData(cluster.key, clusterSelectedApp, newList, previousRowCount);
                              } catch (err: any) {
                                // If fetch fails, remove the subsidiary from list and show error
                                const subName = subsidiaries.find(s => s.code === selected)?.name || selected;
                                setSelectedSubsidiaries(prev => ({
                                  ...prev,
                                  [cluster.key]: (prev[cluster.key] || []).filter(c => c !== selected)
                                }));
                                console.error("Failed to fetch data for subsidiary:", selected, err);
                                toast.error(`Failed to load data for ${subName}`, {
                                  duration: 4000,
                                  icon: '❌',
                                });
                              }
                            }
                          }
                          // Reset select to empty value after selection
                          e.target.value = "";
                        }}
                        disabled={!clusterSelectedApp}
                      >
                        <option value="">Select Subsidiary to Add</option>
                        {(cluster.subsidiaries || [])
                          .filter(code => {
                            // Only show subsidiaries that are not already selected/added
                            const isSelected = clusterSelectedSubsidiaries.includes(code);
                            // Hide subsidiaries that returned 500 error
                            const isFailed = (failedSubsidiaries[cluster.key] || []).includes(code);
                            return !isSelected && !isFailed;
                          })
                          .map(code => {
                            const sub = subsidiaries.find(s => s.code === code);
                            return sub ? { code: sub.code, name: sub.name } : { code, name: code };
                          })
                          .map(sub => (
                            <option key={sub.code} value={sub.code}>{sub.name} ({sub.code})</option>
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
                          router.push(`/consolidation/${cluster.key}`);
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

