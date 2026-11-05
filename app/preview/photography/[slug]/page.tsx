import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import s from '../../preview.module.css'
import { Arrow, Crumbs } from '../../_components/ui'
import { formatDate, getAlbum, getAlbums, getFilms, matchPairs } from '../../_lib/data'

export const revalidate = 300
type P = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params
  const a = await getAlbum(slug)
  return { title: a ? a.couple : 'Gallery', alternates: { canonical: `/preview/photography/${slug}` } }
}

export default async function AlbumPage({ params }: P) {
  const { slug } = await params
  const [album, albums, films] = await Promise.all([getAlbum(slug), getAlbums(), getFilms()])
  if (!album) notFound()
  const i = albums.findIndex((a) => a.slug === slug)
  const next = albums.length > 1 ? albums[(i + 1) % albums.length] : null
  const pair = matchPairs(albums, films).find((p) => p.album.slug === slug)

  return (
    <>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <Crumbs items={[{ label: 'Preview', href: '/preview' }, { label: 'Photography', href: '/preview/photography' }, { label: album.couple }]} />
        <h1 className={s.h1} style={{ fontSize: 'clamp(2.4rem,6vw,4.6rem)' }}>{album.couple}</h1>
        <p className={s.lede}>{[album.place, formatDate(album.date)].filter(Boolean).join(' · ')}</p>
        {pair && (
          <p style={{ marginTop: '1.4rem' }}>
            <Link href={`/preview/films/${pair.film.slug}`} className={s.arrowLink}>Watch the film from this wedding <Arrow /></Link>
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
          <Link href="/preview/photography" className={s.arrowLink} style={{ flexDirection: 'row-reverse' }}>All photography</Link>
          {next && <Link href={`/preview/photography/${next.slug}`} className={s.arrowLink}>Next: {next.couple} <Arrow /></Link>}
        </div>
      </section>
    </>
  )
}
