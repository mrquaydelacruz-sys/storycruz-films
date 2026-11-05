import Link from 'next/link'
import s from './preview.module.css'

export default function PreviewNotFound() {
  return (
    <section className={`${s.section} ${s.wrap} ${s.narrow}`}>
      <p className={s.eyebrow}>Preview</p>
      <h1 className={s.h2}>That page isn’t in the <em>preview</em>.</h1>
      <p className={s.lede}>It may not exist, or its content may have moved.</p>
      <div className={s.btnRow} style={{ marginTop: '2rem' }}>
        <Link href="/preview" className={`${s.btn} ${s.btnSolid}`}>Preview home</Link>
        <Link href="/preview/photography" className={`${s.btn} ${s.btnGhost}`}>Photography</Link>
        <Link href="/preview/films" className={`${s.btn} ${s.btnGhost}`}>Films</Link>
      </div>
    </section>
  )
}
