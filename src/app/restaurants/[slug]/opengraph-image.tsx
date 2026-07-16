import { ImageResponse } from "next/og";
import { getRestaurantBySlug } from "@/lib/data";

export const alt = "Restaurant listing on Seafood Restaurant London";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  const name = restaurant?.name ?? "Seafood Restaurant London";
  const subtitle = [restaurant?.primary_category, restaurant?.location_area].filter(Boolean).join(" · ");
  const rating = restaurant?.rating ? `⭐ ${restaurant.rating.toFixed(1)}` : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f5c53",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: "#fa8072" }}>
          Seafood Restaurant London
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 60, fontWeight: 700, color: "#fbfaf7", lineHeight: 1.15 }}>
            {name}
          </div>
          {subtitle ? (
            <div style={{ display: "flex", fontSize: 32, color: "#fbfaf7", opacity: 0.8, marginTop: 20 }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {rating ? (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 600,
                color: "#0a3d37",
                background: "#fa8072",
                borderRadius: 999,
                padding: "10px 24px",
              }}
            >
              {rating}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size }
  );
}
