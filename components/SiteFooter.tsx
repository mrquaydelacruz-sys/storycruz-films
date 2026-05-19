import Footer from '@/components/Footer'
import { getSiteChromeData } from '@/lib/site-chrome'

type Props = {
  className?: string
}

/** Server wrapper — use on pages that need a footer outside SiteChrome. */
export default async function SiteFooter({ className }: Props) {
  const data = await getSiteChromeData()
  return <Footer data={data} className={className} />
}
