'use client'

import HomePage from '@/app/vision/HomePage'
import type { VisionData } from '@/app/vision/types'
import type { SiteChromeData } from '@/lib/site-chrome'

type Props = {
  data: VisionData
  chrome: SiteChromeData
}

/** Homepage entry — single native-scroll experience for all devices. */
export default function VisionExperience({ data, chrome }: Props) {
  return <HomePage data={data} chrome={chrome} />
}
