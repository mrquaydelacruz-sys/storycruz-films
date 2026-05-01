import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

import { apiVersion, dataset, projectId } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false for fresh data during development
})

const builder = imageUrlBuilder(client);

// This helper function automatically generates the URL for your photos
export function urlFor(source: any) {
  return builder.image(source);
}