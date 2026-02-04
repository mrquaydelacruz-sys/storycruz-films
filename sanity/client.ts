import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// Sanity projectId allows only a-z, 0-9, and dashes. Always use fallbacks so build never gets undefined.
const SANITY_PROJECT_ID = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a2hh2h81").trim() || "a2hh2h81";
const SANITY_DATASET = (process.env.NEXT_PUBLIC_SANITY_DATASET || "production").trim() || "production";

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false, // Set to false for fresh data during development
});

const builder = imageUrlBuilder(client);

// This helper function automatically generates the URL for your photos
export function urlFor(source: any) {
  return builder.image(source);
}