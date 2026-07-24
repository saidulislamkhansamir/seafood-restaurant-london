"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import {
  adminListSubmissions,
  adminListClaims,
  adminListEditRequests,
  adminListInfoReports,
} from "@/lib/data";

type Counts = {
  submissions: number;
  claims: number;
  editRequests: number;
  infoReports: number;
};

const CARDS: { key: keyof Counts; label: string; href: string; description: string }[] = [
  {
    key: "submissions",
    label: "New Submissions",
    href: "/admin/submissions",
    description: "\"Add Your Restaurant\" listings waiting to be turned into real listings.",
  },
  {
    key: "claims",
    label: "Listing Claims",
    href: "/admin/claims",
    description: "Ownership claims that couldn't auto-verify by email and need a manual check.",
  },
  {
    key: "editRequests",
    label: "Owner Edit Requests",
    href: "/admin/edit-requests",
    description: "Changes a verified owner submitted for their own listing.",
  },
  {
    key: "infoReports",
    label: "Info Reports",
    href: "/admin/info-reports",
    description: "\"Report Wrong Info\" messages from visitors.",
  },
];

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    Promise.all([
      adminListSubmissions("pending"),
      adminListClaims("pending"),
      adminListEditRequests("pending"),
      adminListInfoReports("open"),
    ]).then(([submissions, claims, editRequests, infoReports]) => {
      setCounts({
        submissions: submissions.length,
        claims: claims.length,
        editRequests: editRequests.length,
        infoReports: infoReports.length,
      });
    });
  }, []);

  return (
    <Container className="py-8">
      <p className="text-sm text-foreground/60">Everything waiting on you, in one place.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">{card.label}</p>
              <span
                className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-sm font-bold ${
                  counts && counts[card.key] > 0
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground/50"
                }`}
              >
                {counts ? counts[card.key] : "…"}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-foreground/60">{card.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/restaurants"
          className="rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
        >
          <p className="font-semibold">Restaurants</p>
          <p className="mt-1.5 text-sm text-foreground/60">
            Search any listing, edit its details, or remove it from the site.
          </p>
        </Link>
        <Link
          href="/admin/photos"
          className="rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
        >
          <p className="font-semibold">Photos</p>
          <p className="mt-1.5 text-sm text-foreground/60">
            Browse recently submitted photos and remove any that shouldn&apos;t be live.
          </p>
        </Link>
        <Link
          href="/admin/member-discounts"
          className="rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
        >
          <p className="font-semibold">Member Discounts</p>
          <p className="mt-1.5 text-sm text-foreground/60">Set the discount text shown to logged-in members.</p>
        </Link>
        <Link
          href="/admin/users"
          className="rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
        >
          <p className="font-semibold">Users</p>
          <p className="mt-1.5 text-sm text-foreground/60">Search accounts and ban/unban if needed.</p>
        </Link>
      </div>
    </Container>
  );
}
