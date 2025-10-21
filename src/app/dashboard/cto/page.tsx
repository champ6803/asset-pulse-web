"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

const navigation = [
  { label: 'Dashboard', href: '/dashboard/cto' },
  { label: 'Analytics', href: '/dashboard/cto/analytics' },
  { label: 'Team', href: '/dashboard/cto/team' },
  { label: 'Approvals', href: '/approvals' },
];

const mockOptimizations = [
  {
    id: '1',
    appName: 'Tableau Desktop',
    department: 'Marketing Department',
    inactiveUsers: 15,
    pendingRequests: 8,
    canReallocate: 7,
    potentialSavings: 420000,
    icon: 'fas fa-chart-bar',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: '2',
    appName: 'Adobe Creative Cloud',
    department: 'Design Department',
    inactiveUsers: 12,
    pendingRequests: 5,
    canReallocate: 5,
    potentialSavings: 360000,
    icon: 'fas fa-camera',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    id: '3',
    appName: 'JetBrains Suite',
    department: 'Engineering Department',
    inactiveUsers: 18,
    pendingRequests: 12,
    canReallocate: 12,
    potentialSavings: 280000,
    icon: 'fas fa-code',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
];

const mockHighValueApprovals = [
  {
    id: '1',
    name: 'Salesforce Enterprise',
    department: 'Sales Department',
    description: '50 licenses',
    cost: '฿840K/year',
  },
  {
    id: '2',
    name: 'Microsoft Azure',
    department: 'IT Department',
    description: 'Cloud Services',
    cost: '฿620K/year',
  },
  {
    id: '3',
    name: 'Slack Enterprise',
    department: 'All Departments',
    description: '200 users',
    cost: '฿480K/year',
  },
];

export default function CTODashboard() {
  return (
    <DashboardLayout navigation={navigation}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CTO Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Optimize software licenses and monitor usage across your organization
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>All Companies</option>
                <option>SCBX Bank</option>
                <option>SCB Tech</option>
                <option>SCB Securities</option>
              </select>
              <select className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 6 months</option>
              </select>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <i className="fas fa-download mr-2"></i>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Optimization Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Potential Monthly Savings</p>
                <p className="text-4xl font-bold text-green-600 mt-2">฿2.4M</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-trending-up text-green-500 text-sm mr-1"></i>
                  <span className="text-sm text-green-600">+15% this quarter</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-piggy-bank text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Licenses</p>
                <p className="text-4xl font-bold text-amber-600 mt-2">347</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-exclamation-triangle text-amber-500 text-sm mr-1"></i>
                  <span className="text-sm text-amber-600">Needs attention</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-exclamation-circle text-amber-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Optimization Opportunities</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">28</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-arrow-up text-blue-500 text-sm mr-1"></i>
                  <span className="text-sm text-blue-600">+5 new this week</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-lightbulb text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Optimization */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Top Seat Optimization Opportunities
                </h2>
                <div className="flex space-x-2">
                  <Link href="/seat-optimization">
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors">
                      Bulk Actions
                    </button>
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                {mockOptimizations.map((opt) => (
                  <div
                    key={opt.id}
                    className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`h-10 w-10 ${opt.bgColor} rounded-lg flex items-center justify-center`}>
                          <i className={`${opt.icon} ${opt.iconColor}`}></i>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{opt.appName}</h4>
                          <p className="text-sm text-gray-500">{opt.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          ฿{(opt.potentialSavings / 1000).toFixed(0)}K/year
                        </p>
                        <p className="text-xs text-gray-500">Potential savings</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{opt.inactiveUsers}</p>
                        <p className="text-xs text-gray-500">Inactive users</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{opt.pendingRequests}</p>
                        <p className="text-xs text-gray-500">Pending requests</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{opt.canReallocate}</p>
                        <p className="text-xs text-gray-500">Can reallocate</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/seat-optimization/${opt.id}`} className="flex-1">
                        <button className="w-full bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                          View Details
                        </button>
                      </Link>
                      <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm hover:bg-green-200 transition-colors">
                        Quick Reallocate
                      </button>
                    </div>
                  </div>
                ))}
                <Link href="/seat-optimization">
                  <button className="w-full mt-4 text-center text-primary-600 hover:text-primary-700 text-sm font-medium py-2 hover:bg-primary-50 rounded-lg transition-colors">
                    View All Optimization Opportunities
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* High-Value Approvals */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">High-Value Approvals</h3>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                  3 pending
                </span>
              </div>
              <div className="space-y-4">
                {mockHighValueApprovals.map((approval) => (
                  <div key={approval.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{approval.name}</h4>
                      <span className="text-sm font-bold text-red-600">{approval.cost}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {approval.department} • {approval.description}
                    </p>
                    <div className="flex space-x-2">
                      <button className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors">
                        Reject
                      </button>
                      <button className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200 transition-colors">
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Usage Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* License Utilization Chart */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  License Utilization Over Time
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400">Chart placeholder (use Chart.js or Recharts)</p>
                </div>
              </div>

              {/* Cost Breakdown Chart */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Cost by Department</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400">Pie chart placeholder</p>
                </div>
              </div>
            </div>

            {/* Top Apps Chart */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Applications by Usage</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">Bar chart placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

