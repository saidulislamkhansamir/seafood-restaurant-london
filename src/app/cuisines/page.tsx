import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { getCategories } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Cuisines",
  description: "Browse every restaurant category and cuisine listed on Seafood Restaurant London.",
};

export default async function CuisinesPage() {
  const categories = await getCategories();

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold">All Cuisines</h1>
      <p className="mt-2 text-foreground/60">{categories.length} categories</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary transition"
          >
            {cat.name} <span className="text-foreground/50">({cat.count})</span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
