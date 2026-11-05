import type { SiteRoutes } from '../routes'
import s from '../site.module.css'
import { Crumbs } from '../components/ui'
import { getStory } from '../data'

/**
 * Shared inquiry page frame. The form itself is injected:
 *  - public site: the existing, unmodified `components/ContactForm` (inside a dark panel)
 *  - /preview: the local-only `InquiryDemo`
 */
export default async function InquireView({ routes, form }: { routes: SiteRoutes; form: React.ReactNode }) {
  const d = await getStory()
  const live = routes.mode === 'live'
  return (
    <section className={`${s.wrap} ${s.pageHead} ${s.section}`} style={{ paddingTop: 'clamp(2.5rem,6vw,5rem)' }}>
      <Crumbs items={[{ label: routes.homeLabel, href: routes.home }, { label: 'Inquire' }]} />
      <div className={live ? s.formStack : s.formGrid}>
        <div>
          <h1 className={s.h1} style={{ fontSize: 'clamp(2.4rem,5.5vw,4.4rem)' }}>{d.inquireTitle ?? 'Your next chapter begins'}</h1>
          <div className={s.prose} style={{ marginTop: '1.6rem' }}>
            {d.inquireParagraphs.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
          </div>
        </div>
        {live ? <div className={s.darkPanel}>{form}</div> : form}
      </div>
    </section>
  )
}
