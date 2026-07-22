import { parseNearbyParking } from "@/lib/nearby-parking";
import { walkTime } from "@/lib/nearby-stations";

export function NearbyParking({ data }: { data: unknown }) {
  const parking = parseNearbyParking(data);
  if (parking.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="mb-2 text-sm font-semibold text-foreground/50">Nearby Parking</h2>
      <ul className="space-y-1.5 text-sm">
        {parking.map((p, i) => (
          <li key={`${p.name}-${i}`} className="flex items-center justify-between gap-3">
            <span>
              {p.name}
              {p.fee === true ? <span className="text-foreground/50"> · paid</span> : null}
              {p.fee === false ? <span className="text-foreground/50"> · free</span> : null}
            </span>
            <span className="shrink-0 text-foreground/50">{walkTime(p.distanceMeters)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
