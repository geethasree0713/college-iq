"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCompareStore, useSavedStore } from "@/store";
import { cn } from "@/utils";
import { BarChart3, Bookmark, GraduationCap, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { compareList } = useCompareStore();
  const { savedIds } = useSavedStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/colleges", label: "Colleges" },
    { href: "/saved", label: "Saved", badge: savedIds.length },
    { href: "/compare", label: "Compare", badge: compareList.length },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              Collège<span className="text-indigo-600">IQ</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                  pathname.startsWith(link.href)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {link.label}
                {link.badge ? (
                  <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          <Link href="/" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>Home</Link>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium",
                pathname.startsWith(link.href) ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
              {link.badge ? (
                <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {link.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
