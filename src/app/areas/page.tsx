import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { getBoroughs } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Areas",
  description: "Browse restaurants by London borough on Seafood Restaurant London.",
};

export default async function AreasPage() {
  const boroughs = await getBoroughs();

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold">All Areas</h1>
      <p className="mt-2 text-foreground/60">{boroughs.length} boroughs</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {boroughs.map((b) => (
          <Link
            key={b.slug}
            href={`/${b.slug}`}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary transition"
          >
            {b.name} <span className="text-foreground/50">({b.count})</span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
