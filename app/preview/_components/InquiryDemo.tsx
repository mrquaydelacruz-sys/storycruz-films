'use client'

/**
 * PREVIEW ONLY — simulated inquiry experience.
 *
 * Safety design:
 *  - There is NO <form> element, so Enter-key submission and the no-JS fallback
 *    (a native GET/POST navigation) cannot exist at all.
 *  - Inputs have no `name` attributes and no live field mappings are reused.
 *  - No fetch / XHR / beacon / server action is used anywhere in this file.
 *  - "Fill with sample data" only inserts obviously synthetic values.
 *  - State lives in memory only; nothing is persisted.
 */

import { useId, useRef, useState } from 'react'
import Link from 'next/link'
import s from '../preview.module.css'

type Values = {
  names: string
  partner: string
  email: string
  phone: string
  date: string
  location: string
  coverage: string
  found: string
  message: string
}

const EMPTY: Values = {
  names: '',
  partner: '',
  email: '',
  phone: '',
  date: '',
  location: '',
  coverage: '',
  found: '',
  message: '',
}

const SAMPLE: Values = {
  names: 'Sample Person',
  partner: 'Sample Partner',
  email: 'sample@example.invalid',
  phone: '000-000-0000',
  date: '',
  location: 'Sample Venue, Sample Town',
  coverage: 'Photography + Film',
  found: 'Design preview',
  message: 'SAMPLE DATA — this is a demo message to show how the inquiry experience feels. It is not sent anywhere.',
}

const COVERAGE = ['Photography', 'Film', 'Photography + Film', 'Not sure yet']

export default function InquiryDemo() {
  const uid = useId()
  const [v, setV] = useState<Values>(EMPTY)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({})
  const top = useRef<HTMLDivElement>(null)

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((p) => ({ ...p, [k]: e.target.value }))

  const id = (k: string) => `${uid}-${k}`

  function runDemo() {
    const next: Partial<Record<keyof Values, string>> = {}
    if (!v.names.trim()) next.names = 'Please add your name(s).'
    if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) next.email = 'Please add a valid email.'
    if (!v.message.trim()) next.message = 'Tell us a little about your day.'
    setErrors(next)
    if (Object.keys(next).length) return
    // Local-only simulation. Intentionally no network call.
    setDone(true)
    requestAnimationFrame(() => top.current?.focus())
  }

  function reset() {
    setV(EMPTY)
    setErrors({})
    setDone(false)
  }

  if (done) {
    return (
      <div className={s.demoDone} ref={top} tabIndex={-1} role="status" style={{ outline: 'none' }}>
        <span className={s.stamp}>Demo confirmation</span>
        <h2 className={s.h3}>This is how a thank-you would feel.</h2>
        <p className={s.muted}>
          Nothing was sent. No inquiry was created, no email went out, and nothing was saved. This is a local
          simulation inside the design preview.
        </p>
        <div className={s.formActions}>
          <button type="button" className={`${s.btn} ${s.btnSolid}`} onClick={reset}>
            Reset demo
          </button>
          <Link href="/preview" className={s.arrowLink}>
            Back to preview home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div role="group" aria-labelledby={id('title')} ref={top}>
      <div className={s.notice} role="note">
        <strong id={id('title')}>Preview only — nothing will be sent</strong>
        This form is a demonstration. It is not connected to the live inquiry process, our CRM, or email.
      </div>

      <div className={s.fields}>
        <div className={s.field}>
          <label className={s.label} htmlFor={id('names')}>Your name</label>
          <input id={id('names')} className={s.input} autoComplete="off" value={v.names} onChange={set('names')} aria-invalid={!!errors.names} aria-describedby={errors.names ? id('names-e') : undefined} />
          {errors.names && <p className={s.errorText} id={id('names-e')}>{errors.names}</p>}
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor={id('partner')}>Partner’s name</label>
          <input id={id('partner')} className={s.input} autoComplete="off" value={v.partner} onChange={set('partner')} />
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor={id('email')}>Email</label>
          <input id={id('email')} className={s.input} type="text" inputMode="email" autoComplete="off" value={v.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? id('email-e') : undefined} />
          {errors.email && <p className={s.errorText} id={id('email-e')}>{errors.email}</p>}
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor={id('phone')}>Phone (optional)</label>
          <input id={id('phone')} className={s.input} inputMode="tel" autoComplete="off" value={v.phone} onChange={set('phone')} />
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor={id('date')}>Wedding date</label>
          <input id={id('date')} className={s.input} type="date" autoComplete="off" value={v.date} onChange={set('date')} />
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor={id('location')}>Location</label>
          <input id={id('location')} className={s.input} autoComplete="off" value={v.location} onChange={set('location')} />
        </div>

        <fieldset className={`${s.field} ${s.full}`}>
          <legend className={s.label} style={{ marginBottom: '0.5rem' }}>What are you looking for?</legend>
          <div className={s.choices}>
            {COVERAGE.map((c) => (
              <label key={c} className={s.choice}>
                <input type="radio" value={c} checked={v.coverage === c} onChange={set('coverage')} />
                <span>{c}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={`${s.field} ${s.full}`}>
          <label className={s.label} htmlFor={id('found')}>How did you find us?</label>
          <input id={id('found')} className={s.input} autoComplete="off" value={v.found} onChange={set('found')} />
        </div>
        <div className={`${s.field} ${s.full}`}>
          <label className={s.label} htmlFor={id('message')}>Tell us about your day</label>
          <textarea id={id('message')} className={s.input} value={v.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? id('message-e') : undefined} />
          {errors.message && <p className={s.errorText} id={id('message-e')}>{errors.message}</p>}
        </div>
      </div>

      <div className={s.formActions}>
        <button type="button" className={`${s.btn} ${s.btnSolid}`} onClick={runDemo}>
          Try the demo submit
        </button>
        <button type="button" className={s.linkBtn} onClick={() => { setV(SAMPLE); setErrors({}) }}>
          Fill with sample data
        </button>
        <button type="button" className={s.linkBtn} onClick={reset}>
          Clear
        </button>
      </div>
    </div>
  )
}
