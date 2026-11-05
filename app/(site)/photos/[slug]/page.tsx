import type { Metadata } from 'next'
import AlbumView from '@/app/_site/views/AlbumView'
import { LIVE_ROUTES } from '@/app/_site/routes'
import { getAlbum } from '@/app/_site/data'

export const revalidate = 60
type P = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params
  const a = await getAlbum(slug)
  if (!a) return {}
  return {
    title: a.couple,
    description: `Wedding photography by StoryCruz Films — ${a.couple}.`,
    alternates: { canonical: LIVE_ROUTES.photo(slug) },
  }
}

export default async function AlbumPage({ params }: P) {
  const { slug } = await params
  return <AlbumView slug={slug} routes={LIVE_ROUTES} />
}
