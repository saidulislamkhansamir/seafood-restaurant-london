"use client";

import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { loadAccountSaved, clearAccountSaved } from "@/lib/account-saved-restaurants";

type AuthState = { status: "loading" | "resolved"; user: User | null };

let state: AuthState = { status: "loading", user: null };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((callback) => callback());
}

// Registered once per browser session — Supabase fires an initial event with
// whatever session already exists (from localStorage), then again on every
// sign-in/sign-out, keeping this store's snapshot in sync automatically.
if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user ?? null;
    state = { status: "resolved", user };
    if (user) {
      loadAccountSaved(user.id);
    } else {
      clearAccountSaved();
    }
    notify();
  });
}

export function subscribeAuth(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getAuthSnapshot(): AuthState {
  return state;
}

// A single cached object, not a new literal per call — useSyncExternalStore
// requires the server snapshot to be referentially stable across calls, or
// React treats every render as a change and warns of a possible infinite loop.
const SERVER_SNAPSHOT: AuthState = { status: "loading", user: null };

export function getServerAuthSnapshot(): AuthState {
  return SERVER_SNAPSHOT;
}
