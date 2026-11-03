import VisionExperience from '@/app/vision/VisionExperience'
import { getVisionData } from '@/lib/vision-data'

export const revalidate = 60

export default async function Home() {
  const data = await getVisionData()
  return <VisionExperience data={data} />
}
