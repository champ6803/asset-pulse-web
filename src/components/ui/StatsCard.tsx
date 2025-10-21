import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    value: string;
    positive?: boolean;
  };
  icon: string;
  iconBgColor?: string;
  iconColor?: string;
}

export default function StatsCard({
  title,
  value,
  trend,
  icon,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <i className={`fas fa-arrow-${trend.direction} ${
                trend.positive === false
                  ? 'text-red-500'
                  : trend.positive === true
                  ? 'text-green-500'
                  : trend.direction === 'up'
                  ? 'text-green-500'
                  : 'text-red-500'
              } text-sm mr-1`}></i>
              <span className={`text-sm ${
                trend.positive === false
                  ? 'text-red-600'
                  : trend.positive === true
                  ? 'text-green-600'
                  : trend.direction === 'up'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={`h-12 w-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <i className={`${icon} ${iconColor} text-xl`}></i>
        </div>
      </div>
    </div>
  );
}

