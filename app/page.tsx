import { headers } from 'next/headers'
import VisionExperience from '@/app/vision/VisionExperience'
import { getVisionData } from '@/lib/vision-data'
import { getSiteChromeData } from '@/lib/site-chrome'
import { isMobileUserAgent } from '@/lib/device'

export const revalidate = 60

export default async function Home() {
  const [data, chrome] = await Promise.all([getVisionData(), getSiteChromeData()])
  const ua = (await headers()).get('user-agent')
  return <VisionExperience data={data} chrome={chrome} initialLight={isMobileUserAgent(ua)} />
}
