"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFeaturedColleges } from "@/hooks/useColleges";
import CollegeCard from "@/components/colleges/CollegeCard";
import Button from "@/components/ui/Button";
import { CollegeCardSkeleton } from "@/components/ui";
import { useFilterStore } from "@/store";
import { Search, ArrowRight, GraduationCap, BarChart3, Bookmark, Star, TrendingUp, Building2 } from "lucide-react";

const HERO_STATS = [
  { label: "Colleges Listed", value: "1,200+", icon: Building2 },
  { label: "Student Reviews", value: "50K+", icon: Star },
  { label: "Placement Partners", value: "500+", icon: TrendingUp },
];

export default function HomePage() {
  const router = useRouter();
  const { setFilter } = useFilterStore();
  const { data: featured, isLoading } = useFeaturedColleges();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setFilter("search", query);
    router.push("/colleges");
  }

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-indigo-200 mb-6">
            <GraduationCap className="w-4 h-4" />
            India's Smartest College Discovery Platform
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
              Dream College
            </span>
          </h1>
          <p className="text-lg text-indigo-200 mb-10 max-w-2xl mx-auto">
            Search, compare and shortlist from 1200+ top colleges across India. Make the best decision for your future.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-xl">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search college name, location, or state..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 text-slate-900 text-sm placeholder-slate-400 outline-none bg-transparent"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-xl flex-shrink-0">
                Search <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Quick links */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap text-sm">
            <span className="text-indigo-300">Popular:</span>
            {["IIT Bombay", "NIT Trichy", "BITS Pilani", "VIT Vellore"].map((name) => (
              <button
                key={name}
                onClick={() => { setFilter("search", name); router.push("/colleges"); }}
                className="text-white/80 hover:text-white underline underline-offset-2 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-3 gap-6">
            {HERO_STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-indigo-300" />
                  <span className="text-2xl font-black text-white">{value}</span>
                </div>
                <p className="text-xs text-indigo-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Search, title: "Smart Search", desc: "Filter by fees, rating, location, courses and more", color: "bg-blue-50 text-blue-600" },
            { icon: BarChart3, title: "Side-by-Side Compare", desc: "Compare up to 3 colleges on fees, placements and ratings", color: "bg-emerald-50 text-emerald-600" },
            { icon: Bookmark, title: "Save Colleges", desc: "Build your shortlist and access it anytime", color: "bg-purple-50 text-purple-600" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
              <p className="text-slate-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Top Ranked Colleges</h2>
            <p className="text-slate-500 text-sm mt-1">Based on NIRF rankings & student reviews</p>
          </div>
          <Link href="/colleges">
            <Button variant="outline" size="sm">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CollegeCardSkeleton key={i} />)
            : featured?.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
        </div>
      </section>
    </div>
  );
}
