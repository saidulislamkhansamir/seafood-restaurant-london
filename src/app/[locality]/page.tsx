import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { RestaurantCard } from "@/components/RestaurantCard";
import {
  getRestaurantsByBoroughSlug,
  getRestaurantsByCategorySlug,
  getAreas,
  getCategories,
} from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;

type Props = { params: Promise<{ locality: string }> };

async function resolve(locality: string) {
  const borough = await getRestaurantsByBoroughSlug(locality);
  if (borough.borough) {
    return { kind: "borough" as const, label: `Restaurants in ${borough.borough}`, ...borough };
  }
  const category = await getRestaurantsByCategorySlug(locality);
  if (category.category) {
    return { kind: "category" as const, label: `${category.category}s in London`, ...category };
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locality } = await params;
  const result = await resolve(locality);
  if (!result) return {};
  return {
    title: result.label,
    description:
      result.kind === "borough"
        ? `Seafood, fish & chips and takeaway restaurants in ${result.borough}, London, with ratings, hours and booking links.`
        : `Browse every ${result.category?.toLowerCase()} listed on Seafood Restaurant London, with ratings, hours and booking links.`,
    alternates: { canonical: `/${locality}` },
  };
}

export default async function LocalityPage({ params }: Props) {
  const { locality } = await params;
  const result = await resolve(locality);
  if (!result) notFound();

  const [allAreas, allCategories] = await Promise.all([getAreas(), getCategories()]);
  const isBorough = result.kind === "borough";
  const areas = isBorough ? allAreas.filter((a) => a.boroughSlug === locality) : [];
  const restaurantCategorySlugs = new Set(
    result.restaurants.map((r) => r.primary_category).filter((c): c is string => !!c)
  );
  const categories = isBorough ? allCategories.filter((c) => restaurantCategorySlugs.has(c.name)) : [];

  const breadcrumb = breadcrumbJsonLd([
    { name: "All Restaurants", path: "/restaurants" },
    { name: result.label, path: `/${locality}` },
  ]);

  return (
    <Container className="py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <h1 className="text-3xl font-bold">{result.label}</h1>
      <p className="mt-2 text-foreground/60">{result.restaurants.length} restaurants found</p>

      {areas.length > 0 ? (
        <div className="mt-6">
          <p className="text-sm font-semibold text-foreground/50 mb-2">Neighbourhoods</p>
          <div className="flex flex-wrap gap-2">
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/${locality}/${a.slug}`}
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
                href={`/${locality}/${c.slug}`}
                className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/70 hover:text-primary transition"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {result.restaurants.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-foreground/60">No restaurants listed here yet.</p>
      )}
    </Container>
  );
}
