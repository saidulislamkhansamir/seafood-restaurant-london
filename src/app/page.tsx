import Link from "next/link";
import { Container } from "@/components/Container";
import { SearchBar } from "@/components/SearchBar";
import { RestaurantCard } from "@/components/RestaurantCard";
import { getFeaturedRestaurants, getCategories, getBoroughs } from "@/lib/data";
import { categoryIcon } from "@/lib/category-icon";
import { POSTS } from "@/lib/posts";

export const revalidate = 3600;

export default async function HomePage() {
  const [featured, categories, boroughs] = await Promise.all([
    getFeaturedRestaurants(6),
    getCategories(),
    getBoroughs(),
  ]);

  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-muted to-background">
        <Container className="flex flex-col items-center gap-6 py-20 text-center">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-primary-dark sm:text-5xl">
            Seafood Restaurant London — Find the Best Seafood in the City
          </h1>
          <p className="max-w-xl text-lg text-foreground/70">
            Browse seafood, fish &amp; chips, and takeaway spots across every London borough —
            ratings, hours, menus and booking links in one place.
          </p>
          <SearchBar />
          <Link
            href="/add-your-restaurant"
            className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-dark"
          >
            Own a restaurant? Add it for free →
          </Link>
        </Container>
      </section>

      {categories.length > 0 ? (
        <section className="py-16">
          <Container>
            <h2 className="text-2xl font-bold mb-6">Browse by Cuisine</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 hover:border-primary hover:shadow-sm transition"
                >
                  <span className="text-2xl" aria-hidden>
                    {categoryIcon(cat.name)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{cat.name}</span>
                    <span className="block text-xs text-foreground/60">{cat.count} listed</span>
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {featured.length > 0 ? (
        <section className="py-16 bg-muted">
          <Container>
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-bold">Featured Restaurants</h2>
              <Link href="/restaurants" className="text-sm font-semibold text-primary hover:text-primary-dark">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {boroughs.length > 0 ? (
        <section className="py-16">
          <Container>
            <h2 className="text-2xl font-bold mb-6">Explore by Borough</h2>
            <div className="flex flex-wrap gap-2">
              {boroughs.map((b) => (
                <Link
                  key={b.slug}
                  href={`/${b.slug}`}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm hover:border-primary hover:text-primary transition"
                >
                  {b.name} <span className="text-foreground/50">({b.count})</span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-16 bg-muted">
        <Container>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold">From the Blog</h2>
            <Link href="/blog" className="text-sm font-semibold text-primary hover:text-primary-dark">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {POSTS.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-2xl border border-border bg-white p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold leading-snug">{post.title}</h3>
                <p className="mt-2 text-sm text-foreground/60">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="flex flex-col items-center gap-4 rounded-3xl bg-primary px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold">List Your Restaurant on Seafood Restaurant London</h2>
          <p className="max-w-xl text-white/80">
            Free basic listings, with premium placement and featured spots available to reach more
            diners across London.
          </p>
          <Link
            href="/add-your-restaurant"
            className="mt-2 rounded-full bg-accent px-6 py-3 font-semibold hover:bg-accent-dark transition-colors"
          >
            Add Your Restaurant — Free
          </Link>
        </Container>
      </section>
    </>
  );
}
