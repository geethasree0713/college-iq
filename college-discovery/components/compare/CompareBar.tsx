"use client";
import { useCompareStore } from "@/store";
import { useRouter } from "next/navigation";
import { X, GitCompare } from "lucide-react";
import Button from "@/components/ui/Button";
import { truncate } from "@/utils";

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();
  const router = useRouter();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <GitCompare className="w-4 h-4 text-indigo-600" />
          <span>Compare ({compareList.length}/3)</span>
        </div>

        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {compareList.map((college) => (
            <div
              key={college.id}
              className="flex items-center gap-2 bg-indigo-50 rounded-lg px-3 py-1.5 text-sm text-indigo-700 font-medium"
            >
              <span>{truncate(college.name, 20)}</span>
              <button
                onClick={() => removeFromCompare(college.id)}
                className="text-indigo-400 hover:text-indigo-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {Array.from({ length: 3 - compareList.length }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-400">
              Add college...
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={clearCompare} className="text-xs text-slate-500 hover:text-slate-700 underline">
            Clear all
          </button>
          <Button
            size="sm"
            onClick={() => router.push("/compare")}
            disabled={compareList.length < 2}
          >
            Compare Now
          </Button>
        </div>
      </div>
    </div>
  );
}
