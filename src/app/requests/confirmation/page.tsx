"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';


export default function ConfirmationPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          {/* Success Icon */}
          <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-check text-green-600 text-3xl"></i>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Submitted!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Your software request has been successfully submitted.
          </p>

          {/* Request Details Card */}
          <div className="bg-gray-50 rounded-xl p-6 text-left mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Request ID:</span>
                <span className="text-sm font-medium text-gray-900">#REQ-2024-001234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Employee:</span>
                <span className="text-sm font-medium text-gray-900">John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Department:</span>
                <span className="text-sm font-medium text-gray-900">IT - Backend Team</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Applications:</span>
                <span className="text-sm font-medium text-gray-900">10 apps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Cost:</span>
                <span className="text-sm font-medium text-gray-900">48,000 THB/year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  🟡 Pending Approval
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left mb-8">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">Next Steps:</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="font-medium mr-2">1.</span>
                <span>David Chen (IT Manager) will review</span>
              </li>
              <li className="flex items-start ml-4 text-xs text-blue-700">
                Deadline: Oct 24, 2025
              </li>
              <li className="flex items-start mt-2">
                <span className="font-medium mr-2">2.</span>
                <span>You will receive email notification</span>
              </li>
              <li className="flex items-start mt-2">
                <span className="font-medium mr-2">3.</span>
                <span>If approved, licenses will be auto-assigned</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/requests"
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View Request Details
            </Link>
            <Link
              href="/requests/new-hire"
              className="px-6 py-3 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors"
            >
              Create Another
            </Link>
            <Link
              href="/dashboard/employee"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

