import type { Metadata } from 'next'
import TestingPackageBuilder from '@/components/TestingPackageBuilder'
import { fetchPackageBuilderBriefBySlug } from '@/lib/package-builder-fetch'
import { resolvePackageBuilderPage } from '@/lib/package-builder-content'
import { fetchInvestmentPricingForPackage } from '@/lib/package-builder-fetch-pricing'
import { DEFAULT_INVESTMENT_GUIDE_SLUG } from '@/lib/pricing-to-package-catalog'

/** Sanity `packageBuilderBrief` slug for the public page at `/investment/package-builder`. */
const PUBLIC_BUILDER_BRIEF_SLUG = 'package-builder'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Build your package | Story Cruz Films',
  description:
    'Choose photography and cinematography collections, customize inclusions, and send your draft to Story Cruz Films.',
  robots: {
    index: true,
    follow: true,
  },
}

export default async function InvestmentPackageBuilderPage() {
  const doc = await fetchPackageBuilderBriefBySlug(PUBLIC_BUILDER_BRIEF_SLUG)

  const shouldLoadGuide = doc == null || doc.useInvestmentGuide !== false
  const pricingSlug =
    doc?.investmentPricingSlug?.trim() || DEFAULT_INVESTMENT_GUIDE_SLUG

  const pricing = shouldLoadGuide
    ? await fetchInvestmentPricingForPackage(pricingSlug)
    : null

  const content = resolvePackageBuilderPage({
    brief: doc,
    pricing,
    strictOfferings: doc != null,
  })

  return (
    <TestingPackageBuilder
      {...content}
      submissionSlug="investment/package-builder"
    />
  )
}
