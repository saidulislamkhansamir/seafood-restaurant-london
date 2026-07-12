import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SearchBar } from "@/components/SearchBar";
import { RestaurantCard } from "@/components/RestaurantCard";
import { getAllRestaurants, getCategories, getBoroughs } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Restaurants",
  description: "Browse every restaurant listed on Seafood Restaurant London, filterable by cuisine, borough and area.",
};

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; borough?: string }>;
}) {
  const params = await searchParams;
  const [restaurants, categories, boroughs] = await Promise.all([
    getAllRestaurants({ q: params.q, category: params.category, borough: params.borough }),
    getCategories(),
    getBoroughs(),
  ]);

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold">All Restaurants</h1>
      <p className="mt-2 text-foreground/60">{restaurants.length} restaurants found</p>

      <div className="mt-6">
        <SearchBar initialQuery={params.q} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary transition"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {boroughs.map((b) => (
          <Link
            key={b.slug}
            href={`/${b.slug}`}
            className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/70 hover:text-primary transition"
          >
            {b.name}
          </Link>
        ))}
      </div>

      {restaurants.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-foreground/60">No restaurants match that search yet — try a different term.</p>
      )}
    </Container>
  );
}
