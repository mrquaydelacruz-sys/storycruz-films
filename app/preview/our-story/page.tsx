import type { Metadata } from 'next'
import Link from 'next/link'
import s from '../preview.module.css'
import { Arrow, Crumbs, Photo } from '../_components/ui'
import Reveal from '../_components/Reveal'
import { getStory } from '../_lib/data'

export const revalidate = 300
export const metadata: Metadata = { title: 'Our Story', alternates: { canonical: '/preview/our-story' } }

export default async function OurStory() {
  const d = await getStory()
  return (
    <>
      <section className={`${s.wrap} ${s.pageHead}`}>
        <Crumbs items={[{ label: 'Preview', href: '/preview' }, { label: 'Our Story' }]} />
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
            <Link href="/preview/experience" className={`${s.btn} ${s.btnLight}`}>The experience <Arrow /></Link>
            <Link href="/preview/inquire" className={`${s.btn} ${s.btnLight}`} style={{ background: 'transparent', color: 'var(--ivory)' }}>Inquire (demo)</Link>
          </div>
        </div>
      </section>
    </>
  )
}
