import Link from "next/link";
import Image from "next/image";
import type { Restaurant } from "@/lib/data";
import { StarRating } from "./StarRating";
import { StatusBadge } from "./StatusBadge";
import { SaveButton } from "./SaveButton";
import { categoryGradient } from "@/lib/category-icon";
import { getLiveStatus } from "@/lib/opening-hours";
import { isActive } from "@/lib/restaurant-status";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const liveStatus = isActive(restaurant.listing_status)
    ? getLiveStatus(restaurant.opening_hours)
    : null;

  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-lg"
    >
      {restaurant.photo_url ? (
        <div className="relative h-32 w-full">
          <Image
            src={restaurant.photo_url}
            alt={restaurant.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          <StatusBadge
            status={restaurant.listing_status}
            liveStatus={liveStatus}
            className="absolute left-2 top-2 shadow-sm"
          />
          <SaveButton restaurantId={restaurant.id} className="absolute right-2 top-2" />
        </div>
      ) : (
        <div
          className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${categoryGradient(
            restaurant.primary_category ?? restaurant.name
          )}`}
        >
          <Image
            src="/logo/brand-icon.png"
            alt=""
            aria-hidden
            width={250}
            height={175}
            className="h-14 w-auto opacity-90 brightness-0 invert"
          />
          <StatusBadge
            status={restaurant.listing_status}
            liveStatus={liveStatus}
            className="absolute left-2 top-2 shadow-sm"
          />
          <SaveButton restaurantId={restaurant.id} className="absolute right-2 top-2" />
        </div>
      )}
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
