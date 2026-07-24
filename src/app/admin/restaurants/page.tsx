"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { adminSearchRestaurants, adminUpdateRestaurant, adminSetListingStatus, type Restaurant } from "@/lib/data";
import { ACTIVE, TEMPORARILY_CLOSED, PERMANENTLY_CLOSED, NOT_A_RESTAURANT } from "@/lib/restaurant-status";

const STATUS_OPTIONS = [ACTIVE, TEMPORARILY_CLOSED, PERMANENTLY_CLOSED, NOT_A_RESTAURANT];

export default function AdminRestaurantsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Restaurant[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  function updateResult(updated: Restaurant) {
    setResults((prev) => (prev ? prev.map((r) => (r.id === updated.id ? updated : r)) : prev));
  }

  return (
    <Container className="max-w-4xl py-8">
      <h1 className="text-xl font-bold">Restaurants</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Search any listing to edit its details directly, or remove/restore it.
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
              <RestaurantRow
                key={r.id}
                restaurant={r}
                expanded={expandedId === r.id}
                onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
                onUpdated={updateResult}
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-foreground/60">No restaurants match that search.</p>
        )
      ) : null}
    </Container>
  );
}

function RestaurantRow({
  restaurant,
  expanded,
  onToggle,
  onUpdated,
}: {
  restaurant: Restaurant;
  expanded: boolean;
  onToggle: () => void;
  onUpdated: (r: Restaurant) => void;
}) {
  const removed = restaurant.listing_status === NOT_A_RESTAURANT;
  const [pending, setPending] = useState(false);

  async function toggleRemoved() {
    setPending(true);
    try {
      const newStatus = removed ? ACTIVE : NOT_A_RESTAURANT;
      await adminSetListingStatus(restaurant.id, newStatus);
      onUpdated({ ...restaurant, listing_status: newStatus });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">
            {restaurant.name}
            {removed ? (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                Removed
              </span>
            ) : null}
          </p>
          <p className="text-xs text-foreground/50">
            {restaurant.primary_category}
            {restaurant.location_area ? ` · ${restaurant.location_area}` : ""}
            {" · "}
            {restaurant.listing_status ?? ACTIVE}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-primary hover:text-primary"
          >
            {expanded ? "Close" : "Edit"}
          </button>
          <button
            type="button"
            onClick={toggleRemoved}
            disabled={pending}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-60 ${
              removed
                ? "border-green-200 bg-green-50 text-green-700 hover:border-green-400"
                : "border-red-200 bg-red-50 text-red-700 hover:border-red-400"
            }`}
          >
            {pending ? "…" : removed ? "Restore" : "Remove"}
          </button>
        </div>
      </div>

      {expanded ? <RestaurantEditForm restaurant={restaurant} onUpdated={onUpdated} /> : null}
    </div>
  );
}

function RestaurantEditForm({
  restaurant,
  onUpdated,
}: {
  restaurant: Restaurant;
  onUpdated: (r: Restaurant) => void;
}) {
  const [form, setForm] = useState({
    name: restaurant.name ?? "",
    primary_category: restaurant.primary_category ?? "",
    phone: restaurant.phone ?? "",
    email: restaurant.email ?? "",
    website_url: restaurant.website_url ?? "",
    full_address: restaurant.full_address ?? "",
    opening_hours: restaurant.opening_hours ?? "",
    description: restaurant.description ?? "",
    specialities: restaurant.specialities ?? "",
    price_range: restaurant.price_range ?? "",
    booking_link: restaurant.booking_link ?? "",
    menu_link: restaurant.menu_link ?? "",
    listing_status: restaurant.listing_status ?? ACTIVE,
  });
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setPending(true);
    setError(null);
    try {
      await adminUpdateRestaurant(restaurant.id, form);
      onUpdated({ ...restaurant, ...form });
      setSaved(true);
    } catch {
      setError("Couldn't save. Try again.");
    } finally {
      setPending(false);
    }
  }

  const fields: { key: keyof typeof form; label: string; textarea?: boolean }[] = [
    { key: "name", label: "Name" },
    { key: "primary_category", label: "Category" },
    { key: "price_range", label: "Price range (£/££/£££/££££)" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "website_url", label: "Website URL" },
    { key: "booking_link", label: "Booking link" },
    { key: "menu_link", label: "Menu link" },
    { key: "full_address", label: "Full address" },
    { key: "opening_hours", label: "Opening hours" },
    { key: "specialities", label: "Specialities" },
    { key: "description", label: "Description", textarea: true },
  ];

  return (
    <div className="mt-4 rounded-xl border border-border bg-muted/50 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className={f.textarea ? "sm:col-span-2" : ""}>
            <label className="block text-xs font-medium text-foreground/60">{f.label}</label>
            {f.textarea ? (
              <textarea
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
              />
            ) : (
              <input
                type="text"
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
              />
            )}
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-foreground/60">Listing status</label>
          <select
            value={form.listing_status}
            onChange={(e) => set("listing_status", e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {saved ? <p className="text-sm text-green-600">Saved.</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
