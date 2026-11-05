import type { SiteRoutes } from '../routes'
import s from '../site.module.css'
import { Crumbs, FilmCard, WorkTabs } from '../components/ui'
import Reveal from '../components/Reveal'
import { getFilms } from '../data'


export default async function FilmsView({ routes }: { routes: SiteRoutes }) {
  const films = await getFilms()
  return (
    <>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <Crumbs items={[{ label: routes.homeLabel, href: routes.home }, { label: 'Films' }]} />
        <h1 className={s.h1}>Films</h1>
        <p className={s.lede}>Wedding highlight films and trailers.</p>
        <WorkTabs current="films" routes={routes} />
      </section>
      <section className={`${s.wrap} ${s.section}`} style={{ paddingTop: '1.5rem' }}>
        {films.length === 0 ? (
          <p className={s.muted}>Films could not be loaded right now.</p>
        ) : (
          <div className={s.cards}>
            {films.map((f, i) => (
              <Reveal key={f.slug} delay={(i % 3) * 80}><FilmCard film={f} routes={routes} /></Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
