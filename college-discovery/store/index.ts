import { create } from "zustand";
import { persist } from "zustand/middleware";
import { College, FilterState } from "@/types";

// ─── Compare Store ────────────────────────────────────────────────────────────
interface CompareStore {
  compareList: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  compareList: [],
  addToCompare: (college) =>
    set((state) => {
      if (state.compareList.length >= 3) return state;
      if (state.compareList.find((c) => c.id === college.id)) return state;
      return { compareList: [...state.compareList, college] };
    }),
  removeFromCompare: (id) =>
    set((state) => ({
      compareList: state.compareList.filter((c) => c.id !== id),
    })),
  clearCompare: () => set({ compareList: [] }),
  isInCompare: (id) => get().compareList.some((c) => c.id === id),
}));

// ─── Saved Colleges Store ─────────────────────────────────────────────────────
interface SavedStore {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useSavedStore = create<SavedStore>()(
  persist(
    (set, get) => ({
      savedIds: [],
      toggleSaved: (id) =>
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((s) => s !== id)
            : [...state.savedIds, id],
        })),
      isSaved: (id) => get().savedIds.includes(id),
    }),
    { name: "saved-colleges" }
  )
);

// ─── Filter Store ─────────────────────────────────────────────────────────────
const defaultFilters: FilterState = {
  search: "",
  type: [],
  state: [],
  minFees: 0,
  maxFees: 1000000,
  minRating: 0,
  courses: [],
  sortBy: "ranking",
};

interface FilterStore {
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: defaultFilters,
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
