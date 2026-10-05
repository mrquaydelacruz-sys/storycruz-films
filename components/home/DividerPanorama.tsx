'use client'

import { useRef } from 'react'
import Image from 'next/image'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'

type Props = {
  src: string
}

export default function DividerPanorama({ src }: Props) {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['3%', '-3%'])
  const scale = useTransform(scrollYProgress, [0, 0.35, 1], [1.06, 1, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0.4, 1, 1, 0.85])

  return (
    <section ref={ref} className="relative w-full overflow-hidden">
      <div className="relative aspect-[2/1] w-full md:aspect-[21/9]">
        {reducedMotion ? (
          <Image src={src} alt="" fill sizes="100vw" className="object-cover opacity-90" />
        ) : (
          <motion.div
            className="absolute inset-[-6%]"
            style={{ y, scale, opacity }}
          >
            <Image src={src} alt="" fill sizes="100vw" className="object-cover" />
          </motion.div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
    </section>
  )
}
