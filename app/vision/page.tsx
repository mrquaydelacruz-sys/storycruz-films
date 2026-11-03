import VisionExperience from '@/app/vision/VisionExperience'
import { getVisionData } from '@/lib/vision-data'

export const revalidate = 60

export { getVisionData }

export default async function VisionPage() {
  const data = await getVisionData()
  return <VisionExperience data={data} />
}
