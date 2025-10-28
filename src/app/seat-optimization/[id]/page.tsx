"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';


const sourceUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Marketing Manager',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
    lastActive: '45 days ago',
    usage: '2 hours in last 90 days',
    selected: true,
  },
  {
    id: '2',
    name: 'David Park',
    role: 'Content Specialist',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
    lastActive: '32 days ago',
    usage: '0 hours in last 90 days',
    selected: true,
  },
  {
    id: '3',
    name: 'Maria Garcia',
    role: 'Brand Manager',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
    lastActive: '28 days ago',
    usage: '5 hours in last 90 days',
    selected: false,
  },
  {
    id: '4',
    name: 'Tom Wilson',
    role: 'Marketing Coordinator',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg',
    lastActive: '52 days ago',
    usage: '1 hour in last 90 days',
    selected: true,
  },
];

const targetUsers = [
  {
    id: '1',
    name: 'Lisa Chen',
    role: 'Senior Data Analyst',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg',
    requestedAt: 'Oct 18, 2024',
    priority: 'High Priority',
    priorityColor: 'bg-red-100 text-red-800',
    justification:
      'Need advanced visualization capabilities for quarterly business review presentations and executive dashboards.',
  },
  {
    id: '2',
    name: 'Alex Kumar',
    role: 'Business Intelligence Analyst',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
    requestedAt: 'Oct 15, 2024',
    priority: 'Medium Priority',
    priorityColor: 'bg-yellow-100 text-yellow-800',
    justification:
      'Required for creating interactive dashboards for sales performance tracking and customer analytics.',
  },
];

export default function ReallocationDetailsPage() {
  const [sourceSelections, setSourceSelections] = useState(sourceUsers);
  const [actionType, setActionType] = useState('immediate');

  const toggleSourceUser = (id: string) => {
    setSourceSelections(
      sourceSelections.map((user) =>
        user.id === id ? { ...user, selected: !user.selected } : user
      )
    );
  };

  const selectedCount = sourceSelections.filter((u) => u.selected).length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/dashboard/cto" className="hover:text-gray-700">
              Dashboard
            </Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <Link href="/seat-optimization" className="hover:text-gray-700">
              Seat Optimization
            </Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span className="text-gray-900 font-medium">Reallocation Details</span>
          </nav>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau Pro Reallocation</h1>
              <p className="text-gray-600 mt-2">
                Optimize license distribution between Marketing and Analytics departments
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/seat-optimization">
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back
                </button>
              </Link>
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <i className="fas fa-bookmark mr-2"></i>
                Save Draft
              </button>
            </div>
          </div>
        </div>

        {/* Reallocation Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Source Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <i className="fas fa-users text-red-500 mr-3"></i>
                  Source (Inactive Users)
                </h2>
                <p className="text-gray-600 mt-1">Marketing Department</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Inactive Licenses</p>
                <p className="text-2xl font-bold text-red-600">7</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="select-all-source"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  onChange={(e) =>
                    setSourceSelections(
                      sourceSelections.map((u) => ({ ...u, selected: e.target.checked }))
                    )
                  }
                />
                <label htmlFor="select-all-source" className="text-sm font-medium text-gray-700">
                  Select All
                </label>
              </div>
              <button
                onClick={() => setSourceSelections(sourceSelections.map((u) => ({ ...u, selected: false })))}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Deselect All
              </button>
            </div>

            <div className="space-y-3">
              {sourceSelections.map((user) => (
                <div
                  key={user.id}
                  className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={user.selected}
                      onChange={() => toggleSourceUser(user.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {user.lastActive}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{user.role}</p>
                      <p className="text-xs text-gray-400 mt-1">Usage: {user.usage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <i className="fas fa-arrow-right text-green-500 mr-3"></i>
                  Target (Pending Requests)
                </h2>
                <p className="text-gray-600 mt-1">Analytics Department</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Pending Requests</p>
                <p className="text-2xl font-bold text-green-600">2</p>
              </div>
            </div>

            <div className="space-y-3">
              {targetUsers.map((user) => (
                <div
                  key={user.id}
                  className="border border-gray-100 rounded-lg p-4 bg-green-50 border-green-200"
                >
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-arrow-right text-green-500"></i>
                    <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${user.priorityColor}`}>
                            {user.priority}
                          </span>
                          <span className="text-xs text-gray-500">{user.requestedAt}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{user.role}</p>
                      <p className="text-xs text-gray-600 mt-2 bg-white p-2 rounded border">
                        {user.justification}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Suggested Mapping</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sarah Johnson → Lisa Chen</span>
                  <i className="fas fa-check-circle text-green-500"></i>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">David Park → Alex Kumar</span>
                  <i className="fas fa-check-circle text-green-500"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Impact Analysis</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Action Summary */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Action Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-800">Transfer</span>
                  <span className="text-lg font-bold text-green-600">2</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-red-800">Revoke</span>
                  <span className="text-lg font-bold text-red-600">2</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Keep Unused</span>
                  <span className="text-lg font-bold text-gray-600">3</span>
                </div>
              </div>
            </div>

            {/* Financial Impact */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Impact</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Monthly Cost</span>
                  <span className="text-sm font-medium">฿29,400</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">After Optimization</span>
                  <span className="text-sm font-medium">฿21,000</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">Monthly Savings</span>
                    <span className="text-lg font-bold text-green-600">฿8,400</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">Annual Savings</span>
                    <span className="text-sm font-medium text-green-600">฿100,800</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Execution Timeline */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Execution Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">1</span>
                  </div>
                  <span className="text-sm text-gray-600">Notify affected users</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">2</span>
                  </div>
                  <span className="text-sm text-gray-600">Revoke unused licenses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">3</span>
                  </div>
                  <span className="text-sm text-gray-600">Assign to new users</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">4</span>
                  </div>
                  <span className="text-sm text-gray-600">Send confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuration Options</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notification Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="notify-revoked"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    defaultChecked
                  />
                  <label htmlFor="notify-revoked" className="text-sm text-gray-700">
                    Notify users about license revocation
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="notify-assigned"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    defaultChecked
                  />
                  <label htmlFor="notify-assigned" className="text-sm text-gray-700">
                    Notify users about new license assignment
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="notify-managers"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="notify-managers" className="text-sm text-gray-700">
                    Notify department managers
                  </label>
                </div>
              </div>
            </div>

            {/* Action Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Action Type</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="immediate"
                    name="action-type"
                    value="immediate"
                    checked={actionType === 'immediate'}
                    onChange={(e) => setActionType(e.target.value)}
                    className="border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="immediate" className="text-sm text-gray-700">
                    Execute immediately
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="scheduled"
                    name="action-type"
                    value="scheduled"
                    checked={actionType === 'scheduled'}
                    onChange={(e) => setActionType(e.target.value)}
                    className="border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="scheduled" className="text-sm text-gray-700">
                    Schedule for later execution
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="gradual"
                    name="action-type"
                    value="gradual"
                    checked={actionType === 'gradual'}
                    onChange={(e) => setActionType(e.target.value)}
                    className="border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="gradual" className="text-sm text-gray-700">
                    Gradual transition over 30 days
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Link href="/seat-optimization">
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </Link>
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <i className="fas fa-save mr-2"></i>
            Save Draft
          </button>
          <button className="bg-primary-100 text-primary-700 border border-primary-200 px-6 py-3 rounded-lg hover:bg-primary-200 transition-colors flex items-center">
            <i className="fas fa-clock mr-2"></i>
            Schedule Execution
          </button>
          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
            <i className="fas fa-play mr-2"></i>
            Execute Now
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

