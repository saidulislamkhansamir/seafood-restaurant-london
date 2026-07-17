import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { POSTS } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, alternates: { canonical: `/blog/${slug}` } };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  let lastHeading: string | undefined;

  return (
    <Container className="py-12 max-w-2xl">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="mt-8 space-y-4 text-foreground/80 leading-relaxed">
        {post.content.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {post.picks && post.picks.length > 0 ? (
        <div className="mt-10 space-y-6">
          {post.picks.map((pick, i) => {
            const showHeading = pick.heading && pick.heading !== lastHeading;
            if (pick.heading) lastHeading = pick.heading;
            return (
              <div key={pick.slug}>
                {showHeading ? (
                  <h2 className="mb-4 text-xl font-bold text-primary-dark">{pick.heading}</h2>
                ) : null}
                <div className="rounded-2xl border border-border bg-white p-5">
                  <p className="text-xs font-semibold text-foreground/50">
                    {i + 1}. {pick.area}
                  </p>
                  <Link
                    href={`/restaurants/${pick.slug}`}
                    className="text-lg font-semibold text-primary hover:text-primary-dark"
                  >
                    {pick.name}
                  </Link>
                  <p className="mt-2 text-foreground/70">{pick.blurb}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {post.closing && post.closing.length > 0 ? (
        <div className="mt-8 space-y-4 text-foreground/80 leading-relaxed">
          {post.closing.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <Link
            href="/seafood-restaurant"
            className="inline-block font-semibold text-primary hover:text-primary-dark"
          >
            Browse all seafood restaurants in London →
          </Link>
        </div>
      ) : null}
    </Container>
  );
}
