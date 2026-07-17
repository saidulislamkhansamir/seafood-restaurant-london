export type Pick = {
  heading?: string;
  name: string;
  slug: string;
  area: string;
  blurb: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  picks?: Pick[];
  closing?: string[];
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
    slug: "best-seafood-boils-in-london",
    title: "Best Seafood Boils in London",
    excerpt: "What a seafood boil actually is, and where in London to get a real one, from Camden to Streatham.",
    content: [
      "A seafood boil is a big, hands-on meal for sharing. The kitchen cooks crab, shrimp and lobster together in a spicy broth, then tips it all onto your table, usually straight out of the bag. You eat with your hands, it gets messy, and that's the whole point.",
      "The style started in the southern United States, where it's known as a Cajun boil. Restaurants there mix Old Bay seasoning, garlic and cayenne pepper into the cooking water. London has picked up the trend fast, especially in East and South London, where a few restaurants now build their whole menu around it.",
      "One thing worth knowing: real all-you-can-eat seafood buffets are rare in London. Most seafood-boil spots don't offer unlimited food. Instead, you order a bag of seafood by weight, pick your spice level, and share it with the table. Expect to pay somewhere between £25 and £40 a head, depending on how much you order.",
    ],
    picks: [
      {
        heading: "Real Cajun-style seafood boils",
        name: "Soulful Seafood",
        slug: "soulful-seafood-whitechapel-spitalfields",
        area: "Whitechapel / Spitalfields, Tower Hamlets",
        blurb:
          "A strong place to start, rated 4.8 stars from over 200 reviews. The menu is built around seafood boils, with crab legs and prawns as the main event.",
      },
      {
        name: "Shrimp Shack Camden",
        slug: "shrimp-shack-camden-camden-marylebone",
        area: "Camden / Marylebone",
        blurb:
          "Over 2,600 reviews and a 4.7-star rating. As the name suggests, shrimp is the star here, served fresh in a boil alongside crab legs.",
      },
      {
        name: "Shrimp Shack Streatham",
        slug: "shrimp-shack-streatham-streatham-norbury",
        area: "Streatham / Norbury, Lambeth",
        blurb:
          "The South London branch of Shrimp Shack, with over 3,600 reviews and the same solid 4.7-star rating. A good pick if you're south of the river and craving a boil.",
      },
      {
        name: "Hot n Juicy Shrimp LDN – Dulwich",
        slug: "hot-n-juicy-shrimp-ldn-dulwich-dulwich",
        area: "Dulwich, Southwark",
        blurb:
          "Rounds out the South London boil scene with a 4.7-star rating from over 2,700 reviews. Shrimp and crab legs, boiled together with your choice of sauce and spice level.",
      },
      {
        heading: "Prefer something a bit more refined?",
        name: "Oysteria",
        slug: "oysteria-canary-wharf-isle-of-dogs",
        area: "Canary Wharf / Isle of Dogs, Tower Hamlets",
        blurb:
          "If you'd rather sit down to a proper seafood platter than dig through a bag, Oysteria is rated 4.7 stars from nearly 1,900 reviews, and specialises in oysters, scallops and seafood platters.",
      },
      {
        name: "Ocean Basket Kingston",
        slug: "ocean-basket-kingston-kingston-upon-thames",
        area: "Kingston upon Thames",
        blurb:
          "One of the highest-rated spots on this list at 4.8 stars from over 3,700 reviews, with fresh seafood, calamari, grilled fish and prawns on the menu.",
      },
    ],
    closing: [
      "Want more options beyond these six? We've listed every seafood restaurant in London with ratings, hours and booking links in one place.",
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
