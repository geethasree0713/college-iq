"use client";
import { useEffect, useRef, useState } from "react";
import { useColleges } from "@/hooks/useColleges";
import { useFilterStore } from "@/store";
import CollegeCard from "@/components/colleges/CollegeCard";
import FilterSidebar from "@/components/colleges/FilterSidebar";
import Button from "@/components/ui/Button";
import { CollegeCardSkeleton, EmptyState, ErrorState, Pagination, Select } from "@/components/ui";
import Input from "@/components/ui/Input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { debounce } from "@/utils";

const SORT_OPTIONS = [
  { value: "ranking", label: "Sort by Ranking" },
  { value: "rating", label: "Sort by Rating" },
  { value: "fees_asc", label: "Fees: Low to High" },
  { value: "fees_desc", label: "Fees: High to Low" },
  { value: "name", label: "Sort by Name" },
];

export default function CollegesPage() {
  const { filters, setFilter } = useFilterStore();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [mobileFilters, setMobileFilters] = useState(false);

  const { data, isLoading, isError, isFetching } = useColleges(filters, page);

  // Debounced search
  const debouncedSearch = useRef(
    debounce((val: string) => {
      setFilter("search", val);
      setPage(1);
    }, 300)
  ).current;

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  }

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Browse Colleges</h1>
        <p className="text-slate-500 text-sm mt-1">
          {data ? `${data.total} colleges found` : "Searching..."}
        </p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex-1 min-w-48">
          <Input
            placeholder="Search college name, city..."
            value={searchInput}
            onChange={handleSearchChange}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              searchInput ? (
                <button onClick={() => { setSearchInput(""); setFilter("search", ""); }}>
                  <X className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
                </button>
              ) : null
            }
          />
        </div>
        <Select
          options={SORT_OPTIONS}
          value={filters.sortBy}
          onChange={(e) => setFilter("sortBy", e.target.value as typeof filters.sortBy)}
          className="w-auto min-w-48"
        />
        <Button
          variant="secondary"
          className="md:hidden"
          onClick={() => setMobileFilters(true)}
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-24">
            <FilterSidebar />
          </div>
        </div>

        {/* Mobile filter overlay */}
        {mobileFilters && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl p-5 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900">Filters</h3>
                <button onClick={() => setMobileFilters(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <FilterSidebar />
              <Button fullWidth className="mt-6" onClick={() => setMobileFilters(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* College grid */}
        <div className="flex-1">
          {isError ? (
            <ErrorState description="Failed to load colleges. Please try again." />
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <CollegeCardSkeleton key={i} />)}
            </div>
          ) : data?.colleges.length === 0 ? (
            <EmptyState
              title="No colleges found"
              description="Try adjusting your filters or search terms"
              action={
                <Button variant="outline" onClick={() => { useFilterStore.getState().resetFilters(); setSearchInput(""); }}>
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <>
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity ${isFetching ? "opacity-70" : "opacity-100"}`}>
                {data?.colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              {data && data.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    page={page}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
