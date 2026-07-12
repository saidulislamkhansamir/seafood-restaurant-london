import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { RestaurantCard } from "@/components/RestaurantCard";
import { getRestaurantsByBoroughSlug, getAreas, getCategories } from "@/lib/data";

export const revalidate = 3600;

type Props = { params: Promise<{ borough: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { borough } = await params;
  const { borough: name } = await getRestaurantsByBoroughSlug(borough);
  if (!name) return {};
  return {
    title: `Restaurants in ${name}`,
    description: `Seafood, fish & chips and takeaway restaurants in ${name}, London — ratings, hours and booking links.`,
  };
}

export default async function BoroughPage({ params }: Props) {
  const { borough } = await params;
  const [{ borough: name, restaurants }, allAreas, allCategories] = await Promise.all([
    getRestaurantsByBoroughSlug(borough),
    getAreas(),
    getCategories(),
  ]);
  if (!name) notFound();

  const areas = allAreas.filter((a) => a.boroughSlug === borough);
  const restaurantCategorySlugs = new Set(
    restaurants.map((r) => r.primary_category).filter((c): c is string => !!c)
  );
  const categories = allCategories.filter((c) => restaurantCategorySlugs.has(c.name));

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold">Restaurants in {name}</h1>
      <p className="mt-2 text-foreground/60">{restaurants.length} restaurants found</p>

      {areas.length > 0 ? (
        <div className="mt-6">
          <p className="text-sm font-semibold text-foreground/50 mb-2">Neighbourhoods</p>
          <div className="flex flex-wrap gap-2">
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/${borough}/${a.slug}`}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary transition"
              >
                {a.name} <span className="text-foreground/50">({a.count})</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {categories.length > 0 ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-foreground/50 mb-2">Cuisine</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/${borough}/${c.slug}`}
                className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/70 hover:text-primary transition"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {restaurants.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-foreground/60">No restaurants listed in {name} yet.</p>
      )}
    </Container>
  );
}
