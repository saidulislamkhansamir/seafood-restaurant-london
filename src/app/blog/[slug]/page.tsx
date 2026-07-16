import type { Metadata } from "next";
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

  return (
    <Container className="py-12 max-w-2xl">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="mt-8 space-y-4 text-foreground/80 leading-relaxed">
        {post.content.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </Container>
  );
}
