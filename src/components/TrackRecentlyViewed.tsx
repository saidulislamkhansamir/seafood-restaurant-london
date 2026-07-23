"use client";

import { useEffect } from "react";
import { recordRecentlyViewed, type RecentlyViewedEntry } from "@/lib/recently-viewed";

export function TrackRecentlyViewed({ entry }: { entry: RecentlyViewedEntry }) {
  useEffect(() => {
    recordRecentlyViewed(entry);
    // Only record once per mount (i.e. once per page visit) — entry fields
    // don't change after the restaurant data has loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.id]);

  return null;
}
