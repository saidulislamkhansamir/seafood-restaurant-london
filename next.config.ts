import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tprriulqoigcdduhcvvj.supabase.co",
        pathname: "/storage/v1/object/public/restaurant-photos/**",
      },
    ],
  },
};

export default nextConfig;
