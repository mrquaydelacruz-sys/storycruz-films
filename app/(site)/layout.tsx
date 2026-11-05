import SiteShell from '@/app/_site/components/SiteShell'
import { LIVE_ROUTES, shellRoutes } from '@/app/_site/routes'
import { getSiteChromeData } from '@/lib/site-chrome'

/**
 * Public wedding site layout (redesign). Layout selection is explicit: components/SiteChrome
 * skips the legacy navbar/footer for these paths (see routeUsesSiteShell in lib/site-chrome.ts).
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const chrome = await getSiteChromeData()
  return (
    <SiteShell routes={shellRoutes(LIVE_ROUTES)} chrome={chrome}>
      {children}
    </SiteShell>
  )
}
