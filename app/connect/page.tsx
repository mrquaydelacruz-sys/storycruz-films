import type { Metadata } from 'next'
import ConnectLanding from '@/components/ConnectLanding'
import { getSiteChromeData } from '@/lib/site-chrome'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Connect | StoryCruz Films',
  description:
    'Follow StoryCruz Films on social and visit our website for wedding films and photography.',
  robots: {
    index: true,
    follow: true,
  },
}

export default async function ConnectPage() {
  const data = await getSiteChromeData()
  return <ConnectLanding data={data} />
}
