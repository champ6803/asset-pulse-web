"use client";

import { useEffect } from 'react';

interface AIRationaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: {
    name: string;
    category: string;
    tier: string;
    cost: number;
    relevanceScore: number;
    rationale: string;
    reasons: string[];
    features: string[];
  };
}

export default function AIRationaleModal({ isOpen, onClose, app }: AIRationaleModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 relative transform"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="p-8">
          {/* App Header */}
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
              <i className="fas fa-cube text-gray-600 text-2xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{app.name}</h2>
              <div className="flex items-center mt-1">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-3">
                  {app.category}
                </span>
                <span className="text-sm font-medium text-green-600">{app.relevanceScore}% Match</span>
              </div>
            </div>
          </div>

          {/* Why Recommended Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-lightbulb text-blue-600 mr-2"></i>
              Why Recommended
            </h3>
            <div className="space-y-3">
              {app.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Tier Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-star text-yellow-500 mr-2"></i>
              Recommended Tier
            </h3>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl font-bold text-gray-900">{app.tier}</h4>
                <span className="text-2xl font-bold text-green-600">{app.cost.toLocaleString()} THB/year</span>
              </div>
              <p className="text-gray-700 mb-4">{app.rationale}</p>
              <div className="grid grid-cols-2 gap-4">
                {app.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Confidence Breakdown */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Confidence Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'Job Requirements Match', percent: 98, color: 'bg-green-500' },
                { label: 'Peer Usage Similarity', percent: 95, color: 'bg-blue-500' },
                { label: 'Department Standard', percent: 92, color: 'bg-purple-500' },
              ].map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{metric.label}</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`${metric.color} h-2 rounded-full`}
                        style={{ width: `${metric.percent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{metric.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors">
              <i className="fas fa-external-link-alt mr-2"></i>
              Learn More About {app.name}
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <i className="fas fa-times mr-2"></i>
                Remove
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                <i className="fas fa-check mr-2"></i>
                Keep Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

