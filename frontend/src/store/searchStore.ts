import { create } from "zustand";

interface SearchStore {
  query: string;
  setQuery: (value: string) => void;
  clearQuery: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  setQuery: (value) => set({ query: value }),
  clearQuery: () => set({ query: "" }),
}));
