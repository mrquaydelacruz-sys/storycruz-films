import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false, // Set to false for fresh data during development
});

const builder = imageUrlBuilder(client);

// This helper function automatically generates the URL for your photos
export function urlFor(source: any) {
  return builder.image(source);
}