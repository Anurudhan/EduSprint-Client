import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search courses...",
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value);

  // Update internal state when props change
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounce effect
  useEffect(() => {
    const timerId = setTimeout(() => {
      // Only call onChange if the value has actually changed
      if (inputValue !== value) {
        onChange(inputValue);
      }
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(timerId);
    };
  }, [inputValue, onChange, value]);

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};