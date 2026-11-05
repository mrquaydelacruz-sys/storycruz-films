import type { Metadata } from 'next'
import HomeView from '@/app/_site/views/HomeView'
import { PREVIEW_ROUTES } from '@/app/_site/routes'

export const revalidate = 300
export const metadata: Metadata = { title: { absolute: 'Home · Design preview' }, alternates: { canonical: '/preview' } }

export default function PreviewHome() {
  return <HomeView routes={PREVIEW_ROUTES} />
}
