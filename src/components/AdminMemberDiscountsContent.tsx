"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { subscribeAuth, getAuthSnapshot, getServerAuthSnapshot } from "@/lib/auth-store";
import { checkIsAdmin, adminSearchRestaurants, adminSetMemberDiscount, type Restaurant } from "@/lib/data";

export function AdminMemberDiscountsContent() {
  const router = useRouter();
  const { status, user } = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Restaurant[] | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (status === "resolved" && !user) router.push("/login");
  }, [status, user, router]);

  useEffect(() => {
    if (!user) return;
    checkIsAdmin().then(setIsAdmin);
  }, [user]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      setResults(await adminSearchRestaurants(query.trim()));
    } finally {
      setSearching(false);
    }
  }

  if (status === "loading" || !user || isAdmin === null) {
    return (
      <Container className="max-w-3xl py-12">
        <p className="text-foreground/60">Loading…</p>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container className="max-w-3xl py-12">
        <h1 className="text-2xl font-bold">Not authorized</h1>
        <p className="mt-2 text-foreground/60">
          This account ({user.email}) doesn&apos;t have admin access.
        </p>
      </Container>
    );
  }

  return (
    <Container className="max-w-3xl py-12">
      <h1 className="text-2xl font-bold">Member Discounts</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Search for a restaurant and set the discount text shown to logged-in members on its page.
        Leave it blank and save to remove a discount.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search restaurant by name…"
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
            {results.map((r) => (
              <DiscountRow key={r.id} restaurant={r} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-foreground/60">No restaurants match that search.</p>
        )
      ) : null}
    </Container>
  );
}

function DiscountRow({ restaurant }: { restaurant: Restaurant }) {
  const [value, setValue] = useState(restaurant.member_discount ?? "");
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setPending(true);
    setError(null);
    setSaved(false);
    try {
      await adminSetMemberDiscount(restaurant.id, value);
      setSaved(true);
    } catch {
      setError("Couldn't save. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="py-4">
      <p className="font-semibold">{restaurant.name}</p>
      <p className="text-xs text-foreground/50">
        {restaurant.primary_category}
        {restaurant.location_area ? ` · ${restaurant.location_area}` : ""}
      </p>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSaved(false);
          }}
          placeholder="e.g. 10% off your bill for logged-in members"
          className="min-w-0 flex-1 rounded-lg border border-border px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      {saved ? <p className="mt-1 text-xs text-green-600">Saved.</p> : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
