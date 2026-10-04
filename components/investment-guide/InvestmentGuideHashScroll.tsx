'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Scrolls to a section from `?section=`, `#hash`, or `#builder` when a collection
 * card sets `?package=` (hash may be stripped by redirects).
 */
export default function InvestmentGuideHashScroll() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const section = searchParams.get('section')
    const hasPackage = Boolean(searchParams.get('package'))
    const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : ''
    const targetId = hasPackage ? 'builder' : section || hash
    if (!targetId) return

    const el = document.getElementById(targetId)
    if (!el) return

    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => window.clearTimeout(t)
  }, [searchParams])

  return null
}
