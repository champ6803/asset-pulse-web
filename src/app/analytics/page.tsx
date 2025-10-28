"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Filters</h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Sales</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">App Category</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>All Categories</option>
              <option>Development</option>
              <option>Design</option>
              <option>Analytics</option>
              <option>Communication</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Usage Threshold</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>All Usage Levels</option>
              <option>High (&gt;80%)</option>
              <option>Medium (40-80%)</option>
              <option>Low (&lt;40%)</option>
            </select>
          </div>

          <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm">
            Apply Filters
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Usage Analytics</h1>
                <p className="text-gray-600 mt-2">Monitor software usage patterns and optimize license allocation</p>
              </div>
              <div className="flex items-center space-x-3">
                <select className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Custom</option>
                </select>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                  <i className="fas fa-download mr-2"></i>
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Active Users</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">2,847</p>
                  <div className="flex items-center mt-2">
                    <i className="fas fa-arrow-up text-green-500 text-sm mr-1"></i>
                    <span className="text-sm text-green-600">+12% vs last period</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-green-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Licenses</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">3,245</p>
                  <div className="flex items-center mt-2">
                    <i className="fas fa-arrow-up text-blue-500 text-sm mr-1"></i>
                    <span className="text-sm text-blue-600">+5% vs last period</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-key text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">87.7%</p>
                  <div className="flex items-center mt-2">
                    <i className="fas fa-arrow-up text-purple-500 text-sm mr-1"></i>
                    <span className="text-sm text-purple-600">+3.2% vs last period</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-pie text-purple-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                  <p className="text-3xl font-bold text-amber-600 mt-2">฿1.2M</p>
                  <div className="flex items-center mt-2">
                    <i className="fas fa-arrow-down text-red-500 text-sm mr-1"></i>
                    <span className="text-sm text-red-600">-2.5% vs last period</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-dollar-sign text-amber-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">License Utilization Over Time</h3>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">Chart placeholder (use Recharts or Chart.js)</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown by Application</h3>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">Chart placeholder</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Usage Comparison</h3>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">Chart placeholder</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity Heatmap</h3>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-400">Heatmap placeholder</p>
              </div>
            </div>
          </div>

          {/* Usage Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Application Usage Details</h3>
                <div className="flex items-center space-x-3">
                  <button className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
                    <i className="fas fa-file-csv mr-2"></i>CSV
                  </button>
                  <button className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
                    <i className="fas fa-file-pdf mr-2"></i>PDF
                  </button>
                  <button className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
                    <i className="fas fa-file-excel mr-2"></i>Excel
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Licenses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inactive Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilization %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: 'Figma', icon: 'fab fa-figma', bg: 'bg-purple-100', color: 'text-purple-600', licenses: 245, active: 198, inactive: 47, util: 81, cost: 1176000 },
                    { name: 'Slack', icon: 'fab fa-slack', bg: 'bg-blue-100', color: 'text-blue-600', licenses: 180, active: 156, inactive: 24, util: 87, cost: 576000 },
                    { name: 'GitHub', icon: 'fab fa-github', bg: 'bg-indigo-100', color: 'text-indigo-600', licenses: 120, active: 89, inactive: 31, util: 74, cost: 1008000 },
                  ].map((app, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 ${app.bg} rounded-lg flex items-center justify-center mr-3`}>
                            <i className={`${app.icon} ${app.color}`}></i>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{app.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.licenses}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{app.active}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.inactive}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${app.util > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                              style={{ width: `${app.util}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-900">{app.util}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ฿{app.cost.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-primary-600 hover:text-primary-700 text-sm">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

