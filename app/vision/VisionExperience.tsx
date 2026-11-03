'use client'

import HomePage from '@/app/vision/HomePage'
import type { VisionData } from '@/app/vision/types'

type Props = {
  data: VisionData
}

/** Homepage entry — single native-scroll experience for all devices. */
export default function VisionExperience({ data }: Props) {
  return <HomePage data={data} />
}
