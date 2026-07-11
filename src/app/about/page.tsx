import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "About",
  description: "About Seafood Restaurant London, the directory for seafood and restaurant listings across the capital.",
};

export default function AboutPage() {
  return (
    <Container className="py-12 max-w-2xl">
      <h1 className="text-3xl font-bold">About Seafood Restaurant London</h1>
      <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed">
        <p>
          Seafood Restaurant London is a directory of seafood, fish &amp; chips, and takeaway
          restaurants across Greater London. We started with a focus on seafood and are expanding
          borough by borough to cover more of the capital&apos;s restaurant scene.
        </p>
        <p>
          Every listing pulls together ratings, opening hours, menus, booking links and delivery
          options in one place, so you can find somewhere to eat without hopping between five
          different apps.
        </p>
        <p>
          Run a restaurant and want to be listed?{" "}
          <a href="/add-your-restaurant" className="font-semibold text-primary hover:text-primary-dark">
            Add your restaurant for free
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
