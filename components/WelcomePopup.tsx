'use client'
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/sanity/client';

export function WelcomePopup({ data }: { data: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Don't show popup on commercial page (not wedding-related)
    if (pathname === '/commercial') return;

    const hasSeen = sessionStorage.getItem('hasSeenPopup');

    if (data?.popupActive && !hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [data, pathname]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenPopup', 'true');
  };

  if (!data?.popupActive) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal — full promo image, no cropping */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full max-w-[420px] bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden shadow-2xl"
          >
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 z-20 flex items-center justify-center gap-2 min-w-[44px] min-h-[44px] px-4 rounded-full bg-white/95 text-black hover:bg-white shadow-lg active:scale-95 transition-colors md:min-w-0 md:min-h-0 md:px-0 md:top-2 md:right-2 md:p-1.5 md:bg-black/50 md:text-white md:hover:bg-black/70 md:shadow-none"
              aria-label="Close popup"
            >
              <X size={24} className="shrink-0 md:w-5 md:h-5" />
              <span className="text-sm font-semibold md:hidden">Close</span>
            </button>

            {data.popupImage && (
              <div className="relative w-full max-w-[420px] aspect-[4/5] max-h-[85vh] mx-auto">
                <Link 
                  href="/inquire" 
                  onClick={handleClose}
                  className="block w-full h-full relative focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded-sm"
                >
                  <Image 
                    src={urlFor(data.popupImage).url()} 
                    alt={data.popupTitle || 'Welcome — Book 2026/2027'} 
                    fill 
                    className="object-contain"
                    sizes="(max-width: 448px) 100vw, 420px"
                    priority
                  />
                </Link>
              </div>
            )}

            <div className="p-6 pt-4 pb-6 text-center">
              {data.popupTitle && (
                <h2 className="text-2xl font-serif text-white mb-3">
                  {data.popupTitle}
                </h2>
              )}
              {data.popupText && (
                <p className="text-white/70 font-sans text-sm leading-relaxed mb-6">
                  {data.popupText}
                </p>
              )}
              {(data.popupLink || data.popupLinkText) && (
                <Link 
                  href="/inquire"
                  onClick={handleClose}
                  className="inline-block bg-white text-black px-6 py-2.5 uppercase tracking-widest text-xs font-bold hover:bg-accent hover:text-white transition-colors"
                >
                  {data.popupLinkText || 'Inquire'}
                </Link>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}