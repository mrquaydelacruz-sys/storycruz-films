'use client'

import { useEffect, useRef } from 'react'
import s from '../site.module.css'

/** Gentle fade/rise on scroll. Content is visible by default (no JS / reduced motion / already in view). */
export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return
    el.classList.add(s.revealArmed)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          if (delay) el.style.transitionDelay = `${delay}ms`
          el.classList.remove(s.revealArmed)
          el.classList.add(s.revealIn)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
