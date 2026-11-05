import type { SiteRoutes } from '../routes'
import s from '../site.module.css'
import { AlbumCard, Crumbs, WorkTabs } from '../components/ui'
import Reveal from '../components/Reveal'
import { getAlbums } from '../data'


export default async function PhotographyView({ routes }: { routes: SiteRoutes }) {
  const albums = await getAlbums()
  return (
    <>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <Crumbs items={[{ label: routes.homeLabel, href: routes.home }, { label: 'Our Work' }, { label: 'Photography' }]} />
        <h1 className={s.h1}>Photography</h1>
        <p className={s.lede}>Candid, documentary, warm and moody.</p>
        <WorkTabs current="photography" routes={routes} />
      </section>
      <section className={`${s.wrap} ${s.section}`} style={{ paddingTop: '1.5rem' }}>
        {albums.length === 0 ? (
          <p className={s.muted}>Albums could not be loaded right now.</p>
        ) : (
          <div className={s.cards}>
            {albums.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 80}><AlbumCard album={a} routes={routes} /></Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
