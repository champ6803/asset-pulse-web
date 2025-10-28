"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import { useState } from "react";
import { useLicenses } from "@/lib/hooks/useLicenses";
import { formatExpireDate, isExpiringSoon, isExpired } from "@/lib/utils";

const getCategoryStyle = (category?: string) => {
  const normalized = category?.toLowerCase() || "";

  if (
    normalized.includes("communication") ||
    normalized.includes("collaboration")
  ) {
    return {
      icon: "fab fa-slack",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    };
  }
  if (normalized.includes("design") || normalized.includes("creative")) {
    return {
      icon: "fab fa-figma",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    };
  }
  if (normalized.includes("development") || normalized.includes("dev")) {
    return {
      icon: "fab fa-github",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    };
  }
  if (normalized.includes("security")) {
    return {
      icon: "fas fa-shield-alt",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    };
  }
  if (normalized.includes("productivity") || normalized.includes("office")) {
    return {
      icon: "fas fa-briefcase",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    };
  }
  if (normalized.includes("analytics") || normalized.includes("data")) {
    return {
      icon: "fas fa-chart-bar",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    };
  }

  // Default
  return {
    icon: "fas fa-cube",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600",
  };
};

export default function MyLicensesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const filters = {
    search: searchQuery || undefined,
    category: categoryFilter || undefined,
  };

  // Fetch licenses with filters
  const { data, isLoading, error } = useLicenses(filters);

  // Client-side filtering based on status
  const allLicenses = data?.licenses || [];
  const licenses = (() => {
    switch (statusFilter) {
      case "all":
        return allLicenses;
      case "active":
        return allLicenses.filter(
          (l) =>
            !l.is_revoked &&
            !isExpired(l.expire_date) &&
            !isExpiringSoon(l.expire_date)
        );
      case "expiring":
        return allLicenses.filter(
          (l) =>
            !l.is_revoked &&
            isExpiringSoon(l.expire_date) &&
            !isExpired(l.expire_date)
        );
      case "expired":
        return allLicenses.filter((l) => isExpired(l.expire_date));
      default:
        return allLicenses;
    }
  })();
  const activeCount = allLicenses.filter(
    (l) => !l.is_revoked && !isExpired(l.expire_date)
  ).length;
  const totalCost = allLicenses
    .filter((l) => !l.is_revoked)
    .reduce((sum) => sum + 0, 0); // Cost calculation would need pricing data
  const expiringCount = allLicenses.filter((l) =>
    isExpiringSoon(l.expire_date)
  ).length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Licenses</h1>
              <p className="text-gray-600 mt-2">
                Manage and track all your active and expired software licenses
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                <option value="Development">Development Tools</option>
                <option value="Design">Design Software</option>
                <option value="Analytics">Analytics</option>
                <option value="Communication">Communication</option>
                <option value="Security">Security</option>
              </select>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <i className="fas fa-download mr-2"></i>
                Export List
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Active Licenses
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {activeCount}
                </p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-check-circle text-green-500 text-sm mr-1"></i>
                  <span className="text-sm text-green-600">All current</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Annual Cost
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ฿{totalCost.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-chart-line text-blue-500 text-sm mr-1"></i>
                  <span className="text-sm text-blue-600">Per year</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-dollar-sign text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Most Used App
                </p>
                <div className="flex items-center mt-2">
                  <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fab fa-figma text-purple-600"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Figma</p>
                    <p className="text-sm text-gray-500">Daily usage</p>
                  </div>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-star text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Expiring in 30 Days
                </p>
                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {expiringCount}
                </p>
                <div className="flex items-center mt-2">
                  <i className="fas fa-exclamation-triangle text-amber-500 text-sm mr-1"></i>
                  <span className="text-sm text-amber-600">
                    Needs attention
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-amber-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  statusFilter === "all"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  statusFilter === "active"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("expiring")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  statusFilter === "expiring"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Expiring Soon
              </button>
              <button
                onClick={() => setStatusFilter("expired")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  statusFilter === "expired"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Expired
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search licenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-2">
                <i className="fas fa-filter"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Licenses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            // Loading skeletons
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-600 mb-4">
                {error instanceof Error
                  ? error.message
                  : "Failed to load licenses"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : licenses.length === 0 ? (
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border-2 border-dashed border-primary-200 p-8 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-plus text-primary-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Request Your First License
              </h3>
              <p className="text-gray-600 mb-4">
                Need additional software? Request a new license to get started
              </p>
              <Link href="/requests/new-hire">
                <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                  Request New License
                </button>
              </Link>
            </div>
          ) : (
            <>
              {licenses.map((license) => {
                const style = getCategoryStyle(license.app_category);
                const expiringSoon = isExpiringSoon(license.expire_date);
                const expired = isExpired(license.expire_date);
                const status = license.is_revoked
                  ? "revoked"
                  : expired
                  ? "expired"
                  : expiringSoon
                  ? "expiring"
                  : "active";

                return (
                  <div
                    key={license.license_assignment_id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {license.app_logo_url ? (
                          <img
                            src={license.app_logo_url}
                            alt={license.app_name}
                            className="h-12 w-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                        ) : null}
                        <div
                          className={`h-12 w-12 ${
                            style.bgColor
                          } rounded-lg flex items-center justify-center ${
                            license.app_logo_url ? "hidden" : ""
                          }`}
                        >
                          <i
                            className={`${style.icon} ${style.iconColor} text-xl`}
                          ></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {license.app_name}
                          </h3>
                          {license.license_tier && (
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${style.bgColor} ${style.iconColor}`}
                            >
                              {license.license_tier}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            status === "active"
                              ? "bg-green-100 text-green-800"
                              : status === "expiring"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-1 ${
                              status === "active"
                                ? "bg-green-500"
                                : status === "expiring"
                                ? "bg-amber-500"
                                : "bg-gray-500"
                            }`}
                          ></div>
                          {status === "active"
                            ? "Active"
                            : status === "expiring"
                            ? "Expiring"
                            : status === "revoked"
                            ? "Revoked"
                            : "Expired"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Assigned:</span>
                        <span className="text-gray-900">
                          {new Date(license.assigned_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </span>
                      </div>
                      {license.expire_date && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Expires:</span>
                          <span
                            className={`${
                              expiringSoon
                                ? "text-amber-600 font-medium"
                                : expired
                                ? "text-red-600 font-medium"
                                : "text-gray-900"
                            }`}
                          >
                            {formatExpireDate(license.expire_date)}
                          </span>
                        </div>
                      )}
                      {license.last_used && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Last Used:</span>
                          <span className="text-gray-900">
                            {new Date(license.last_used).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {license.usage_frequency && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Usage Frequency</span>
                          <span
                            className={`font-medium ${
                              license.usage_frequency > 70
                                ? "text-green-600"
                                : license.usage_frequency > 40
                                ? "text-yellow-600"
                                : "text-gray-600"
                            }`}
                          >
                            {license.usage_frequency > 70
                              ? "High"
                              : license.usage_frequency > 40
                              ? "Medium"
                              : "Low"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              license.usage_frequency > 70
                                ? "bg-green-500"
                                : license.usage_frequency > 40
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                            }`}
                            style={{
                              width: `${license.usage_frequency}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {license.total_seats && `${license.total_seats} seats`}
                      </span>
                      <div className="flex space-x-2">
                        {(expiringSoon || expired) && !license.is_revoked ? (
                          <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                            Request Renewal
                          </button>
                        ) : (
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            View Usage
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Empty State Card */}
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border-2 border-dashed border-primary-200 p-8 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-plus text-primary-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Request Your First License
                </h3>
                <p className="text-gray-600 mb-4">
                  Need additional software? Request a new license to get started
                </p>
                <Link href="/requests/new-hire">
                  <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                    Request New License
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
