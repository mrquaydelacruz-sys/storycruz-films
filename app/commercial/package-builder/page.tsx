import type { Metadata } from 'next'
import CommercialPackageBuilder from '@/components/CommercialPackageBuilder'

export const metadata: Metadata = {
  title: 'Corporate package builder | Story Cruz Films',
  description:
    'Build a commercial quote for meeting captures and corporate shoots — half-day or full-day filming plus editing.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function CommercialPackageBuilderPage() {
  return <CommercialPackageBuilder />
}
