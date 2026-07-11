// One-off data import: reads the scraped CSV + location reference CSV and
// upserts into Supabase via the anon key (a temporary permissive insert
// policy is applied before running this, and revoked after).
// Run with: node scripts/import.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const envText = fs.readFileSync(path.join(root, ".env.local"), "utf-8");
const env = Object.fromEntries(
  envText
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      if (field !== "" || row.length > 0) {
        row.push(field);
        rows.push(row);
      }
      row = [];
      field = "";
    } else if (c === "\r") {
      // skip
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function naToNull(val) {
  if (val === undefined) return null;
  const v = val.trim();
  if (v === "" || v.toUpperCase() === "N/A") return null;
  return v;
}

function splitList(val) {
  const v = naToNull(val);
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function importRestaurants() {
  const csvText = fs.readFileSync(path.join(root, "data", "restaurants.csv"), "utf-8");
  const rows = parseCsv(csvText);
  const header = rows[0];
  const dataRows = rows.slice(1).filter((r) => r.length > 1 && r[0].trim() !== "");
  const col = (row, name) => row[header.indexOf(name)];

  const usedSlugs = new Set();
  const records = dataRows.map((row) => {
    const name = col(row, "Business Name").trim();
    const area = naToNull(col(row, "Location")) || "";
    let slug = slugify(`${name} ${area}`);
    let uniqueSlug = slug;
    let n = 2;
    while (usedSlugs.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${n}`;
      n++;
    }
    usedSlugs.add(uniqueSlug);

    return {
      slug: uniqueSlug,
      name,
      primary_category: naToNull(col(row, "GBP Primary Category")),
      subcategories: splitList(col(row, "GBP Subcategories")),
      phone: naToNull(col(row, "Phone Number")),
      website_url: naToNull(col(row, "Website URL")),
      google_maps_url: naToNull(col(row, "Google Maps URL")),
      rating: naToNull(col(row, "Star Rating")) ? Number(naToNull(col(row, "Star Rating"))) : null,
      review_count: naToNull(col(row, "Review Count")) ? Number(naToNull(col(row, "Review Count"))) : null,
      price_range: naToNull(col(row, "Price Range")),
      opening_hours: naToNull(col(row, "Opening Hours")),
      description: naToNull(col(row, "GBP Description")),
      attributes: splitList(col(row, "GBP Attributes")),
      verified: col(row, "GBP Verified").trim().toLowerCase() === "yes",
      latest_review_date: naToNull(col(row, "Latest Review Date")),
      photos_count: naToNull(col(row, "Google Photos Count"))
        ? Number(naToNull(col(row, "Google Photos Count")))
        : null,
      full_address: naToNull(col(row, "Full Address")),
      location_area: area || null,
      borough: naToNull(col(row, "Borough")),
      postcode: naToNull(col(row, "Postcode")),
      postcode_district: naToNull(col(row, "Postcode District")),
      lat: naToNull(col(row, "Latitude")) ? Number(naToNull(col(row, "Latitude"))) : null,
      lng: naToNull(col(row, "Longitude")) ? Number(naToNull(col(row, "Longitude"))) : null,
      cuisine_tags: splitList(col(row, "Cuisine Tags")),
      specialities: naToNull(col(row, "Seafood Specialities")),
      booking_link: naToNull(col(row, "Booking Link")),
      menu_link: naToNull(col(row, "Menu Link")),
      delivery_platforms: splitList(col(row, "Delivery Platforms")),
      has_website: col(row, "Has Website").trim().toLowerCase() === "yes",
      has_booking: col(row, "Has Booking").trim().toLowerCase() === "yes",
      has_delivery: col(row, "Has Delivery").trim().toLowerCase() === "yes",
      listing_status: naToNull(col(row, "Listing Status")) || "Active",
    };
  });

  const { error, count } = await supabase.from("restaurants").insert(records, { count: "exact" });
  if (error) throw new Error(`restaurants insert failed: ${error.message}`);
  console.log(`Imported ${records.length} restaurants.`);
}

async function importLocations() {
  const locCsvText = fs.readFileSync(path.join(root, "data", "locations.csv"), "utf-8");
  const locRows = parseCsv(locCsvText)
    .slice(1)
    .filter((r) => r.length > 1 && r[1] && r[1].trim() !== "");

  const usedLocSlugs = new Set();
  const records = locRows.map((row) => {
    const name = row[1].trim();
    const borough = naToNull(row[2]);
    const postcodeDistrict = naToNull(row[3]);
    let slug = slugify(name);
    let uniqueSlug = slug;
    let n = 2;
    while (usedLocSlugs.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${n}`;
      n++;
    }
    usedLocSlugs.add(uniqueSlug);
    return { name, slug: uniqueSlug, borough, postcode_district: postcodeDistrict };
  });

  const { error } = await supabase.from("locations").insert(records);
  if (error) throw new Error(`locations insert failed: ${error.message}`);
  console.log(`Imported ${records.length} locations.`);
}

await importRestaurants();
await importLocations();
