"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';


const mockSimilarGroups = [
  {
    id: '1',
    name: 'Design & Creative Tools',
    apps: 4,
    subsidiaries: 8,
    similarityScore: 92,
    potentialSavings: 4200000,
    icon: 'fas fa-palette',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    id: '2',
    name: 'Analytics Platforms',
    apps: 3,
    subsidiaries: 12,
    similarityScore: 87,
    potentialSavings: 3800000,
    icon: 'fas fa-chart-bar',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: '3',
    name: 'Communication Tools',
    apps: 2,
    subsidiaries: 15,
    similarityScore: 95,
    potentialSavings: 2100000,
    icon: 'fas fa-comments',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
];

const mockConsolidationOpps = [
  {
    id: '1',
    name: 'Development Tools',
    subsidiaries: 8,
    users: 245,
    currentCost: 8200000,
    savings: 2900000,
    savingsPercent: 35,
  },
  {
    id: '2',
    name: 'Project Management',
    subsidiaries: 6,
    users: 156,
    currentCost: 4800000,
    savings: 1300000,
    savingsPercent: 28,
  },
  {
    id: '3',
    name: 'Cloud Storage',
    subsidiaries: 12,
    users: 892,
    currentCost: 3200000,
    savings: 700000,
    savingsPercent: 22,
  },
];

export default function GroupCTODashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Group CTO Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Optimize software portfolios and identify consolidation opportunities across all subsidiaries
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white border border-gray-300 rounded-lg p-2 flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Scope:</span>
                <label className="flex items-center">
                  <input type="radio" name="scope" value="subsidiary" className="mr-1" />
                  <span className="text-sm">Subsidiary</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="scope" value="group" defaultChecked className="mr-1" />
                  <span className="text-sm">Group</span>
                </label>
              </div>
              <select className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>All Categories</option>
                <option>Development Tools</option>
                <option>Design Software</option>
                <option>Analytics</option>
                <option>Communication</option>
              </select>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <i className="fas fa-download mr-2"></i>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subsidiaries</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">25</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-building text-blue-500 text-sm mr-1"></i>
                  <span className="text-sm text-blue-600">SCBX Group</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-sitemap text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Applications</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">87</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-arrow-up text-green-500 text-sm mr-1"></i>
                  <span className="text-sm text-green-600">+12 this quarter</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-layer-group text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Annual Cost</p>
                <p className="text-4xl font-bold text-red-600 mt-2">฿45M</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-chart-line text-red-500 text-sm mr-1"></i>
                  <span className="text-sm text-red-600">+8% vs last year</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-dollar-sign text-red-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consolidation Opportunities</p>
                <p className="text-4xl font-bold text-green-600 mt-2">18</p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-piggy-bank text-green-500 text-sm mr-1"></i>
                  <span className="text-sm text-green-600">฿12.5M potential savings</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-compress-arrows-alt text-green-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Similar Software Detection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Similar Software Detection</h2>
                <Link href="/similar-software">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All Groups
                  </button>
                </Link>
              </div>
              <div className="space-y-4">
                {mockSimilarGroups.map((group) => (
                  <Link key={group.id} href={`/similar-software/${group.id}`}>
                    <div className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 ${group.bgColor} rounded-lg flex items-center justify-center`}>
                            <i className={`${group.icon} ${group.iconColor}`}></i>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{group.name}</h4>
                            <p className="text-sm text-gray-500">
                              {group.apps} similar applications across {group.subsidiaries} subsidiaries
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                            {group.similarityScore}% Similar
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">
                          Potential Savings: ฿{(group.potentialSavings / 1000000).toFixed(1)}M/year
                        </span>
                        <button className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg text-sm hover:bg-primary-200 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Access */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
              <div className="space-y-3">
                <Link href="/memos">
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-file-alt text-blue-600"></i>
                      <span className="text-sm font-medium">Recent Memos</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">3</span>
                  </button>
                </Link>
                <Link href="/analytics">
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-chart-line text-green-600"></i>
                      <span className="text-sm font-medium">Strategic Reports</span>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">5</span>
                  </button>
                </Link>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-cog text-purple-600"></i>
                    <span className="text-sm font-medium">Settings</span>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Consolidation Opportunities */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Top Consolidation Opportunities</h3>
                <Link href="/consolidation">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View All
                  </button>
                </Link>
              </div>
              <div className="space-y-4">
                {mockConsolidationOpps.map((opp) => (
                  <div key={opp.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{opp.name}</h4>
                      <span className="text-sm font-bold text-green-600">
                        {opp.savingsPercent}% savings
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-2">
                      <span>{opp.subsidiaries} subsidiaries</span>
                      <span>{opp.users} users</span>
                      <span>฿{(opp.currentCost / 1000000).toFixed(1)}M current cost</span>
                      <span>฿{(opp.savings / 1000000).toFixed(1)}M savings</span>
                    </div>
                    <Link href={`/consolidation/${opp.id}`}>
                      <button className="w-full bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm hover:bg-green-200 transition-colors">
                        Generate Memo
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Analytics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Strategic Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Distribution by Subsidiary</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">Treemap chart placeholder</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Software Portfolio Overlap</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">Pie chart placeholder</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Trend Over Time</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">Line chart placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

