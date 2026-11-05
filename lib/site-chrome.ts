import { client } from '@/sanity/client'

export type SiteChromeData = {
  logoUrl?: string
  email: string
  location: string
  socialLinks: { platform: string; url: string }[]
  copyrightText: string
}

/** Primary brand mark in `/public` — used sitewide (nav, footer, connect landing, vision). */
export const BRAND_LOGO_PATH = '/logo.png'

const DEFAULT_EMAIL = 'hello@storycruzfilms.com'
const DEFAULT_LOCATION = 'High River, Alberta'

export async function getSiteChromeData(): Promise<SiteChromeData> {
  const doc = await client.fetch(`*[_type == "siteContent"][0]{
    email,
    location,
    socialLinks,
    copyrightText
  }`)

  const year = new Date().getFullYear()

  return {
    logoUrl: BRAND_LOGO_PATH,
    email: doc?.email?.trim() || DEFAULT_EMAIL,
    location: doc?.location?.trim() || DEFAULT_LOCATION,
    socialLinks: Array.isArray(doc?.socialLinks) ? doc.socialLinks : [],
    copyrightText:
      doc?.copyrightText?.trim() ||
      `© ${year} StoryCruz Films. All rights reserved.`,
  }
}

/** QR / link landing — self-contained page without site chrome. */
export function routeIsConnectLanding(pathname: string): boolean {
  return pathname === '/connect' || pathname === '/qr'
}

/**
 * Layout selection by ROUTE SEGMENT (from the router's route tree), not by URL pathname.
 *
 * The pathname seen during the server render of the prerendered root route is not guaranteed to be "/"
 * (observed in production: the homepage rendered with the legacy chrome because a pathname allow-list
 * missed it). Segments come from the route tree itself, so they cannot drift.
 *
 *  - "(site)"  → public redesign routes (app/(site)/**, including "/")  → own shell from (site)/layout.tsx
 *  - "preview" → noindex sandbox (app/preview/**)                       → own shell from preview/layout.tsx
 *  - "studio" / "connect" / "qr" → no site chrome at all (as before)
 *  - anything else (commercial, investment, package, testing, vision, global 404, …) → legacy navbar/footer
 */
export function segmentUsesSiteShell(segment: string | null): boolean {
  return segment === '(site)' || segment === 'preview'
}

export function segmentHasNoChrome(segment: string | null): boolean {
  return segment === 'studio' || segment === 'connect' || segment === 'qr'
}
