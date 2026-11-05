import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import s from '../../preview.module.css'
import { Arrow, Crumbs } from '../../_components/ui'
import FilmPlayer from '../../_components/FilmPlayer'
import { formatDate, getAlbums, getFilm, getFilms, matchPairs } from '../../_lib/data'

export const revalidate = 300
type P = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params
  const f = await getFilm(slug)
  return { title: f ? f.couple : 'Film', alternates: { canonical: `/preview/films/${slug}` } }
}

export default async function FilmPage({ params }: P) {
  const { slug } = await params
  const [film, films, albums] = await Promise.all([getFilm(slug), getFilms(), getAlbums()])
  if (!film) notFound()
  const i = films.findIndex((f) => f.slug === slug)
  const next = films.length > 1 ? films[(i + 1) % films.length] : null
  const pair = matchPairs(albums, films).find((p) => p.film.slug === slug)

  return (
    <>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <Crumbs items={[{ label: 'Preview', href: '/preview' }, { label: 'Films', href: '/preview/films' }, { label: film.couple }]} />
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
            <Link href={`/preview/photography/${pair.album.slug}`} className={s.arrowLink}>See the photographs from this wedding <Arrow /></Link>
          </p>
        )}
        <div className={s.pager}>
          <Link href="/preview/films" className={s.arrowLink}>All films</Link>
          {next && <Link href={`/preview/films/${next.slug}`} className={s.arrowLink}>Next: {next.couple} <Arrow /></Link>}
        </div>
      </section>
    </>
  )
}
