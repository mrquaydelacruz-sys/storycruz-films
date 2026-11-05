import Link from 'next/link'
import type { SiteRoutes } from '../routes'
import s from '../site.module.css'
import { Crumbs } from '../components/ui'
import Reveal from '../components/Reveal'
import { getStory } from '../data'


export default async function ExperienceView({ routes }: { routes: SiteRoutes }) {
  const d = await getStory()
  const OFFERS = [
    { t: 'Photography', d: 'Candid, documentary-style coverage with a warm, moody aesthetic.', href: routes.photos },
    { t: 'Films', d: 'Wedding highlight films and trailers.', href: routes.films },
    { t: 'Photography + Film', d: 'Both of us on your day — one cohesive story in stills and motion.', href: routes.inquire },
    { t: 'Elopements & micro-weddings', d: 'Smaller days, offered as photo, film, or both.', href: routes.inquire },
  ]
  return (
    <>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <Crumbs items={[{ label: routes.homeLabel, href: routes.home }, { label: 'Experience' }]} />
        <h1 className={s.h1}>The <em>experience.</em></h1>
        {d.inquireParagraphs[0] && <p className={s.lede} style={{ maxWidth: '44rem' }}>{d.inquireParagraphs[0]}</p>}
      </section>

      <section className={`${s.wrap} ${s.section}`} style={{ paddingTop: '1rem' }}>
        <Reveal>
          <p className={s.eyebrow}>How it works</p>
          <ol className={s.steps}>
            <li><h3 className={s.h3}>Connect</h3><p className={s.muted}>Reach out and we’ll get to know each other.</p></li>
            <li><h3 className={s.h3}>Share your day</h3><p className={s.muted}>We learn about your day and what matters to you.</p></li>
            <li><h3 className={s.h3}>Investment guide</h3><p className={s.muted}>We send our guide with the services we offer and pricing.</p></li>
          </ol>
        </Reveal>
      </section>

      <section className={`${s.section} ${s.band}`}>
        <div className={s.wrap}>
          <p className={s.eyebrow}>What we offer</p>
          <div className={s.offers}>
            {OFFERS.map((o) => (
              <Reveal key={o.t}>
                <div className={s.offer}>
                  <h3 className={s.h3}>{o.t}</h3>
                  <p>{o.d}</p>
                  <p><Link href={o.href} className={s.arrowLink}>{o.href === routes.inquire ? `Inquire${routes.demoSuffix}` : 'See the work'}</Link></p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className={`${s.muted} ${s.small}`} style={{ marginTop: '1.5rem' }}>Pricing is shared in our investment guide after we connect.</p>
        </div>
      </section>

      <section className={`${s.section} ${s.cta}`}>
        <div className={`${s.wrap} ${s.narrow}`}>
          <h2 className={s.h2}>{d.inquireTitle ?? 'Your next chapter begins'}</h2>
          <div className={s.btnRow}>
            <Link href={routes.inquire} className={`${s.btn} ${s.btnLight}`}>Start an inquiry{routes.demoSuffix}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
