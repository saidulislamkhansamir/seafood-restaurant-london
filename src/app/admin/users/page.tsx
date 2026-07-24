"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { adminSearchUsers, adminBanUser, adminUnbanUser, type AdminUserRow } from "@/lib/data";

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminUserRow[] | null>(null);
  const [searching, setSearching] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    try {
      setResults(await adminSearchUsers(query.trim()));
    } finally {
      setSearching(false);
    }
  }

  function updateResult(updated: AdminUserRow) {
    setResults((prev) => (prev ? prev.map((u) => (u.id === updated.id ? updated : u)) : prev));
  }

  return (
    <Container className="max-w-3xl py-8">
      <h1 className="text-xl font-bold">Users</h1>
      <p className="mt-1 text-sm text-foreground/60">
        A banned account can still log in and browse, but can&apos;t write reviews, submit claims, or submit
        edit requests.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email (leave blank to list recent accounts)…"
          className="min-w-0 flex-1 rounded-full border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={searching}
          className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {searching ? "…" : "Search"}
        </button>
      </form>

      {results ? (
        results.length > 0 ? (
          <div className="mt-6 divide-y divide-border">
            {results.map((u) => (
              <UserRow key={u.id} user={u} onUpdated={updateResult} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-foreground/60">No accounts match that search.</p>
        )
      ) : null}
    </Container>
  );
}

function UserRow({ user, onUpdated }: { user: AdminUserRow; onUpdated: (u: AdminUserRow) => void }) {
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);

  async function handleBan() {
    setPending(true);
    try {
      await adminBanUser(user.id, reason.trim() || undefined);
      onUpdated({ ...user, banned: true, ban_reason: reason.trim() || null });
      setReason("");
    } finally {
      setPending(false);
    }
  }

  async function handleUnban() {
    setPending(true);
    try {
      await adminUnbanUser(user.id);
      onUpdated({ ...user, banned: false, ban_reason: null });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">
            {user.email}
            {user.banned ? (
              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                Banned
              </span>
            ) : null}
          </p>
          <p className="text-xs text-foreground/50">
            Joined {new Date(user.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            {user.banned && user.ban_reason ? ` · Reason: ${user.ban_reason}` : ""}
          </p>
        </div>
        {user.banned ? (
          <button
            type="button"
            onClick={handleUnban}
            disabled={pending}
            className="shrink-0 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700 hover:border-green-400 disabled:opacity-60"
          >
            {pending ? "…" : "Unban"}
          </button>
        ) : null}
      </div>

      {!user.banned ? (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (optional)"
            className="min-w-0 flex-1 rounded-lg border border-border px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={handleBan}
            disabled={pending}
            className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 hover:border-red-400 disabled:opacity-60"
          >
            {pending ? "…" : "Ban"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
