import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-muted">
      <Container className="py-12 grid gap-8 sm:grid-cols-2 md:grid-cols-5">
        <div>
          <Image src="/logo/logo.png" alt="Seafood Restaurant London" width={760} height={230} className="h-16 w-auto" />
          <p className="mt-3 text-sm text-foreground/70">
            The London restaurant directory — seafood, fish & chips, takeaway and more, borough by
            borough.
          </p>
        </div>
        <div>
          <p className="font-semibold text-sm mb-3">Explore</p>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><Link href="/restaurants" className="hover:text-primary">All Restaurants</Link></li>
            <li><Link href="/blog" className="hover:text-primary">Guides & Blog</Link></li>
            <li><Link href="/add-your-restaurant" className="hover:text-primary">Add Your Restaurant</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm mb-3">Popular Categories</p>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><Link href="/seafood-restaurant" className="hover:text-primary">Seafood Restaurants</Link></li>
            <li><Link href="/fish-and-chips-shop" className="hover:text-primary">Fish & Chips</Link></li>
            <li><Link href="/cuisines" className="hover:text-primary">All Cuisines</Link></li>
            <li><Link href="/areas" className="hover:text-primary">All Areas</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm mb-3">Company</p>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><Link href="/about" className="hover:text-primary">About</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/advertise" className="hover:text-primary">Advertise</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-sm mb-3">Legal</p>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms of Use</Link></li>
            <li><Link href="/cookies" className="hover:text-primary">Cookies</Link></li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-border py-6">
        <Container>
          <p className="text-xs text-foreground/60">
            &copy; {new Date().getFullYear()} Seafood Restaurant London. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
