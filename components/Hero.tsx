'use client'
import { useRef } from 'react';

interface HeroProps {
  videoUrl: string;
}

export default function Hero({ videoUrl }: HeroProps) {
  const containerRef = useRef(null);
  
  // We removed the text animations since the text is gone
  return (
    <div ref={containerRef} className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden flex items-center justify-center bg-background">
      
      {/* BACKGROUND VIDEO (Clean, No Overlay) */}
      <div className="absolute inset-0 z-0">
        {/* We keep a very light tint just to blend it, but much lighter now */}
        <div className="absolute inset-0 bg-black/10 z-10" />
        {videoUrl ? (
          <video 
            autoPlay loop muted playsInline 
            className="object-cover w-full h-full"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
           <div className="w-full h-full bg-neutral-900" />
        )}
      </div>

    </div>
  );
}