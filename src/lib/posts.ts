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
    slug: "best-oyster-bars-in-london",
    title: "Best Oyster Bars in London",
    excerpt: "From casual Soho spots to long-running institutions, here's where to get good oysters across the capital.",
    content: [
      "London has a genuinely good oyster scene. You can find them everywhere from a quick counter seat in Soho to a proper sit-down dinner in Covent Garden, and the quality is usually high whichever way you go.",
      "A quick note if you're searching for oyster happy hours: some restaurants do run early-evening deals, but these change often and aren't something we can guarantee is running right now. Your best bet is to call ahead or check the restaurant's own site before you go. What we can promise is that every restaurant below is a genuinely well-reviewed place to eat oysters, deal or no deal.",
      "Oysters usually come two ways: native (in season roughly September to April, richer and more expensive) or rock oysters (available all year, milder and cheaper). Most of the restaurants below serve both, so you can compare side by side.",
    ],
    picks: [
      {
        heading: "Casual and easygoing",
        name: "The Whistling Oyster",
        slug: "the-whistling-oyster-chiswick",
        area: "Chiswick, Hounslow",
        blurb:
          "The highest-rated oyster spot on this list at 4.8 stars, though from a smaller base of around 150 reviews. Oysters and fresh seafood are the whole point here.",
      },
      {
        name: "Oysteria",
        slug: "oysteria-canary-wharf-isle-of-dogs",
        area: "Canary Wharf / Isle of Dogs, Tower Hamlets",
        blurb:
          "Rated 4.7 stars from nearly 1,900 reviews. Alongside oysters, it does scallops and full seafood platters if you want to share more than one dish.",
      },
      {
        name: "Noisy Oyster Seafood Bistro",
        slug: "noisy-oyster-seafood-bistro-whitechapel-spitalfields",
        area: "Whitechapel / Spitalfields, Tower Hamlets",
        blurb:
          "A 4.6-star bistro with over 600 reviews, pairing oysters and fresh seafood with a solid cocktail list.",
      },
      {
        name: "Randall & Aubin",
        slug: "randall-and-aubin-soho-carnaby",
        area: "Soho / Carnaby, Westminster",
        blurb:
          "A Soho fixture with over 2,100 reviews and a 4.6-star rating. It runs a champagne bar alongside its oysters and fresh fish, good for a celebration.",
      },
      {
        heading: "Long-running favourites for a proper sit-down meal",
        name: "J Sheekey",
        slug: "j-sheekey-covent-garden",
        area: "Covent Garden, Westminster",
        blurb:
          "A well-known Covent Garden address rated 4.5 stars from over 2,600 reviews. Oysters sit on the menu alongside lobster, fish pie and skate wing.",
      },
      {
        name: "Bentley's Oyster Bar & Grill",
        slug: "bentley-s-oyster-bar-and-grill-soho-west-end",
        area: "Soho / West End, Westminster",
        blurb:
          "Rated 4.5 stars from over 2,000 reviews. As the name suggests, native oysters are the specialty, alongside grilled fish and lobster.",
      },
      {
        name: "The Oystermen Seafood Bar & Kitchen",
        slug: "the-oystermen-seafood-bar-and-kitchen-covent-garden",
        area: "Covent Garden, Westminster",
        blurb:
          "A small, focused Covent Garden kitchen rated 4.5 stars from over 1,700 reviews, built entirely around oysters and fresh shellfish.",
      },
      {
        name: "Wright Brothers Borough Market",
        slug: "wright-brothers-borough-market-southwark-london-bridge",
        area: "Borough Market, Southwark",
        blurb:
          "Rated 4.4 stars from over 1,400 reviews. A Borough Market institution serving oysters and seafood platters right by the market stalls.",
      },
    ],
    closing: [
      "Want to see every oyster and seafood spot we've listed, not just these eight? Browse the full seafood category with ratings, hours and booking links.",
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
    excerpt: "From long-running Mayfair institutions to casual lobster-and-burger chains, here's where to find it.",
    content: [
      "Lobster in London covers a lot of ground. On one end, you've got casual whole-lobster-and-chips chains where you can turn up in jeans. On the other, there are white-tablecloth seafood restaurants where lobster has been on the menu for decades.",
      "Both are worth trying, and neither costs the same amount. Casual lobster rolls and burgers usually run £15 to £25. A proper sit-down whole lobster dinner at an upscale restaurant can run £40 to £70 or more per person.",
    ],
    picks: [
      {
        heading: "Casual and fun",
        name: "Burger & Lobster – West India Quay",
        slug: "burger-and-lobster-west-india-quay-canary-wharf-isle-of-dogs",
        area: "Canary Wharf / Isle of Dogs, Tower Hamlets",
        blurb:
          "This casual chain has several branches across London, and this Canary Wharf one has the most reviews of any of them: over 10,000, at a 4.7-star rating. Order the whole lobster or a lobster roll, both come simple, with no fuss.",
      },
      {
        name: "The Cajun Boil",
        slug: "the-cajun-boil-bethnal-green",
        area: "Bethnal Green, Tower Hamlets",
        blurb:
          "Rated 4.7 stars from 250 reviews. For a messier, hands-on lobster meal, this Bethnal Green spot serves a Cajun-style seafood boil with crab and lobster tipped straight onto your table.",
      },
      {
        name: "Big Easy Bar.B.Q & Crabshack – Canary Wharf",
        slug: "big-easy-bar-b-q-and-crabshack-canary-wharf-canary-wharf-isle-of-dogs",
        area: "Canary Wharf / Isle of Dogs, Tower Hamlets",
        blurb:
          "The most-reviewed restaurant on this whole list, with over 14,000 reviews at a 4.4-star rating. Crab, lobster, jumbo shrimp and BBQ ribs all on one big American-style menu.",
      },
      {
        heading: "For a special occasion",
        name: "Scott's",
        slug: "scott-s-mayfair",
        area: "Mayfair, Westminster",
        blurb:
          "A well-known Mayfair address rated 4.6 stars from nearly 3,000 reviews. Lobster and native oysters are the standouts on a proper, dress-up-a-little menu.",
      },
      {
        name: "J Sheekey",
        slug: "j-sheekey-covent-garden",
        area: "Covent Garden, Westminster",
        blurb:
          "Rated 4.5 stars from over 2,600 reviews. A long-running Covent Garden institution, known for its lobster, fish pie and skate wing.",
      },
      {
        name: "Bentley's Oyster Bar & Grill",
        slug: "bentley-s-oyster-bar-and-grill-soho-west-end",
        area: "Soho / West End, Westminster",
        blurb:
          "Rated 4.5 stars from over 2,000 reviews. Alongside its famous oysters, Bentley's serves lobster and grilled fish in a classic, formal setting.",
      },
    ],
    closing: [
      "Fancy something else instead? Browse every seafood restaurant we've listed across London, with ratings, hours and booking links in one place.",
    ],
  },
];
