import { FilterState } from "../../../types/ICourse";


interface PriceFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function PriceFilter({ filters, onFilterChange }: PriceFilterProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price Type</label>
        <select
          value={filters.priceType}
          onChange={(e) => onFilterChange({ ...filters, priceType: e.target.value as FilterState['priceType'] })}
          className="mt-1 w-full p-2 text-sm border rounded-md dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Prices</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {(!filters.priceType || filters.priceType === 'paid') && (
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                onFilterChange({ ...filters, minPrice: value });
              }}
              placeholder="Min"
              className="w-1/2 p-2 text-sm border rounded-md dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                onFilterChange({ ...filters, maxPrice: value });
              }}
              placeholder="Max"
              className="w-1/2 p-2 text-sm border rounded-md dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}