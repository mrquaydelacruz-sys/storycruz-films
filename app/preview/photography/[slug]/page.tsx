import type { Metadata } from 'next'
import AlbumView from '@/app/_site/views/AlbumView'
import { PREVIEW_ROUTES } from '@/app/_site/routes'
import { getAlbum } from '@/app/_site/data'

export const revalidate = 300
type P = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params
  const a = await getAlbum(slug)
  return { title: a ? a.couple : 'Gallery', alternates: { canonical: PREVIEW_ROUTES.photo(slug) } }
}

export default async function Page({ params }: P) {
  const { slug } = await params
  return <AlbumView slug={slug} routes={PREVIEW_ROUTES} />
}
