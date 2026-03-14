"use client";

import { useGHLDataStore } from "@/store/useGHLDataStore";

const AdminSearchInput = () => {
  const { searchTerm, setSearchTerm } = useGHLDataStore();

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search events..."
      className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-4 text-base text-gray-800 placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0 transition-colors"
    />
  );
};

export default AdminSearchInput;
