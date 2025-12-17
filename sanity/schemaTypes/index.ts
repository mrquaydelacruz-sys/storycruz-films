import { type SchemaTypeDefinition } from 'sanity'
import homepage from './homepage'
import siteContent from './siteContent'
// Import your new files
import film from './film'
import photoGallery from './photoGallery'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    homepage,
    siteContent,
    film,         // <--- Ensure this is here
    photoGallery, // <--- Ensure this is here
  ],
}