import type { Metadata } from 'next'
import s from '../preview.module.css'
import { Crumbs, FilmCard, WorkTabs } from '../_components/ui'
import Reveal from '../_components/Reveal'
import { getFilms } from '../_lib/data'

export const revalidate = 300
export const metadata: Metadata = { title: 'Films', alternates: { canonical: '/preview/films' } }

export default async function FilmsPage() {
  const films = await getFilms()
  return (
    <>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <Crumbs items={[{ label: 'Preview', href: '/preview' }, { label: 'Films' }]} />
        <h1 className={s.h1}>Films</h1>
        <p className={s.lede}>Wedding highlight films and trailers.</p>
        <WorkTabs current="films" />
      </section>
      <section className={`${s.wrap} ${s.section}`} style={{ paddingTop: '1.5rem' }}>
        {films.length === 0 ? (
          <p className={s.muted}>Films could not be loaded right now.</p>
        ) : (
          <div className={s.cards}>
            {films.map((f, i) => (
              <Reveal key={f.slug} delay={(i % 3) * 80}><FilmCard film={f} /></Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
