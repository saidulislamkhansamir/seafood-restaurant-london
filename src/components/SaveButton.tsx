"use client";

import { useSyncExternalStore } from "react";
import {
  isRestaurantSaved,
  toggleSavedRestaurant,
  subscribeSavedRestaurants,
} from "@/lib/saved-restaurants";

export function SaveButton({
  restaurantId,
  label = false,
  className = "",
}: {
  restaurantId: string;
  label?: boolean;
  className?: string;
}) {
  // useSyncExternalStore reads localStorage safely — server snapshot is
  // always false, so there's no hydration mismatch, and it re-renders
  // whenever any SaveButton on the page toggles this restaurant.
  const saved = useSyncExternalStore(
    subscribeSavedRestaurants,
    () => isRestaurantSaved(restaurantId),
    () => false
  );

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedRestaurant(restaurantId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from saved" : "Save this restaurant"}
      aria-pressed={saved}
      className={`inline-flex items-center gap-1.5 rounded-full ${
        label
          ? "border border-border bg-white px-3 py-1.5 text-sm font-semibold text-foreground hover:border-primary"
          : "h-8 w-8 items-center justify-center bg-white/90 shadow-sm hover:bg-white"
      } transition-colors ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill={saved ? "#e11d48" : "none"}
        stroke={saved ? "#e11d48" : "currentColor"}
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M10 17.5s-6.5-4.1-8.5-8.1C.3 6.6 1.6 3.5 4.5 3c1.9-.3 3.6.6 4.5 2.2C9.9 3.6 11.6 2.7 13.5 3c2.9.5 4.2 3.6 3 6.4-2 4-8.5 8.1-8.5 8.1z" />
      </svg>
      {label ? (saved ? "Saved" : "Save") : null}
    </button>
  );
}
