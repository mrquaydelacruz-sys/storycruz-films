import type { Metadata } from 'next'
import StoryView from '@/app/_site/views/StoryView'
import { PREVIEW_ROUTES } from '@/app/_site/routes'

export const revalidate = 300
export const metadata: Metadata = { title: 'Our Story', alternates: { canonical: '/preview/our-story' } }

export default function Page() {
  return <StoryView routes={PREVIEW_ROUTES} />
}
