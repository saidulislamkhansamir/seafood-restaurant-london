"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { adminListSubmissions, adminApproveSubmission, adminRejectSubmission, type AdminSubmission } from "@/lib/data";

export default function AdminSubmissionsPage() {
  const [items, setItems] = useState<AdminSubmission[] | null>(null);

  function reload() {
    adminListSubmissions("pending").then(setItems);
  }

  useEffect(reload, []);

  return (
    <Container className="max-w-3xl py-8">
      <h1 className="text-xl font-bold">New Submissions</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Restaurants submitted via &quot;Add Your Restaurant&quot;. Approving one creates a real listing.
      </p>

      {items === null ? (
        <p className="mt-6 text-sm text-foreground/60">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/60">Nothing pending.</p>
      ) : (
        <div className="mt-6 divide-y divide-border">
          {items.map((s) => (
            <SubmissionRow key={s.id} submission={s} onReviewed={reload} />
          ))}
        </div>
      )}
    </Container>
  );
}

function SubmissionRow({ submission, onReviewed }: { submission: AdminSubmission; onReviewed: () => void }) {
  const [pending, setPending] = useState(false);
  const [approvedSlug, setApprovedSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setPending(true);
    setError(null);
    try {
      await adminApproveSubmission(submission.id);
      setApprovedSlug("done");
      onReviewed();
    } catch {
      setError("Couldn't approve. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function handleReject() {
    setPending(true);
    setError(null);
    try {
      await adminRejectSubmission(submission.id);
      onReviewed();
    } catch {
      setError("Couldn't reject. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (approvedSlug) return null;

  return (
    <div className="py-4">
      <p className="font-semibold">{submission.restaurant_name}</p>
      <p className="mt-1 text-xs text-foreground/50">
        {submission.category ?? "No category"}
        {submission.address ? ` · ${submission.address}` : ""}
      </p>
      <dl className="mt-2 space-y-1 text-sm text-foreground/70">
        {submission.contact_name ? <p>Contact: {submission.contact_name}</p> : null}
        {submission.email ? <p>Email: {submission.email}</p> : null}
        {submission.phone ? <p>Phone: {submission.phone}</p> : null}
        {submission.message ? <p className="whitespace-pre-line">Message: {submission.message}</p> : null}
      </dl>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleApprove}
          disabled={pending}
          className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "…" : "Approve"}
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={pending}
          className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700 hover:border-red-400 disabled:opacity-60"
        >
          Reject
        </button>
        <Link href="/admin/restaurants" className="text-xs font-semibold text-primary hover:underline">
          Search restaurants →
        </Link>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
