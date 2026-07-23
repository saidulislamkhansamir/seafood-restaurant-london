"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRecentlyViewed, subscribeRecentlyViewed } from "@/lib/recently-viewed";
import { categoryGradient } from "@/lib/category-icon";
import { StarRating } from "./StarRating";
import { Container } from "./Container";

export function RecentlyViewedStrip() {
  // Empty on the server (and on first paint) so there's no hydration
  // mismatch — this section only ever appears for a returning visitor.
  const entries = useSyncExternalStore(subscribeRecentlyViewed, getRecentlyViewed, () => []);

  if (entries.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Recently Viewed</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {entries.map((r) => (
            <Link
              key={r.id}
              href={`/restaurants/${r.slug}`}
              className="flex w-56 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-lg"
            >
              {r.photo_url ? (
                <div className="relative h-24 w-full">
                  <Image src={r.photo_url} alt={r.name} fill sizes="224px" className="object-cover" />
                </div>
              ) : (
                <div
                  className={`h-24 w-full bg-gradient-to-br ${categoryGradient(r.primary_category ?? r.name)}`}
                />
              )}
              <div className="flex flex-1 flex-col gap-1 p-3">
                <p className="text-sm font-semibold leading-snug line-clamp-1">{r.name}</p>
                <StarRating rating={r.rating} reviewCount={r.review_count} />
                <p className="text-xs text-foreground/60 line-clamp-1">
                  {r.primary_category}
                  {r.location_area ? ` · ${r.location_area}` : ""}
                  {r.price_range ? ` · ${r.price_range}` : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
