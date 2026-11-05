import type { Metadata } from 'next'
import PhotographyView from '@/app/_site/views/PhotographyView'
import { PREVIEW_ROUTES } from '@/app/_site/routes'

export const revalidate = 300
export const metadata: Metadata = { title: 'Photography', alternates: { canonical: '/preview/photography' } }

export default function Page() {
  return <PhotographyView routes={PREVIEW_ROUTES} />
}
