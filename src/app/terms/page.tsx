import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Seafood Restaurant London.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <Container className="py-12 max-w-2xl">
      <h1 className="text-3xl font-bold">Terms of Use</h1>
      <p className="mt-2 text-sm text-foreground/50">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-6 space-y-6 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground">Using this site</h2>
          <p className="mt-2">
            Seafood Restaurant London is a directory of restaurants across London, provided for
            informational purposes. Listing details (hours, ratings, menus, etc.) are sourced from
            public listings and owner submissions and may change without notice — always confirm
            directly with the restaurant before visiting.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Listings and submissions</h2>
          <p className="mt-2">
            Submitting a restaurant via the &quot;Add Your Restaurant&quot; form doesn&apos;t
            guarantee publication. We reserve the right to edit, decline, or remove any listing.
            Paid/premium placements are subject to separate terms agreed at time of purchase.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">No liability for third-party links</h2>
          <p className="mt-2">
            Booking, menu, and delivery links point to third-party services we don&apos;t control.
            We&apos;re not responsible for their content, availability, or the transactions you make
            through them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Questions about these terms: <a href="/contact" className="text-primary hover:text-primary-dark font-medium">contact us</a>.
          </p>
        </section>

        <p className="text-sm text-foreground/50 italic">
          This is a general-purpose template, not legal advice — have it reviewed before the site
          goes live, especially once paid listings/advertising are introduced.
        </p>
      </div>
    </Container>
  );
}
