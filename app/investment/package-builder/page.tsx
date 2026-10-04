import type { Metadata } from 'next'
import InvestmentGuidePage from '@/components/investment-guide/InvestmentGuidePage'
import TestingPackageBuilder from '@/components/TestingPackageBuilder'
import { getInvestmentGuideBuilderProps } from '@/lib/investment-guide-data'
import { fetchInvestmentPricingForPackage } from '@/lib/package-builder-fetch-pricing'
import { DEFAULT_INVESTMENT_GUIDE_SLUG } from '@/lib/pricing-to-package-catalog'

/**
 * Public Investment Guide — catalogs and displayed prices share one module
 * (`lib/investment-guide-data.ts`) so totals cannot drift from the cards.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Investment Guide | Story Cruz Films',
  description:
    'Wedding and elopement photography and cinematography collections across Alberta and beyond.',
  robots: {
    index: true,
    follow: true,
  },
}

export default async function InvestmentPackageBuilderPage() {
  const content = getInvestmentGuideBuilderProps()
  const pricing = await fetchInvestmentPricingForPackage(DEFAULT_INVESTMENT_GUIDE_SLUG)
  const heroVideoSrc = pricing?.heroVideoUrl?.trim() || '/inquire-bg.mp4'

  return (
    <InvestmentGuidePage
      heroVideoSrc={heroVideoSrc}
      builder={
        <TestingPackageBuilder
          {...content}
          embedMode
          submissionSlug="investment/package-builder"
        />
      }
    />
  )
}
