import type { Metadata } from 'next'
import PreviewShell from './_components/PreviewShell'

/**
 * PREVIEW ONLY. Everything under /preview is a self-contained design concept.
 * - Not indexed: robots meta noindex/nofollow on every preview page.
 * - The live site chrome (global nav/footer rendered by the root layout) is hidden
 *   with a rule that only matches while a preview page is mounted, so no shared
 *   component or live page is modified.
 */
export const metadata: Metadata = {
  title: { default: 'Design preview', template: '%s · Design preview' },
  description: 'Internal design preview — not the live site.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
  openGraph: { title: 'Design preview', url: '/preview', images: [] },
  twitter: { card: 'summary', title: 'Design preview', images: [] },
}

const HIDE_LIVE_CHROME = `
body:has([data-scp-root]) > nav,
body:has([data-scp-root]) > footer { display: none !important; }
body:has([data-scp-root]) { background: #f6f1e7; }
`

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_LIVE_CHROME }} />
      <PreviewShell>{children}</PreviewShell>
    </>
  )
}
