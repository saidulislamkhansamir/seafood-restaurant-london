import { parseNearbyStations, walkTime } from "@/lib/nearby-stations";

export function NearbyStations({ data }: { data: unknown }) {
  const stations = parseNearbyStations(data);
  if (stations.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="mb-2 text-sm font-semibold text-foreground/50">Nearby Stations</h2>
      <ul className="space-y-1.5 text-sm">
        {stations.map((s) => (
          <li key={s.name} className="flex items-center justify-between gap-3">
            <span>{s.name}</span>
            <span className="shrink-0 text-foreground/50">{walkTime(s.distanceMeters)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
