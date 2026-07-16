"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";

const NAV = [
  { href: "/restaurants", label: "All Restaurants" },
  { href: "/seafood-restaurant", label: "Seafood" },
  { href: "/fish-and-chips-shop", label: "Fish & Chips" },
  { href: "/blog", label: "Guides" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Image src="/logo/logo.png" alt="Seafood Restaurant London" width={760} height={230} priority className="h-14 w-auto" />
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
          className="hidden shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark transition-colors md:inline-block"
        >
          Add Your Restaurant
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground md:hidden"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </Container>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 hover:bg-muted hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/add-your-restaurant"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-accent px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-accent-dark transition-colors"
            >
              Add Your Restaurant
            </Link>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
