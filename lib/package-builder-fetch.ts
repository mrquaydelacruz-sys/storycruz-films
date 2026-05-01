import { client } from '@/sanity/client'
import type { PackageBuilderGroqDoc } from '@/lib/package-builder-content'

/** GROQ for one brief by slug (merged server-side with Hidden Pricing Page rows when enabled). */
export const PACKAGE_BUILDER_BRIEF_QUERY = `
*[_type == "packageBuilderBrief" && slug.current == $slug][0]{
  pageEyebrow,
  pageTitle,
  pageIntro,
  photoColumnTitle,
  photoColumnSubtitle,
  videoColumnTitle,
  videoColumnSubtitle,
  photoOfferings[]{ _key, key, title, description, price, included,
    optionalPackageAddOns[]{ key, title, description, price, addonTotalsToward }
  },
  videoOfferings[]{ _key, key, title, description, price, included,
    optionalPackageAddOns[]{ key, title, description, price, addonTotalsToward }
  },
  addonSectionTitle,
  addonSectionSubtitle,
  addonOfferings[]{ _key, key, title, description, price, included, addonTotalsToward },
  variablesSectionTitle,
  variablesSectionSubtitle,
  packageVariables[]{
    _key,
    key,
    title,
    description,
    variableKind,
    unitLabel,
    minQuantity,
    maxQuantity,
    defaultQuantity,
    pricePerUnit,
    quantityTotalsToward,
    pickAllowMultiple,
    pickOptions[]{ _key, key, title, description, price, included, addonTotalsToward }
  },
  useInvestmentGuide,
  investmentPricingSlug
}
`

export async function fetchPackageBuilderBriefBySlug(
  slug: string
): Promise<PackageBuilderGroqDoc | null> {
  const normalized = slug.trim().toLowerCase()
  if (!normalized) return null
  try {
    return await client.fetch<PackageBuilderGroqDoc | null>(PACKAGE_BUILDER_BRIEF_QUERY, {
      slug: normalized,
    })
  } catch {
    return null
  }
}
