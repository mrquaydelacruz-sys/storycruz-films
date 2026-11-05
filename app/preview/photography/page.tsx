import type { Metadata } from 'next'
import s from '../preview.module.css'
import { AlbumCard, Crumbs, WorkTabs } from '../_components/ui'
import Reveal from '../_components/Reveal'
import { getAlbums } from '../_lib/data'

export const revalidate = 300
export const metadata: Metadata = { title: 'Photography', alternates: { canonical: '/preview/photography' } }

export default async function PhotographyPage() {
  const albums = await getAlbums()
  return (
    <>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <Crumbs items={[{ label: 'Preview', href: '/preview' }, { label: 'Our Work' }, { label: 'Photography' }]} />
        <h1 className={s.h1}>Photography</h1>
        <p className={s.lede}>Candid, documentary, warm and moody.</p>
        <WorkTabs current="photography" />
      </section>
      <section className={`${s.wrap} ${s.section}`} style={{ paddingTop: '1.5rem' }}>
        {albums.length === 0 ? (
          <p className={s.muted}>Albums could not be loaded right now.</p>
        ) : (
          <div className={s.cards}>
            {albums.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 80}><AlbumCard album={a} /></Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
