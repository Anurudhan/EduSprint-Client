import React, { useCallback, useEffect, useState } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { PriceFilter } from './filter/PriceFilter';
import { LevelFilter } from './filter/LevelFilter';
import { FilterState } from '../../types/ICourse';
import { getAllCategory } from '../../redux/store/actions/admin';
import { useAppDispatch } from '../../hooks/hooks';
import { Category } from '../../types/ICategory';
import { debounce } from '../../utilities/debouncer/debounce';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
  const dispatch = useAppDispatch();
  const [categories, setCategories] = useState<Category[]>([]);
  
 // Debounce the request to prevent multiple rapid calls
 const fetchCategories = async () => {
  try {
    const response = await dispatch(getAllCategory({ page: 1, limit: 1000 }));
    if (response.payload.success) {
      setCategories(response.payload.data.categories);
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

// Debounce the fetchCategories function
const debouncedFetchCategories = useCallback(debounce(fetchCategories, 300), [dispatch]);

useEffect(() => {
  debouncedFetchCategories();
  return () => debouncedFetchCategories.cancel();
}, [debouncedFetchCategories]);



  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span>Filters</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select
                value={filters.category}
                onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                className="mt-1 w-full p-2 text-sm border rounded-md dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <PriceFilter filters={filters} onFilterChange={onFilterChange} />
            
            <LevelFilter filters={filters} onFilterChange={onFilterChange} />

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Rating</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => onFilterChange({ ...filters, minRating: Number(e.target.value) })}
                  className="w-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem]">{filters.minRating}★</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
