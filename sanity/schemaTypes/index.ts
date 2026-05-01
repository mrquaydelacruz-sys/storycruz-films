import { type SchemaTypeDefinition } from 'sanity'
import homepage from './homepage'
import siteContent from './siteContent'
import pricing from './pricing' // <--- You already had this, which is great!

// Import your new files
import film from './film'
import photoGallery from './photoGallery'
import commercialInquiry from './commercialInquiry'
import packageBuilderOffering from './packageBuilderOffering'
import packageBuilderBrief from './packageBuilderBrief'
import packageBuilderVariable from './packageBuilderVariable'
import packageOptionalAddOn from './packageOptionalAddOn'
import pricingPackageFeature from './pricingPackageFeature'
import pricingPlainFeatureLine from './pricingPlainFeatureLine'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    homepage,
    siteContent,
    pricingPackageFeature,
    pricingPlainFeatureLine,
    packageOptionalAddOn,
    pricing,
    film,
    photoGallery,
    commercialInquiry,
    packageBuilderOffering,
    packageBuilderVariable,
    packageBuilderBrief,
  ],
}