'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { routeUsesEmbeddedFooter, type SiteChromeData } from '@/lib/site-chrome'

type Props = {
  children: React.ReactNode
  chrome: SiteChromeData
}

export default function SiteChrome({ children, chrome }: Props) {
  const pathname = usePathname() ?? ''
  const isStudio = pathname.startsWith('/studio')
  const embedFooter = routeUsesEmbeddedFooter(pathname)

  if (isStudio) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar logoUrl={chrome.logoUrl} />
      {children}
      {!embedFooter && <Footer data={chrome} />}
    </>
  )
}
