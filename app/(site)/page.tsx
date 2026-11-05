import HomeView from '@/app/_site/views/HomeView'
import { LIVE_ROUTES } from '@/app/_site/routes'

// Metadata (title, description, canonical, Open Graph, JSON-LD) is inherited unchanged from the root layout.
export const revalidate = 60

export default function Home() {
  return <HomeView routes={LIVE_ROUTES} />
}
