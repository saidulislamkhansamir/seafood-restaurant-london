"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function NearMeButton({ active }: { active: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  function clearDistanceSort() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("lat");
    params.delete("lng");
    params.delete("sort");
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/restaurants?${qs}` : "/restaurants");
  }

  function handleClick() {
    if (active) {
      clearDistanceSort();
      return;
    }
    if (!("geolocation" in navigator)) {
      setError(true);
      return;
    }
    setPending(true);
    setError(false);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("lat", String(position.coords.latitude));
        params.set("lng", String(position.coords.longitude));
        params.set("sort", "distance");
        params.delete("page");
        setPending(false);
        router.push(`/restaurants?${params.toString()}`);
      },
      () => {
        setPending(false);
        setError(true);
      }
    );
  }

  return (
    <div className="inline-flex flex-col">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
          active
            ? "border-primary bg-primary text-white"
            : "border-border bg-white text-foreground/70 hover:border-primary hover:text-primary"
        }`}
      >
        📍 {pending ? "Finding you…" : active ? "Sorted by distance — clear" : "Sort by distance"}
      </button>
      {error ? (
        <span className="mt-1 text-xs text-red-600">
          Couldn&apos;t get your location. Check your browser&apos;s location permission.
        </span>
      ) : null}
    </div>
  );
}
