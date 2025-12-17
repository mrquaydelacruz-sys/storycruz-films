'use client'
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-[100]">
      {/* 1. THE TOP BAR (Logo and Hamburger) */}
      <div className="relative z-[120] bg-black/80 backdrop-blur-md border-b border-white/5 h-20 px-6 md:px-12 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="relative w-32 h-10 block" onClick={() => setIsOpen(false)}>
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" fill className="object-contain object-left" priority />
          ) : (
            <span className="text-2xl font-serif tracking-tighter text-white">StoryCruz</span>
          )}
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-[10px] uppercase tracking-[0.3em] hover:text-accent transition-colors ${
                pathname === link.href ? 'text-accent' : 'text-white/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* ANIMATED HAMBURGER BUTTON */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
        </button>
      </div>

      {/* 2. THE MOBILE OVERLAY (Moved outside the flex container) */}
      <div className={`fixed inset-0 bg-black z-[110] transition-all duration-500 ease-in-out flex flex-col items-center justify-center gap-10 ${
        isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
      }`}>
        {links.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            onClick={() => setIsOpen(false)}
            className={`text-3xl uppercase tracking-[0.4em] font-serif transition-colors hover:text-accent ${
              pathname === link.href ? 'text-accent' : 'text-white'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}