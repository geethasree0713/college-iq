"use client";
import { useSavedStore } from "@/store";
import { MOCK_COLLEGES } from "@/lib/data";
import CollegeCard from "@/components/colleges/CollegeCard";
import { EmptyState } from "@/components/ui";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Bookmark, Search } from "lucide-react";

export default function SavedPage() {
  const { savedIds } = useSavedStore();
  const savedColleges = MOCK_COLLEGES.filter((c) => savedIds.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <Bookmark className="w-7 h-7 text-indigo-600 fill-current" />
          Saved Colleges
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {savedColleges.length} college{savedColleges.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {savedColleges.length === 0 ? (
        <EmptyState
          title="No saved colleges yet"
          description="Bookmark colleges from the listing to see them here"
          icon={<Bookmark className="w-8 h-8" />}
          action={
            <Link href="/colleges">
              <Button>
                <Search className="w-4 h-4" /> Browse Colleges
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {savedColleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      )}
    </div>
  );
}
