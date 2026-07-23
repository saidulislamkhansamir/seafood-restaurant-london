// Saved restaurants live in the browser only (localStorage) — there are no
// user accounts on this site, so this is the simplest way to let someone
// keep a personal list without signing up for anything.
const STORAGE_KEY = "savedRestaurants";

const listeners = new Set<() => void>();

export function subscribeSavedRestaurants(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  listeners.forEach((callback) => callback());
}

export function getSavedIds(): string[] {
  return readIds();
}

export function isRestaurantSaved(id: string): boolean {
  return readIds().includes(id);
}

export function toggleSavedRestaurant(id: string): boolean {
  const ids = readIds();
  const index = ids.indexOf(id);
  if (index === -1) {
    ids.push(id);
    writeIds(ids);
    return true;
  }
  ids.splice(index, 1);
  writeIds(ids);
  return false;
}
