"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useNewHireRecommendations, type NewHireRecommendation } from '@/lib/hooks/useNewHireRecommendations';


type UIRecommendation = NewHireRecommendation & { id: string };

export default function RecommendationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const step1Data = useMemo(() => {
    const qp = {
      jobTitle: searchParams.get('job_title') || undefined,
      jobDescription: searchParams.get('job_description') || undefined,
      department: searchParams.get('department') || undefined,
      company: searchParams.get('company') || undefined,
    };

    // Fallback to sessionStorage if query params missing
    if (!qp.jobTitle || !qp.jobDescription || !qp.department || !qp.company) {
      try {
        const saved = sessionStorage.getItem('newHireStep1');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            jobTitle: qp.jobTitle ?? parsed?.jobTitle,
            jobDescription: qp.jobDescription ?? parsed?.jobDescription,
            department: qp.department ?? parsed?.department,
            company: qp.company ?? parsed?.company,
          };
        }
      } catch {}
    }
    return qp;
  }, [searchParams]);

  const appName = searchParams.get('app_name') || undefined;
  const { data, isLoading, error } = useNewHireRecommendations(step1Data, appName);

  const [recommendations, setRecommendations] = useState<UIRecommendation[]>([]);
  useEffect(() => {
    if (data) {
      const mapped: UIRecommendation[] = data.map((r, idx) => ({
        // Stable and unique id across renders and across potential duplicate app names
        id: `${r.app_name}-${r.tier || 'default'}-${idx}`,
        ...r,
        app_name: r.app_name,
        selected: typeof r.selected === 'boolean' ? r.selected : false,
      }));
      setRecommendations(mapped);
    }
  }, [data]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'similarity' | 'cost' | 'category'>(appName ? 'similarity' : 'relevance');

  // Fallback icon resolver to make sure we always show an icon
  const resolveIconClass = (name?: string, provided?: string) => {
    if (provided && provided.trim().length > 0) return provided;
    const n = (name || '').toLowerCase();
    if (n.includes('github')) return 'fab fa-github';
    if (n.includes('gitlab')) return 'fab fa-gitlab';
    if (n.includes('bitbucket')) return 'fab fa-bitbucket';
    if (n.includes('slack')) return 'fab fa-slack';
    if (n.includes('microsoft') || n.includes('teams')) return 'fab fa-microsoft';
    if (n.includes('figma')) return 'fab fa-figma';
    if (n.includes('jira')) return 'fab fa-jira';
    if (n.includes('notion')) return 'fab fa-notion';
    if (n.includes('google')) return 'fab fa-google';
    if (n.includes('aws') || n.includes('amazon')) return 'fab fa-aws';
    if (n.includes('azure')) return 'fab fa-microsoft';
    if (n.includes('visual studio') || n.includes('vs code') || n.includes('vscode')) return 'fas fa-code';
    return 'fas fa-cube';
  };

  const toggleSelection = (id: string) => {
    setRecommendations(prev => prev.map(rec =>
      rec.id === id ? { ...rec, selected: !rec.selected } : rec
    ));
  };

  const selectedCount = recommendations.filter(r => r.selected).length;
  const totalCost = recommendations
    .filter(r => r.selected)
    .reduce((sum, r) => sum + (r.cost || 0), 0);

  const handleNext = () => {
    router.push('/requests/new-hire/review');
  };

  // Derived lists with filter/sort
  const filteredSorted = useMemo(() => {
    let list = recommendations;
    if (selectedCategory !== 'all') {
      const target = selectedCategory.toLowerCase();
      list = list.filter(r => (r.category || '').toLowerCase() === target);
    }
    const sorted = [...list];
    if (sortBy === 'relevance') {
      sorted.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
    } else if (sortBy === 'similarity') {
      const getSim = (x: UIRecommendation) => (x.similarity_score ?? x.relevance_score ?? 0);
      sorted.sort((a, b) => getSim(b) - getSim(a));
    } else if (sortBy === 'cost') {
      sorted.sort((a, b) => (a.cost || 0) - (b.cost || 0));
    } else if (sortBy === 'category') {
      sorted.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    }
    return sorted;
  }, [recommendations, selectedCategory, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    recommendations.forEach(r => {
      const key = (r.category || 'other').toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [recommendations]);

  return (
    <DashboardLayout>
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Content Area */}
        <div className="flex-1">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
                  {!!data && (
                    <div className="ml-4 flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      <i className="fas fa-robot mr-2"></i>
                      AI Results
                    </div>
                  )}
                </div>
                {step1Data?.jobTitle && (
                  <p className="text-gray-600">
                    {step1Data.jobTitle}
                  </p>
                )}
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
                  All ({recommendations.length})
                </button>
                <button
                  onClick={() => setSelectedCategory('devops')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    selectedCategory === 'devops'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  DevOps ({categoryCounts['devops'] || 0})
                </button>
                <button
                  onClick={() => setSelectedCategory('collaboration')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    selectedCategory === 'collaboration'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Collaboration ({categoryCounts['collaboration'] || 0})
                </button>
                <button
                  onClick={() => setSelectedCategory('security')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    selectedCategory === 'security'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Security ({categoryCounts['security'] || 0})
                </button>
                <button
                  onClick={() => setSelectedCategory('design')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    selectedCategory === 'design'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Design ({categoryCounts['design'] || 0})
                </button>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-3">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy((e.target.value as any) ?? 'relevance')}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="relevance">Relevance Score</option>
                  {appName && <option value="similarity">Similarity</option>}
                  <option value="cost">Annual Cost</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {isLoading && (
              <div className="col-span-1 md:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 p-10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                    <p className="text-gray-700 font-medium">Loading AI recommendations...</p>
                    <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="col-span-1 md:col-span-2 text-red-600">Failed to load recommendations</div>
            )}
            {!isLoading && !error && filteredSorted.map((rec) => (
              <div
                key={`card-${rec.id}`}
                className={`bg-white rounded-xl shadow-sm p-6 relative ${
                  rec.selected ? 'border-2 border-green-200' : 'border border-gray-200'
                }`}
              >
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <button
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Why recommended?"
                    onClick={() => alert(rec.rationale || 'AI rationale is not available for this item.')}
                  >
                    <i className="fas fa-question-circle"></i>
                  </button>
                  <button className="text-gray-400 hover:text-red-500 p-1" title="Remove from list" onClick={() => setRecommendations(prev => prev.filter(r => r.id !== rec.id))}>
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
                    <svg
                      className={`w-3.5 h-3.5 ${rec.selected ? 'text-white' : 'text-transparent'}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <i className={`${resolveIconClass(rec.app_name, rec.icon)} text-gray-600 text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rec.app_name}</h3>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                      {rec.category}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{appName ? 'Similarity' : 'Relevance Score'}</span>
                    {(() => {
                      const score = appName ? (rec.similarity_score ?? rec.relevance_score ?? 0) : (rec.relevance_score ?? 0);
                      return (
                        <span className={`text-sm font-bold ${score >= 90 ? 'text-green-600' : 'text-blue-600'}`}>
                          {Math.round(score)}%
                        </span>
                      );
                    })()}
                  </div>
                  {(() => {
                    const score = appName ? (rec.similarity_score ?? rec.relevance_score ?? 0) : (rec.relevance_score ?? 0);
                    return (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${score >= 90 ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    );
                  })()}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {(rec.cost || 0).toLocaleString()} THB/year
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
                <div key={`sel-${rec.id}`} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                      <i className={`${resolveIconClass(rec.app_name, rec.icon)} text-gray-600 text-sm`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{rec.app_name}</p>
                      <p className="text-xs text-gray-600">{(rec.cost || 0).toLocaleString()} THB/year</p>
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

