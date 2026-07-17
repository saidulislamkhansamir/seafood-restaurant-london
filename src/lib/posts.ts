export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
};

export const POSTS: Post[] = [
  {
    slug: "best-oyster-happy-hours-in-london",
    title: "Best Oyster Happy Hours in London",
    excerpt: "Where to get quality oysters at a discount across the capital, from Soho to Canary Wharf.",
    content: [
      "London's oyster bar scene has quietly become one of the best in Europe, and a growing number of spots run genuinely good happy hour deals rather than treating oysters as a once-a-year treat.",
      "Look out for oyster bars in Soho and Covent Garden offering half-price shellfish during early evening sittings, a great way to try a venue before committing to a full dinner.",
      "Browse our full list of oyster bars across London to find one near you, complete with opening hours and booking links.",
    ],
  },
  {
    slug: "top-10-seafood-buffets-in-london",
    title: "Top 10 Seafood Buffets in London",
    excerpt: "All-you-can-eat seafood spots worth the trip, from casual crab shacks to riverside buffets.",
    content: [
      "Seafood buffets are having a moment in London, with crab shacks and seafood-boil restaurants popping up across boroughs like Tower Hamlets, Croydon and Lambeth.",
      "These spots tend to specialise in Cajun-style seafood boils (crab, shrimp and lobster served in a bag with corn and sausage), a format that's spread fast through East and South London.",
      "Check our seafood restaurant category page for the full, regularly updated list.",
    ],
  },
  {
    slug: "where-to-eat-fresh-lobster-in-london",
    title: "Where to Eat Fresh Lobster in London",
    excerpt: "From Mayfair institutions to casual lobster-and-burger chains, here's where to find it.",
    content: [
      "Lobster in London ranges from the whole-lobster-and-chips casual chains found in Soho, Mayfair and Canary Wharf, to the white-tablecloth seafood institutions of St James's and Knightsbridge.",
      "If you're after something more casual, the lobster-roll-and-burger format has multiple London locations and consistently good reviews.",
      "For a special occasion, the historic Mayfair seafood restaurants dating back to the 1800s remain some of the best-reviewed lobster spots in the city.",
    ],
  },
];
