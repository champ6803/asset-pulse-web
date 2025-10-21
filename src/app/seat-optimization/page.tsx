"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

const navigation = [
  { label: 'Dashboard', href: '/dashboard/cto' },
  { label: 'Team', href: '/dashboard/cto/team' },
  { label: 'Templates', href: '/templates' },
  { label: 'Approvals', href: '/approvals' },
  { label: 'Optimization', href: '/seat-optimization' },
];

export default function SeatOptimizationPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'revoke' | 'reallocate' | 'downgrade'>('all');

  return (
    <DashboardLayout navigation={navigation}>
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
                <p className="text-3xl font-bold text-red-600 mt-2">24</p>
                <p className="text-sm text-red-600 mt-1">฿85,200/month savings</p>
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
                <p className="text-3xl font-bold text-blue-600 mt-2">18</p>
                <p className="text-sm text-blue-600 mt-1">฿127,400 cost avoided</p>
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
                <p className="text-3xl font-bold text-amber-600 mt-2">12</p>
                <p className="text-sm text-amber-600 mt-1">฿42,800/month savings</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-arrow-down text-amber-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Optimization Content */}
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
                  All <span className="ml-1 bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">54</span>
                </button>
                <button
                  onClick={() => setActiveTab('revoke')}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === 'revoke'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Revoke <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">24</span>
                </button>
                <button
                  onClick={() => setActiveTab('reallocate')}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === 'reallocate'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Reallocate <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">18</span>
                </button>
                <button
                  onClick={() => setActiveTab('downgrade')}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === 'downgrade'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Downgrade <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">12</span>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>All Companies</option>
                  <option>SCBX</option>
                  <option>SCB Tech</option>
                </select>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>Marketing</option>
                </select>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>All Apps</option>
                  <option>Adobe Creative</option>
                  <option>Microsoft 365</option>
                </select>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Sort by Priority</option>
                  <option>Sort by Savings</option>
                  <option>Sort by Date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">Select All (54 items)</span>
              </div>
              <div className="text-sm text-gray-500">
                Total potential savings:{' '}
                <span className="font-semibold text-green-600">฿255,400/month</span>
              </div>
            </div>
          </div>

          {/* Optimization Cards */}
          <div className="p-6 space-y-4">
            {/* Reallocation Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-exchange-alt text-blue-600"></i>
                      </div>
                      <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        Reallocation
                      </span>
                      <div className="flex items-center">
                        <i className="fas fa-star text-amber-400 text-xs"></i>
                        <i className="fas fa-star text-amber-400 text-xs"></i>
                        <i className="fas fa-star text-amber-400 text-xs"></i>
                        <span className="text-xs text-gray-600 ml-1">High Priority</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <i className="fas fa-chart-bar text-purple-600"></i>
                          <h4 className="font-semibold text-gray-900">Tableau Pro</h4>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>From: Marketing</span>
                            <span className="text-red-600 font-medium">7 inactive</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>To: Analytics</span>
                            <span className="text-blue-600 font-medium">2 pending requests</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <i className="fas fa-robot text-primary-600 mt-1"></i>
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm mb-1">AI Rationale</h5>
                            <p className="text-xs text-gray-600">
                              Marketing team shows 0% usage for 90 days while Analytics has 2 pending
                              license requests for data visualization projects.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 text-sm mb-2">Impact Metrics</h5>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cost Avoided:</span>
                            <span className="font-medium text-green-600">฿29,400/month</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Requests Fulfilled:</span>
                            <span className="font-medium text-blue-600">2 users</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Efficiency Gain:</span>
                            <span className="font-medium text-purple-600">85%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Link href="/seat-optimization/1">
                    <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                      View Details
                    </button>
                  </Link>
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

            {/* Revoke Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-times-circle text-red-600"></i>
                      </div>
                      <span className="text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                        Revoke
                      </span>
                      <div className="flex items-center">
                        <i className="fas fa-star text-amber-400 text-xs"></i>
                        <i className="fas fa-star text-amber-400 text-xs"></i>
                        <i className="far fa-star text-gray-300 text-xs"></i>
                        <span className="text-xs text-gray-600 ml-1">Medium Priority</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <i className="fab fa-adobe text-red-600"></i>
                          <h4 className="font-semibold text-gray-900">Adobe Creative Cloud</h4>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Department: Finance</span>
                            <span className="text-red-600 font-medium">12 inactive</span>
                          </div>
                          <div className="text-xs text-gray-500">Last used: 180+ days ago</div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <i className="fas fa-robot text-primary-600 mt-1"></i>
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm mb-1">AI Rationale</h5>
                            <p className="text-xs text-gray-600">
                              Finance team licenses show zero usage for 6 months. No creative design
                              tasks identified in department workflow analysis.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 text-sm mb-2">Impact Metrics</h5>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Savings:</span>
                            <span className="font-medium text-green-600">฿28,800</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Annual Savings:</span>
                            <span className="font-medium text-green-600">฿345,600</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Risk Level:</span>
                            <span className="font-medium text-green-600">Low</span>
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

            {/* Downgrade Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-arrow-down text-amber-600"></i>
                      </div>
                      <span className="text-sm font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                        Downgrade
                      </span>
                      <div className="flex items-center">
                        <i className="fas fa-star text-amber-400 text-xs"></i>
                        <i className="far fa-star text-gray-300 text-xs"></i>
                        <i className="far fa-star text-gray-300 text-xs"></i>
                        <span className="text-xs text-gray-600 ml-1">Low Priority</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <i className="fab fa-microsoft text-blue-600"></i>
                          <h4 className="font-semibold text-gray-900">Microsoft 365 E5</h4>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Department: HR</span>
                            <span className="text-amber-600 font-medium">8 users</span>
                          </div>
                          <div className="text-xs text-gray-500">Suggested: Downgrade to E3</div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <i className="fas fa-robot text-primary-600 mt-1"></i>
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm mb-1">AI Rationale</h5>
                            <p className="text-xs text-gray-600">
                              HR team uses only 35% of E5 features. Advanced compliance and analytics
                              features unused for 90+ days.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 text-sm mb-2">Impact Metrics</h5>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Savings:</span>
                            <span className="font-medium text-green-600">฿12,800</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Feature Usage:</span>
                            <span className="font-medium text-amber-600">35%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Risk Level:</span>
                            <span className="font-medium text-green-600">Very Low</span>
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
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                <span className="font-medium">54</span> results
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg">1</button>
                <button className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

