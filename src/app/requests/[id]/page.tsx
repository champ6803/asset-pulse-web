"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';


export default function RequestDetailPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard/employee/requests" className="flex items-center text-gray-500 hover:text-gray-700">
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Requests
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <i className="fas fa-file-alt text-blue-600 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Details</h1>
            <p className="text-gray-600">Request #REQ-2024-001</p>
          </div>

          <div className="space-y-6">
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Status:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  Pending Review
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Application:</span>
                  <span className="font-medium text-gray-900">Notion Team Plan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted:</span>
                  <span className="font-medium text-gray-900">Oct 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium text-gray-900">฿12,000/year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

