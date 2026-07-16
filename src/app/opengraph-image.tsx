import { ImageResponse } from "next/og";

export const alt = "Seafood Restaurant London";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f5c53",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "#fbfaf7",
            marginBottom: 40,
          }}
        >
          <div style={{ display: "flex", fontSize: 56 }}>🐟</div>
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#fbfaf7" }}>
          Seafood Restaurant London
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#fa8072", marginTop: 20 }}>
          Find the Best Seafood in the City
        </div>
      </div>
    ),
    { ...size }
  );
}
