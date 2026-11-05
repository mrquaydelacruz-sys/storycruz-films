import type { Metadata } from 'next'
import FilmView from '@/app/_site/views/FilmView'
import { LIVE_ROUTES } from '@/app/_site/routes'
import { getFilm } from '@/app/_site/data'

export const revalidate = 60
type P = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params
  const f = await getFilm(slug)
  if (!f) return {}
  return {
    title: f.couple,
    description: `Wedding film by StoryCruz Films — ${f.couple}.`,
    alternates: { canonical: LIVE_ROUTES.film(slug) },
  }
}

export default async function FilmPage({ params }: P) {
  const { slug } = await params
  return <FilmView slug={slug} routes={LIVE_ROUTES} />
}
