import { useState, useEffect, useRef } from "react";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceTime?: number;
  initialValue?: string;
  className?: string;
}

const SearchInput = ({
  placeholder = "Search...",
  onSearch,
  debounceTime = 300,
  initialValue = "",
  className = "",
}: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const onSearchRef = useRef(onSearch);

  // Keep the latest onSearch function in ref to avoid stale closures
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Update internal state when initialValue changes (from parent)
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Handle search debouncing
  useEffect(() => {
    // Skip the very first render to avoid triggering search on mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      onSearchRef.current(searchTerm);
    }, debounceTime);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [searchTerm, debounceTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        className="w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        aria-label="Search"
      />
    </div>
  );
};

export default SearchInput;