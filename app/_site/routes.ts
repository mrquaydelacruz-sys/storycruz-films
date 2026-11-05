/**
 * Route sets for the shared redesigned site views. The same views render the public
 * site (LIVE_ROUTES, existing URLs) and the noindex /preview sandbox (PREVIEW_ROUTES).
 */
export type SiteRoutes = {
  mode: 'preview' | 'live'
  home: string
  photos: string
  films: string
  story: string
  experience: string
  inquire: string
  photo: (slug: string) => string
  film: (slug: string) => string
  /** Label for the root breadcrumb. */
  homeLabel: string
  /** ' (demo)' only in the preview sandbox; empty on public pages. */
  demoSuffix: string
}

export const PREVIEW_ROUTES: SiteRoutes = {
  mode: 'preview',
  home: '/preview',
  photos: '/preview/photography',
  films: '/preview/films',
  story: '/preview/our-story',
  experience: '/preview/experience',
  inquire: '/preview/inquire',
  photo: (slug) => `/preview/photography/${slug}`,
  film: (slug) => `/preview/films/${slug}`,
  homeLabel: 'Preview',
  demoSuffix: ' (demo)',
}

/** Existing public URLs — unchanged by the redesign (only /experience is new). */
export const LIVE_ROUTES: SiteRoutes = {
  mode: 'live',
  home: '/',
  photos: '/photos',
  films: '/films',
  story: '/about',
  experience: '/experience',
  inquire: '/inquire',
  photo: (slug) => `/photos/${slug}`,
  film: (slug) => `/films/${slug}`,
  homeLabel: 'Home',
  demoSuffix: '',
}

/** Serializable subset (no functions) that can be passed from server layouts to the client SiteShell. */
export type ShellRoutes = Pick<SiteRoutes, 'mode' | 'home' | 'photos' | 'films' | 'story' | 'experience' | 'inquire'>

export function shellRoutes(r: SiteRoutes): ShellRoutes {
  const { mode, home, photos, films, story, experience, inquire } = r
  return { mode, home, photos, films, story, experience, inquire }
}
