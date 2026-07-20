export type NearbyStation = { name: string; distanceMeters: number; modes: string[] };

export function parseNearbyStations(json: unknown): NearbyStation[] {
  if (!Array.isArray(json)) return [];
  return json.filter(
    (s): s is NearbyStation =>
      Boolean(s) &&
      typeof s === "object" &&
      typeof (s as NearbyStation).name === "string" &&
      typeof (s as NearbyStation).distanceMeters === "number"
  );
}

export function walkTime(meters: number): string {
  const minutes = Math.max(1, Math.round(meters / 80));
  return `${minutes} min walk`;
}
