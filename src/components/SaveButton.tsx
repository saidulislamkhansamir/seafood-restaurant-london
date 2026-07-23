"use client";

import { useState, useSyncExternalStore } from "react";
import {
  isRestaurantSaved,
  toggleSavedRestaurant,
  subscribeSavedRestaurants,
} from "@/lib/saved-restaurants";

function noopSubscribe() {
  return () => {};
}

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

  // Until mounted, `saved` above is always a guess (false) — the real value
  // only exists in this browser's localStorage, which we can't read during
  // SSR. Rather than show "Save" and then pop to "Saved" once we know the
  // truth, fade the button in only once we already know it — no flash of
  // wrong content, just a brief, gentle appearance.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Bumping this key remounts the heart icon, which restarts the CSS "pop"
  // animation — a small, satisfying confirmation when saving (not on
  // un-saving, which would feel odd to celebrate).
  const [pulseKey, setPulseKey] = useState(0);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggleSavedRestaurant(restaurantId);
    if (nowSaved) setPulseKey((k) => k + 1);
  }

  // The chip (label) variant's circle backdrop itself flips color (pale <->
  // solid red), so the heart just needs to contrast with that. The icon-only
  // card overlay always sits on a plain white circle, so the heart alone
  // must carry the saved/unsaved state: solid red when saved, hollow red
  // outline when not — a white heart there would be invisible on white.
  const heartFill = label ? (saved ? "white" : "#e11d48") : saved ? "#e11d48" : "white";
  const heartStroke = label ? (saved ? "white" : "#e11d48") : "#e11d48";

  const heart = (
    <svg
      key={pulseKey}
      width="12"
      height="12"
      viewBox="0 0 20 20"
      fill={heartFill}
      stroke={heartStroke}
      strokeWidth="1.6"
      className={pulseKey > 0 ? "animate-pop" : ""}
      aria-hidden="true"
    >
      <path d="M10 17.5s-6.5-4.1-8.5-8.1C.3 6.6 1.6 3.5 4.5 3c1.9-.3 3.6.6 4.5 2.2C9.9 3.6 11.6 2.7 13.5 3c2.9.5 4.2 3.6 3 6.4-2 4-8.5 8.1-8.5 8.1z" />
    </svg>
  );

  if (!label) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={saved ? "Remove from saved" : "Save this restaurant"}
        aria-pressed={saved}
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-90 ${
          mounted ? "opacity-100" : "opacity-0"
        } ${className}`}
      >
        {heart}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from saved" : "Save this restaurant"}
      aria-pressed={saved}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-white py-1 pl-1 pr-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${
        mounted ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-200 ${
          saved ? "bg-red-500" : "bg-red-50"
        }`}
      >
        {heart}
      </span>
      <span className="text-xs font-semibold text-foreground">{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
