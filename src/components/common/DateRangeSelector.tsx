import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
  range: 'day' | 'month' | 'year';
  setRange: (range: 'day' | 'month' | 'year') => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ range, setRange }) => {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
      <Calendar className="w-4 h-4 text-gray-500 ml-2" />
      <div className="flex bg-gray-50 p-1 rounded-md">
        <button
          onClick={() => setRange('day')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            range === 'day'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-indigo-600'
          }`}
        >
          Day
        </button>
        <button
          onClick={() => setRange('month')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            range === 'month'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-indigo-600'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => setRange('year')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            range === 'year'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-indigo-600'
          }`}
        >
          Year
        </button>
      </div>
    </div>
  );
};