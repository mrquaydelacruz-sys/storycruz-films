import { redirect } from 'next/navigation'

/** Short alias for QR stickers that point at /qr instead of /connect. */
export default function QrAliasPage() {
  redirect('/connect')
}
