"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";
import { supabase } from "@/lib/supabase";
import { subscribeAuth, getAuthSnapshot, getServerAuthSnapshot } from "@/lib/auth-store";

const NAV = [
  { href: "/restaurants", label: "All Restaurants" },
  { href: "/seafood-restaurant", label: "Seafood" },
  { href: "/fish-and-chips-shop", label: "Fish & Chips" },
  { href: "/blog", label: "Guides" },
  { href: "/saved", label: "Saved" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);

  function handleLogout() {
    supabase.auth.signOut();
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Image src="/logo/logo.png" alt="Seafood Restaurant London" width={760} height={230} priority className="h-10 w-auto md:h-14" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-4 md:flex">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Log out
            </button>
          ) : (
            <Link href="/login" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Log in
            </Link>
          )}
          <Link
            href="/add-your-restaurant"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark transition-colors"
          >
            Add Your Restaurant
          </Link>
        </div>
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
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-3 py-2.5 text-left text-base font-medium text-foreground/80 hover:bg-muted hover:text-primary transition-colors"
              >
                Log out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 hover:bg-muted hover:text-primary transition-colors"
              >
                Log in
              </Link>
            )}
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
