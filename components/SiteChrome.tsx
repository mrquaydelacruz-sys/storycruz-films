'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { routeIsConnectLanding, routeUsesSiteShell, type SiteChromeData } from '@/lib/site-chrome'

type Props = {
  children: React.ReactNode
  chrome: SiteChromeData
}

export default function SiteChrome({ children, chrome }: Props) {
  const pathname = usePathname() ?? ''
  const isStudio = pathname.startsWith('/studio')
  const isConnectLanding = routeIsConnectLanding(pathname)

  if (isStudio || isConnectLanding || routeUsesSiteShell(pathname)) {
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
