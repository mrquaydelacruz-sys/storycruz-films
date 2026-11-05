'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { segmentHasNoChrome, segmentUsesSiteShell, type SiteChromeData } from '@/lib/site-chrome'

type Props = {
  children: React.ReactNode
  chrome: SiteChromeData
}

export default function SiteChrome({ children, chrome }: Props) {
  // Explicit, route-tree-based selection (see lib/site-chrome.ts). No URL/pathname matching.
  const segment = useSelectedLayoutSegment()

  if (segmentHasNoChrome(segment) || segmentUsesSiteShell(segment)) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar logoUrl={chrome.logoUrl} />
      {children}
      <Footer data={chrome} />
    </>
  )
}
