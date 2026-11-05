import type { Metadata } from 'next'
import ExperienceView from '@/app/_site/views/ExperienceView'
import { PREVIEW_ROUTES } from '@/app/_site/routes'

export const revalidate = 300
export const metadata: Metadata = { title: 'Experience', alternates: { canonical: '/preview/experience' } }

export default function Page() {
  return <ExperienceView routes={PREVIEW_ROUTES} />
}
