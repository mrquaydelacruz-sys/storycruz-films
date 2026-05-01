import { client } from '@/sanity/client'
import type { PricingForPackageGroq } from '@/lib/package-builder-content'
import { DEFAULT_INVESTMENT_GUIDE_SLUG } from '@/lib/pricing-to-package-catalog'

const QUERY = `
*[_type == "pricing" && slug.current == $slug][0]{
  title,
  "heroVideoUrl": heroVideo.asset->url,
  videoPackages[]{ name, price, description, features, optionalAddOns[]{ key, title, description, price, addonTotalsToward } },
  photoPackages[]{ name, price, description, features, optionalAddOns[]{ key, title, description, price, addonTotalsToward } },
  seasonalCollections
}
`

/** Loads the Hidden Pricing Page document whose public URL is /investment/&lt;slug&gt;. */
export async function fetchInvestmentPricingForPackage(
  slug?: string | null
): Promise<PricingForPackageGroq> {
  const normalized = (slug ?? DEFAULT_INVESTMENT_GUIDE_SLUG).trim() || DEFAULT_INVESTMENT_GUIDE_SLUG
  try {
    return await client.fetch<PricingForPackageGroq>(QUERY, { slug: normalized })
  } catch {
    return null
  }
}
