// Recently viewed restaurants live in the browser only (localStorage), same
// pattern as saved-restaurants.ts — no account needed, and it stores just
// enough real, already-fetched data to render a small card without an
// extra query.
const STORAGE_KEY = "recentlyViewedRestaurants";
const MAX_ITEMS = 12;

export type RecentlyViewedEntry = {
  id: string;
  slug: string;
  name: string;
  photo_url: string | null;
  primary_category: string | null;
  location_area: string | null;
  price_range: string | null;
  rating: number | null;
  review_count: number | null;
};

const listeners = new Set<() => void>();

export function subscribeRecentlyViewed(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// See the matching comment in compare-list.ts: useSyncExternalStore needs
// the SAME array reference back when nothing changed, or it re-renders
// forever ("Maximum update depth exceeded") — this is what was crashing
// every page, since RecentlyViewedStrip mounts on the homepage.
let cachedRaw: string | null = null;
let cachedEntries: RecentlyViewedEntry[] = [];

function readEntries(): RecentlyViewedEntry[] {
  if (typeof window === "undefined") return cachedEntries;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedEntries;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedEntries = Array.isArray(parsed) ? parsed : [];
  } catch {
    cachedEntries = [];
  }
  return cachedEntries;
}

function writeEntries(entries: RecentlyViewedEntry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  listeners.forEach((callback) => callback());
}

export function getRecentlyViewed(): RecentlyViewedEntry[] {
  return readEntries();
}

export function recordRecentlyViewed(entry: RecentlyViewedEntry) {
  const entries = readEntries().filter((e) => e.id !== entry.id);
  entries.unshift(entry);
  writeEntries(entries.slice(0, MAX_ITEMS));
}
