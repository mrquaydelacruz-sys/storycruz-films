import type { Metadata } from 'next'
import FilmsView from '@/app/_site/views/FilmsView'
import { PREVIEW_ROUTES } from '@/app/_site/routes'

export const revalidate = 300
export const metadata: Metadata = { title: 'Films', alternates: { canonical: '/preview/films' } }

export default function Page() {
  return <FilmsView routes={PREVIEW_ROUTES} />
}
