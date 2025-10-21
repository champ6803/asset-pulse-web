"use client";

import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

const navigation = [
  { label: 'Dashboard', href: '/dashboard/employee' },
  { label: 'HR Management', href: '/requests/new-hire' },
  { label: 'Assets', href: '/dashboard/employee/licenses' },
  { label: 'Analytics', href: '/analytics' },
];

export default function ReviewSubmitPage() {
  const router = useRouter();

  const handleSubmit = () => {
    router.push('/requests/confirmation');
  };

  return (
    <DashboardLayout navigation={navigation}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Review & Submit</h1>
              <p className="text-gray-600 mt-1">Review your request before submitting</p>
            </div>
            <Link
              href="/requests/new-hire/recommendations"
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back
            </Link>
          </div>

          {/* Step Indicator */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                  <i className="fas fa-check text-xs"></i>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Basic Information</span>
              </div>
              <div className="flex-1 mx-4 h-px bg-green-500"></div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium">
                  <i className="fas fa-check text-xs"></i>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">AI Recommendations</span>
              </div>
              <div className="flex-1 mx-4 h-px bg-primary-500"></div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-medium">
                  3
                </div>
                <span className="ml-3 text-sm font-medium text-primary-600">Review & Submit</span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-sm font-medium text-primary-600">Step 3 of 3</span>
            </div>
          </div>
        </div>

        {/* Review Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Request Summary</h2>

          {/* Employee Info */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Employee Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">Sarah Johnson</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Job Title</p>
                <p className="font-medium text-gray-900">Senior Software Engineer</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium text-gray-900">Engineering</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-medium text-gray-900">SCB TechX</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">sarah.johnson@scbtech.com</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium text-gray-900">Nov 1, 2024</p>
              </div>
            </div>
          </div>

          {/* Selected Software */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Selected Software (4 apps)</h3>
            <div className="space-y-3">
              {['GitHub Enterprise', 'Docker Pro', 'Figma Professional', 'Slack Pro'].map((app, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-cube text-gray-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{app}</p>
                      <p className="text-sm text-gray-500">Pro License</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">
                    {(Math.random() * 10000 + 5000).toFixed(0)} THB/year
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total Cost */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total Annual Cost</span>
              <span className="text-2xl font-bold text-gray-900">42,400 THB</span>
            </div>
          </div>
        </div>

        {/* Approval Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <i className="fas fa-info-circle text-blue-600 text-xl"></i>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Approval Required</h4>
              <p className="text-sm text-blue-700 mb-3">
                This request requires approval from your department manager.
              </p>
              <div className="space-y-2 text-sm text-blue-700">
                <p><strong>Approver:</strong> David Chen (Engineering Director)</p>
                <p><strong>Expected time:</strong> 2-3 business days</p>
                <p><strong>SLA:</strong> 3 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/requests/new-hire/recommendations"
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back
          </Link>
          <div className="flex space-x-4">
            <button className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Save Draft
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center"
            >
              <i className="fas fa-check mr-2"></i>
              Submit for Approval
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

