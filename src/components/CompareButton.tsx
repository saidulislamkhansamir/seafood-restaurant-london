"use client";

import { useSyncExternalStore } from "react";
import { isInCompare, subscribeCompareList, toggleCompare, MAX_COMPARE } from "@/lib/compare-list";

export function CompareButton({ restaurantId, className = "" }: { restaurantId: string; className?: string }) {
  const inCompare = useSyncExternalStore(
    subscribeCompareList,
    () => isInCompare(restaurantId),
    () => false
  );

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(restaurantId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={inCompare}
      title={inCompare ? "Remove from compare" : `Add to compare (up to ${MAX_COMPARE})`}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
        inCompare
          ? "border-primary bg-primary text-white"
          : "border-border bg-white/95 text-foreground/70 hover:border-primary hover:text-primary"
      } ${className}`}
    >
      <span
        className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${
          inCompare ? "border-white bg-white/20" : "border-foreground/40"
        }`}
        aria-hidden
      >
        {inCompare ? "✓" : ""}
      </span>
      Compare
    </button>
  );
}
