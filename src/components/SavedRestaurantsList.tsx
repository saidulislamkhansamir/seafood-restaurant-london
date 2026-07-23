"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { RestaurantCard } from "@/components/RestaurantCard";
import { getSavedIds } from "@/lib/saved-restaurants";
import type { Restaurant } from "@/lib/data";

export function SavedRestaurantsList() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);

  useEffect(() => {
    const ids = getSavedIds();
    const fetchSaved =
      ids.length === 0
        ? Promise.resolve({ data: [] as Restaurant[] })
        : supabase.from("restaurants").select("*").in("id", ids);

    fetchSaved.then(({ data }) => setRestaurants(data ?? []));
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
