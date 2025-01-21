import { FilterState, Level } from '../../../types/ICourse';

interface LevelFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function LevelFilter({ filters, onFilterChange }: LevelFilterProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Level</label>
      <select
        value={filters.level}
        onChange={(e) => onFilterChange({ ...filters, level: e.target.value as Level | '' })}
        className="mt-1 w-full p-2 text-sm border rounded-md dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">All Levels</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
    </div>
  );
}