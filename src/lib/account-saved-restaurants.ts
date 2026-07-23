"use client";

import { supabase } from "@/lib/supabase";
import { getSavedIds, clearSavedRestaurants } from "@/lib/saved-restaurants";

// Mirrors the shape of saved-restaurants.ts (the logged-out, localStorage
// version) but backed by the saved_restaurants table for a logged-in user.
let savedIds = new Set<string>();
let loadedForUserId: string | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((callback) => callback());
}

export function subscribeAccountSaved(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export async function loadAccountSaved(userId: string, force = false) {
  if (!force && loadedForUserId === userId) return;
  const { data } = await supabase.from("saved_restaurants").select("restaurant_id").eq("user_id", userId);
  savedIds = new Set((data ?? []).map((row) => row.restaurant_id));
  loadedForUserId = userId;
  notify();
}

// Runs once right after a successful login: copies any restaurants saved
// anonymously in this browser into the new account, then clears localStorage
// so the two lists can't drift out of sync. Safe to call every login — it's
// a no-op once localStorage is empty.
export async function migrateLocalSavesToAccount(userId: string) {
  const localIds = getSavedIds();
  if (localIds.length === 0) return;

  const rows = localIds.map((restaurant_id) => ({ user_id: userId, restaurant_id }));
  const { error } = await supabase
    .from("saved_restaurants")
    .upsert(rows, { onConflict: "user_id,restaurant_id", ignoreDuplicates: true });

  if (!error) {
    clearSavedRestaurants();
    await loadAccountSaved(userId, true);
  }
}

export function clearAccountSaved() {
  savedIds = new Set();
  loadedForUserId = null;
  notify();
}

export function getAccountSavedIds(): string[] {
  return Array.from(savedIds);
}

export function isAccountRestaurantSaved(id: string): boolean {
  return savedIds.has(id);
}

export async function toggleAccountSavedRestaurant(userId: string, id: string): Promise<boolean> {
  const nowSaved = !savedIds.has(id);

  // Optimistic update — the heart flips instantly, then we confirm with the
  // database and quietly roll back if the write actually failed.
  if (nowSaved) {
    savedIds.add(id);
  } else {
    savedIds.delete(id);
  }
  notify();

  try {
    if (nowSaved) {
      const { error } = await supabase.from("saved_restaurants").insert({ user_id: userId, restaurant_id: id });
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("saved_restaurants")
        .delete()
        .eq("user_id", userId)
        .eq("restaurant_id", id);
      if (error) throw error;
    }
  } catch {
    if (nowSaved) {
      savedIds.delete(id);
    } else {
      savedIds.add(id);
    }
    notify();
  }

  return nowSaved;
}
