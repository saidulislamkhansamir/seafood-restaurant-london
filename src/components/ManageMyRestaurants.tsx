"use client";

import { useEffect, useState } from "react";
import {
  getMyClaimedRestaurants,
  submitEditRequest,
  getMyEditRequests,
  checkIsBanned,
  type Restaurant,
  type MyEditRequest,
  type OwnerEditableFields,
} from "@/lib/data";

export function ManageMyRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
  const [banned, setBanned] = useState(false);

  useEffect(() => {
    getMyClaimedRestaurants()
      .then(setRestaurants)
      .catch(() => setRestaurants([]));
    checkIsBanned().then(setBanned);
  }, []);

  if (!restaurants || restaurants.length === 0) return null;

  return (
    <div className="mt-10 border-t border-border pt-8">
      <h2 className="text-lg font-bold">Manage My Restaurant{restaurants.length > 1 ? "s" : ""}</h2>
      <div className="mt-4 space-y-4">
        {banned ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            This account is currently restricted from submitting changes.
          </p>
        ) : null}
        {restaurants.map((r) => (
          <RestaurantManager key={r.id} restaurant={r} disabled={banned} />
        ))}
      </div>
    </div>
  );
}

function RestaurantManager({ restaurant, disabled }: { restaurant: Restaurant; disabled: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [requests, setRequests] = useState<MyEditRequest[] | null>(null);

  function reloadRequests() {
    getMyEditRequests(restaurant.id).then(setRequests);
  }

  useEffect(() => {
    if (expanded && requests === null) reloadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{restaurant.name}</p>
          <p className="text-xs text-foreground/50">
            {restaurant.primary_category}
            {restaurant.location_area ? ` · ${restaurant.location_area}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-primary hover:text-primary"
        >
          {expanded ? "Close" : "Manage"}
        </button>
      </div>

      {expanded ? (
        <div className="mt-4 space-y-6">
          <EditForm restaurant={restaurant} disabled={disabled} onSubmitted={reloadRequests} />
          {requests && requests.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold">Your submitted changes</h3>
              <div className="mt-2 divide-y divide-border text-sm">
                {requests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-2">
                    <span className="text-xs text-foreground/50">
                      {new Date(req.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-800 border-amber-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-gray-100 text-gray-600 border-gray-300",
  };
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${styles[status] ?? styles.pending}`}>
      {status}
    </span>
  );
}

function EditForm({
  restaurant,
  disabled,
  onSubmitted,
}: {
  restaurant: Restaurant;
  disabled: boolean;
  onSubmitted: () => void;
}) {
  const [form, setForm] = useState<Required<OwnerEditableFields>>({
    description: restaurant.description ?? "",
    phone: restaurant.phone ?? "",
    opening_hours: restaurant.opening_hours ?? "",
    website_url: restaurant.website_url ?? "",
    menu_link: restaurant.menu_link ?? "",
    booking_link: restaurant.booking_link ?? "",
    specialities: restaurant.specialities ?? "",
  });
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setDone(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await submitEditRequest(restaurant.id, form);
      setDone(true);
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  const fields: { key: keyof typeof form; label: string; textarea?: boolean }[] = [
    { key: "phone", label: "Phone" },
    { key: "opening_hours", label: "Opening hours" },
    { key: "website_url", label: "Website URL" },
    { key: "menu_link", label: "Menu link" },
    { key: "booking_link", label: "Booking link" },
    { key: "specialities", label: "Specialities" },
    { key: "description", label: "Description", textarea: true },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-sm font-semibold">Suggest changes</h3>
      <p className="mt-1 text-xs text-foreground/60">
        Submitted changes are reviewed before they go live on your listing.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className={f.textarea ? "sm:col-span-2" : ""}>
            <label className="block text-xs font-medium text-foreground/60">{f.label}</label>
            {f.textarea ? (
              <textarea
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                rows={3}
                disabled={disabled}
                className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none disabled:opacity-60"
              />
            ) : (
              <input
                type="text"
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                disabled={disabled}
                className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none disabled:opacity-60"
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || disabled}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit for review"}
        </button>
        {done ? <p className="text-sm text-green-600">Submitted — an admin will review it soon.</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </form>
  );
}
