'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeaderCarouselProps {
  images: string[];
}

export default function HeaderCarousel({ images }: HeaderCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle images every 4 seconds
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images]);

  if (!images || images.length === 0) {
    return <div className="h-32 bg-black" />; // Spacer if no images
  }

  return (
    <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden mb-16 bg-black">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={src}
            alt="Photography Header"
            fill
            className="object-cover opacity-70" // Slightly dimmed for mood
            priority={index === 0}
          />
        </div>
      ))}
      
      {/* Gradient Fade at bottom to blend into the black page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}