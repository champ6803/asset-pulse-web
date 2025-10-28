"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';


export default function ConsolidationDetailsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/dashboard/group-cto" className="text-gray-400 hover:text-gray-500">
                  <i className="fas fa-home"></i>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fas fa-chevron-right text-gray-300 mr-4"></i>
                  <Link href="/consolidation" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                    Consolidation
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fas fa-chevron-right text-gray-300 mr-4"></i>
                  <span className="text-sm font-medium text-gray-900">Design Tools Group</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Design Tools Consolidation</h1>
              <p className="text-gray-600 mt-2">
                Consolidate 3 design applications across 8 subsidiaries with potential savings of ฿3.2M annually
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                <i className="fas fa-palette mr-2"></i>
                92% Similarity Score
              </span>
            </div>
          </div>
        </div>

        {/* Current State Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Current State</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subsidiary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tool
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost/Year
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { subsidiary: 'SCBX Bank', tool: 'Adobe Creative Cloud', users: 145, cost: 3200000 },
                  { subsidiary: 'SCB Tech', tool: 'Adobe Creative Cloud', users: 89, cost: 2100000 },
                  { subsidiary: 'SCB Securities', tool: 'Adobe Creative Cloud', users: 67, cost: 1500000 },
                  { subsidiary: 'SCB Asset', tool: 'Adobe Creative Cloud', users: 42, cost: 980000 },
                  { subsidiary: 'SCB Insurance', tool: 'Adobe Creative Cloud', users: 28, cost: 420000 },
                  { subsidiary: 'Digital Ventures', tool: 'Figma Enterprise', users: 85, cost: 1200000 },
                  { subsidiary: 'SCB Abacus', tool: 'Figma Enterprise', users: 43, cost: 600000 },
                  { subsidiary: 'SCB Julius Baer', tool: 'Sketch Business', users: 35, cost: 600000 },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.subsidiary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.tool}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.users}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ฿{(row.cost / 1000).toFixed(0)}K
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">3 Tools</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">534 Users</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">฿10.6M</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Proposed Solution & Financial Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Proposed Solution</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <i className="fab fa-adobe text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Adobe Creative Cloud Enterprise</h3>
                  <p className="text-sm text-gray-600">Recommended unified platform for all design needs</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Why this platform?</h4>
                <div className="space-y-2">
                  {[
                    'Comprehensive feature coverage across all design disciplines',
                    'Already used by 5 subsidiaries with established workflows',
                    'Volume discount available for enterprise licensing',
                    '24/7 enterprise support and training resources',
                    'Pre-approved vendor with existing security compliance',
                  ].map((point, idx) => (
                    <div key={idx} className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-3"></i>
                      <span className="text-sm text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Group Pricing Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="text-sm font-medium text-gray-900">534 users</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base Cost per User</span>
                  <span className="text-sm font-medium text-gray-900">฿18,000/year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">฿9.6M</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span className="text-sm">Group Discount (25%)</span>
                  <span className="text-sm font-medium">-฿2.4M</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">Final Annual Cost</span>
                    <span className="text-base font-bold text-blue-600">฿7.4M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Impact</h3>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg mb-6">
              <p className="text-gray-400">Chart placeholder</p>
            </div>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">฿3.2M</div>
                <div className="text-sm text-green-700">Annual Savings</div>
                <div className="text-lg font-semibold text-green-600 mt-1">30% Reduction</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">ROI Calculation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Migration Cost</span>
                    <span className="font-medium">฿800K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Savings</span>
                    <span className="font-medium text-green-600">฿3.2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payback Period</span>
                    <span className="font-medium">3 months</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">3-Year Savings</span>
                      <span className="font-bold text-green-600">฿8.8M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Plan */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Implementation Plan</h2>
          <div className="space-y-4">
            {[
              { phase: 1, title: 'Approval & Contracting', duration: 'Weeks 1-2', color: 'bg-blue-100', textColor: 'text-blue-600' },
              { phase: 2, title: 'Migration', duration: 'Weeks 3-5', color: 'bg-orange-100', textColor: 'text-orange-600' },
              { phase: 3, title: 'Go-Live', duration: 'Weeks 6-8', color: 'bg-green-100', textColor: 'text-green-600' },
            ].map((item) => (
              <div key={item.phase} className="border border-gray-200 rounded-lg">
                <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className={`h-8 w-8 ${item.color} rounded-full flex items-center justify-center mr-4`}>
                      <span className={`text-sm font-semibold ${item.textColor}`}>{item.phase}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.duration}</p>
                    </div>
                  </div>
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Risks & Mitigation */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <i className="fas fa-exclamation-triangle text-amber-500 mr-3"></i>
            <h2 className="text-xl font-semibold text-gray-900">Risks & Mitigation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">User Resistance</h4>
              <p className="text-sm text-red-700 mb-3">Teams may resist switching from familiar tools</p>
              <p className="text-sm text-gray-600">
                <strong>Mitigation:</strong> Comprehensive training program and change management support
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Data Migration</h4>
              <p className="text-sm text-yellow-700 mb-3">Potential data loss during migration process</p>
              <p className="text-sm text-gray-600">
                <strong>Mitigation:</strong> Phased migration with backup systems and validation checkpoints
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Link href="/similar-software">
            <button className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <i className="fas fa-arrow-left mr-2"></i>
              Back
            </button>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/memos/generate">
              <button className="flex items-center px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                <i className="fas fa-file-alt mr-2"></i>
                Generate Business Case Memo
              </button>
            </Link>
            <button className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <i className="fas fa-check mr-2"></i>
              Approve Plan
            </button>
            <button className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <i className="fas fa-times mr-2"></i>
              Reject
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

