"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { getCompareIds, subscribeCompareList, clearCompare, MAX_COMPARE } from "@/lib/compare-list";

export function CompareBar() {
  const ids = useSyncExternalStore(subscribeCompareList, getCompareIds, () => []);

  if (ids.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className="text-sm font-medium text-foreground/80">
          {ids.length} of {MAX_COMPARE} restaurants selected to compare
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => clearCompare()}
            className="text-sm font-semibold text-foreground/60 hover:text-foreground"
          >
            Clear
          </button>
          <Link
            href={`/compare?ids=${ids.join(",")}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors ${
              ids.length >= 2 ? "bg-primary hover:bg-primary-dark" : "pointer-events-none bg-primary/40"
            }`}
          >
            Compare {ids.length >= 2 ? `(${ids.length})` : "— pick 1 more"}
          </Link>
        </div>
      </div>
    </div>
  );
}
