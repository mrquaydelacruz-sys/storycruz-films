import { createClient } from "next-sanity";

// This client has write permissions for creating documents
// Requires SANITY_API_TOKEN environment variable with write access
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Server-side only, not exposed to client
});
