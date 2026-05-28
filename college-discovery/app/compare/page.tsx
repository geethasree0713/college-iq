"use client";
import { useCompareStore } from "@/store";
import { formatCurrency, formatPackage, cn } from "@/utils";
import Button from "@/components/ui/Button";
import { StarRating } from "@/components/ui";
import Link from "next/link";
import { ArrowLeft, GitCompare, MapPin, X } from "lucide-react";

const COMPARE_ROWS = [
  { label: "Location", key: "location" },
  { label: "Type", key: "type" },
  { label: "Established", key: "established" },
  { label: "NIRF Ranking", key: "ranking" },
  { label: "Rating", key: "rating" },
  { label: "B.Tech Fees/yr", key: "fees_btech" },
  { label: "M.Tech Fees/yr", key: "fees_mtech" },
  { label: "MBA Fees/yr", key: "fees_mba" },
  { label: "Avg Package", key: "avg_package" },
  { label: "Highest Package", key: "highest_package" },
  { label: "Placement Rate", key: "placement_rate" },
  { label: "Courses", key: "courses" },
  { label: "Accreditation", key: "accreditation" },
];

function getValue(college: import("@/types").College, key: string) {
  switch (key) {
    case "location": return `${college.location}, ${college.state}`;
    case "type": return college.type;
    case "established": return college.established.toString();
    case "ranking": return `#${college.ranking}`;
    case "rating": return college.rating.toString();
    case "fees_btech": return formatCurrency(college.fees.btech) + "/yr";
    case "fees_mtech": return formatCurrency(college.fees.mtech) + "/yr";
    case "fees_mba": return formatCurrency(college.fees.mba) + "/yr";
    case "avg_package": return formatPackage(college.placements.averagePackage);
    case "highest_package": return formatPackage(college.placements.highestPackage);
    case "placement_rate": return `${college.placements.placementRate}%`;
    case "courses": return college.courses.join(", ");
    case "accreditation": return college.accreditation.join(", ");
    default: return "—";
  }
}

function getBest(colleges: import("@/types").College[], key: string): string | null {
  if (colleges.length < 2) return null;
  switch (key) {
    case "ranking": return colleges.reduce((a, b) => a.ranking < b.ranking ? a : b).id;
    case "rating": return colleges.reduce((a, b) => a.rating > b.rating ? a : b).id;
    case "avg_package": return colleges.reduce((a, b) => a.placements.averagePackage > b.placements.averagePackage ? a : b).id;
    case "placement_rate": return colleges.reduce((a, b) => a.placements.placementRate > b.placements.placementRate ? a : b).id;
    case "fees_btech": return colleges.reduce((a, b) => a.fees.btech < b.fees.btech ? a : b).id;
    default: return null;
  }
}

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  if (compareList.length < 2) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <GitCompare className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-3">Compare Colleges</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Select at least 2 colleges from the listing to compare them side-by-side.
        </p>
        <Link href="/colleges">
          <Button>Browse Colleges</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <Link href="/colleges" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to colleges
          </Link>
          <h1 className="text-2xl font-black text-slate-900">College Comparison</h1>
          <p className="text-slate-500 text-sm">Comparing {compareList.length} colleges</p>
        </div>
        <Button variant="danger" size="sm" onClick={clearCompare}>
          Clear All
        </Button>
      </div>

      {/* College headers */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid border-b border-slate-100" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
          <div className="p-4 bg-slate-50" />
          {compareList.map((college) => (
            <div key={college.id} className="p-4 text-center relative border-l border-slate-100">
              <button
                onClick={() => removeFromCompare(college.id)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <img
                src={college.image}
                alt={college.name}
                className="w-full h-28 object-cover rounded-xl mb-3"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80`; }}
              />
              <Link href={`/colleges/${college.id}`} className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-sm leading-snug block">
                {college.name}
              </Link>
              <div className="flex items-center justify-center gap-1 mt-1.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-400">{college.location}</span>
              </div>
              <div className="flex items-center justify-center gap-1 mt-1.5">
                <StarRating rating={college.rating} />
                <span className="text-xs font-bold text-slate-600">{college.rating}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison rows */}
        {COMPARE_ROWS.map((row, i) => {
          const bestId = getBest(compareList, row.key);
          return (
            <div
              key={row.key}
              className={cn(
                "grid border-b border-slate-50",
                i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              )}
              style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}
            >
              <div className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center">
                {row.label}
              </div>
              {compareList.map((college) => {
                const isWinner = bestId === college.id;
                return (
                  <div
                    key={college.id}
                    className={cn(
                      "px-5 py-3.5 text-sm text-center border-l border-slate-100 flex items-center justify-center",
                      isWinner && "text-emerald-700 font-bold"
                    )}
                  >
                    {isWinner && (
                      <span className="mr-1.5 text-emerald-500 text-xs">✓</span>
                    )}
                    {getValue(college, row.key)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
