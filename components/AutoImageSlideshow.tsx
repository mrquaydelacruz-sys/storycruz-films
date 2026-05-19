'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  images: string[]
  alt?: string
  /** Seconds between slides */
  intervalSec?: number
  className?: string
  aspectClassName?: string
}

export default function AutoImageSlideshow({
  images,
  alt = '',
  intervalSec = 4,
  className = '',
  aspectClassName = 'aspect-[3/4]',
}: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, intervalSec * 1000)
    return () => clearInterval(timer)
  }, [images.length, intervalSec])

  if (!images.length) return null

  return (
    <div
      className={`relative overflow-hidden border border-white/20 bg-black ${aspectClassName} ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={images[index]}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt={alt}
            fill
            sizes="(max-width: 768px) 90vw, 480px"
            className="object-cover"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
