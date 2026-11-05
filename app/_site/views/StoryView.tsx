import Link from 'next/link'
import type { SiteRoutes } from '../routes'
import s from '../site.module.css'
import { Arrow, Crumbs, Photo } from '../components/ui'
import Reveal from '../components/Reveal'
import { getStory } from '../data'


export default async function StoryView({ routes }: { routes: SiteRoutes }) {
  const d = await getStory()
  return (
    <>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <Crumbs items={[{ label: routes.homeLabel, href: routes.home }, { label: 'Our Story' }]} />
        <h1 className={s.h1}>{d.aboutTitle ?? 'Our Story'}</h1>
      </section>

      <section className={s.section} style={{ paddingTop: '1rem' }}>
        <div className={`${s.wrap} ${s.split}`} style={{ alignItems: 'start' }}>
          <Reveal><div className={s.frame}><Photo src={d.aboutImageUrl} alt="Quay and Christine" sizes="(max-width: 52rem) 100vw, 40vw" priority /></div></Reveal>
          <div className={s.prose}>{d.aboutParagraphs.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>
        </div>
      </section>

      {d.christineParagraphs.length > 0 && (
        <section className={`${s.section} ${s.band}`}>
          <div className={`${s.wrap} ${s.split}`} style={{ alignItems: 'start' }}>
            <div>
              <p className={s.eyebrow}>Our shared approach</p>
              <h2 className={s.h2} style={{ marginBottom: '1.6rem' }}>{d.christineTitle ?? 'Hello, Christine here…'}</h2>
              <div className={s.prose}>{d.christineParagraphs.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>
            </div>
            <Reveal><div className={s.frame}><Photo src={d.christineImageUrl} alt="Christine" sizes="(max-width: 52rem) 100vw, 40vw" /></div></Reveal>
          </div>
        </section>
      )}

      <section className={`${s.section} ${s.cta}`}>
        <div className={`${s.wrap} ${s.narrow}`}>
          <h2 className={s.h2}>Photo, film, <em>or both.</em></h2>
          <div className={s.btnRow}>
            <Link href={routes.experience} className={`${s.btn} ${s.btnLight}`}>The experience <Arrow /></Link>
            <Link href={routes.inquire} className={`${s.btn} ${s.btnOutlineLight}`}>Inquire{routes.demoSuffix}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
