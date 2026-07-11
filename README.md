# Seafood Restaurant London

Restaurant directory for London — seafood, fish & chips, takeaway and more — built with Next.js
and Supabase.

## Stack

- Next.js (App Router, TypeScript, Tailwind CSS)
- Supabase (Postgres) for restaurant listings, the location reference, and "Add Your Restaurant"
  submissions
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

Requires a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Data import

`data/restaurants.csv` and `data/locations.csv` are the source datasets. `scripts/import.mjs`
upserts them into Supabase — it needs a temporary permissive insert policy on `restaurants` and
`locations` applied first (see the comment at the top of the script), since imports run with the
anon key and RLS otherwise only allows public reads.

## Project structure

- `src/app` — routes (home, restaurants, category/borough pages, blog, add-your-restaurant)
- `src/lib/data.ts` — all Supabase data-fetching functions
- `src/components` — shared UI (header, footer, restaurant card, search)
