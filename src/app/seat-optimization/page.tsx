"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';

interface SeatOptimization {
  id: string;
  appId: number;
  appName: string;
  appCategory: string;
  department: string;
  departmentCode: string;
  companyCode: string;
  action: 'revoke' | 'reallocate' | 'downgrade';
  inactiveUsers: number;
  pendingRequests: number;
  canReallocate: number;
  potentialSavings: number;
  riskLevel: string;
  priority: 1 | 2 | 3;
  rationale: string;
  aiGeneratedRationale: string;
  fromDepartment?: string;
  toDepartment?: string;
  downgradeFrom?: string;
  downgradeTo?: string;
  lastUsedDays?: number;
  createdAt: string;
  updatedAt: string;
}

interface OptimizationCounts {
  total: number;
  revoke: number;
  reallocate: number;
  downgrade: number;
}

interface SeatOptimizationResponse {
  data: {
    optimizations: SeatOptimization[];
    totalSavings: number;
    totalUsers: number;
    counts: OptimizationCounts;
  };
}

export default function SeatOptimizationPage() {
  const { token } = useAuthStore();
  const searchParams = useSearchParams();

  // Filters
  const [activeTab, setActiveTab] = useState<'all' | 'revoke' | 'reallocate' | 'downgrade'>('all');
  const [companyCode, setCompanyCode] = useState(searchParams.get('company') || '');
  const [departmentCode, setDepartmentCode] = useState(searchParams.get('department') || '');
  const [appName, setAppName] = useState(searchParams.get('app') || '');
  const [sortBy, setSortBy] = useState('priority');

  // Data
  const [optimizations, setOptimizations] = useState<SeatOptimization[]>([]);
  const [counts, setCounts] = useState<OptimizationCounts>({
    total: 0,
    revoke: 0,
    reallocate: 0,
    downgrade: 0,
  });
  const [totalSavings, setTotalSavings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getSeatOptimization(token, {
        companyCode,
        departmentCode,
        appName,
        action: activeTab !== 'all' ? activeTab : undefined,
        sortBy,
        limit,
        offset: (page - 1) * limit,
      });

      console.log('API Response:', response);
      const data = (response as SeatOptimizationResponse).data;
      console.log('Optimizations data:', data.optimizations);
      
      // Map data to ensure all fields are present
      const mappedOptimizations = data.optimizations.map(opt => ({
        ...opt,
        appName: opt.appName || 'Unknown App',
        appCategory: opt.appCategory || 'General',
        inactiveUsers: opt.inactiveUsers || 0,
      }));
      
      setOptimizations(mappedOptimizations);
      setCounts(data.counts);
      setTotalSavings(data.totalSavings);
    } catch (err) {
      console.error('Error fetching optimizations:', err);
      setError('Failed to load optimization data');
      setOptimizations([]);
      setCounts({ total: 0, revoke: 0, reallocate: 0, downgrade: 0 });
      setTotalSavings(0);
    } finally {
      setLoading(false);
    }
  }, [token, companyCode, departmentCode, appName, activeTab, sortBy, page]);

  // Debounce effect for filters
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyCode, departmentCode, appName, activeTab, sortBy, page, token]);

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === optimizations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(optimizations.map((opt) => opt.id));
    }
  };

  // Get action icon and color
  const getActionConfig = (action: string) => {
    switch (action) {
      case 'revoke':
        return { icon: 'fa-times-circle', color: 'red', bg: 'bg-red-100' };
      case 'reallocate':
        return { icon: 'fa-exchange-alt', color: 'blue', bg: 'bg-blue-100' };
      case 'downgrade':
        return { icon: 'fa-arrow-down', color: 'amber', bg: 'bg-amber-100' };
      default:
        return { icon: 'fa-info-circle', color: 'gray', bg: 'bg-gray-100' };
    }
  };

  // Get priority stars
  const renderPriorityStars = (priority: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3].map((star) => (
          <i
            key={star}
            className={`fas fa-star text-xs ${
              star <= priority ? 'text-amber-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">
          {priority === 3 ? 'High' : priority === 2 ? 'Medium' : 'Low'} Priority
        </span>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seat Optimization</h1>
              <p className="text-gray-600 mt-2">AI-powered license optimization recommendations</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <i className="fas fa-download mr-2"></i>
                Export
              </button>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <i className="fas fa-check mr-2"></i>
                Apply Selected
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revoke</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse mt-2 w-12"></div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-red-600 mt-2">{counts.revoke}</p>
                    <p className="text-sm text-red-600 mt-1">
                      ${Math.round((totalSavings || 0) * 0.33).toLocaleString()}/month savings
                    </p>
                  </>
                )}
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-times-circle text-red-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reallocate</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse mt-2 w-12"></div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{counts.reallocate}</p>
                    <p className="text-sm text-blue-600 mt-1">Cost avoided</p>
                  </>
                )}
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-exchange-alt text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Downgrade</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse mt-2 w-12"></div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{counts.downgrade}</p>
                    <p className="text-sm text-amber-600 mt-1">
                      ${Math.round((totalSavings || 0) * 0.17).toLocaleString()}/month savings
                    </p>
                  </>
                )}
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-arrow-down text-amber-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-6">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === 'all'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All <span className="ml-1 bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">{loading ? '...' : counts.total}</span>
                </button>
                <button
                  onClick={() => setActiveTab('revoke')}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === 'revoke'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Revoke <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{loading ? '...' : counts.revoke}</span>
                </button>
                <button
                  onClick={() => setActiveTab('reallocate')}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === 'reallocate'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Reallocate <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{loading ? '...' : counts.reallocate}</span>
                </button>
                <button
                  onClick={() => setActiveTab('downgrade')}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === 'downgrade'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Downgrade <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{loading ? '...' : counts.downgrade}</span>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <select 
                  value={departmentCode} 
                  onChange={(e) => setDepartmentCode(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Departments</option>
                  <option value="ENG">Engineering</option>
                  <option value="MKT">Marketing</option>
                  <option value="SALES">Sales</option>
                </select>
                <select 
                  value={appName} 
                  onChange={(e) => setAppName(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Apps</option>
                  <option value="Adobe Creative">Adobe Creative</option>
                  <option value="Microsoft 365">Microsoft 365</option>
                  <option value="Slack">Slack</option>
                </select>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="priority">Sort by Priority</option>
                  <option value="savings">Sort by Savings</option>
                  <option value="date">Sort by Date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {optimizations.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === optimizations.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-600">
                    Select All ({optimizations.length} items)
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Total potential savings:{' '}
                  <span className="font-semibold text-green-600">
                    ${(totalSavings || 0).toLocaleString()}/month
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-的不同 text-red-800 px-4 py-3 rounded">
                {error}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="p-6">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                  <p className="text-gray-600">Loading AI recommendations...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && optimizations.length === 0 && (
            <div className="p-6 text-center">
              <i className="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
              <p className="text-gray-600">No optimization opportunities found</p>
            </div>
          )}

          {/* Optimization Cards */}
          {!loading && !error && optimizations.length > 0 && (
            <div className="p-6 space-y-4">
              {optimizations.map((opt) => {
                console.log('Rendering optimization:', opt);
                const actionConfig = getActionConfig(opt.action);
                return (
                  <div
                    key={opt.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(opt.id)}
                          onChange={() => toggleSelection(opt.id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`h-8 w-8 ${actionConfig.bg} rounded-lg flex items-center justify-center`}>
                              <i className={`fas ${actionConfig.icon} text-${actionConfig.color}-600`}></i>
                            </div>
                            <span className={`text-sm font-medium text-${actionConfig.color}-600 bg-${actionConfig.bg} px-2 py-1 rounded-full`}>
                              {opt.action.charAt(0).toUpperCase() + opt.action.slice(1)}
                            </span>
                            {renderPriorityStars(opt.priority)}
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <i className={`fab fa-${(opt.appCategory || 'general').toLowerCase()} text-primary-600`}></i>
                                <h4 className="font-semibold text-gray-900">{opt.appName || 'Unknown App'}</h4>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                {opt.action === 'reallocate' ? (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <span>From: {opt.fromDepartment || opt.department}</span>
                                      <span className="text-red-600 font-medium">{opt.inactiveUsers || 0} inactive</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span>To: {opt.toDepartment}</span>
                                      <span className="text-blue-600 font-medium">{opt.pendingRequests} requests</span>
                                    </div>
                                  </>
                                ) : opt.action === 'revoke' ? (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <span>Department: {opt.department}</span>
                                      <span className="text-red-600 font-medium">{opt.inactiveUsers || 0} inactive</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Last used: {opt.lastUsedDays || 90}+ days ago
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <span>Department: {opt.department}</span>
                                      <span className="text-amber-600 font-medium">{opt.inactiveUsers || 0} users</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Suggested: Downgrade from {opt.downgradeFrom} to {opt.downgradeTo}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-start space-x-2">
                                <i className="fas fa-robot text-primary-600 mt-1"></i>
                                <div>
                                  <h5 className="font-medium text-gray-900 text-sm mb-1">AI Rationale</h5>
                                  <p className="text-xs text-gray-600">
                                    {opt.aiGeneratedRationale || opt.rationale}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm mb-2">Impact Metrics</h5>
                              <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Savings:</span>
                                  <span className="font-medium text-green-600">${(opt.potentialSavings || 0).toLocaleString()}/month</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Users:</span>
                                  <span className="font-medium text-blue-600">{opt.inactiveUsers || 0} users</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Risk Level:</span>
                                  <span className={`font-medium text-${
                                    opt.riskLevel === 'Low' ? 'green' : opt.riskLevel === 'Medium' ? 'amber' : 'red'
                                  }-600`}>{opt.riskLevel}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                          View Details
                        </button>
                        <button className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm hover:bg-green-200 transition-colors">
                          Approve
                        </button>
                        <button className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm hover:bg-red-200 transition-colors">
                          Dismiss
                        </button>
                        <button className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && optimizations.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((page - 1) * limit) + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(page * limit, counts.total)}</span> of{' '}
                  <span className="font-medium">{counts.total}</span> results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button className="px-3 py- которую text-sm bg-primary-600 text-white rounded-lg">{page}</button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page * limit >= counts.total}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
