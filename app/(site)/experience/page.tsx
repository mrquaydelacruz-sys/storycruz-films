import type { Metadata } from 'next'
import ExperienceView from '@/app/_site/views/ExperienceView'
import { LIVE_ROUTES } from '@/app/_site/routes'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Experience',
  description: 'How working with StoryCruz Films works, from first hello to your investment guide, plus the photography and film services we offer.',
  alternates: { canonical: '/experience' },
}

export default function ExperiencePage() {
  return <ExperienceView routes={LIVE_ROUTES} />
}
