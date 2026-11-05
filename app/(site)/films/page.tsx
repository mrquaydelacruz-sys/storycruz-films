import type { Metadata } from 'next'
import FilmsView from '@/app/_site/views/FilmsView'
import { LIVE_ROUTES } from '@/app/_site/routes'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Wedding Films',
  description: 'Watch cinematic wedding films from StoryCruz Films, capturing real, unscripted moments.',
  alternates: { canonical: '/films' },
}

export default function FilmsPage() {
  return <FilmsView routes={LIVE_ROUTES} />
}
