"use client";

import { useState } from "react";
import { useGHLDataStore } from "@/store/useGHLDataStore";

const AdminSearchInput = () => {
  const { setSearchTerm } = useGHLDataStore();
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    setSearchTerm("");
  };

  return (
    <div className="not-prose relative flex-1">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search events..."
        className="w-full rounded-lg border-2 border-gray-300 px-4 py-4 pr-12 text-base text-gray-800 placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0 transition-colors"
      />
      {value && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="not-prose absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-gray-300 hover:bg-gray-500 text-gray-700 hover:text-white text-sm font-bold transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default AdminSearchInput;
