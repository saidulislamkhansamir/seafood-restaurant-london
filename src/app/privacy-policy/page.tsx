import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Seafood Restaurant London collects and uses data.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-12 max-w-2xl">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-foreground/50">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-6 space-y-6 text-foreground/80 leading-relaxed">
        <p>
          This policy explains what data Seafood Restaurant London ("we", "us") collects when you
          use this website, and how it&apos;s used.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-foreground">What we collect</h2>
          <p className="mt-2">
            If you submit a restaurant via the &quot;Add Your Restaurant&quot; form, we collect the
            restaurant details and your contact information (name, email, phone) so we can review
            and publish the listing. We don&apos;t collect personal data from visitors just browsing
            the directory beyond standard, anonymised web analytics.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Restaurant listing data</h2>
          <p className="mt-2">
            Restaurant information shown on this site (name, address, hours, ratings, etc.) is
            sourced from publicly available Google Business Profile listings, and from direct
            submissions by restaurant owners. If you run a restaurant listed here and want
            information corrected or removed, contact us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Cookies</h2>
          <p className="mt-2">
            See our <a href="/cookies" className="text-primary hover:text-primary-dark font-medium">Cookies Policy</a> for details on cookies and similar technologies used on this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Questions about this policy: <a href="/contact" className="text-primary hover:text-primary-dark font-medium">contact us</a>.
          </p>
        </section>

        <p className="text-sm text-foreground/50 italic">
          This is a general-purpose template, not legal advice — have it reviewed before the site
          goes live or starts running ads/analytics that process personal data.
        </p>
      </div>
    </Container>
  );
}
