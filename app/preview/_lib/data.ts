/**
 * PREVIEW ONLY — read-only content helpers.
 * Uses the existing Sanity *read* client (GET queries only). Never imports the
 * write client, API routes, CRM endpoints, or any form submission code.
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- loosely-typed CMS rows */
import { client, urlFor } from '@/sanity/client'

const REVALIDATE = { next: { revalidate: 300 } }

export const PREVIEW_BASE = '/preview'

export type Album = {
  slug: string
  title: string
  couple: string
  place?: string
  date?: string | null
  coverUrl: string | null
  count: number
}

export type AlbumDetail = Album & {
  images: { url: string; width: number; height: number }[]
}

export type Film = {
  slug: string
  title: string
  couple: string
  detail?: string
  publishedAt?: string | null
  youtubeId: string | null
  thumbUrl: string | null
}

export type StoryData = {
  aboutTitle?: string
  aboutParagraphs: string[]
  aboutImageUrl: string | null
  christineTitle?: string
  christineParagraphs: string[]
  christineImageUrl: string | null
  inquireTitle?: string
  inquireParagraphs: string[]
  email: string
  location: string
}

export type HomeData = {
  heroUrl: string | null
  stripUrls: string[]
  testimonials: { quote: string; couple: string; location?: string }[]
}

export function youTubeId(url?: string | null): string | null {
  if (!url) return null
  const m = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)
  return m && m[2].length === 11 ? m[2] : null
}

function splitTitle(raw: string): { couple: string; detail?: string } {
  const clean = raw.replace(/\s+/g, ' ').trim()
  const idx = clean.indexOf('|')
  if (idx === -1) return { couple: clean }
  return { couple: clean.slice(0, idx).trim(), detail: clean.slice(idx + 1).trim() || undefined }
}

/** Single newlines inside a paragraph are hard-wraps in the CMS; blank lines separate paragraphs. */
function paragraphs(text?: string | null): string[] {
  if (!text) return []
  return text
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
}

function img(source: unknown, w: number, q = 75): string | null {
  if (!source) return null
  try {
    return urlFor(source).width(w).quality(q).auto('format').url()
  } catch {
    return null
  }
}

export async function getAlbums(): Promise<Album[]> {
  try {
    const rows = await client.fetch(
      `*[_type == "photoGallery" && defined(slug.current)] | order(date desc){
        title, "slug": slug.current, date, coverImage, "count": count(images)
      }`,
      {},
      REVALIDATE
    )
    return (rows ?? []).map((r: any) => {
      const t = splitTitle(r.title ?? '')
      return {
        slug: r.slug,
        title: r.title,
        couple: t.couple,
        place: t.detail,
        date: r.date ?? null,
        coverUrl: img(r.coverImage, 1400),
        count: r.count ?? 0,
      }
    })
  } catch {
    return []
  }
}

export async function getAlbum(slug: string): Promise<AlbumDetail | null> {
  try {
    const r = await client.fetch(
      `*[_type == "photoGallery" && slug.current == $slug][0]{
        title, "slug": slug.current, date, coverImage,
        images[]{ asset->{ url, metadata{ dimensions } } }
      }`,
      { slug },
      REVALIDATE
    )
    if (!r) return null
    const t = splitTitle(r.title ?? '')
    const images = (r.images ?? [])
      .map((p: any) => {
        const dim = p?.asset?.metadata?.dimensions
        const url = p?.asset?.url ? `${p.asset.url}?w=1400&q=75&auto=format` : null
        if (!url || !dim) return null
        return { url, width: dim.width as number, height: dim.height as number }
      })
      .filter(Boolean)
    return {
      slug: r.slug,
      title: r.title,
      couple: t.couple,
      place: t.detail,
      date: r.date ?? null,
      coverUrl: img(r.coverImage, 1400),
      count: images.length,
      images,
    }
  } catch {
    return null
  }
}

function toFilm(r: any): Film {
  const t = splitTitle(r.title ?? '')
  const id = youTubeId(r.youtubeUrl)
  return {
    slug: r.slug,
    title: (r.title ?? '').trim(),
    couple: t.couple,
    detail: t.detail,
    publishedAt: r.publishedAt ?? null,
    youtubeId: id,
    thumbUrl: img(r.customThumbnail, 1400) ?? (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null),
  }
}

export async function getFilms(): Promise<Film[]> {
  try {
    const rows = await client.fetch(
      `*[_type == "film" && defined(slug.current)] | order(featured desc, publishedAt desc){
        title, "slug": slug.current, youtubeUrl, publishedAt, customThumbnail
      }`,
      {},
      REVALIDATE
    )
    return (rows ?? []).map(toFilm)
  } catch {
    return []
  }
}

export async function getFilm(slug: string): Promise<Film | null> {
  try {
    const r = await client.fetch(
      `*[_type == "film" && slug.current == $slug][0]{
        title, "slug": slug.current, youtubeUrl, publishedAt, customThumbnail
      }`,
      { slug },
      REVALIDATE
    )
    return r ? toFilm(r) : null
  } catch {
    return null
  }
}

export async function getStory(): Promise<StoryData> {
  let d: any = null
  try {
    d = await client.fetch(
      `*[_type == "siteContent"][0]{
        aboutTitle, aboutText, aboutImage, christineTitle, christineText, christineImage,
        inquireTitle, inquireText, email, location
      }`,
      {},
      REVALIDATE
    )
  } catch {
    d = null
  }
  return {
    aboutTitle: d?.aboutTitle,
    aboutParagraphs: paragraphs(d?.aboutText),
    aboutImageUrl: img(d?.aboutImage, 1000),
    christineTitle: d?.christineTitle,
    christineParagraphs: paragraphs(d?.christineText),
    christineImageUrl: img(d?.christineImage, 1000),
    inquireTitle: d?.inquireTitle,
    inquireParagraphs: paragraphs(d?.inquireText),
    email: d?.email?.trim() || 'hi@storycruzfilms.com',
    location: d?.location?.trim() || 'High River, Alberta',
  }
}

export async function getHome(): Promise<HomeData> {
  let d: any = null
  try {
    d = await client.fetch(
      `*[_type == "homepage"][0]{ introSlideshow, introLeftImage, introRightImage, testimonials }`,
      {},
      REVALIDATE
    )
  } catch {
    d = null
  }
  const slides: unknown[] = d?.introSlideshow ?? []
  return {
    heroUrl: img(slides[0], 1800) ?? img(d?.introRightImage, 1800),
    stripUrls: [d?.introLeftImage, ...slides.slice(1, 4), d?.introRightImage]
      .map((s) => img(s, 900))
      .filter((u): u is string => Boolean(u))
      .slice(0, 4),
    testimonials: (d?.testimonials ?? []).map((t: any) => ({
      quote: String(t.quote ?? '').trim(),
      couple: String(t.couple ?? '').trim(),
      location: t.location ? String(t.location).trim() : undefined,
    })),
  }
}

/** Couple-name tokens, e.g. "Ella & Braden" -> ["ella","braden"]. */
function nameTokens(couple: string): string[] {
  return couple
    .toLowerCase()
    .split(/[&+,]|\band\b/)
    .map((s) => s.replace(/[^a-z]/g, ''))
    .filter((s) => s.length > 1)
}

/**
 * Pairs a photo album with a film only when BOTH partners' first names match.
 * Returns an empty list when no genuine match exists — nothing is forced.
 */
export function matchPairs(albums: Album[], films: Film[]): { album: Album; film: Film }[] {
  const out: { album: Album; film: Film }[] = []
  for (const album of albums) {
    const a = nameTokens(album.couple)
    if (a.length < 2) continue
    const film = films.find((f) => {
      const b = nameTokens(f.couple)
      return b.length >= 2 && a.every((n) => b.includes(n))
    })
    if (film) out.push({ album, film })
  }
  return out
}

export function formatDate(d?: string | null, withDay = false): string | null {
  if (!d) return null
  const dt = new Date(d + (d.length === 10 ? 'T12:00:00' : ''))
  if (isNaN(dt.getTime())) return null
  return dt.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    ...(withDay ? { day: 'numeric' } : {}),
  })
}
