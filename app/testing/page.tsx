import type { Metadata } from 'next'
import TestingPackageBuilder from '@/components/TestingPackageBuilder'
import { fetchPackageBuilderBriefBySlug } from '@/lib/package-builder-fetch'
import { resolvePackageBuilderPage } from '@/lib/package-builder-content'
import { fetchInvestmentPricingForPackage } from '@/lib/package-builder-fetch-pricing'
import { DEFAULT_INVESTMENT_GUIDE_SLUG } from '@/lib/pricing-to-package-catalog'

export const metadata: Metadata = {
  title: 'Build your package',
  robots: {
    index: false,
    follow: false,
  },
}

export const revalidate = 60

/** Optional brief slug `sandbox` — same shape as client `/package/[slug]` links (noindex QA route). */
const SANDBOX_SLUG = 'sandbox'

export default async function TestingPage() {
  const doc = await fetchPackageBuilderBriefBySlug(SANDBOX_SLUG)

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
      submissionSlug={doc ? SANDBOX_SLUG : 'testing'}
    />
  )
}
