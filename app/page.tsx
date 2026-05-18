import { headers } from 'next/headers'
import VisionExperience from '@/app/vision/VisionExperience'
import { getVisionData } from '@/lib/vision-data'
import { isMobileUserAgent } from '@/lib/device'

export const revalidate = 60

export default async function Home() {
  const data = await getVisionData()
  const ua = (await headers()).get('user-agent')
  return <VisionExperience data={data} initialLight={isMobileUserAgent(ua)} />
}
