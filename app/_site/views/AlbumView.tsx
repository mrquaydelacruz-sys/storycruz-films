import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { SiteRoutes } from '../routes'
import s from '../site.module.css'
import { Arrow, Crumbs } from '../components/ui'
import { formatDate, getAlbum, getAlbums, getFilms, matchPairs } from '../data'

export default async function AlbumView({ slug, routes }: { slug: string; routes: SiteRoutes }) {
  const [album, albums, films] = await Promise.all([getAlbum(slug), getAlbums(), getFilms()])
  if (!album) notFound()
  const i = albums.findIndex((a) => a.slug === slug)
  const next = albums.length > 1 ? albums[(i + 1) % albums.length] : null
  const pair = matchPairs(albums, films).find((p) => p.album.slug === slug)

  return (
    <>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <Crumbs items={[{ label: routes.homeLabel, href: routes.home }, { label: 'Photography', href: routes.photos }, { label: album.couple }]} />
        <h1 className={s.h1} style={{ fontSize: 'clamp(2.4rem,6vw,4.6rem)' }}>{album.couple}</h1>
        <p className={s.lede}>{[album.place, formatDate(album.date)].filter(Boolean).join(' · ')}</p>
        {pair && (
          <p style={{ marginTop: '1.4rem' }}>
            <Link href={routes.film(pair.film.slug)} className={s.arrowLink}>Watch the film from this wedding <Arrow /></Link>
          </p>
        )}
      </section>
      <section className={`${s.wrap} ${s.section}`} style={{ paddingTop: '1rem' }}>
        <div className={s.masonry}>
          {album.images.map((im, n) => (
            <figure key={im.url}>
              <Image src={im.url} alt={`${album.couple} — photograph ${n + 1}`} width={im.width} height={im.height} sizes="(max-width: 48rem) 100vw, 33vw" priority={n < 2} />
            </figure>
          ))}
        </div>
        <div className={s.pager}>
          <Link href={routes.photos} className={s.arrowLink} style={{ flexDirection: 'row-reverse' }}>All photography</Link>
          {next && <Link href={routes.photo(next.slug)} className={s.arrowLink}>Next: {next.couple} <Arrow /></Link>}
        </div>
      </section>
    </>
  )
}
