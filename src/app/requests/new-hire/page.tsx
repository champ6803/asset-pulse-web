"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';


export default function NewHireForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    jobTitle: '',
    department: '',
    company: '',
    email: '',
    startDate: '',
    jobDescription: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to recommendations page
    router.push('/requests/new-hire/recommendations');
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
      router.push('/dashboard/employee');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Hire Request</h1>
              <p className="text-gray-600 mt-1">Submit a request to onboard a new employee</p>
            </div>
            <Link
              href="/dashboard/employee"
              className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to HR Dashboard
            </Link>
          </div>

          {/* Step Indicator */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-medium">
                  1
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">Basic Information</span>
              </div>
              <div className="flex-1 mx-4 h-px bg-gray-200"></div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-500 rounded-full text-sm font-medium">
                  2
                </div>
                <span className="ml-3 text-sm text-gray-500">AI Recommendations</span>
              </div>
              <div className="flex-1 mx-4 h-px bg-gray-200"></div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-500 rounded-full text-sm font-medium">
                  3
                </div>
                <span className="ml-3 text-sm text-gray-500">Review & Submit</span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-sm font-medium text-primary-600">Step 1 of 3</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Enter employee's full name"
                  />
                </div>

                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    required
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select department</option>
                    <option value="engineering">Engineering</option>
                    <option value="product">Product</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="hr">Human Resources</option>
                    <option value="finance">Finance</option>
                    <option value="operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select company</option>
                    <option value="scbx">SCBX Group</option>
                    <option value="scb">Siam Commercial Bank</option>
                    <option value="scb-tech">SCB TechX</option>
                    <option value="scb-securities">SCB Securities</option>
                    <option value="scb-asset">SCB Asset Management</option>
                    <option value="scb-life">SCB Life Assurance</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="employee@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Job Description Section */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    rows={6}
                    required
                    maxLength={2000}
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Provide a detailed description of the role, responsibilities, required skills, and any specific requirements. This information will help our AI system recommend the most suitable software licenses and tools for the new hire."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-sm ${
                      formData.jobDescription.length > 1800 ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {formData.jobDescription.length} / 2000 characters
                    </span>
                  </div>
                </div>

                {/* Tip Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <i className="fas fa-lightbulb text-blue-600 text-lg"></i>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">
                        Tip for Better AI Recommendations
                      </h4>
                      <p className="text-sm text-blue-700">
                        Provide detailed job description for better AI recommendations. Include
                        specific tools, programming languages, or software the role will require.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center"
                >
                  Next: Get AI Recs
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

