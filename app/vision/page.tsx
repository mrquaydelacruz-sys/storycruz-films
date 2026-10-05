import VisionExperience from '@/app/vision/VisionExperience'
import { getVisionData } from '@/lib/vision-data'
import { getSiteChromeData } from '@/lib/site-chrome'

export const revalidate = 60

export { getVisionData }

export default async function VisionPage() {
  const [data, chrome] = await Promise.all([getVisionData(), getSiteChromeData()])
  return <VisionExperience data={data} chrome={chrome} />
}
