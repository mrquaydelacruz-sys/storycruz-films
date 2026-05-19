'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import VisionSceneMobile from '@/app/vision/VisionSceneMobile'
import type { VisionData } from '@/app/vision/types'
import type { SiteChromeData } from '@/lib/site-chrome'

const VisionScene = dynamic(() => import('@/app/vision/VisionScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
      <div className="h-10 w-10 animate-pulse rounded-full border border-white/20" />
    </div>
  ),
})

function prefersLightExperience(): boolean {
  if (typeof window === 'undefined') return true
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const narrow = window.matchMedia('(max-width: 768px)').matches
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  return reducedMotion || narrow || coarsePointer
}

type Props = {
  data: VisionData
  chrome: SiteChromeData
  /** From server User-Agent — avoids loading WebGL on phones before hydration. */
  initialLight?: boolean
}

export default function VisionExperience({ data, chrome, initialLight = false }: Props) {
  const [useLight, setUseLight] = useState(initialLight)

  useEffect(() => {
    setUseLight(prefersLightExperience())
    const mq = window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce), (pointer: coarse)')
    const onChange = () => setUseLight(prefersLightExperience())
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  if (useLight) {
    return <VisionSceneMobile data={data} chrome={chrome} />
  }

  return <VisionScene data={data} chrome={chrome} />
}
