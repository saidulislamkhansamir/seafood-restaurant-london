"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { adminListEditRequests, adminReviewEditRequest, type AdminEditRequest } from "@/lib/data";

const FIELD_LABELS: Record<string, string> = {
  description: "Description",
  phone: "Phone",
  opening_hours: "Opening hours",
  website_url: "Website URL",
  menu_link: "Menu link",
  booking_link: "Booking link",
  specialities: "Specialities",
};

export default function AdminEditRequestsPage() {
  const [items, setItems] = useState<AdminEditRequest[] | null>(null);

  function reload() {
    adminListEditRequests("pending").then(setItems);
  }

  useEffect(reload, []);

  return (
    <Container className="max-w-3xl py-8">
      <h1 className="text-xl font-bold">Owner Edit Requests</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Changes a verified restaurant owner submitted for their own listing. Approving applies them
        immediately.
      </p>

      {items === null ? (
        <p className="mt-6 text-sm text-foreground/60">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/60">Nothing pending.</p>
      ) : (
        <div className="mt-6 divide-y divide-border">
          {items.map((r) => (
            <RequestRow key={r.id} request={r} onReviewed={reload} />
          ))}
        </div>
      )}
    </Container>
  );
}

function RequestRow({ request, onReviewed }: { request: AdminEditRequest; onReviewed: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(approve: boolean) {
    setPending(true);
    setError(null);
    try {
      await adminReviewEditRequest(request.id, approve);
      onReviewed();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setPending(false);
    }
  }

  const entries = Object.entries(request.changes).filter(([, v]) => v !== undefined);

  return (
    <div className="py-4">
      <p className="font-semibold">
        <Link href={`/restaurants/${request.restaurant_slug}`} className="hover:text-primary" target="_blank">
          {request.restaurant_name}
        </Link>
      </p>
      <p className="text-xs text-foreground/50">Submitted by {request.user_email}</p>

      <dl className="mt-2 space-y-2 text-sm">
        {entries.map(([key, value]) => (
          <div key={key}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
              {FIELD_LABELS[key] ?? key}
            </dt>
            <dd className="whitespace-pre-line text-foreground/80">{value || <em className="text-foreground/40">(cleared)</em>}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => handle(true)}
          disabled={pending}
          className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "…" : "Approve"}
        </button>
        <button
          type="button"
          onClick={() => handle(false)}
          disabled={pending}
          className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700 hover:border-red-400 disabled:opacity-60"
        >
          Reject
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
