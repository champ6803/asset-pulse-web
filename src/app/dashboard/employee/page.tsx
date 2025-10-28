"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import { useActiveLicenses } from "@/lib/hooks/useLicenses";
import { usePendingRequests } from "@/lib/hooks/useRequests";
import { useAIRecommendations } from "@/lib/hooks/useRecommendations";
import { formatExpireDate, isExpiringSoon } from "@/lib/utils";

// Helper function to get category-based icon and colors
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
  if (normalized.includes("productivity") || normalized.includes("office")) {
    return {
      icon: "fas fa-briefcase",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    };
  }

  // Default
  return {
    icon: "fas fa-cube",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600",
  };
};

export default function EmployeeDashboard() {
  // Use TanStack Query hook to fetch active licenses (limit to 4 for dashboard)
  const { data, isLoading, error } = useActiveLicenses(4);

  // Use TanStack Query hook to fetch pending requests (limit to 2 for dashboard)
  const {
    data: pendingRequestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
  } = usePendingRequests(2);

  // Use TanStack Query hook to fetch AI recommendations (limit to 2 for dashboard)
  const {
    data: recommendationsData,
    isLoading: isLoadingRecommendations,
    error: recommendationsError,
  } = useAIRecommendations(2);

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
                  {data?.total || 0} active
                </span>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-2">
                    {error instanceof Error
                      ? error.message
                      : "Failed to load licenses"}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : data?.licenses.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
                  <p className="text-gray-500">No active licenses found</p>
                  <Link href="/requests/new-hire">
                    <button className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Request Software
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.licenses.map((license) => {
                    const style = getCategoryStyle(license.app_category);
                    const expiringSoon = isExpiringSoon(license.expire_date);

                    return (
                      <div
                        key={license.license_assignment_id}
                        className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          {license.app_logo_url ? (
                            <img
                              src={license.app_logo_url}
                              alt={license.app_name}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                // Fallback to icon if image fails to load
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.classList.remove(
                                  "hidden"
                                );
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-12 h-12 ${
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
                            <h4 className="font-medium text-gray-900">
                              {license.app_name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {license.app_category || ""}
                              {license.license_tier &&
                                ` • ${license.license_tier} Plan`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              license.is_revoked
                                ? "bg-red-100 text-red-800"
                                : expiringSoon
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {license.is_revoked
                              ? "Revoked"
                              : expiringSoon
                              ? "Expiring Soon"
                              : "Active"}
                          </span>
                          {license.expire_date && (
                            <p
                              className={`text-sm mt-1 ${
                                expiringSoon
                                  ? "text-yellow-600"
                                  : "text-gray-500"
                              }`}
                            >
                              Expires: {formatExpireDate(license.expire_date)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-3">
                    <Link href="/dashboard/employee/licenses">
                      <button className="w-full text-center text-primary-600 hover:text-gray-500 text-sm font-medium py-2 rounded-lg transition-colors">
                        View All Licenses
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Requests Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pending Requests
              </h3>

              {isLoadingRequests ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse border border-gray-100 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : requestsError ? (
                <div className="text-center py-4">
                  <p className="text-red-600 text-sm mb-2">
                    {requestsError instanceof Error
                      ? requestsError.message
                      : "Failed to load requests"}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-primary-600 hover:text-primary-700 text-xs font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : pendingRequestsData?.requests.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-inbox text-3xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500 text-sm">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequestsData?.requests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-100 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {request.ticket_no}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {request.status === "pending"
                            ? "Pending"
                            : request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 capitalize">
                        {request.app_name}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          Submitted:
                          {formatExpireDate(request.created_at)}
                        </span>
                        {request.approvals_curr_step &&
                          request.approvals_step && (
                            <span>
                              {request.approvals_curr_step}/
                              {request.approvals_step} approvals
                            </span>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Recommendations Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  AI Recommendations
                </h3>
              </div>

              {isLoadingRecommendations ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse border border-gray-100 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendationsError ? (
                <div className="text-center py-4">
                  <p className="text-red-600 text-sm mb-2">
                    {recommendationsError instanceof Error
                      ? recommendationsError.message
                      : "Failed to load recommendations"}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-primary-600 hover:text-primary-700 text-xs font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : recommendationsData?.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-lightbulb text-3xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500 text-sm">
                    No recommendations available
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendationsData?.map((rec) => {
                    const style = getCategoryStyle(rec.category);
                    return (
                      <div
                        key={rec.id}
                        className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            {rec.app_logo_url ? (
                              <img
                                src={rec.app_logo_url}
                                alt={rec.app_name}
                                className="w-8 h-8 rounded-lg object-cover mr-3"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.nextElementSibling?.classList.remove(
                                    "hidden"
                                  );
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-8 h-8 ${
                                style.bgColor
                              } rounded-lg flex items-center justify-center mr-3 ${
                                rec.app_logo_url ? "hidden" : ""
                              }`}
                            >
                              <i
                                className={`${style.icon} ${style.iconColor} text-sm`}
                              ></i>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {rec.app_name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {rec.category}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            {Math.round(rec.relevance_score)}% Match
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">
                          {rec.rationale}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            ฿{888}/month
                          </span>
                          <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                            Request
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <button className="w-full text-center text-primary-600 text-sm font-medium py-2 hover:text-gray-700 rounded-lg transition-colors">
                    View All Recommendations
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
