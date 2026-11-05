import type { Metadata } from 'next'
import FilmView from '@/app/_site/views/FilmView'
import { PREVIEW_ROUTES } from '@/app/_site/routes'
import { getFilm } from '@/app/_site/data'

export const revalidate = 300
type P = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params
  const f = await getFilm(slug)
  return { title: f ? f.couple : 'Film', alternates: { canonical: PREVIEW_ROUTES.film(slug) } }
}

export default async function Page({ params }: P) {
  const { slug } = await params
  return <FilmView slug={slug} routes={PREVIEW_ROUTES} />
}
