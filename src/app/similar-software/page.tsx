"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

const navigation = [
  { label: 'Dashboard', href: '/dashboard/group-cto' },
  { label: 'Consolidation', href: '/consolidation' },
  { label: 'Similar Software', href: '/similar-software' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Memos', href: '/memos' },
];

export default function SimilarSoftwarePage() {
  return (
    <DashboardLayout navigation={navigation}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Similar Software Detection</h1>
              <p className="text-gray-600 mt-2">
                AI-powered cross-subsidiary software matching to identify consolidation opportunities
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Scope:</span>
                <select className="bg-transparent border-none text-sm focus:outline-none">
                  <option>Group - All 25 subsidiaries</option>
                  <option>Subsidiary Level</option>
                </select>
              </div>
              <select className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>All Categories</option>
                <option>Development Tools</option>
                <option>Design Software</option>
                <option>Analytics</option>
                <option>Communication</option>
                <option>Project Management</option>
              </select>
              <div className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Similarity:</span>
                <input
                  type="range"
                  min="50"
                  max="100"
                  defaultValue="80"
                  className="w-20 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium text-primary-600">&gt;80%</span>
              </div>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <i className="fas fa-download mr-2"></i>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Summary Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600 mt-1">Similar Software Groups</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">47</div>
              <div className="text-sm text-gray-600 mt-1">Applications Identified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">฿18.7M</div>
              <div className="text-sm text-gray-600 mt-1">Total Potential Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">23</div>
              <div className="text-sm text-gray-600 mt-1">Subsidiaries Affected</div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Savings (High to Low)</option>
              <option>Similarity Score</option>
              <option>Number of Apps</option>
              <option>Subsidiaries Count</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">Showing 12 groups • Updated 5 minutes ago</div>
        </div>

        {/* Similar Groups */}
        <div className="space-y-6">
          {/* Group 1: Design Tools */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-palette text-orange-600 text-lg"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Group #1: Design & Creative Tools</h3>
                  <p className="text-sm text-gray-500">4 applications across 8 subsidiaries</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <span className="text-sm font-semibold text-orange-600">92% Similar</span>
                </div>
                <div className="text-2xl font-bold text-green-600">฿4.2M</div>
                <div className="text-xs text-gray-500">potential savings</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href="/consolidation/1">
                  <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                    <i className="fas fa-eye mr-2"></i>
                    View Consolidation Plan
                  </button>
                </Link>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Dismiss
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                  <i className="fas fa-download mr-2"></i>
                  Export
                </button>
              </div>
              <div className="text-sm text-gray-500">Last updated: 2 hours ago</div>
            </div>
          </div>

          {/* Add more groups here... */}
        </div>
      </div>
    </DashboardLayout>
  );
}

