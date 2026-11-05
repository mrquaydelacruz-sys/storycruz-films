import type { Metadata } from 'next'
import PhotographyView from '@/app/_site/views/PhotographyView'
import { LIVE_ROUTES } from '@/app/_site/routes'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Wedding Photography',
  description: 'Browse wedding photography galleries by StoryCruz Films.',
  alternates: { canonical: '/photos' },
}

export default function PhotosPage() {
  return <PhotographyView routes={LIVE_ROUTES} />
}
