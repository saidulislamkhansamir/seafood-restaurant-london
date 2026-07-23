"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { RestaurantCard } from "@/components/RestaurantCard";
import { getSavedIds, subscribeSavedRestaurants } from "@/lib/saved-restaurants";
import { getAccountSavedIds, subscribeAccountSaved } from "@/lib/account-saved-restaurants";
import { subscribeAuth, getAuthSnapshot } from "@/lib/auth-store";
import type { Restaurant } from "@/lib/data";

export function SavedRestaurantsList() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Logged-in users' saved list lives in their account; logged-out
    // visitors keep reading from localStorage, as before. Re-runs whenever
    // auth state or either saved list changes (login, logout, toggling a
    // heart elsewhere on the page).
    function refetch() {
      const { user } = getAuthSnapshot();
      const ids = user ? getAccountSavedIds() : getSavedIds();
      const fetchSaved =
        ids.length === 0
          ? Promise.resolve({ data: [] as Restaurant[] })
          : supabase.from("restaurants").select("*").in("id", ids);

      fetchSaved.then(({ data }) => {
        if (!cancelled) setRestaurants(data ?? []);
      });
    }

    refetch();
    const unsubAuth = subscribeAuth(refetch);
    const unsubLocal = subscribeSavedRestaurants(refetch);
    const unsubAccount = subscribeAccountSaved(refetch);

    return () => {
      cancelled = true;
      unsubAuth();
      unsubLocal();
      unsubAccount();
    };
  }, []);

  if (restaurants === null) {
    return <p className="text-foreground/60">Loading your saved restaurants…</p>;
  }

  if (restaurants.length === 0) {
    return (
      <p className="text-foreground/60">
        You haven&apos;t saved any restaurants yet. Tap the heart on a restaurant to save it —{" "}
        <Link href="/restaurants" className="font-semibold text-primary hover:text-primary-dark">
          browse restaurants →
        </Link>
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </div>
  );
}
