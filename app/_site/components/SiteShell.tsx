'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegments } from 'next/navigation'
import s from '../site.module.css'
import type { ShellRoutes } from '../routes'
import type { SiteChromeData } from '@/lib/site-chrome'

const PLATFORM_LABELS: Record<string, string> = { youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', twitter: 'Twitter', vimeo: 'Vimeo', email: 'Email' }

type NavItem = { label: string; href: string; kind: 'home' | 'work' | 'page'; segments: string[] }

// Route-segment names for each nav item, for both the public routes and the /preview sandbox.
const WORK_SEGMENTS = ['photos', 'photography', 'films']

export default function SiteShell({
  children,
  routes,
  chrome,
}: {
  children: React.ReactNode
  routes: ShellRoutes
  /** Real contact/social data (public site only). */
  chrome?: SiteChromeData
}) {
  const isPreview = routes.mode === 'preview'
  const pathname = usePathname() ?? routes.home
  const NAV: NavItem[] = [
    { label: 'Home', href: routes.home, kind: 'home', segments: [] },
    // One "Our Work" item; Photography / Films are switched via the tabs inside the section.
    { label: 'Our Work', href: routes.photos, kind: 'work', segments: WORK_SEGMENTS },
    { label: 'Our Story', href: routes.story, kind: 'page', segments: ['about', 'our-story'] },
    { label: 'Experience', href: routes.experience, kind: 'page', segments: ['experience'] },
    { label: 'Inquire', href: routes.inquire, kind: 'page', segments: ['inquire'] },
  ]
  // Menu is "open" only for the route it was opened on, so any navigation closes it.
  const [openPath, setOpenPath] = useState<string | null>(null)
  const open = openPath === pathname
  const setOpen = (v: boolean) => setOpenPath(v ? pathname : null)

  // Active state comes from the route tree (segments below this layout), never from the URL string:
  // the server-side pathname of the prerendered root route is not reliably "/".
  const segments = useSelectedLayoutSegments()
  const first = segments[0] ?? null
  const isActive = (n: NavItem) => (n.kind === 'home' ? first === null || first === '__PAGE__' : first !== null && n.segments.includes(first))
  // Clicking "Our Work" while inside Films keeps you in Films rather than bouncing to Photography.
  const hrefFor = (n: NavItem) => (n.kind === 'work' && first === 'films' ? routes.films : n.href)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  // Match the page canvas to the shell (overscroll/bounce area); restored when leaving the shell.
  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#f6f1e7'
    return () => {
      document.body.style.backgroundColor = prev
    }
  }, [])

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
      {isPreview && (
        <div className={s.banner} role="note">
          <strong>Design preview</strong>
          Not the live site — a clickable redesign concept. Nothing here is sent or saved.
        </div>
      )}

      <header className={s.header}>
        <div className={s.headerInner}>
          <Link href={routes.home} className={s.logo} aria-label={isPreview ? 'Story Cruz Films — preview home' : 'Story Cruz Films — home'}>
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
        {isPreview && <p className={s.mobileNote}>Design preview — not the live site.</p>}
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
            {isPreview ? (
              <div>
                <h2>Preview</h2>
                <ul>
                  <li>
                    <Link href={routes.home}>Preview home</Link>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <h2>Connect</h2>
                <ul>
                  {chrome?.email && (
                    <li>
                      <a href={`mailto:${chrome.email}`}>{chrome.email}</a>
                    </li>
                  )}
                  {chrome?.location && <li className={s.muted}>{chrome.location}</li>}
                  {(chrome?.socialLinks ?? []).map((l) => (
                    <li key={l.url}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer">
                        {PLATFORM_LABELS[l.platform.toLowerCase()] ?? l.platform.charAt(0).toUpperCase() + l.platform.slice(1)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p className={s.footNote}>
            {isPreview
              ? 'Design preview for internal review. Not indexed, not connected to the live inquiry flow or CRM.'
              : chrome?.copyrightText}
          </p>
        </div>
      </footer>
    </div>
  )
}
