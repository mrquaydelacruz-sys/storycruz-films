import type { Metadata } from 'next'
import StoryView from '@/app/_site/views/StoryView'
import { LIVE_ROUTES } from '@/app/_site/routes'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet the team behind StoryCruz Films and the story-first approach we bring to every wedding.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return <StoryView routes={LIVE_ROUTES} />
}
