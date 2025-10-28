"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';


export default function MemoGeneratePage() {
  const [tone, setTone] = useState('professional');

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">AI-Generated Business Case Memo</h1>
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                  <i className="fas fa-robot text-blue-600 text-sm"></i>
                  <span className="text-sm font-medium text-blue-700">AI-Generated</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-blue-700">Editable</span>
                </div>
              </div>
              <p className="text-gray-600">
                Professional memo for Design Tools consolidation opportunity across SCBX Group
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <i className="fas fa-file-pdf mr-2 text-red-500"></i>
                Export PDF
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <i className="fas fa-paper-plane mr-2 text-blue-500"></i>
                Send for Review
              </button>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <i className="fas fa-save mr-2"></i>
                Save Draft
              </button>
            </div>
          </div>
        </div>

        {/* Memo Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Memo Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              {/* Editor Toolbar */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button className="px-3 py-1 text-sm font-medium rounded-md bg-white text-gray-900 shadow-sm">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900">
                      Preview
                    </button>
                  </div>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                      <i className="fas fa-bold text-sm"></i>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                      <i className="fas fa-italic text-sm"></i>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                      <i className="fas fa-underline text-sm"></i>
                    </button>
                  </div>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                      <i className="fas fa-list-ul text-sm"></i>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                      <i className="fas fa-table text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Memo Content */}
              <div className="p-8 min-h-[600px]">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">MEMORANDUM</h1>
                  <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 text-sm">
                  <div className="flex">
                    <span className="font-semibold w-16">TO:</span>
                    <span className="text-gray-700">SCBX Group Executive Committee</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-16">DATE:</span>
                    <span className="text-gray-700">October 21, 2025</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-16">FROM:</span>
                    <span className="text-gray-700">David Kim, Group CTO</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-16">CC:</span>
                    <span className="text-gray-700">CFO, Subsidiary CTOs</span>
                  </div>
                  <div className="flex col-span-2">
                    <span className="font-semibold w-16">RE:</span>
                    <span className="text-gray-700 font-medium">
                      Design Tools Consolidation - Strategic Cost Optimization Initiative
                    </span>
                  </div>
                </div>

                <hr className="border-gray-300 mb-8" />

                <div className="space-y-8 text-gray-700 leading-relaxed">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Executive Summary</h2>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <i className="fas fa-piggy-bank text-green-600"></i>
                        <span className="font-semibold text-green-800">
                          Projected Annual Savings: ฿3.2M (31% cost reduction)
                        </span>
                      </div>
                    </div>
                    <p>
                      This memo presents a strategic opportunity to consolidate design software across SCBX
                      Group&apos;s 8 subsidiaries. Through standardization on Adobe Creative Cloud Enterprise, we
                      can achieve significant cost savings while improving collaboration and operational
                      efficiency. The consolidation affects 156 design professionals across our organization and
                      requires a 6-month implementation timeline.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Current State Analysis</h2>
                    <p className="mb-4">Our analysis reveals significant fragmentation in design tool procurement:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Three different design platforms across 8 subsidiaries</li>
                      <li>Inconsistent licensing models and pricing structures</li>
                      <li>Limited cross-subsidiary collaboration capabilities</li>
                      <li>Redundant training and support costs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Generated:</span>
                  <span className="font-medium">Oct 21, 4:32 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence Score:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }} />
                    </div>
                    <span className="font-medium text-green-600">94%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Word Count:</span>
                  <span className="font-medium">1,247</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Suggestions</h3>
              <div className="space-y-3">
                {[
                  { color: 'blue', icon: 'fa-lightbulb', title: 'Add Market Research', text: 'Consider adding industry benchmarks for design tool consolidation' },
                  { color: 'yellow', icon: 'fa-chart-line', title: 'Enhance Metrics', text: 'Include productivity metrics and collaboration KPIs' },
                  { color: 'green', icon: 'fa-users', title: 'Stakeholder Input', text: 'Consider adding quotes from subsidiary design leads' },
                ].map((suggestion, idx) => (
                  <div key={idx} className={`bg-${suggestion.color}-50 border border-${suggestion.color}-200 rounded-lg p-3`}>
                    <div className="flex items-start space-x-2">
                      <i className={`fas ${suggestion.icon} text-${suggestion.color}-600 text-sm mt-1`}></i>
                      <div>
                        <p className={`text-sm font-medium text-${suggestion.color}-900`}>{suggestion.title}</p>
                        <p className={`text-xs text-${suggestion.color}-700 mt-1`}>{suggestion.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tone & Style</h3>
              <div className="space-y-2">
                {['professional', 'concise', 'detailed'].map((toneOption) => (
                  <label key={toneOption} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="tone"
                      value={toneOption}
                      checked={tone === toneOption}
                      onChange={(e) => setTone(e.target.value)}
                      className="text-primary-600"
                    />
                    <span className="text-sm font-medium capitalize">{toneOption}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

