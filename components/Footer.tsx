import type { ComponentType } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Twitter,
  Video,
  Music2,
  MapPin,
  ArrowUpRight,
} from 'lucide-react'
import type { SiteChromeData } from '@/lib/site-chrome'

const iconMap: Record<
  string,
  ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  email: Mail,
  vimeo: Video,
  tiktok: Music2,
}

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Photos', href: '/photos' },
  { name: 'Films', href: '/films' },
  { name: 'Inquire', href: '/inquire' },
]

type Props = {
  data: SiteChromeData
  className?: string
}

export default function Footer({ data, className = '' }: Props) {
  const mailto = `mailto:${data.email}`

  return (
    <footer
      className={`relative z-10 border-t border-white/10 bg-[#030303] text-white ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(209,192,168,0.08),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block">
              {data.logoUrl ? (
                <div className="relative mb-6 h-20 w-20 md:h-24 md:w-24">
                  <Image
                    src={data.logoUrl}
                    alt="StoryCruz Films"
                    fill
                    className="object-contain object-left"
                    sizes="96px"
                  />
                </div>
              ) : (
                <p className="mb-6 font-serif text-3xl tracking-tight text-white">
                  StoryCruz Films
                </p>
              )}
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
              Cinematic wedding films and photography — capturing authentic moments across Alberta
              and beyond.
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-accent">
              Explore
            </p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-60"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-4">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-accent">
              Connect
            </p>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href={mailto}
                  className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-accent"
                >
                  <Mail size={16} strokeWidth={1.5} />
                  {data.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-2 text-white/60">
                <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                <span>{data.location}</span>
              </li>
            </ul>

            {data.socialLinks.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {data.socialLinks.map((link, i) => {
                  const key = link.platform?.toLowerCase().trim() || ''
                  const Icon = iconMap[key]
                  return (
                    <a
                      key={`${key}-${i}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-white"
                    >
                      {Icon ? (
                        <Icon size={18} strokeWidth={1.5} />
                      ) : (
                        <span className="text-[9px] uppercase tracking-wider">{key.slice(0, 2)}</span>
                      )}
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-center text-[11px] uppercase tracking-[0.2em] text-white/35 md:text-left">
            {data.copyrightText}
          </p>
          <p className="text-center text-[11px] uppercase tracking-[0.25em] text-white/25">
            Wedding Films &amp; Photography
          </p>
        </div>
      </div>
    </footer>
  )
}
