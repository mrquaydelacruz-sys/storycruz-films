import Link from 'next/link'
import s from '@/app/_site/site.module.css'

export default function SiteNotFound() {
  return (
    <section className={`${s.section} ${s.wrap} ${s.narrow}`}>
      <p className={s.eyebrow}>Story Cruz Films</p>
      <h1 className={s.h2}>We couldn’t find that <em>page.</em></h1>
      <p className={s.lede}>It may have moved, or the link may be out of date.</p>
      <div className={s.btnRow} style={{ marginTop: '2rem' }}>
        <Link href="/" className={`${s.btn} ${s.btnSolid}`}>Home</Link>
        <Link href="/photos" className={`${s.btn} ${s.btnGhost}`}>Photography</Link>
        <Link href="/films" className={`${s.btn} ${s.btnGhost}`}>Films</Link>
      </div>
    </section>
  )
}
