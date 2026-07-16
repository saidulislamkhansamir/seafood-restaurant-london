import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Guides & Blog",
  description: "London seafood guides, best-of lists and dining tips from Seafood Restaurant London.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold">Guides &amp; Blog</h1>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="rounded-2xl border border-border bg-white p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="font-semibold leading-snug">{post.title}</h2>
            <p className="mt-2 text-sm text-foreground/60">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
