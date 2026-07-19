import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SearchBar } from "@/components/SearchBar";
import { RestaurantCard } from "@/components/RestaurantCard";
import { getFeaturedRestaurants, getCategories, getBoroughs, getRestaurantsCount } from "@/lib/data";
import { categoryIcon, categoryTint } from "@/lib/category-icon";
import { POSTS } from "@/lib/posts";
import { faqJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [featured, categories, boroughs, restaurantsCount] = await Promise.all([
    getFeaturedRestaurants(6),
    getCategories(),
    getBoroughs(),
    getRestaurantsCount(),
  ]);

  const topCategories = categories.slice(0, 8);
  const topBoroughs = boroughs.slice(0, 10);

  const stats = [
    { value: `${restaurantsCount}+`, label: "Restaurants" },
    { value: `${boroughs.length}`, label: "Boroughs" },
    { value: `${categories.length}`, label: "Cuisines" },
  ];

  const faqs = [
    {
      question: "What's the best seafood restaurant in London?",
      answer:
        "It depends on budget and borough. For a special occasion, Michelin-listed spots in Mayfair and Soho lead the way; for a quick, honest meal, a good local fish and chip shop often beats a tasting menu. Browse our Featured Restaurants above, or filter by borough and cuisine to find highly rated options near you.",
    },
    {
      question: "How do I find fish and chip shops near me in London?",
      answer:
        "Use the search bar at the top of this page, or browse by borough to see every fish and chip shop, seafood restaurant and takeaway we've listed in that area, complete with ratings, opening hours and booking links where available.",
    },
    {
      question: "Is it free to list a restaurant on this directory?",
      answer:
        "Yes. Basic listings are free for restaurant owners. Premium placement and featured spots are also available for restaurants that want extra visibility across the site.",
    },
    {
      question: "Does this directory only cover seafood restaurants?",
      answer:
        "We started with seafood and fish and chips as our focus, and we're expanding borough by borough to cover more of London's restaurant scene, including other cuisines. Check Browse by Cuisine to see everything currently listed.",
    },
    {
      question: "Can I book a table directly through the site?",
      answer:
        "Where a restaurant provides a booking link, it's included on their listing page alongside hours, menu and contact details, so you can book directly with the restaurant.",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted to-background">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-coral/15 blur-3xl"
        />
        <Container className="relative flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-primary-dark sm:text-5xl">
            Seafood Restaurant London: Find the Best Seafood in the City
          </h1>
          <p className="max-w-xl text-lg text-foreground/70">
            Browse seafood, fish &amp; chips, and takeaway spots across every London borough, with
            ratings, hours, menus and booking links in one place.
          </p>
          <SearchBar />

          <div className="mt-2 flex items-center gap-6 sm:gap-10">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-6 sm:gap-10">
                {i > 0 ? <span className="h-8 w-px bg-border" aria-hidden /> : null}
                <div>
                  <p className="text-2xl font-bold text-primary-dark sm:text-3xl">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wide text-foreground/50">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/add-your-restaurant"
            className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-dark"
          >
            Own a restaurant? Add it for free →
          </Link>
        </Container>
      </section>

      <section className="py-16 bg-muted sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Finding the Best Seafood in London</h2>
          <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed">
            <p>
              London&apos;s seafood scene runs from Billingsgate-supplied fine dining rooms in Mayfair
              to the corner chippy that&apos;s been frying since your grandparents were young. We&apos;ve
              pulled together {restaurantsCount}+ seafood restaurants, fish and chip shops and seafood
              takeaways across {boroughs.length} London boroughs, so you can compare ratings, opening
              hours, menus and booking links without switching between five different apps and maps.
            </p>
            <p>
              Whether you want oysters and a bottle of Muscadet in Soho, a proper Friday-night fish
              supper in Lewisham, or a Cantonese seafood banquet in Chinatown, start with{" "}
              <Link href="/areas" className="font-semibold text-primary hover:text-primary-dark">
                Explore by Borough
              </Link>{" "}
              if you know where you&apos;re eating, or{" "}
              <Link href="/cuisines" className="font-semibold text-primary hover:text-primary-dark">
                Browse by Cuisine
              </Link>{" "}
              if you know what you&apos;re craving. Every listing shows what we could verify directly
              from the restaurant, so hours and contact details are accurate rather than guessed.
            </p>
            <p>
              New to the site? The{" "}
              <Link href="/restaurants" className="font-semibold text-primary hover:text-primary-dark">
                full restaurant directory
              </Link>{" "}
              is searchable and filterable, and our{" "}
              <Link href="/blog" className="font-semibold text-primary hover:text-primary-dark">
                guides and blog
              </Link>{" "}
              cover specific questions, like where to find the best fish and chips in a given area, or
              which boroughs are worth a special trip for seafood.
            </p>
          </div>
        </Container>
      </section>

      {topCategories.length > 0 ? (
        <section className="py-16 sm:py-20">
          <Container>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">Browse by Cuisine</h2>
                <p className="mt-1 text-sm text-foreground/60">
                  The most popular cuisines across London, by number of listings.
                </p>
              </div>
              <Link
                href="/cuisines"
                className="hidden shrink-0 text-sm font-semibold text-primary hover:text-primary-dark sm:inline-block"
              >
                All cuisines →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {topCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${categoryTint(cat.name)}`}
                    aria-hidden
                  >
                    {categoryIcon(cat.name)}
                  </span>
                  <span>
                    <span className="block font-semibold group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                    <span className="block text-sm text-foreground/50">{cat.count} listed</span>
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/cuisines"
              className="mt-6 block text-center text-sm font-semibold text-primary hover:text-primary-dark sm:hidden"
            >
              All cuisines →
            </Link>
          </Container>
        </section>
      ) : null}

      {featured.length > 0 ? (
        <section className="py-16 bg-muted sm:py-20">
          <Container>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">Featured Restaurants</h2>
                <p className="mt-1 text-sm text-foreground/60">Hand-picked spots worth booking first.</p>
              </div>
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

      {topBoroughs.length > 0 ? (
        <section className="py-16 sm:py-20">
          <Container>
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-2xl font-bold sm:text-3xl">Explore by Borough</h2>
              <Link href="/areas" className="text-sm font-semibold text-primary hover:text-primary-dark">
                All areas →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {topBoroughs.map((b) => (
                <Link
                  key={b.slug}
                  href={`/${b.slug}`}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm transition hover:border-primary hover:text-primary hover:shadow-sm"
                >
                  {b.name} <span className="text-foreground/50">({b.count})</span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-16 bg-muted sm:py-20">
        <Container>
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl">From the Blog</h2>
            <Link href="/blog" className="text-sm font-semibold text-primary hover:text-primary-dark">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {POSTS.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-2xl border border-border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold leading-snug">{post.title}</h3>
                <p className="mt-2 text-sm text-foreground/60">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
          />
          <h2 className="text-2xl font-bold sm:text-3xl">Frequently Asked Questions</h2>
          <div className="mt-6 divide-y divide-border">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-5">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="flex flex-col items-center gap-4 rounded-3xl bg-primary px-8 py-16 text-center text-white sm:py-20">
          <h2 className="text-3xl font-bold">List Your Restaurant on Seafood Restaurant London</h2>
          <p className="max-w-xl text-white/80">
            Free basic listings, with premium placement and featured spots available to reach more
            diners across London.
          </p>
          <Link
            href="/add-your-restaurant"
            className="mt-2 rounded-full bg-accent px-6 py-3 font-semibold hover:bg-accent-dark transition-colors"
          >
            Add Your Restaurant (Free)
          </Link>
        </Container>
      </section>
    </>
  );
}
