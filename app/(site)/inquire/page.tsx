import type { Metadata } from 'next'
import InquireView from '@/app/_site/views/InquireView'
// The existing, working inquiry form — unmodified (validation, payload mapping, Cruzcontrol POST).
import ContactForm from '@/components/ContactForm'
import { LIVE_ROUTES } from '@/app/_site/routes'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Inquire',
  description: 'Check availability and inquire about wedding film and photography with StoryCruz Films.',
  alternates: { canonical: '/inquire' },
}

export default function InquirePage() {
  return <InquireView routes={LIVE_ROUTES} form={<ContactForm />} />
}
