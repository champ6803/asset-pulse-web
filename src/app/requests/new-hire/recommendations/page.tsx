"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

const navigation = [
  { label: 'Dashboard', href: '/dashboard/employee' },
  { label: 'HR Management', href: '/requests/new-hire' },
  { label: 'Assets', href: '/dashboard/employee/licenses' },
  { label: 'Analytics', href: '/analytics' },
];

const mockRecommendations = [
  {
    id: '1',
    appName: 'GitHub Enterprise',
    category: 'DevOps',
    tier: 'Pro License',
    relevanceScore: 96,
    cost: 12000,
    rationale: 'Job mentions version control, CI/CD pipelines, and code collaboration',
    icon: 'fab fa-github',
    selected: true,
  },
  {
    id: '2',
    appName: 'Slack Pro',
    category: 'Collaboration',
    tier: 'Pro License',
    relevanceScore: 92,
    cost: 8500,
    rationale: 'Engineering role requires team communication and file sharing',
    icon: 'fab fa-slack',
    selected: false,
  },
  {
    id: '3',
    appName: 'Docker Pro',
    category: 'DevOps',
    tier: 'Pro License',
    relevanceScore: 89,
    cost: 7200,
    rationale: 'Containerization experience mentioned in requirements',
    icon: 'fab fa-docker',
    selected: true,
  },
  {
    id: '4',
    appName: 'Jira Software',
    category: 'Collaboration',
    tier: 'Standard',
    relevanceScore: 87,
    cost: 9600,
    rationale: 'Agile development and project management required',
    icon: 'fas fa-tasks',
    selected: false,
  },
  {
    id: '5',
    appName: 'VS Code Pro',
    category: 'DevOps',
    tier: 'Pro License',
    relevanceScore: 85,
    cost: 4800,
    rationale: 'Code editor with advanced features for development',
    icon: 'fas fa-code',
    selected: false,
  },
  {
    id: '6',
    appName: 'Figma Professional',
    category: 'Design',
    tier: 'Professional',
    relevanceScore: 78,
    cost: 14400,
    rationale: 'Frontend role may require design collaboration tools',
    icon: 'fab fa-figma',
    selected: true,
  },
];

export default function RecommendationsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleSelection = (id: string) => {
    setRecommendations(recommendations.map(rec =>
      rec.id === id ? { ...rec, selected: !rec.selected } : rec
    ));
  };

  const selectedCount = recommendations.filter(r => r.selected).length;
  const totalCost = recommendations
    .filter(r => r.selected)
    .reduce((sum, r) => sum + r.cost, 0);

  const handleNext = () => {
    router.push('/requests/new-hire/review');
  };

  return (
    <DashboardLayout navigation={navigation}>
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Content Area */}
        <div className="flex-1">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
                  <div className="ml-4 flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <i className="fas fa-robot mr-2"></i>
                    95% Confidence
                  </div>
                </div>
                <p className="text-gray-600">
                  Sarah Johnson • Senior Software Engineer • Total: 89,500 THB/year
                </p>
              </div>
              <Link
                href="/requests/new-hire"
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
                <div className="flex-1 mx-4 h-px bg-primary-500"></div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-medium">
                    2
                  </div>
                  <span className="ml-3 text-sm font-medium text-primary-600">AI Recommendations</span>
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
                <span className="text-sm font-medium text-primary-600">Step 2 of 3</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedCategory === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All (10)
                </button>
                <button
                  onClick={() => setSelectedCategory('devops')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    selectedCategory === 'devops'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  DevOps (3)
                </button>
                <button
                  onClick={() => setSelectedCategory('collaboration')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    selectedCategory === 'collaboration'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Collaboration (4)
                </button>
                <button
                  onClick={() => setSelectedCategory('security')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    selectedCategory === 'security'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Security (2)
                </button>
                <button
                  onClick={() => setSelectedCategory('design')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    selectedCategory === 'design'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Design (1)
                </button>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-3">Sort by:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Relevance Score</option>
                  <option>Annual Cost</option>
                  <option>Category</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`bg-white rounded-xl shadow-sm p-6 relative ${
                  rec.selected ? 'border-2 border-green-200' : 'border border-gray-200'
                }`}
              >
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <button
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Why recommended?"
                  >
                    <i className="fas fa-question-circle"></i>
                  </button>
                  <button className="text-gray-400 hover:text-red-500 p-1">
                    <i className="fas fa-times"></i>
                  </button>
                  <button
                    onClick={() => toggleSelection(rec.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      rec.selected
                        ? 'bg-green-500'
                        : 'border-2 border-gray-300'
                    }`}
                  >
                    {rec.selected && <i className="fas fa-check text-white text-xs"></i>}
                  </button>
                </div>
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <i className={`${rec.icon} text-gray-600 text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rec.appName}</h3>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                      {rec.category}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Relevance Score</span>
                    <span className={`text-sm font-bold ${
                      rec.relevanceScore >= 90 ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {rec.relevanceScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        rec.relevanceScore >= 90 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${rec.relevanceScore}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {rec.cost.toLocaleString()} THB/year
                  </span>
                  <span className="text-sm text-gray-500">{rec.tier}</span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <i className="fas fa-robot text-blue-600 text-sm mt-0.5 mr-2"></i>
                    <p className="text-sm text-blue-800">{rec.rationale}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Link
              href="/requests/new-hire"
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
                onClick={handleNext}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center"
              >
                Review & Submit
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Selection Summary</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Selected Apps</span>
                <span className="font-semibold text-gray-900">
                  {selectedCount} of {recommendations.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Cost</span>
                <span className="font-semibold text-gray-900">
                  {totalCost.toLocaleString()} THB/year
                </span>
              </div>
            </div>

            {/* Budget Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Budget Limit</span>
                <span className="text-sm text-gray-600">50,000 THB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${Math.min((totalCost / 50000) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {Math.round((totalCost / 50000) * 100)}% used
                </span>
                <span className="text-xs font-medium text-green-600">
                  {(50000 - totalCost).toLocaleString()} THB remaining
                </span>
              </div>
            </div>

            {/* Approval Info */}
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex items-center mb-2">
                <i className="fas fa-user-check text-gray-600 mr-2"></i>
                <span className="text-sm font-medium text-gray-700">Approver</span>
              </div>
              <p className="text-sm text-gray-900 mb-3">David Chen (Engineering Director)</p>
              <div className="flex items-center">
                <i className="fas fa-clock text-gray-500 mr-2"></i>
                <span className="text-xs text-gray-600">Est. approval time: 2-3 business days</span>
              </div>
            </div>

            {/* Selected Apps */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Applications</h4>
              {recommendations.filter(r => r.selected).map((rec) => (
                <div key={rec.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                      <i className={`${rec.icon} text-gray-600 text-sm`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{rec.appName}</p>
                      <p className="text-xs text-gray-600">{rec.cost.toLocaleString()} THB/year</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSelection(rec.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <i className="fas fa-times text-sm"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

