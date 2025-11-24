"use client";

import { useState } from "react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, any>) => void;
  placeholder?: string;
  filterOptions?: {
    label: string;
    key: string;
    type: "select" | "date" | "text";
    options?: { value: string; label: string }[];
  }[];
}

export default function SearchFilter({
  onSearch,
  onFilter,
  placeholder = "Search...",
  filterOptions = [],
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    onSearch("");
    onFilter({});
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {filterOptions.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {Object.keys(filters).length > 0 && (
              <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
        )}
        {(searchQuery || Object.keys(filters).length > 0) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Clear
          </button>
        )}
      </div>

      {showFilters && filterOptions.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filterOptions.map((option) => (
              <div key={option.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {option.label}
                </label>
                {option.type === "select" && option.options ? (
                  <select
                    value={filters[option.key] || ""}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All</option>
                    {option.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : option.type === "date" ? (
                  <input
                    type="date"
                    value={filters[option.key] || ""}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={filters[option.key] || ""}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                    placeholder={option.label}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

