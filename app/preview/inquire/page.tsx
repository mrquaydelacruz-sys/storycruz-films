import type { Metadata } from 'next'
import s from '../preview.module.css'
import { Crumbs } from '../_components/ui'
import InquiryDemo from '../_components/InquiryDemo'
import { getStory } from '../_lib/data'

export const revalidate = 300
export const metadata: Metadata = { title: 'Inquire', alternates: { canonical: '/preview/inquire' } }

export default async function Inquire() {
  const d = await getStory()
  return (
    <section className={`${s.wrap} ${s.pageHead} ${s.section}`} style={{ paddingTop: 'clamp(2.5rem,6vw,5rem)' }}>
      <Crumbs items={[{ label: 'Preview', href: '/preview' }, { label: 'Inquire' }]} />
      <div className={s.formGrid}>
        <div>
          <h1 className={s.h1} style={{ fontSize: 'clamp(2.4rem,5.5vw,4.4rem)' }}>{d.inquireTitle ?? 'Your next chapter begins'}</h1>
          <div className={s.prose} style={{ marginTop: '1.6rem' }}>
            {d.inquireParagraphs.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
          </div>
        </div>
        <InquiryDemo />
      </div>
    </section>
  )
}
