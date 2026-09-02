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

/** Routes that render their own footer inside the vision experience. */
export function routeUsesEmbeddedFooter(pathname: string): boolean {
  return pathname === '/' || pathname === '/vision'
}

/** QR / link landing — self-contained page without site chrome. */
export function routeIsConnectLanding(pathname: string): boolean {
  return pathname === '/connect' || pathname === '/qr'
}
