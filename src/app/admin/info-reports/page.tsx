"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { adminListInfoReports, adminResolveInfoReport, type AdminInfoReport } from "@/lib/data";

export default function AdminInfoReportsPage() {
  const [items, setItems] = useState<AdminInfoReport[] | null>(null);

  function reload() {
    adminListInfoReports("open").then(setItems);
  }

  useEffect(reload, []);

  return (
    <Container className="max-w-3xl py-8">
      <h1 className="text-xl font-bold">Info Reports</h1>
      <p className="mt-1 text-sm text-foreground/60">
        &quot;Report Wrong Info&quot; messages from visitors. Edit the restaurant directly, then mark this
        resolved.
      </p>

      {items === null ? (
        <p className="mt-6 text-sm text-foreground/60">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/60">Nothing open.</p>
      ) : (
        <div className="mt-6 divide-y divide-border">
          {items.map((r) => (
            <ReportRow key={r.id} report={r} onReviewed={reload} />
          ))}
        </div>
      )}
    </Container>
  );
}

function ReportRow({ report, onReviewed }: { report: AdminInfoReport; onReviewed: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(dismiss: boolean) {
    setPending(true);
    setError(null);
    try {
      await adminResolveInfoReport(report.id, dismiss);
      onReviewed();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="py-4">
      <p className="font-semibold">
        <Link href={`/restaurants/${report.restaurant_slug}`} className="hover:text-primary" target="_blank">
          {report.restaurant_name}
        </Link>
      </p>
      <p className="mt-1 whitespace-pre-line text-sm text-foreground/70">{report.message}</p>
      <div className="mt-3 flex items-center gap-2">
        <Link
          href="/admin/restaurants"
          className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Edit restaurant
        </Link>
        <button
          type="button"
          onClick={() => handle(false)}
          disabled={pending}
          className="rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700 hover:border-green-400 disabled:opacity-60"
        >
          {pending ? "…" : "Mark resolved"}
        </button>
        <button
          type="button"
          onClick={() => handle(true)}
          disabled={pending}
          className="rounded-full border border-border bg-white px-4 py-1.5 text-sm font-semibold text-foreground/70 hover:border-primary hover:text-primary disabled:opacity-60"
        >
          Dismiss
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
