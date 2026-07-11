import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { RestaurantCard } from "@/components/RestaurantCard";
import { getRestaurantsByBoroughSlug } from "@/lib/data";

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
  const { borough: name, restaurants } = await getRestaurantsByBoroughSlug(borough);
  if (!name) notFound();

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold">Restaurants in {name}</h1>
      <p className="mt-2 text-foreground/60">{restaurants.length} restaurants found</p>

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
