"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { License } from '@/types/license';
import { transformLicenses } from '@/lib/transform/licenseTransform';

const mockLicenses: License[] = [
  {
    id: '1',
    name: 'Figma',
    tier: 'Professional',
    icon: 'fab fa-figma',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    tierColor: 'bg-purple-100 text-purple-800',
    status: 'active' as const,
    assignedAt: 'Mar 15, 2024',
    expiresAt: 'Mar 15, 2025',
    lastUsed: '2 hours ago',
    usageFrequency: 'High',
    usagePercent: 85,
    usageColor: 'bg-green-500',
    cost: 4800,
  },
  {
    id: '2',
    name: 'Slack',
    tier: 'Pro',
    icon: 'fab fa-slack',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    tierColor: 'bg-blue-100 text-blue-800',
    status: 'expiring' as const,
    assignedAt: 'Jan 10, 2024',
    expiresAt: 'Jan 10, 2025 (18 days)',
    lastUsed: '1 day ago',
    usageFrequency: 'Medium',
    usagePercent: 60,
    usageColor: 'bg-blue-500',
    cost: 3200,
  },
  {
    id: '3',
    name: 'GitHub',
    tier: 'Team',
    icon: 'fab fa-github',
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    tierColor: 'bg-indigo-100 text-indigo-800',
    status: 'active' as const,
    assignedAt: 'Feb 20, 2024',
    expiresAt: 'Feb 20, 2025',
    lastUsed: '3 hours ago',
    usageFrequency: 'High',
    usagePercent: 90,
    usageColor: 'bg-green-500',
    cost: 8400,
  },
  {
    id: '4',
    name: 'Adobe Creative Cloud',
    tier: 'All Apps',
    icon: 'fab fa-adobe',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    tierColor: 'bg-red-100 text-red-800',
    status: 'expired' as const,
    assignedAt: 'Nov 5, 2023',
    expiresAt: 'Nov 5, 2024 (45 days ago)',
    lastUsed: '50 days ago',
    usageFrequency: 'Low',
    usagePercent: 25,
    usageColor: 'bg-gray-400',
    cost: 12000,
  },
  {
    id: '5',
    name: 'Tableau',
    tier: 'Creator',
    icon: 'fas fa-table',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    tierColor: 'bg-green-100 text-green-800',
    status: 'active' as const,
    assignedAt: 'Apr 8, 2024',
    expiresAt: 'Apr 8, 2025',
    lastUsed: '5 days ago',
    usageFrequency: 'Medium',
    usagePercent: 45,
    usageColor: 'bg-yellow-500',
    cost: 19800,
  },
];

export default function MyLicensesPage() {
  const { token } = useAuthStore();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLicenses() {
      try {
        if (token) {
          const response = await apiClient.getUserLicenses(token) as { data: { licenses: any[] } };
          const transformedLicenses = transformLicenses(response.data.licenses);
          setLicenses(transformedLicenses);
        }
      } catch (error) {
        console.error('Failed to fetch licenses:', error);
        // Fallback to mock data
        setLicenses(mockLicenses);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLicenses();
  }, [token]);

  const activeCount = licenses.filter((l) => l.status === 'active' || l.status === 'expiring').length;
  const totalCost = licenses.filter((l) => l.status !== 'expired').reduce((sum, l) => sum + l.cost, 0);
  const expiringCount = licenses.filter((l) => l.status === 'expiring').length;
  const mostUsedApp = licenses.sort((a, b) => b.usagePercent - a.usagePercent)[0];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading licenses...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Licenses</h1>
              <p className="text-gray-600 mt-2">Manage and track all your active and expired software licenses</p>
            </div>
            <div className="flex items-center space-x-3">
              <select className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>All Categories</option>
                <option>Development Tools</option>
                <option>Design Software</option>
                <option>Analytics</option>
                <option>Communication</option>
              </select>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <i className="fas fa-download mr-2"></i>
                Export List
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Active Licenses</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{activeCount}</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-check-circle text-green-500 text-sm mr-1"></i>
                  <span className="text-sm text-green-600">All current</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Annual Cost</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">฿{totalCost.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-chart-line text-blue-500 text-sm mr-1"></i>
                  <span className="text-sm text-blue-600">Per year</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-dollar-sign text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Most Used App</p>
                <div className="flex items-center mt-2">
                  <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fab fa-figma text-purple-600"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Figma</p>
                    <p className="text-sm text-gray-500">Daily usage</p>
                  </div>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-star text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring in 30 Days</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{expiringCount}</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-exclamation-triangle text-amber-500 text-sm mr-1"></i>
                  <span className="text-sm text-amber-600">Needs attention</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-amber-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <button className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium">
                All
              </button>
              <button className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                Active
              </button>
              <button className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                Expiring Soon
              </button>
              <button className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                Expired
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search licenses..."
                  className="pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-2">
                <i className="fas fa-filter"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Licenses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {licenses.map((license) => (
            <div
              key={license.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`h-12 w-12 ${license.bgColor} rounded-lg flex items-center justify-center`}>
                    <i className={`${license.icon} ${license.iconColor} text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{license.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${license.tierColor}`}>
                      {license.tier}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    license.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : license.status === 'expiring'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      license.status === 'active'
                        ? 'bg-green-500'
                        : license.status === 'expiring'
                        ? 'bg-amber-500'
                        : 'bg-gray-500'
                    }`}></div>
                    {license.status === 'active' ? 'Active' : license.status === 'expiring' ? 'Expiring' : 'Expired'}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Assigned:</span>
                  <span className="text-gray-900">{license.assignedAt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Expires:</span>
                  <span className={`${
                    license.status === 'expiring' ? 'text-amber-600 font-medium' :
                    license.status === 'expired' ? 'text-red-600 font-medium' :
                    'text-gray-900'
                  }`}>
                    {license.expiresAt}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Used:</span>
                  <span className="text-gray-900">{license.lastUsed}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Usage Frequency</span>
                  <span className={`font-medium ${
                    license.usagePercent > 70 ? 'text-green-600' :
                    license.usagePercent > 40 ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {license.usageFrequency}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${license.usageColor}`}
                    style={{ width: `${license.usagePercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-lg font-bold ${
                  license.status === 'expired' ? 'text-gray-500' : 'text-gray-900'
                }`}>
                  ฿{license.cost.toLocaleString()}/year
                </span>
                <div className="flex space-x-2">
                  {license.status === 'expiring' || license.status === 'expired' ? (
                    <button className="text-amber-600 hover:text-amber-700 text-sm">
                      Request Renewal
                    </button>
                  ) : (
                    <button className="text-primary-600 hover:text-primary-700 text-sm">
                      View Usage
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State Card */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border-2 border-dashed border-primary-200 p-8 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-plus text-primary-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Your First License</h3>
            <p className="text-gray-600 mb-4">Need additional software? Request a new license to get started</p>
            <Link href="/requests/new-hire">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                Request New License
              </button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

