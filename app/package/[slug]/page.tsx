import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import TestingPackageBuilder from '@/components/TestingPackageBuilder'
import { fetchPackageBuilderBriefBySlug } from '@/lib/package-builder-fetch'
import { resolvePackageBuilderPage } from '@/lib/package-builder-content'
import { fetchInvestmentPricingForPackage } from '@/lib/package-builder-fetch-pricing'
import { DEFAULT_INVESTMENT_GUIDE_SLUG } from '@/lib/pricing-to-package-catalog'

export const revalidate = 60

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const normalized = slug.trim().toLowerCase()
  const doc = await fetchPackageBuilderBriefBySlug(normalized)

  if (!doc)
    return { title: 'Your package', robots: { index: false, follow: false } }

  let title = `${doc.pageTitle ?? ''}`.trim() || 'Your package'

  if (doc.useInvestmentGuide !== false) {
    const pslug =
      `${doc.investmentPricingSlug ?? ''}`.trim() || DEFAULT_INVESTMENT_GUIDE_SLUG
    const pricing = await fetchInvestmentPricingForPackage(pslug)
    const fromGuide = `${pricing?.title ?? ''}`.trim()
    if (fromGuide) title = fromGuide
  }

  return {
    title,
    robots: { index: false, follow: false },
  }
}

export default async function ClientPackagePage({ params }: PageProps) {
  const { slug } = await params
  const normalized = slug.trim().toLowerCase()
  if (!normalized) notFound()

  const doc = await fetchPackageBuilderBriefBySlug(normalized)
  if (!doc) notFound()

  const shouldLoadGuide = doc.useInvestmentGuide !== false
  const pricingSlug =
    doc.investmentPricingSlug?.trim() || DEFAULT_INVESTMENT_GUIDE_SLUG

  const pricing = shouldLoadGuide
    ? await fetchInvestmentPricingForPackage(pricingSlug)
    : null

  const content = resolvePackageBuilderPage({
    brief: doc,
    pricing,
    strictOfferings: true,
  })

  return (
    <TestingPackageBuilder {...content} submissionSlug={normalized} />
  )
}
