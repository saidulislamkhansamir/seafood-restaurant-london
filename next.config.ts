import type { NextConfig } from "next";

// Slugs renamed during the 2026-07 duplicate-listing cleanup — redirect
// the old URLs so links to them (bookmarks, shares) don't 404.
const RENAMED_RESTAURANT_SLUGS: [string, string][] = [
  ["chai-wu-harrods-knightsbridge-2", "chai-wu-harrods-knightsbridge"],
  ["ci-tua-osteria-romana-notting-hill-2", "ci-tua-osteria-romana-notting-hill"],
  ["park-chinois-mayfair-west-end-2", "park-chinois-mayfair-west-end"],
  ["syon-lounge-brentford-syon-park-2", "syon-lounge-brentford-syon-park"],
  ["the-eadn-london-bar-and-lounge-canning-town-west-ham-2", "the-eadn-london-bar-and-lounge-canning-town-west-ham"],
  ["aram-by-imad-strand-covent-garden-2", "aram-by-imad-strand-covent-garden"],
  ["dice-roll-002-indian-counter-knightsbridge", "viras-harrods-food-hall-knightsbridge"],
  ["l-oscar-restaurant-l-oscar-london-holborn-bloomsbury", "l-oscar-restaurant-holborn-bloomsbury"],
];

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
  async redirects() {
    return RENAMED_RESTAURANT_SLUGS.map(([from, to]) => ({
      source: `/restaurants/${from}`,
      destination: `/restaurants/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
