"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";

const mockLicenses = [
  {
    id: "1",
    name: "Slack Pro",
    category: "Communication",
    tier: "Pro Plan",
    status: "active" as const,
    expiresAt: "Dec 2024",
    icon: "fab fa-slack",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "2",
    name: "Figma Professional",
    category: "Design",
    tier: "Professional Plan",
    status: "active" as const,
    expiresAt: "Mar 2025",
    icon: "fab fa-figma",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: "3",
    name: "GitHub Enterprise",
    category: "Development",
    tier: "Enterprise Plan",
    status: "active" as const,
    expiresAt: "Jun 2025",
    icon: "fab fa-github",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: "4",
    name: "Adobe Creative Cloud",
    category: "Creative",
    tier: "All Apps Plan",
    status: "expiring" as const,
    expiresAt: "Nov 2024",
    icon: "fab fa-adobe",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

const mockRecommendations = [
  {
    id: "1",
    name: "Miro",
    category: "Collaboration",
    price: "฿1,200/month",
    matchScore: 95,
    description: "Perfect for your design workflow needs",
    icon: "fas fa-chart-bar",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    id: "2",
    name: "Loom",
    category: "Screen Recording",
    price: "฿800/month",
    matchScore: 88,
    description: "Great for creating tutorial videos",
    icon: "fas fa-video",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
];

const mockRequests = [
  {
    id: "REQ-2024-001",
    name: "Notion Team Plan",
    status: "in_review" as const,
    submittedAt: "Oct 15",
    approvals: "2/3 approvals",
  },
  {
    id: "REQ-2024-002",
    name: "Tableau Desktop",
    status: "pending" as const,
    submittedAt: "Oct 18",
    approvals: "0/2 approvals",
  },
];

export default function EmployeeDashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Sarah!</h1>
            <p className="text-primary-100 text-lg">
              Manage your software licenses and discover new tools to boost your
              productivity.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/requests/new-hire">
              <button className="w-full bg-white border-2 border-primary-600 text-primary-600 rounded-xl p-6 hover:bg-primary-50 transition-colors text-left group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Request Software
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Get new tools for your projects
                    </p>
                  </div>
                  <i className="fas fa-plus text-2xl transition-transform"></i>
                </div>
              </button>
            </Link>
            <Link href="/dashboard/employee/licenses">
              <button className="w-full bg-white border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-colors text-left group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-gray-900">
                      View My Licenses
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Manage your active software
                    </p>
                  </div>
                  <i className="fas fa-list text-2xl text-gray-400 transition-transform"></i>
                </div>
              </button>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Licenses Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Active Licenses
                </h2>
                <span className="text-sm text-gray-500">
                  {mockLicenses.length} active
                </span>
              </div>
              <div className="space-y-4">
                {mockLicenses.map((license) => (
                  <div
                    key={license.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 ${license.bgColor} rounded-lg flex items-center justify-center`}
                      >
                        <i
                          className={`${license.icon} ${license.iconColor} text-xl`}
                        ></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {license.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {license.category} • {license.tier}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          license.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {license.status === "active"
                          ? "Active"
                          : "Expiring Soon"}
                      </span>
                      <p
                        className={`text-sm mt-1 ${
                          license.status === "expiring"
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        Expires: {license.expiresAt}
                      </p>
                    </div>
                  </div>
                ))}
                <button className="w-full text-center text-primary-600 hover:text-gray-500 text-sm font-medium py-2 rounded-lg transition-colors">
                  View All Licenses
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Requests Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pending Requests
              </h3>
              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-100 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        #{request.id}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          request.status === "in_review"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status === "in_review"
                          ? "In Review"
                          : "Pending"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{request.name}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Submitted: {request.submittedAt}</span>
                      <span>{request.approvals}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  AI Recommendations
                </h3>
              </div>
              <div className="space-y-4">
                {mockRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 ${rec.bgColor} rounded-lg flex items-center justify-center mr-3`}
                        >
                          <i
                            className={`${rec.icon} ${rec.iconColor} text-sm`}
                          ></i>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {rec.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {rec.category}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                        {rec.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      {rec.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{rec.price}</span>
                      <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                        Request
                      </button>
                    </div>
                  </div>
                ))}
                <button className="w-full text-center text-primary-600 text-sm font-medium py-2 hover:text-gray-700 rounded-lg transition-colors">
                  View All Recommendations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
