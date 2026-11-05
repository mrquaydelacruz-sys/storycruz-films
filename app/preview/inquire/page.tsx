import type { Metadata } from 'next'
import InquireView from '@/app/_site/views/InquireView'
import InquiryDemo from '../_components/InquiryDemo'
import { PREVIEW_ROUTES } from '@/app/_site/routes'

export const revalidate = 300
export const metadata: Metadata = { title: 'Inquire', alternates: { canonical: '/preview/inquire' } }

// Preview sandbox: local-only simulated form (no network, no CRM).
export default function Page() {
  return <InquireView routes={PREVIEW_ROUTES} form={<InquiryDemo />} />
}
