"use client";

import { useEffect, useRef } from "react";
import type { Restaurant } from "@/lib/data";
import "leaflet/dist/leaflet.css";

type Pin = Pick<Restaurant, "id" | "slug" | "name" | "lat" | "lng" | "primary_category">;

export function RestaurantsMap({ restaurants }: { restaurants: Pin[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pins = restaurants.filter(
      (r): r is Pin & { lat: number; lng: number } => r.lat != null && r.lng != null
    );
    if (pins.length === 0 || !containerRef.current) return;

    let cancelled = false;
    let map: import("leaflet").Map | undefined;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      // Avoid re-initializing if effect re-runs before cleanup on fast navigation.
      containerRef.current.innerHTML = "";
      map = L.map(containerRef.current);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: '<div style="width:16px;height:16px;border-radius:50%;background:#e11d48;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]));
      for (const p of pins) {
        L.marker([p.lat, p.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<a href="/restaurants/${p.slug}" style="font-weight:600;color:#0f172a">${escapeHtml(p.name)}</a>${
              p.primary_category ? `<br/><span style="color:#64748b;font-size:12px">${escapeHtml(p.primary_category)}</span>` : ""
            }`
          );
      }
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 15 });
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [restaurants]);

  const hasPins = restaurants.some((r) => r.lat != null && r.lng != null);

  if (!hasPins) {
    return (
      <p className="rounded-2xl border border-border bg-muted p-10 text-center text-sm text-foreground/60">
        None of these restaurants have map coordinates yet.
      </p>
    );
  }

  return <div ref={containerRef} className="h-[32rem] w-full rounded-2xl border border-border" />;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
