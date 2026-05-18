import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

import { apiVersion, dataset, projectId } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN in production for faster reads; API direct in dev for fresher drafts.
  useCdn: process.env.NODE_ENV === 'production',
})

const builder = imageUrlBuilder(client);

// This helper function automatically generates the URL for your photos
export function urlFor(source: any) {
  return builder.image(source);
}