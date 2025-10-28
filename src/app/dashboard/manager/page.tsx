"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';


const mockApprovals = [
  {
    id: '1',
    name: 'Emma Wilson',
    role: 'Product Designer',
    software: 'Adobe Creative Cloud',
    type: 'Individual License • 1 year',
    cost: '฿2,400/month',
    date: 'Oct 20, 2024',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
  },
  {
    id: '2',
    name: 'James Rodriguez',
    role: 'Frontend Developer',
    software: 'JetBrains WebStorm',
    type: 'Individual License • 1 year',
    cost: '฿1,800/month',
    date: 'Oct 19, 2024',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
  },
  {
    id: '3',
    name: 'Lisa Chen',
    role: 'Data Analyst',
    software: 'Tableau Desktop',
    type: 'Professional License • 1 year',
    cost: '฿4,200/month',
    date: 'Oct 18, 2024',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg',
  },
];

const mockTemplates = [
  {
    id: '1',
    name: 'Developer Pack',
    apps: 8,
    cost: '฿12,500/user',
    timesUsed: 23,
    icon: 'fas fa-code',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: '2',
    name: 'Designer Pack',
    apps: 5,
    cost: '฿8,900/user',
    timesUsed: 15,
    icon: 'fas fa-palette',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    id: '3',
    name: 'Marketing Pack',
    apps: 6,
    cost: '฿6,750/user',
    timesUsed: 8,
    icon: 'fas fa-bullhorn',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    badgeColor: 'bg-green-100 text-green-800',
  },
];

export default function ManagerDashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your team&apos;s software licenses and approvals</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <i className="fas fa-filter mr-2"></i>
                Filter
              </button>
              <Link href="/templates/create">
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                  <i className="fas fa-plus mr-2"></i>
                  Create Template
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Licenses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">127</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-arrow-up text-green-500 text-sm mr-1"></i>
                  <span className="text-sm text-green-600">+12 this month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-certificate text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">฿485K</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-arrow-down text-green-500 text-sm mr-1"></i>
                  <span className="text-sm text-green-600">-8% vs last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-dollar-sign text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">89</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-arrow-up text-green-500 text-sm mr-1"></i>
                  <span className="text-sm text-green-600">+5 this week</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Approvals */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Pending Approvals</h2>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                  5 pending
                </span>
              </div>
              <div className="space-y-4">
                {mockApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={approval.avatar}
                          alt={approval.name}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{approval.name}</h4>
                          <p className="text-sm text-gray-500">{approval.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{approval.cost}</p>
                        <p className="text-xs text-gray-500">{approval.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{approval.software}</p>
                        <p className="text-xs text-gray-600">{approval.type}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors">
                          Reject
                        </button>
                        <button className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-200 transition-colors">
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-4 text-center text-primary-600 hover:text-primary-700 text-sm font-medium py-2 hover:bg-primary-50 rounded-lg transition-colors">
                  View All Pending Requests
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Usage Trend - Placeholder */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Usage Trend</h3>
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">Chart placeholder</p>
              </div>
            </div>

            {/* Purchase Templates */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Purchase Templates</h3>
                <Link href="/templates/create">
                  <button className="text-primary-600 hover:text-primary-700 text-sm">
                    <i className="fas fa-plus"></i>
                  </button>
                </Link>
              </div>
              <div className="space-y-4">
                {mockTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${template.badgeColor}`}>
                        {template.apps} apps
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{template.cost}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Used {template.timesUsed} times</span>
                      <Link href="/templates">
                        <button className="text-primary-600 hover:text-primary-700 font-medium">
                          Use
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

