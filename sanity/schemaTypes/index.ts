import { type SchemaTypeDefinition } from 'sanity'
import homepage from './homepage'
import siteContent from './siteContent'
import pricing from './pricing' // <--- You already had this, which is great!

// Import your new files
import film from './film'
import photoGallery from './photoGallery'
import commercialInquiry from './commercialInquiry'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    homepage,
    siteContent,
    pricing,      // <--- ADD THIS HERE so Sanity knows to use it!
    film,
    photoGallery,
    commercialInquiry,
  ],
}