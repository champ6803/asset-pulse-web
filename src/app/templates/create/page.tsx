"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

const navigation = [
  { label: 'Dashboard', href: '/dashboard/manager' },
  { label: 'Team', href: '/dashboard/manager/team' },
  { label: 'Templates', href: '/templates' },
  { label: 'Approvals', href: '/approvals' },
  { label: 'Requests', href: '/requests' },
];

const mockApps = [
  {
    id: '1',
    name: 'GitHub Enterprise',
    category: 'DevOps',
    icon: 'fab fa-github',
    bgColor: 'bg-gray-800',
    cost: 48000,
    selected: true,
    tier: 'Team',
    required: true,
    editable: false,
  },
  {
    id: '2',
    name: 'Docker Hub',
    category: 'DevOps',
    icon: 'fab fa-docker',
    bgColor: 'bg-blue-600',
    cost: 18000,
    selected: true,
    tier: 'Pro',
    required: false,
    editable: true,
  },
  {
    id: '3',
    name: 'Slack',
    category: 'Collaboration',
    icon: 'fab fa-slack',
    bgColor: 'bg-purple-600',
    cost: 24000,
    selected: true,
    tier: 'Pro',
    required: true,
    editable: false,
  },
  {
    id: '4',
    name: 'AWS',
    category: 'DevOps',
    icon: 'fab fa-aws',
    bgColor: 'bg-orange-500',
    cost: 36000,
    selected: true,
    tier: 'Business',
    required: false,
    editable: true,
  },
  {
    id: '5',
    name: 'Jira',
    category: 'DevOps',
    icon: 'fab fa-jira',
    bgColor: 'bg-blue-500',
    cost: 21000,
    selected: true,
    tier: 'Standard',
    required: false,
    editable: false,
  },
  {
    id: '6',
    name: 'MongoDB Atlas',
    category: 'Database',
    icon: 'fab fa-node-js',
    bgColor: 'bg-green-600',
    cost: 15000,
    selected: false,
    tier: 'M10',
    required: false,
    editable: false,
  },
];

export default function TemplateCreatePage() {
  const router = useRouter();
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [targetType, setTargetType] = useState('roleBased');
  const [department, setDepartment] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('200000');
  const [apps, setApps] = useState(mockApps);

  const toggleApp = (id: string) => {
    setApps(apps.map(app => app.id === id ? { ...app, selected: !app.selected } : app));
  };

  const selectedApps = apps.filter(app => app.selected);
  const totalCost = selectedApps.reduce((sum, app) => sum + app.cost, 0);
  const budgetUsage = (totalCost / parseInt(budgetLimit || '1')) * 100;

  const handleSubmit = () => {
    router.push('/templates');
  };

  return (
    <DashboardLayout navigation={navigation}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link
              href="/templates"
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Templates
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Purchase Template</h1>
              <p className="text-gray-600 mt-2">Build a reusable software package for your team</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Preview Template
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g., Senior Developer Pack"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this template includes and when to use it..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Target & Scope Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Target & Scope</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Target Type <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="targetType"
                        value="newHire"
                        checked={targetType === 'newHire'}
                        onChange={(e) => setTargetType(e.target.value)}
                        className="text-primary-600 focus:ring-primary-500 mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">New Hire Onboarding</div>
                        <div className="text-sm text-gray-600">Standard package for new employees</div>
                      </div>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="targetType"
                        value="roleBased"
                        checked={targetType === 'roleBased'}
                        onChange={(e) => setTargetType(e.target.value)}
                        className="text-primary-600 focus:ring-primary-500 mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Role-Based</div>
                        <div className="text-sm text-gray-600">Specific to job roles and responsibilities</div>
                      </div>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="targetType"
                        value="department"
                        checked={targetType === 'department'}
                        onChange={(e) => setTargetType(e.target.value)}
                        className="text-primary-600 focus:ring-primary-500 mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Department Standard</div>
                        <div className="text-sm text-gray-600">Common tools for entire department</div>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scope Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select department</option>
                      <option value="engineering">Engineering</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales</option>
                      <option value="data">Data & Analytics</option>
                      <option value="hr">Human Resources</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Limit <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={budgetLimit}
                        onChange={(e) => setBudgetLimit(e.target.value)}
                        placeholder="200,000"
                        className="w-full pl-12 pr-16 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">฿</span>
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">/year</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Selection Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Application Selection</h2>
                <span className="text-sm text-gray-600">{selectedApps.length} apps selected</span>
              </div>

              <div className="mb-6">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search applications..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    All
                  </button>
                  <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded-full text-sm">
                    DevOps
                  </button>
                  <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded-full text-sm">
                    Collaboration
                  </button>
                  <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded-full text-sm">
                    Security
                  </button>
                  <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded-full text-sm">
                    Analytics
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apps.map((app) => (
                  <div
                    key={app.id}
                    className={`border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors ${
                      !app.selected ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`h-10 w-10 ${app.bgColor} rounded-lg flex items-center justify-center`}>
                          <i className={`${app.icon} text-white`}></i>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{app.name}</h3>
                          <p className="text-sm text-gray-600">{app.category}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={app.selected}
                        onChange={() => toggleApp(app.id)}
                        className="text-primary-600 focus:ring-primary-500 rounded"
                      />
                    </div>
                    {app.selected && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Tier:</span>
                          <select className="text-sm border border-gray-300 rounded px-2 py-1">
                            <option>{app.tier}</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Annual Cost:</span>
                          <span className="text-sm font-medium">฿{app.cost.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Required:</span>
                          <input
                            type="checkbox"
                            checked={app.required}
                            onChange={() => {}}
                            className="text-primary-600 focus:ring-primary-500 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">User can edit:</span>
                          <input
                            type="checkbox"
                            checked={app.editable}
                            onChange={() => {}}
                            className="text-primary-600 focus:ring-primary-500 rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between">
              <Link
                href="/templates"
                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <div className="flex space-x-4">
                <button className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Save as Draft
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Publish Template
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Template Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Applications:</span>
                  <span className="font-medium text-gray-900">{selectedApps.length} apps</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium text-gray-900">฿{totalCost.toLocaleString()}/year</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Budget Limit:</span>
                  <span className="font-medium text-gray-900">฿{parseInt(budgetLimit || '0').toLocaleString()}/year</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Budget Usage</span>
                  <span className={`text-sm font-medium ${
                    budgetUsage > 100 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {budgetUsage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      budgetUsage > 100 ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className={budgetUsage > 100 ? 'text-red-600' : 'text-green-600'}>
                    ฿{totalCost.toLocaleString()} used
                  </span>
                  <span className="text-gray-600">
                    ฿{Math.max(parseInt(budgetLimit || '0') - totalCost, 0).toLocaleString()} remaining
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-3">Selected Applications</h4>
                <div className="space-y-3">
                  {selectedApps.map((app) => (
                    <div key={app.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`h-6 w-6 ${app.bgColor} rounded flex items-center justify-center`}>
                          <i className={`${app.icon} text-white text-xs`}></i>
                        </div>
                        <span className="text-sm text-gray-900">{app.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">฿{app.cost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

