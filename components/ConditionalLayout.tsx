'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import { WelcomePopup } from '@/components/WelcomePopup'

type PopupData = {
  popupActive?: boolean
  popupImage?: unknown
  popupTitle?: string
  popupText?: string
  popupLink?: string
  popupLinkText?: string
} | null

export default function ConditionalLayout({
  children,
  logoUrl,
  popupData,
}: {
  children: React.ReactNode
  logoUrl?: string
  popupData?: PopupData
}) {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio')

  // On Sanity Studio routes, render only the studio (no site nav/footer/cursor/popup)
  if (isStudio) {
    return <>{children}</>
  }

  return (
    <>
      <CustomCursor />
      <WelcomePopup data={popupData} />
      <Navbar logoUrl={logoUrl} />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </>
  )
}
