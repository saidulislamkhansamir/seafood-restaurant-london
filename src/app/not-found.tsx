import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SearchBar } from "@/components/SearchBar";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-6 py-24 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="text-3xl font-bold text-primary-dark">We couldn&apos;t find that page</h1>
      <p className="max-w-md text-foreground/70">
        The page you're looking for may have been moved or no longer exists. Try searching for a
        restaurant, or head back to the homepage.
      </p>
      <div className="w-full max-w-xl">
        <SearchBar />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
        <Link
          href="/"
          className="rounded-full bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          Back to Homepage
        </Link>
        <Link
          href="/restaurants"
          className="rounded-full border border-border bg-white px-5 py-2.5 font-semibold hover:border-primary hover:text-primary transition-colors"
        >
          Browse All Restaurants
        </Link>
      </div>
    </Container>
  );
}
