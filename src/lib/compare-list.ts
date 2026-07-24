// Compare list lives in the browser only (localStorage), same pattern as
// saved-restaurants.ts. Capped at 3 — a side-by-side table wider than that
// stops being readable, and it keeps the compare page fast.
const STORAGE_KEY = "compareRestaurants";
export const MAX_COMPARE = 3;

const listeners = new Set<() => void>();

export function subscribeCompareList(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// useSyncExternalStore compares snapshots by reference (Object.is), so
// getCompareIds() must keep returning the SAME array object when the
// underlying data hasn't changed — parsing a fresh array on every call
// (even an identical empty []) looks like a change on every check and
// causes an infinite re-render loop ("Maximum update depth exceeded").
let cachedRaw: string | null = null;
let cachedIds: string[] = [];

function readIds(): string[] {
  if (typeof window === "undefined") return cachedIds;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedIds;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedIds = Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    cachedIds = [];
  }
  return cachedIds;
}

function writeIds(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  listeners.forEach((callback) => callback());
}

export function getCompareIds(): string[] {
  return readIds();
}

export function isInCompare(id: string): boolean {
  return readIds().includes(id);
}

// Returns the resulting list, so callers can tell whether an add was
// rejected for being over MAX_COMPARE.
export function toggleCompare(id: string): string[] {
  const ids = readIds();
  const index = ids.indexOf(id);
  if (index !== -1) {
    ids.splice(index, 1);
    writeIds(ids);
    return ids;
  }
  if (ids.length >= MAX_COMPARE) return ids;
  ids.push(id);
  writeIds(ids);
  return ids;
}

export function removeFromCompare(id: string) {
  writeIds(readIds().filter((existingId) => existingId !== id));
}

export function clearCompare() {
  writeIds([]);
}
