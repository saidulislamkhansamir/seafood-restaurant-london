// Free OpenStreetMap iframe embed — no API key, no billing, no quota.
export function MapEmbed({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const delta = 0.004;
  const bbox = [lng - delta, lat - delta * 0.6, lng + delta, lat + delta * 0.6].join("%2C");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <iframe
      title={`Map showing ${label}`}
      src={src}
      className="h-48 w-full rounded-xl border border-border"
      loading="lazy"
    />
  );
}
