"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        router.push(`/restaurants${params.toString() ? `?${params}` : ""}`);
      }}
      className="flex w-full max-w-xl overflow-hidden rounded-full border border-border bg-white shadow-sm"
    >
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by cuisine, area, or restaurant name"
        className="flex-1 px-5 py-3 text-sm outline-none placeholder:text-foreground/40"
      />
      <button
        type="submit"
        className="bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
      >
        Search
      </button>
    </form>
  );
}
