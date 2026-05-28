"use client";
import { use, useState } from "react";
import { useCollege, useReviews } from "@/hooks/useColleges";
import { useCompareStore, useSavedStore } from "@/store";
import Button from "@/components/ui/Button";
import { Badge, StarRating, Skeleton, ErrorState } from "@/components/ui";
import { formatCurrency, formatPackage, getInitials, cn } from "@/utils";
import {
  ArrowLeft, Bookmark, GitCompare, MapPin, Globe, Phone, Mail,
  TrendingUp, Award, BookOpen, Building2, Users, Star
} from "lucide-react";
import Link from "next/link";
import { College } from "@/types";

const typeBadge: Record<string, "government" | "private" | "deemed"> = {
  Government: "government", Private: "private", Deemed: "deemed",
};

const TABS = ["Overview", "Fees", "Placements", "Reviews"];

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: college, isLoading, isError } = useCollege(id);
  const { data: reviews } = useReviews(id);
  const { toggleSaved, isSaved } = useSavedStore();
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompareStore();
  const [activeTab, setActiveTab] = useState("Overview");

  if (isLoading) return <DetailSkeleton />;
  if (isError || !college) return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <ErrorState description="College not found or an error occurred." />
    </div>
  );

  const saved = isSaved(college.id);
  const inCompare = isInCompare(college.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Back */}
      <Link href="/colleges" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to colleges
      </Link>

      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="relative h-56 sm:h-72">
          <img
            src={college.image}
            alt={college.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80`; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant={typeBadge[college.type]}>{college.type}</Badge>
                <Badge variant="info">Est. {college.established}</Badge>
                {college.accreditation.map((a) => (
                  <Badge key={a} variant="success">{a}</Badge>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{college.name}</h1>
              <div className="flex items-center gap-1.5 text-white/80 text-sm mt-1">
                <MapPin className="w-4 h-4" />
                {college.location}, {college.state}
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100">
          {[
            { label: "NIRF Rank", value: `#${college.ranking}`, icon: Award, color: "text-amber-500" },
            { label: "Rating", value: college.rating.toString(), icon: Star, color: "text-indigo-600" },
            { label: "Avg Package", value: formatPackage(college.placements.averagePackage), icon: TrendingUp, color: "text-emerald-600" },
            { label: "Placement %", value: `${college.placements.placementRate}%`, icon: Users, color: "text-blue-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white p-4 text-center">
              <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
              <p className="text-lg font-black text-slate-900">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <Button
          variant={saved ? "primary" : "outline"}
          onClick={() => toggleSaved(college.id)}
        >
          <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
          {saved ? "Saved" : "Save College"}
        </Button>
        <Button
          variant={inCompare ? "secondary" : "outline"}
          onClick={() => inCompare ? removeFromCompare(college.id) : addToCompare(college)}
          disabled={!inCompare && compareList.length >= 3}
        >
          <GitCompare className="w-4 h-4" />
          {inCompare ? "In Compare" : "Compare"}
        </Button>
        <a href={college.website} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost">
            <Globe className="w-4 h-4" /> Website
          </Button>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px",
              activeTab === tab
                ? "text-indigo-600 border-indigo-600"
                : "text-slate-500 border-transparent hover:text-slate-800"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Overview" && <OverviewTab college={college} />}
      {activeTab === "Fees" && <FeesTab college={college} />}
      {activeTab === "Placements" && <PlacementsTab college={college} />}
      {activeTab === "Reviews" && <ReviewsTab reviews={reviews || []} />}
    </div>
  );
}

function OverviewTab({ college }: { college: College }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" /> About
        </h2>
        <p className="text-slate-600 leading-relaxed">{college.description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" /> Courses Offered
          </h2>
          <div className="flex flex-wrap gap-2">
            {college.courses.map((c) => (
              <span key={c} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">{c}</span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" /> Facilities
          </h2>
          <div className="flex flex-wrap gap-2">
            {college.facilities.map((f) => (
              <span key={f} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">{f}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-indigo-500" /> Contact
        </h2>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-slate-400" /> <a href={college.website} className="text-indigo-600 hover:underline">{college.website}</a></div>
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {college.phone}</div>
          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {college.email}</div>
        </div>
      </div>
    </div>
  );
}

function FeesTab({ college }: { college: College }) {
  const feeItems = [
    { course: "B.Tech", annual: college.fees.btech, total: college.fees.btech * 4 },
    { course: "M.Tech", annual: college.fees.mtech, total: college.fees.mtech * 2 },
    { course: "MBA", annual: college.fees.mba, total: college.fees.mba * 2 },
  ];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {["Course", "Annual Fees", "Total Fees", "Duration"].map((h) => (
              <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {feeItems.map(({ course, annual, total }) => (
            <tr key={course} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-semibold text-slate-800">{course}</td>
              <td className="px-6 py-4 text-slate-600">{formatCurrency(annual)}/year</td>
              <td className="px-6 py-4 font-bold text-indigo-600">{formatCurrency(total)}</td>
              <td className="px-6 py-4 text-slate-500">{course === "B.Tech" ? "4 years" : "2 years"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlacementsTab({ college }: { college: College }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Average Package", value: formatPackage(college.placements.averagePackage), color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
          { label: "Highest Package", value: formatPackage(college.placements.highestPackage), color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
          { label: "Placement Rate", value: `${college.placements.placementRate}%`, color: "bg-amber-50 text-amber-700 border-amber-100" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl border p-5 text-center ${color}`}>
            <p className="text-3xl font-black">{value}</p>
            <p className="text-sm font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-4">Top Recruiters</h3>
        <div className="flex flex-wrap gap-3">
          {college.placements.topRecruiters.map((r) => (
            <span key={r} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700">{r}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewsTab({ reviews }: { reviews: import("@/types").Review[] }) {
  if (reviews.length === 0) return (
    <div className="text-center py-16 text-slate-400">No reviews yet for this college.</div>
  );
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
              {getInitials(review.author)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{review.author}</p>
                  <p className="text-xs text-slate-400">{review.course} · {review.year}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <StarRating rating={review.rating} />
                  <span className="text-sm font-bold text-slate-700">{review.rating}/5</span>
                </div>
              </div>
              <h4 className="font-semibold text-slate-800 mt-3 mb-1">{review.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{review.body}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-600 mb-2">Pros</p>
                  <ul className="space-y-1">
                    {review.pros.map((p) => (
                      <li key={p} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-emerald-500 mt-0.5">+</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-500 mb-2">Cons</p>
                  <ul className="space-y-1">
                    {review.cons.map((c) => (
                      <li key={c} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-red-400 mt-0.5">-</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-72 w-full rounded-2xl" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  );
}
