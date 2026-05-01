import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from './env'

// This client has write permissions for creating documents
// Requires SANITY_API_TOKEN environment variable with write access
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Server-side only, not exposed to client
})
