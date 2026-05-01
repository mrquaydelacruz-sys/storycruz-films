import type { PackageIncludedLine } from '@/lib/package-catalog-types'
import { parseIncludedLine } from '@/lib/package-catalog-math'

/** Display label from a Sanity feature (legacy string or object). */
export function getPricingFeatureLabel(feat: unknown): string {
  if (typeof feat === 'string') return feat.trim()
  if (feat && typeof feat === 'object') {
    const o = feat as { label?: unknown; text?: unknown }
    const label = String(o.label ?? '').trim()
    if (label) return label
    const text = String(o.text ?? '').trim()
    if (text) return text
  }
  return ''
}

/** Maps `features` / `included` array (legacy strings + Studio objects) to builder lines. */
export function packageFeaturesRawToIncludedLines(
  packageItemId: string,
  raw: unknown
): PackageIncludedLine[] {
  if (!Array.isArray(raw)) return []

  const out: PackageIncludedLine[] = []

  raw.forEach((f, i) => {
    if (typeof f === 'string') {
      const trimmed = f.trim()
      if (trimmed) out.push(parseIncludedLine(packageItemId, i, trimmed))
      return
    }
    if (f && typeof f === 'object') {
      const o = f as {
        label?: unknown
        text?: unknown
        removable?: unknown
        deductionAmount?: unknown
      }
      const label = String(o.label ?? '').trim()
      const plainText = String(o.text ?? '').trim()

      if (label) {
        const removable = o.removable !== false
        let removeCreditUsd = 0
        const ded = o.deductionAmount
        if (typeof ded === 'number' && Number.isFinite(ded) && ded >= 0) {
          removeCreditUsd = ded
        }
        out.push({
          id: `${packageItemId}__feat__${i}`,
          label,
          removeCreditUsd,
          removable,
        })
        return
      }

      if (plainText) {
        out.push(parseIncludedLine(packageItemId, i, plainText))
      }
    }
  })

  return out
}
