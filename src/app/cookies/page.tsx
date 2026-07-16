import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description: "How Seafood Restaurant London uses cookies.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <Container className="py-12 max-w-2xl">
      <h1 className="text-3xl font-bold">Cookies Policy</h1>
      <p className="mt-2 text-sm text-foreground/50">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-6 space-y-6 text-foreground/80 leading-relaxed">
        <p>
          This site currently uses only essential cookies required for it to function (e.g.
          maintaining basic session state). It does not currently run advertising or analytics
          cookies.
        </p>
        <p>
          If that changes — for example, if we add Google AdSense or web analytics — this page will
          be updated to describe what&apos;s used and how to opt out, and a cookie consent banner
          will be added where required.
        </p>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Questions about cookies on this site: <a href="/contact" className="text-primary hover:text-primary-dark font-medium">contact us</a>.
          </p>
        </section>
        <p className="text-sm text-foreground/50 italic">
          This is a general-purpose template, not legal advice — revisit this page as soon as
          analytics or ad cookies are actually added to the site.
        </p>
      </div>
    </Container>
  );
}
