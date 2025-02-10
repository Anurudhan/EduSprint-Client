import React from 'react';
import { DateRangeSelector } from './DateRangeSelector';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  range: 'day' | 'month' | 'year';
  setRange: (range: 'day' | 'month' | 'year') => void;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  range,            
  setRange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <DateRangeSelector range={range} setRange={setRange} />
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};