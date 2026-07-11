import Link from "next/link";
import type { Restaurant } from "@/lib/data";
import { StarRating } from "./StarRating";
import { categoryIcon, categoryGradient } from "@/lib/category-icon";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-lg"
    >
      <div
        className={`flex h-32 items-center justify-center bg-gradient-to-br text-5xl ${categoryGradient(
          restaurant.primary_category ?? restaurant.name
        )}`}
      >
        <span aria-hidden>{categoryIcon(restaurant.primary_category)}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors">
            {restaurant.name}
          </h3>
          {restaurant.price_range ? (
            <span className="shrink-0 text-sm font-medium text-foreground/60">{restaurant.price_range}</span>
          ) : null}
        </div>
        <StarRating rating={restaurant.rating} reviewCount={restaurant.review_count} />
        <p className="text-sm text-foreground/60">
          {restaurant.primary_category}
          {restaurant.location_area ? ` · ${restaurant.location_area}` : ""}
        </p>
        {restaurant.cuisine_tags && restaurant.cuisine_tags.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {restaurant.cuisine_tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground/70">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
