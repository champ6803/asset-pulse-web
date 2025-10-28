"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';


const mockApprovals = [
  {
    id: 'REQ-2024-1847',
    type: 'New License',
    urgent: true,
    budgetConcern: true,
    requester: 'Sarah Chen',
    role: 'Engineering Lead',
    company: 'SCBX Bank',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
    submittedAt: '2 days ago',
    sla: '6 hours remaining',
    totalValue: 245000,
    budgetPercent: 85,
    summary: 'GitHub Enterprise (50 seats), Jira Software (25 seats), Confluence (25 seats)',
    approvalProgress: 66,
    currentStep: '2 of 3',
  },
  {
    id: 'REQ-2024-1846',
    type: 'Upgrade',
    urgent: false,
    budgetConcern: false,
    requester: 'Lisa Wang',
    role: 'Marketing Director',
    company: 'SCB Securities',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
    submittedAt: '1 day ago',
    sla: '2 days remaining',
    totalValue: 89500,
    budgetPercent: 45,
    summary: 'Adobe Creative Cloud upgrade to Enterprise (15 seats)',
    approvalProgress: 50,
    currentStep: '1 of 2',
  },
  {
    id: 'REQ-2024-1845',
    type: 'Renewal',
    urgent: false,
    budgetConcern: true,
    requester: 'Michael Rodriguez',
    role: 'IT Manager',
    company: 'SCB Asset Management',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
    submittedAt: '3 days ago',
    sla: '1 day remaining',
    totalValue: 156000,
    budgetPercent: 72,
    summary: 'Tableau Server renewal (100 users), Power BI Premium renewal',
    approvalProgress: 33,
    currentStep: '1 of 3',
  },
];

export default function ApprovalsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Approval Queue</h1>
              <p className="text-gray-600 mt-2">
                Review and approve pending software requests across all subsidiaries
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <i className="fas fa-download mr-2"></i>
                Export Queue
              </button>
            </div>
          </div>
        </div>

        {/* Approval Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pending</p>
                <p className="text-4xl font-bold text-orange-600 mt-2">47</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-clock text-orange-500 text-sm mr-1"></i>
                  <span className="text-sm text-orange-600">Awaiting approval</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-hourglass-half text-orange-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">฿8.2M</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-money-bill-wave text-purple-500 text-sm mr-1"></i>
                  <span className="text-sm text-purple-600">Annual cost</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-dollar-sign text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Approval Time</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">2.3</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-stopwatch text-blue-500 text-sm mr-1"></i>
                  <span className="text-sm text-blue-600">days</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-tachometer-alt text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SLA Breaches</p>
                <p className="text-4xl font-bold text-red-600 mt-2">3</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-exclamation-triangle text-red-500 text-sm mr-1"></i>
                  <span className="text-sm text-red-600">Overdue requests</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-warning text-red-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button className="px-4 py-2 text-sm font-medium bg-white text-primary-600 rounded-md shadow-sm">
                All
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                Pending My Approval
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                Approved by Me
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                Rejected
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">0 selected</span>
              <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-200 transition-colors disabled:opacity-50" disabled>
                Bulk Approve
              </button>
              <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm hover:bg-red-200 transition-colors disabled:opacity-50" disabled>
                Bulk Reject
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search requests..."
                className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>
            <select className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>HR</option>
            </select>
            <select className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>All Request Types</option>
              <option>New License</option>
              <option>Upgrade</option>
              <option>Renewal</option>
              <option>Transfer</option>
            </select>
            <input
              type="date"
              className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="date"
              className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select className="border border-gray-300 text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>All Values</option>
              <option>&lt; 50k THB</option>
              <option>50k - 100k THB</option>
              <option>&gt; 100k THB</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
            <button className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors">
              <i className="fas fa-dollar-sign mr-1"></i>
              High Value (&gt;100k)
            </button>
            <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors">
              <i className="fas fa-clock mr-1"></i>
              Urgent (&lt;2 days)
            </button>
            <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200 transition-colors">
              <i className="fas fa-exclamation-triangle mr-1"></i>
              Budget Concerns
            </button>
          </div>
        </div>

        {/* Approval Queue List */}
        <div className="space-y-4">
          {mockApprovals.map((approval) => (
            <div
              key={approval.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-200 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm text-gray-500">{approval.id}</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-copy"></i>
                      </button>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {approval.type}
                      </span>
                      {approval.urgent && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <i className="fas fa-clock mr-1"></i>
                          Urgent
                        </span>
                      )}
                      {approval.budgetConcern && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <i className="fas fa-exclamation-triangle mr-1"></i>
                          Budget Review
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ฿{approval.totalValue.toLocaleString()}
                      </p>
                      <p className={`text-sm ${
                        approval.budgetPercent > 80 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {approval.budgetPercent > 80 ? (
                          <>
                            <i className="fas fa-exclamation-triangle mr-1"></i>
                            {approval.budgetPercent}% of budget
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check-circle mr-1"></i>
                            Within budget
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={approval.avatar}
                        alt={approval.requester}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{approval.requester}</p>
                        <p className="text-sm text-gray-500">
                          {approval.role} • {approval.company}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Submitted {approval.submittedAt}</p>
                      <p className={`text-xs ${
                        approval.sla.includes('hours') ? 'text-red-600' : 'text-green-600'
                      }`}>
                        SLA: {approval.sla}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Items Summary:</p>
                    <p className="text-sm text-gray-600">{approval.summary}</p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Approval Progress</p>
                      <span className="text-sm text-blue-600">Step {approval.currentStep}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${approval.approvalProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Link href={`/approvals/${approval.id}`}>
                        <button className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg text-sm hover:bg-primary-200 transition-colors">
                          View Details
                        </button>
                      </Link>
                      <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-200 transition-colors">
                        Quick Approve
                      </button>
                      <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm hover:bg-red-200 transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

