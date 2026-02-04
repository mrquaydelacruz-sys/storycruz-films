import { createClient } from "next-sanity";

// Same fallbacks as sanity/client.ts so build never gets invalid projectId/dataset
const SANITY_PROJECT_ID = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a2hh2h81").trim() || "a2hh2h81";
const SANITY_DATASET = (process.env.NEXT_PUBLIC_SANITY_DATASET || "production").trim() || "production";

// This client has write permissions for creating documents
// Requires SANITY_API_TOKEN environment variable with write access
export const writeClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Server-side only, not exposed to client
});
