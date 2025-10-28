"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';


const mockRequests = [
  {
    id: 'REQ-2024-001',
    type: 'New License',
    app: 'Notion Team Plan',
    status: 'in_review',
    submittedAt: 'Oct 15, 2024',
    totalCost: 12000,
    approvalStep: '2/3 approvals',
    currentApprover: 'Finance Manager',
  },
  {
    id: 'REQ-2024-002',
    type: 'Upgrade',
    app: 'Tableau Desktop',
    status: 'pending',
    submittedAt: 'Oct 18, 2024',
    totalCost: 25000,
    approvalStep: '0/2 approvals',
    currentApprover: 'Department Manager',
  },
  {
    id: 'REQ-2024-003',
    type: 'Renewal',
    app: 'Adobe Creative Cloud',
    status: 'approved',
    submittedAt: 'Oct 10, 2024',
    totalCost: 14400,
    approvalStep: '3/3 approvals',
    currentApprover: 'Completed',
    approvedAt: 'Oct 14, 2024',
  },
  {
    id: 'REQ-2024-004',
    type: 'New License',
    app: 'Miro Business',
    status: 'rejected',
    submittedAt: 'Oct 8, 2024',
    totalCost: 8500,
    approvalStep: '1/3 approvals',
    currentApprover: 'Finance Manager',
    rejectedAt: 'Oct 12, 2024',
    rejectedReason: 'Budget exceeded for Q4',
  },
];

export default function RequestsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
              <p className="text-gray-600 mt-2">Track all your software license requests and their status</p>
            </div>
            <Link href="/requests/new-hire">
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <i className="fas fa-plus mr-2"></i>
                New Request
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{mockRequests.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-file-alt text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {mockRequests.filter((r) => r.status === 'pending' || r.status === 'in_review').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-yellow-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {mockRequests.filter((r) => r.status === 'approved').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {mockRequests.filter((r) => r.status === 'rejected').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-times-circle text-red-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <button className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium">
                All
              </button>
              <button className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                Pending
              </button>
              <button className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                Approved
              </button>
              <button className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                Rejected
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>All Types</option>
                <option>New License</option>
                <option>Upgrade</option>
                <option>Renewal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {mockRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className="font-mono text-sm text-gray-500">{request.id}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.status === 'in_review' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status === 'in_review' ? 'In Review' :
                     request.status === 'pending' ? 'Pending' :
                     request.status === 'approved' ? 'Approved' :
                     'Rejected'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {request.type}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">฿{request.totalCost.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Annual Cost</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900">{request.app}</h4>
                <p className="text-sm text-gray-500 mt-1">Submitted: {request.submittedAt}</p>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Approval Progress</span>
                  <span className="text-sm text-gray-900">{request.approvalStep}</span>
                </div>
                {request.status !== 'approved' && request.status !== 'rejected' && (
                  <p className="text-sm text-gray-500">Current: {request.currentApprover}</p>
                )}
                {request.status === 'approved' && (
                  <p className="text-sm text-green-600">
                    <i className="fas fa-check-circle mr-1"></i>
                    Approved on {request.approvedAt}
                  </p>
                )}
                {request.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-red-600">
                      <i className="fas fa-times-circle mr-1"></i>
                      Rejected on {request.rejectedAt}
                    </p>
                    <p className="text-sm text-red-700 mt-1">Reason: {request.rejectedReason}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Link href={`/requests/${request.id}`}>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View Details
                  </button>
                </Link>
                {request.status === 'rejected' && (
                  <button className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg text-sm hover:bg-primary-200 transition-colors">
                    Resubmit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

