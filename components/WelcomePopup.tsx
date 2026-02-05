'use client'
import { useState, useEffect } from 'react';
import { usePathname, Link } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/sanity/client';

// DELETE THIS LINE: import { WelcomePopup } from "@/components/WelcomePopup";

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

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden shadow-2xl"
          >
            
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {data.popupImage && (
              <div className="relative h-48 w-full">
                <Image 
                  src={urlFor(data.popupImage).url()} 
                  alt="Welcome" 
                  fill 
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
              </div>
            )}

            <div className="p-8 text-center relative z-10 -mt-10">
              <h2 className="text-3xl font-serif text-white mb-4">
                {data.popupTitle}
              </h2>
              <p className="text-white/70 font-sans leading-relaxed mb-8">
                {data.popupText}
              </p>

              {(data.popupLink || data.popupLinkText) && (
                <Link 
                  href="/inquire"
                  onClick={handleClose}
                  className="inline-block bg-white text-black px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-accent hover:text-white transition-colors"
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