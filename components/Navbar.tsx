'use client'
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Photos', href: '/photos' },
  { name: 'Films', href: '/films' },
  { name: 'Inquire', href: '/inquire' },
];

export default function Navbar({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('menu-open');
    }
  }, [isOpen]);

  // Listen for custom toggle event from scenes (like VisionScene)
  useEffect(() => {
    const handleToggle = (e: CustomEvent) => {
      if (typeof e.detail?.visible === 'boolean') {
        setIsVisible(e.detail.visible);
      }
    };
    window.addEventListener('storycruz-toggle-nav' as any, handleToggle as any);
    return () => {
      window.removeEventListener('storycruz-toggle-nav' as any, handleToggle as any);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[9998] transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      {/* 1. THE TOP BAR — dark + gold branding when menu open to match overlay */}
      <div className={`relative z-[10000] border-b h-20 px-6 md:px-12 flex items-center justify-between transition-colors duration-300 ${isOpen ? 'bg-[#0a0a0a] border-white/10' : 'bg-black/90 backdrop-blur-xl border-white/5'}`}>
        {/* LOGO */}
        <Link href="/" className="relative w-32 h-10 block" onClick={() => setIsOpen(false)}>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Logo"
              fill
              className="object-contain object-left transition-all duration-300"
              priority
            />
          ) : (
            <span className="text-2xl font-serif tracking-tighter text-white transition-colors duration-300">
              StoryCruz
            </span>
          )}
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[10px] uppercase tracking-[0.3em] hover:text-accent transition-colors ${pathname === link.href ? 'text-accent' : 'text-white/80'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* HAMBURGER (mobile) — always white so visible on dark bar */}
        <button
          type="button"
          className="md:hidden flex flex-col justify-center items-center w-12 h-12 gap-1.5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded touch-manipulation"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={`block w-6 h-0.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[8px] bg-white' : 'bg-white'}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'} bg-white`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[8px] bg-white' : 'bg-white'}`} />
        </button>
      </div>

      {/* 2. MOBILE MENU OVERLAY — portaled to body so it always covers full screen (e.g. over /vision Canvas) */}
      {mounted &&
        createPortal(
          <div
            className={`transition-all duration-300 ease-out flex flex-col overflow-hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2147483647,
              backgroundColor: '#0a0a0a',
            }}
            aria-hidden={!isOpen}
          >
            <div className="flex flex-col flex-1 min-h-0 pt-20 px-6 md:px-12 pb-10">
              <div className="flex justify-end shrink-0 mb-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-3 -m-3 touch-manipulation cursor-pointer text-white/80 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto" aria-label="Mobile menu">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block w-full text-left py-4 px-1 text-2xl md:text-3xl font-serif font-bold transition-colors touch-manipulation cursor-pointer rounded-lg -mx-1 active:bg-white/5 shrink-0 ${pathname === link.href ? 'text-accent' : 'text-white hover:text-accent'}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}