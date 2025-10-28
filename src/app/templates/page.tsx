"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

const mockTemplates = [
  {
    id: '1',
    name: 'Developer Pack',
    department: 'Engineering',
    scope: 'New Hire',
    apps: 8,
    costPerUser: 150000,
    budgetLimit: 200000,
    status: 'active' as const,
    createdAt: 'Oct 15, 2024',
    lastUsed: '2 days ago',
    timesUsed: 23,
    icon: 'fas fa-code',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: '2',
    name: 'Designer Pack',
    department: 'Design',
    scope: 'Role-Based',
    apps: 5,
    costPerUser: 106800,
    budgetLimit: 120000,
    status: 'active' as const,
    createdAt: 'Oct 10, 2024',
    lastUsed: '1 week ago',
    timesUsed: 15,
    icon: 'fas fa-palette',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: '3',
    name: 'Marketing Pack',
    department: 'Marketing',
    scope: 'Department Standard',
    apps: 6,
    costPerUser: 81000,
    budgetLimit: 90000,
    status: 'draft' as const,
    createdAt: 'Oct 18, 2024',
    lastUsed: 'Never',
    timesUsed: 0,
    icon: 'fas fa-bullhorn',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: '4',
    name: 'Analytics Pack',
    department: 'Data',
    scope: 'Role-Based',
    apps: 4,
    costPerUser: 180000,
    budgetLimit: 200000,
    status: 'active' as const,
    createdAt: 'Oct 5, 2024',
    lastUsed: '3 days ago',
    timesUsed: 8,
    icon: 'fas fa-chart-bar',
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    id: '5',
    name: 'Sales Pack',
    department: 'Sales',
    scope: 'New Hire',
    apps: 7,
    costPerUser: 95000,
    budgetLimit: 110000,
    status: 'active' as const,
    createdAt: 'Sep 28, 2024',
    lastUsed: '1 day ago',
    timesUsed: 12,
    icon: 'fas fa-handshake',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    id: '6',
    name: 'HR Pack',
    department: 'Human Resources',
    scope: 'Department Standard',
    apps: 3,
    costPerUser: 45000,
    budgetLimit: 50000,
    status: 'draft' as const,
    createdAt: 'Oct 20, 2024',
    lastUsed: 'Never',
    timesUsed: 0,
    icon: 'fas fa-users',
    bgColor: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
];

export default function TemplatesPage() {
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'draft'>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [scopeFilter, setScopeFilter] = useState('all');

  const filteredTemplates = mockTemplates.filter((template) => {
    if (filterTab !== 'all' && template.status !== filterTab) return false;
    if (departmentFilter !== 'all' && template.department !== departmentFilter) return false;
    if (scopeFilter !== 'all' && template.scope !== scopeFilter) return false;
    return true;
  });

  const allCount = mockTemplates.length;
  const activeCount = mockTemplates.filter(t => t.status === 'active').length;
  const draftCount = mockTemplates.filter(t => t.status === 'draft').length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purchase Templates</h1>
              <p className="text-gray-600 mt-2">
                Create and manage reusable software packages for different roles
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <i className="fas fa-download mr-2"></i>
                Export
              </button>
              <Link href="/templates/create">
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                  <i className="fas fa-plus mr-2"></i>
                  Create New Template
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filterTab === 'all'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                All ({allCount})
              </button>
              <button
                onClick={() => setFilterTab('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filterTab === 'active'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setFilterTab('draft')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filterTab === 'draft'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Draft ({draftCount})
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
              <select
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Scopes</option>
                <option value="New Hire">New Hire</option>
                <option value="Role-Based">Role-Based</option>
                <option value="Department Standard">Department Standard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 ${template.bgColor} rounded-lg flex items-center justify-center`}>
                  <i className={`${template.icon} ${template.iconColor} text-xl`}></i>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  template.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {template.status === 'active' ? 'Active' : 'Draft'}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span>{template.department}</span>
                <span>•</span>
                <span>{template.scope}</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Applications:</span>
                  <span className="font-medium">{template.apps} apps</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cost per user/year:</span>
                  <span className="font-medium">฿{template.costPerUser.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Budget limit:</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">฿{template.budgetLimit.toLocaleString()}</span>
                    {template.costPerUser <= template.budgetLimit && (
                      <i className="fas fa-check-circle text-green-500"></i>
                    )}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Created: {template.createdAt}</span>
                  <span>Last used: {template.lastUsed}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>Times used: {template.timesUsed}</span>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/templates/${template.id}`} className="flex-1">
                    <button className="w-full bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                      View
                    </button>
                  </Link>
                  <Link href={`/templates/${template.id}/edit`} className="flex-1">
                    <button className="w-full bg-primary-100 text-primary-700 py-2 px-3 rounded-lg text-sm hover:bg-primary-200 transition-colors">
                      Edit
                    </button>
                  </Link>
                  <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    <i className="fas fa-copy"></i>
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredTemplates.length}</span> of{' '}
            <span className="font-medium">{allCount}</span> templates
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

