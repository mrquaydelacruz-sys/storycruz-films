import Link from 'next/link'
import Image from 'next/image'
import s from '../site.module.css'
import type { Album, Film } from '../data'
import { formatDate } from '../data'
import type { SiteRoutes } from '../routes'

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={s.crumbs}>
        {items.map((i, n) => (
          <li key={i.label} aria-current={n === items.length - 1 ? 'page' : undefined}>
            {i.href ? <Link href={i.href}>{i.label}</Link> : i.label}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function Arrow() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
      <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 4l14 8-14 8z" />
    </svg>
  )
}

export function Photo({ src, alt, sizes, priority }: { src: string | null; alt: string; sizes: string; priority?: boolean }) {
  if (!src) return <div className={s.placeholder}>Image unavailable</div>
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
}

export function AlbumCard({ album, routes }: { album: Album; routes: SiteRoutes }) {
  const d = formatDate(album.date)
  return (
    <Link href={routes.photo(album.slug)} className={s.card}>
      <div className={`${s.frame} ${s.zoom}`}>
        <Photo src={album.coverUrl} alt={`Cover photo: ${album.couple}`} sizes="(max-width: 48rem) 100vw, 33vw" />
      </div>
      <h3 className={s.cardTitle}>{album.couple}</h3>
      <p className={s.cardMeta}>{[album.place, d].filter(Boolean).join(' · ')}</p>
    </Link>
  )
}

export function FilmCard({ film, routes }: { film: Film; routes: SiteRoutes }) {
  const d = formatDate(film.publishedAt)
  return (
    <Link href={routes.film(film.slug)} className={`${s.card} ${s.cardFilm}`}>
      <div className={`${s.frame} ${s.zoom}`}>
        <Photo src={film.thumbUrl} alt={`Film still: ${film.couple}`} sizes="(max-width: 48rem) 100vw, 33vw" />
        <span className={s.playBadge} aria-hidden="true"><PlayIcon /></span>
      </div>
      <h3 className={s.cardTitle}>{film.couple}</h3>
      <p className={s.cardMeta}>{[film.detail, d].filter(Boolean).join(' · ')}</p>
    </Link>
  )
}

/** The single Photography / Films switcher for the Our Work section (rendered once per list page). */
export function WorkTabs({ current, routes }: { current: 'photography' | 'films'; routes: SiteRoutes }) {
  return (
    <nav className={s.switch} aria-label="Our Work sections">
      <Link href={routes.photos} aria-current={current === 'photography' ? 'page' : undefined}>Photography</Link>
      <Link href={routes.films} aria-current={current === 'films' ? 'page' : undefined}>Films</Link>
    </nav>
  )
}
