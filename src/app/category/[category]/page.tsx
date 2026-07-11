import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { RestaurantCard } from "@/components/RestaurantCard";
import { getRestaurantsByCategorySlug } from "@/lib/data";

export const revalidate = 3600;

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const { category: name } = await getRestaurantsByCategorySlug(category);
  if (!name) return {};
  return {
    title: `${name}s in London`,
    description: `Browse every ${name.toLowerCase()} listed on Seafood Restaurant London, with ratings, hours and booking links.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const { category: name, restaurants } = await getRestaurantsByCategorySlug(category);
  if (!name) notFound();

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold">{name}s in London</h1>
      <p className="mt-2 text-foreground/60">{restaurants.length} restaurants found</p>

      {restaurants.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-foreground/60">No restaurants listed in this category yet.</p>
      )}
    </Container>
  );
}
