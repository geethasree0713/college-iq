"use client";
import { useFilterStore } from "@/store";
import { INDIAN_STATES, COURSE_OPTIONS } from "@/lib/data";
import Button from "@/components/ui/Button";
import { cn } from "@/utils";
import { Filter, RotateCcw } from "lucide-react";

const TYPES = ["Government", "Private", "Deemed"];
const RATINGS = [4.5, 4.0, 3.5, 3.0];

export default function FilterSidebar() {
  const { filters, setFilter, resetFilters } = useFilterStore();

  function toggleArrayFilter(key: "type" | "state" | "courses", value: string) {
    const current = filters[key] as string[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilter(key, next);
  }

  return (
    <aside className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* College Type */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">College Type</h4>
        <div className="space-y-2">
          {TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={(filters.type as string[]).includes(type)}
                onChange={() => toggleArrayFilter("type", type)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {RATINGS.map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => setFilter("minRating", r)}
                className="w-4 h-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{r}★ & above</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fees Range */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">
          Max Annual Fees:{" "}
          <span className="text-indigo-600">
            {filters.maxFees < 1000000 ? `₹${(filters.maxFees / 100000).toFixed(0)}L` : "Any"}
          </span>
        </h4>
        <input
          type="range"
          min={50000}
          max={1000000}
          step={50000}
          value={filters.maxFees}
          onChange={(e) => setFilter("maxFees", Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>₹50K</span>
          <span>₹10L+</span>
        </div>
      </div>

      {/* State */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">State</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {INDIAN_STATES.slice(0, 10).map((state) => (
            <label key={state} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={(filters.state as string[]).includes(state)}
                onChange={() => toggleArrayFilter("state", state)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{state}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Courses */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Courses</h4>
        <div className="flex flex-wrap gap-2">
          {COURSE_OPTIONS.map((course) => (
            <button
              key={course}
              onClick={() => toggleArrayFilter("courses", course)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                (filters.courses as string[]).includes(course)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
              )}
            >
              {course}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
