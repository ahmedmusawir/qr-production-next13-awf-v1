import { GHLEvent } from "@/types/events";
import { GHLCustomField } from "@/types/fields";
import { create } from "zustand";

interface AdminState {
  // Raw data — source of truth, never derived
  allEvents: GHLEvent[];
  fields: GHLCustomField[];

  // UI state — search + pagination
  searchTerm: string;
  currentPage: number;
  pageSize: number;

  // Setters
  setAllEvents: (events: GHLEvent[]) => void;
  setFields: (fields: GHLCustomField[]) => void;
  setSearchTerm: (term: string) => void; // resets currentPage to 1
  setCurrentPage: (page: number) => void;
}

export const useGHLDataStore = create<AdminState>((set) => ({
  allEvents: [],
  fields: [],
  searchTerm: "",
  currentPage: 1,
  pageSize: 4,

  setAllEvents: (allEvents) => set({ allEvents }),
  setFields: (fields) => set({ fields }),
  setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
}));
