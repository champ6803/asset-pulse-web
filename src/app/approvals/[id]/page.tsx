"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';


const mockApplications = [
  {
    id: '1',
    name: 'Figma Professional',
    category: 'Design & Prototyping',
    tier: 'Professional',
    quantity: 5,
    unitCost: 720,
    totalCost: 43200,
    description: 'Required for new design team members to collaborate on product mockups and prototypes.',
    icon: 'fab fa-figma',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: '2',
    name: 'Slack Pro',
    category: 'Team Communication',
    tier: 'Pro',
    quantity: 8,
    unitCost: 240,
    totalCost: 23040,
    description: 'Enhanced communication features needed for cross-functional project coordination.',
    icon: 'fab fa-slack',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: '3',
    name: 'Mixpanel Growth',
    category: 'Product Analytics',
    tier: 'Growth',
    quantity: 1,
    unitCost: 8400,
    totalCost: 100800,
    description: 'Advanced analytics platform to track user behavior and product performance metrics.',
    icon: 'fas fa-chart-bar',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
];

export default function RequestDetailsPage() {
  const [activeTab, setActiveTab] = useState('applications');
  const [comments, setComments] = useState('');

  const totalCost = mockApplications.reduce((sum, app) => sum + app.totalCost, 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/approvals" className="hover:text-gray-700">
              Approvals
            </Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <Link href="/approvals" className="hover:text-gray-700">
              Pending Requests
            </Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span className="text-gray-900 font-medium">REQ-2024-1847</span>
          </nav>
        </div>

        {/* Request Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Request #REQ-2024-1847</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                <i className="fas fa-clock mr-1"></i>
                Pending Review
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                High Priority
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Submitted on</p>
              <p className="font-medium text-gray-900">October 18, 2024</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
                alt="Requester"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Sarah Chen</h3>
                <p className="text-sm text-gray-600">Senior Product Manager</p>
                <p className="text-sm text-gray-500">Product Development • sarah.chen@scbx.co.th</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Department</p>
                <p className="text-sm text-gray-600">Product Development</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Details Tabs */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`py-4 px-1 text-sm font-medium ${
                      activeTab === 'applications'
                        ? 'border-b-2 border-primary-500 text-primary-600'
                        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Applications
                  </button>
                  <button
                    onClick={() => setActiveTab('justification')}
                    className={`py-4 px-1 text-sm font-medium ${
                      activeTab === 'justification'
                        ? 'border-b-2 border-primary-500 text-primary-600'
                        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Justification
                  </button>
                  <button
                    onClick={() => setActiveTab('budget')}
                    className={`py-4 px-1 text-sm font-medium ${
                      activeTab === 'budget'
                        ? 'border-b-2 border-primary-500 text-primary-600'
                        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Budget Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`py-4 px-1 text-sm font-medium ${
                      activeTab === 'history'
                        ? 'border-b-2 border-primary-500 text-primary-600'
                        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    History
                  </button>
                </nav>
              </div>

              {activeTab === 'applications' && (
                <div className="p-6">
                  <div className="space-y-4">
                    {mockApplications.map((app) => (
                      <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-primary-600 rounded"
                          />
                          <div className={`h-10 w-10 ${app.bgColor} rounded-lg flex items-center justify-center`}>
                            <i className={`${app.icon} ${app.iconColor}`}></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{app.name}</h4>
                            <p className="text-sm text-gray-500">{app.category}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900">{app.tier}</p>
                            <p className="text-xs text-gray-500">Tier</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900">{app.quantity}</p>
                            <p className="text-xs text-gray-500">Quantity</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900">฿{app.unitCost}/mo</p>
                            <p className="text-xs text-gray-500">Unit Cost</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">฿{app.totalCost.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Annual Total</p>
                          </div>
                        </div>
                        <div className="mt-3 pl-14">
                          <p className="text-sm text-gray-600">{app.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Approval Comments */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Decision</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                  <textarea
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add your comments or feedback..."
                  />
                </div>
                <div className="space-y-2">
                  {[
                    'Require monthly usage tracking reports',
                    'Set license expiry date (12 months)',
                    'Require budget approval for renewals',
                  ].map((condition, idx) => (
                    <label key={idx} className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-primary-600 rounded mr-2" />
                      <span className="text-sm text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>
                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                    <i className="fas fa-check mr-2"></i>
                    Approve Request
                  </button>
                  <button className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
                    <i className="fas fa-times mr-2"></i>
                    Reject Request
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    <i className="fas fa-question-circle mr-2"></i>
                    Request More Info
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    <i className="fas fa-share mr-2"></i>
                    Forward to Another Approver
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Approval Workflow */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Workflow</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-green-600 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Department Manager</p>
                    <p className="text-sm text-gray-500">Approved • Oct 19, 2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-primary-600 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">CTO Approval</p>
                    <p className="text-sm text-primary-600">Pending (You)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-clock text-gray-400 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-400">Finance Review</p>
                    <p className="text-sm text-gray-400">Awaiting</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Summary</h3>
              <div className="space-y-3">
                {mockApplications.map((app) => (
                  <div key={app.id} className="flex justify-between">
                    <span className="text-gray-600">{app.name}</span>
                    <span className="font-medium">฿{app.totalCost.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-gray-900">Total Annual Cost</span>
                    <span className="font-bold text-gray-900">฿{totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Impact */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Impact</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Spend</span>
                  <span className="font-medium">฿2.4M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget Limit</span>
                  <span className="font-medium">฿3.2M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">After Approval</span>
                  <span className="font-medium">฿2.57M</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Budget Usage</span>
                    <span>80.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80.3%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Attached Documents */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attached Documents</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <i className="fas fa-file-pdf text-red-500"></i>
                  <span className="text-sm text-gray-700">Business Justification.pdf</span>
                </div>
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <i className="fas fa-file-excel text-green-500"></i>
                  <span className="text-sm text-gray-700">Cost Analysis.xlsx</span>
                </div>
              </div>
            </div>

            {/* Comments Thread */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm font-medium text-gray-900">Michael Wong</p>
                  <p className="text-xs text-gray-500 mb-1">Department Manager • 2 days ago</p>
                  <p className="text-sm text-gray-700">
                    Approved. These tools are essential for the new product launch timeline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

