import type { Metadata } from 'next'
import SiteShell from '@/app/_site/components/SiteShell'
import { PREVIEW_ROUTES, shellRoutes } from '@/app/_site/routes'

/**
 * PREVIEW SANDBOX. Everything under /preview is a self-contained copy of the redesign,
 * kept out of search indexes (robots meta noindex/nofollow on every page).
 * Layout selection is explicit: lib/site-chrome.ts routeUsesSiteShell() tells the root
 * SiteChrome to skip the legacy navbar/footer for these paths.
 */
export const metadata: Metadata = {
  title: { default: 'Design preview', template: '%s · Design preview' },
  description: 'Internal design preview — not the live site.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
  openGraph: { title: 'Design preview', url: '/preview', images: [] },
  twitter: { card: 'summary', title: 'Design preview', images: [] },
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell routes={shellRoutes(PREVIEW_ROUTES)}>{children}</SiteShell>
}
