'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import s from '../preview.module.css'

type NavItem = { label: string; href: string; exact?: boolean; match?: string[] }

const WORK_SECTIONS = ['/preview/photography', '/preview/films']

const NAV: NavItem[] = [
  { label: 'Home', href: '/preview', exact: true },
  // One "Our Work" item; Photography / Films are switched via the tabs inside the section.
  { label: 'Our Work', href: '/preview/photography', match: WORK_SECTIONS },
  { label: 'Our Story', href: '/preview/our-story' },
  { label: 'Experience', href: '/preview/experience' },
  { label: 'Inquire', href: '/preview/inquire' },
]

export default function PreviewShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/preview'
  // Menu is "open" only for the route it was opened on, so any navigation closes it.
  const [openPath, setOpenPath] = useState<string | null>(null)
  const open = openPath === pathname
  const setOpen = (v: boolean) => setOpenPath(v ? pathname : null)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  const under = (base: string) => pathname === base || pathname.startsWith(base + '/')
  const isActive = (n: NavItem) => (n.match ? n.match.some(under) : n.exact ? pathname === n.href : under(n.href))
  // Clicking "Our Work" while inside Films keeps you in Films rather than bouncing to Photography.
  const hrefFor = (n: NavItem) => (n.match && under('/preview/films') ? '/preview/films' : n.href)

  // Scroll lock, Escape to close, focus handling and a simple focus trap while open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuBtn.current?.focus()
      }
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href],button')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <div className={s.root} data-scp-root="">
      <a href="#scp-main" className={s.skip}>
        Skip to content
      </a>
      <div className={s.banner} role="note">
        <strong>Design preview</strong>
        Not the live site — a clickable redesign concept. Nothing here is sent or saved.
      </div>

      <header className={s.header}>
        <div className={s.headerInner}>
          <Link href="/preview" className={s.logo} aria-label="Story Cruz Films — preview home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" width={54} height={54} />
            <span className={s.logoWord}>Story Cruz Films</span>
          </Link>

          <nav className={s.nav} aria-label="Preview">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={hrefFor(n)}
                className={s.navLink}
                aria-current={isActive(n) ? 'page' : undefined}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <button
            ref={menuBtn}
            type="button"
            className={s.menuBtn}
            aria-expanded={open}
            aria-controls="scp-mobile-menu"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
        </div>
      </header>

      <div
        id="scp-mobile-menu"
        ref={panel}
        className={`${s.mobilePanel} ${open ? s.mobilePanelOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Preview menu"
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <div className={s.mobileTop}>
          <span className={s.logoWord}>Story Cruz Films</span>
          <button ref={closeBtn} type="button" className={s.menuBtn} style={{ display: 'inline-flex' }} onClick={() => { setOpen(false); menuBtn.current?.focus() }}>
            Close
          </button>
        </div>
        <nav className={s.mobileLinks} aria-label="Preview mobile">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={hrefFor(n)}
              className={s.mobileLink}
              aria-current={isActive(n) ? 'page' : undefined}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <p className={s.mobileNote}>Design preview — not the live site.</p>
      </div>

      <main id="scp-main" tabIndex={-1} style={{ outline: 'none' }}>
        {children}
      </main>

      <footer className={s.footer}>
        <div className={s.wrap}>
          <div className={s.footerGrid}>
            <div>
              <h2>Story Cruz Films</h2>
              <p className={s.muted} style={{ margin: 0 }}>
                Wedding photography &amp; films that feel like you.
              </p>
            </div>
            <div>
              <h2>Explore</h2>
              <ul>
                {NAV.slice(1).map((n) => (
                  <li key={n.href}>
                    <Link href={hrefFor(n)}>{n.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Preview</h2>
              <ul>
                <li>
                  <Link href="/preview">Preview home</Link>
                </li>
              </ul>
            </div>
          </div>
          <p className={s.footNote}>
            Design preview for internal review. Not indexed, not connected to the live inquiry flow or CRM.
          </p>
        </div>
      </footer>
    </div>
  )
}
