export type NearbyParking = { name: string; distanceMeters: number; fee: boolean | null };

export function parseNearbyParking(json: unknown): NearbyParking[] {
  if (!Array.isArray(json)) return [];
  return json.filter(
    (p): p is NearbyParking =>
      Boolean(p) &&
      typeof p === "object" &&
      typeof (p as NearbyParking).name === "string" &&
      typeof (p as NearbyParking).distanceMeters === "number"
  );
}
