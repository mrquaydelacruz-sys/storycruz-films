import { client, urlFor } from '@/sanity/client'

export type SiteChromeData = {
  logoUrl?: string
  email: string
  location: string
  socialLinks: { platform: string; url: string }[]
  copyrightText: string
}

const DEFAULT_EMAIL = 'hello@storycruzfilms.com'
const DEFAULT_LOCATION = 'High River, Alberta'

export async function getSiteChromeData(): Promise<SiteChromeData> {
  const doc = await client.fetch(`*[_type == "siteContent"][0]{
    email,
    location,
    socialLinks,
    copyrightText,
    navbarLogo
  }`)

  const year = new Date().getFullYear()

  return {
    logoUrl: doc?.navbarLogo
      ? urlFor(doc.navbarLogo).width(240).auto('format').url()
      : undefined,
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
