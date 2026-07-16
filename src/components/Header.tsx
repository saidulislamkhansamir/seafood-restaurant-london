import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";

const NAV = [
  { href: "/restaurants", label: "All Restaurants" },
  { href: "/seafood-restaurant", label: "Seafood" },
  { href: "/fish-and-chips-shop", label: "Fish & Chips" },
  { href: "/blog", label: "Guides" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/add-your-restaurant"
          className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark transition-colors"
        >
          Add Your Restaurant
        </Link>
      </Container>
    </header>
  );
}
