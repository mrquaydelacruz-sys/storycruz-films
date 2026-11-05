import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { SiteRoutes } from '../routes'
import s from '../site.module.css'
import { Arrow, Crumbs } from '../components/ui'
import FilmPlayer from '../components/FilmPlayer'
import { formatDate, getAlbums, getFilm, getFilms, matchPairs } from '../data'

export default async function FilmView({ slug, routes }: { slug: string; routes: SiteRoutes }) {
  const [film, films, albums] = await Promise.all([getFilm(slug), getFilms(), getAlbums()])
  if (!film) notFound()
  const i = films.findIndex((f) => f.slug === slug)
  const next = films.length > 1 ? films[(i + 1) % films.length] : null
  const pair = matchPairs(albums, films).find((p) => p.film.slug === slug)

  return (
    <>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <Crumbs items={[{ label: routes.homeLabel, href: routes.home }, { label: 'Films', href: routes.films }, { label: film.couple }]} />
        <h1 className={s.h1} style={{ fontSize: 'clamp(2.4rem,6vw,4.6rem)' }}>{film.couple}</h1>
        <p className={s.lede}>{[film.detail, formatDate(film.publishedAt)].filter(Boolean).join(' · ')}</p>
      </section>
      <section className={`${s.wrap} ${s.section}`} style={{ paddingTop: '1rem' }}>
        <FilmPlayer youtubeId={film.youtubeId} title={film.title} poster={film.thumbUrl} />
        <p className={`${s.muted} ${s.small}`} style={{ marginTop: '0.8rem' }}>
          The video loads only when you press play.
        </p>
        {pair && (
          <p style={{ marginTop: '1.4rem' }}>
            <Link href={routes.photo(pair.album.slug)} className={s.arrowLink}>See the photographs from this wedding <Arrow /></Link>
          </p>
        )}
        <div className={s.pager}>
          <Link href={routes.films} className={s.arrowLink}>All films</Link>
          {next && <Link href={routes.film(next.slug)} className={s.arrowLink}>Next: {next.couple} <Arrow /></Link>}
        </div>
      </section>
    </>
  )
}
