import VisionScene from "@/app/vision/VisionScene";
import { getVisionData } from "@/app/vision/page";

export const revalidate = 60;

export default async function Home() {
  const data = await getVisionData();
  return <VisionScene data={data} />;
}
