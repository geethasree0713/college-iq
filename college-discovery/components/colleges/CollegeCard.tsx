"use client";
import Link from "next/link";
import { College } from "@/types";
import { useCompareStore, useSavedStore } from "@/store";
import { Card, Badge, StarRating } from "@/components/ui";
import { formatCurrency, formatPackage, cn } from "@/utils";
import { Bookmark, GitCompare, MapPin, Trophy, TrendingUp } from "lucide-react";

interface CollegeCardProps {
  college: College;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const { toggleSaved, isSaved } = useSavedStore();
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompareStore();
  const saved = isSaved(college.id);
  const inCompare = isInCompare(college.id);
  const canAddCompare = compareList.length < 3 || inCompare;

  const typeBadgeVariant: Record<string, "government" | "private" | "deemed"> = {
    Government: "government",
    Private: "private",
    Deemed: "deemed",
  };

  return (
    <Card hover className="overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden h-44">
        <img
          src={college.image}
          alt={college.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Ranking badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-bold text-slate-800">#{college.ranking}</span>
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => { e.preventDefault(); toggleSaved(college.id); }}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm",
              saved ? "bg-indigo-600 text-white" : "bg-white/90 text-slate-600 hover:bg-indigo-50"
            )}
            title={saved ? "Remove from saved" : "Save college"}
          >
            <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              inCompare ? removeFromCompare(college.id) : addToCompare(college);
            }}
            disabled={!canAddCompare}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm",
              inCompare
                ? "bg-emerald-600 text-white"
                : canAddCompare
                ? "bg-white/90 text-slate-600 hover:bg-emerald-50"
                : "bg-white/50 text-slate-400 cursor-not-allowed"
            )}
            title={inCompare ? "Remove from compare" : "Add to compare"}
          >
            <GitCompare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <Link href={`/colleges/${college.id}`} className="block p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-700 transition-colors">
              {college.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              <span>{college.location}, {college.state}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge variant={typeBadgeVariant[college.type]}>{college.type}</Badge>
          <div className="flex items-center gap-1">
            <StarRating rating={college.rating} />
            <span className="text-xs font-semibold text-slate-700">{college.rating}</span>
            <span className="text-xs text-slate-400">({college.reviewCount})</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-0.5">B.Tech Fees</p>
            <p className="text-sm font-bold text-slate-800">{formatCurrency(college.fees.btech)}/yr</p>
          </div>
          <div className="text-center border-x border-slate-100">
            <p className="text-xs text-slate-400 mb-0.5">Avg Package</p>
            <p className="text-sm font-bold text-emerald-600">{formatPackage(college.placements.averagePackage)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-0.5">Placement</p>
            <div className="flex items-center justify-center gap-0.5">
              <TrendingUp className="w-3 h-3 text-indigo-500" />
              <p className="text-sm font-bold text-indigo-600">{college.placements.placementRate}%</p>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
