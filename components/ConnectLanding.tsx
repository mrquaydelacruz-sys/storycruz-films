'use client'

import type { ComponentType } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Twitter,
  Video,
  Music2,
  MapPin,
  Globe,
  ArrowUpRight,
} from 'lucide-react'
import BackgroundWater from '@/components/BackgroundWater'
import type { SiteChromeData } from '@/lib/site-chrome'

const iconMap: Record<
  string,
  ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  x: Twitter,
  email: Mail,
  vimeo: Video,
  tiktok: Music2,
}

/** Brand-colored tap targets for the connect landing. */
const brandButtonClass: Record<string, string> = {
  instagram:
    'bg-[linear-gradient(135deg,#f58529_0%,#dd2a7b_45%,#8134af_100%)] text-white shadow-[0_10px_28px_rgba(221,42,123,0.35)]',
  facebook: 'bg-[#1877F2] text-white shadow-[0_10px_28px_rgba(24,119,242,0.35)]',
  youtube: 'bg-[#FF0000] text-white shadow-[0_10px_28px_rgba(255,0,0,0.3)]',
  twitter: 'bg-[#1DA1F2] text-white shadow-[0_10px_28px_rgba(29,161,242,0.35)]',
  x: 'bg-neutral-900 text-white shadow-[0_10px_28px_rgba(0,0,0,0.45)] ring-1 ring-white/15',
  tiktok: 'bg-neutral-950 text-white shadow-[0_10px_28px_rgba(0,0,0,0.45)] ring-1 ring-white/15',
  vimeo: 'bg-[#1AB7EA] text-white shadow-[0_10px_28px_rgba(26,183,234,0.35)]',
  email: 'bg-accent text-black shadow-[0_10px_28px_rgba(209,192,168,0.35)]',
}

const fallbackButtonClass =
  'bg-white/10 text-white shadow-[0_10px_28px_rgba(0,0,0,0.35)] ring-1 ring-white/15'

function platformLabel(platform: string): string {
  const key = platform.trim()
  if (!key) return 'Social'
  if (key.toLowerCase() === 'x') return 'X'
  return key.charAt(0).toUpperCase() + key.slice(1)
}

type Props = {
  data: SiteChromeData
}

export default function ConnectLanding({ data }: Props) {
  const socials = (data.socialLinks ?? []).filter((l) => l?.url?.trim())
  const mailto = `mailto:${data.email}`

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white selection:bg-white/20">
      <BackgroundWater />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(209,192,168,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 md:px-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md text-center"
        >
          <Link href="/" className="mx-auto mb-6 inline-flex flex-col items-center">
            {data.logoUrl ? (
              <span className="relative h-44 w-44 sm:h-52 sm:w-52 md:h-60 md:w-60">
                <Image
                  src={data.logoUrl}
                  alt="StoryCruz Films"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
                  sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, 240px"
                />
              </span>
            ) : (
              <span className="font-serif text-4xl tracking-tight text-white md:text-5xl">
                StoryCruz Films
              </span>
            )}
          </Link>

          <h1 className="sr-only">StoryCruz Films — Connect</h1>

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-accent">
            Connect
          </p>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/60 md:text-base">
            Wedding films &amp; photography — follow along, or visit the full site to explore our
            work.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="mt-10"
          >
            <Link
              href="/"
              className="group inline-flex min-h-[3.75rem] w-full items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-5 text-base font-semibold uppercase tracking-[0.18em] text-black transition-all hover:bg-accent/90 active:scale-[0.98]"
            >
              <Globe size={22} strokeWidth={1.75} />
              Visit website
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>

          <div className="mt-10 flex w-full flex-col gap-3.5">
            {socials.map((link, i) => {
              const key = link.platform?.toLowerCase().trim() || ''
              const Icon = iconMap[key]
              const label = platformLabel(link.platform || key)
              const colorClass = brandButtonClass[key] ?? fallbackButtonClass
              return (
                <motion.a
                  key={`${key}-${i}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 + i * 0.05, duration: 0.35 }}
                  className={`flex min-h-[4.25rem] w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 transition-transform active:scale-[0.98] hover:scale-[1.015] ${colorClass}`}
                >
                  {Icon ? (
                    <Icon size={28} strokeWidth={1.75} className="shrink-0" />
                  ) : (
                    <span className="text-sm font-semibold uppercase tracking-wider">
                      {key.slice(0, 2)}
                    </span>
                  )}
                  <span className="text-sm font-semibold uppercase tracking-[0.16em] opacity-95">
                    {label}
                  </span>
                </motion.a>
              )
            })}

            <motion.a
              href={mailto}
              aria-label="Email"
              title="Email"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 + socials.length * 0.05, duration: 0.35 }}
              className={`flex min-h-[4.25rem] w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 transition-transform active:scale-[0.98] hover:scale-[1.015] ${brandButtonClass.email}`}
            >
              <Mail size={28} strokeWidth={1.75} className="shrink-0" />
              <span className="text-sm font-semibold uppercase tracking-[0.16em] opacity-95">
                Email
              </span>
            </motion.a>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-10 inline-flex items-center justify-center gap-2 text-xs text-white/40"
          >
            <MapPin size={14} strokeWidth={1.5} />
            {data.location}
          </motion.p>

          <p className="mt-8 text-[10px] uppercase tracking-[0.25em] text-white/25">
            {data.copyrightText}
          </p>
        </motion.div>
      </div>
    </main>
  )
}
