import s from '../preview.module.css'

/**
 * PREVIEW ONLY — purely decorative layers.
 * Every element is aria-hidden, non-focusable, pointer-events:none and clipped to its section,
 * so it can never intercept clicks, take focus, or create horizontal overflow.
 */

/** Soft translucent colour washes drawn only with the approved palette (olive wash + sand). */
export function Wash({ tone = 'olive', className = '' }: { tone?: 'olive' | 'sand'; className?: string }) {
  return <span aria-hidden="true" className={`${s.wash} ${tone === 'sand' ? s.washSand : s.washOlive} ${className}`} />
}

const LINES: Record<'ridge' | 'drift', string[]> = {
  // Flowing contour lines that echo the mountain/lake shapes in the logo — organic, not floral.
  ridge: [
    'M-20 330 C 90 270, 170 360, 290 300 S 470 190, 600 240 S 760 250, 840 190',
    'M-20 356 C 100 298, 176 386, 296 328 S 474 220, 604 268 S 764 282, 840 222',
    'M-20 382 C 108 326, 184 410, 302 354 S 480 252, 608 296 S 768 312, 840 254',
    'M-20 408 C 116 354, 190 434, 308 380 S 486 284, 612 324 S 772 342, 840 286',
  ],
  drift: [
    'M-20 120 C 80 80, 160 170, 280 130 S 460 60, 580 110 S 760 150, 840 100',
    'M-20 150 C 88 112, 168 198, 288 160 S 466 92, 586 140 S 764 184, 840 134',
    'M-20 180 C 96 144, 176 226, 296 190 S 472 124, 592 170 S 768 218, 840 168',
  ],
}

export function Contour({
  variant = 'ridge',
  animate = false,
  className = '',
}: {
  variant?: 'ridge' | 'drift'
  animate?: boolean
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`${s.contour} ${animate ? s.contourDraw : ''} ${className}`}
      viewBox="0 0 820 520"
      preserveAspectRatio="xMidYMid slice"
    >
      {LINES[variant].map((d, i) => (
        <path key={i} d={d} pathLength={1} vectorEffect="non-scaling-stroke" style={{ animationDelay: `${i * 0.35}s` }} />
      ))}
    </svg>
  )
}

/* ---------- Torn-paper edges (static, deterministic, no random at render time) ---------- */

function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let x = Math.imul(a ^ (a >>> 15), 1 | a)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * One torn profile: three incommensurate low-frequency sines (so nothing visibly repeats) plus a little
 * fibre jitter, joined with smooth Catmull-Rom curves — shallow and organic, never zigzag.
 */
function tearPath(seed: number, base: number, amp: number, fine: number, step = 24): string {
  const r = mulberry32(seed)
  const [p1, p2, p3] = [r() * 6.283, r() * 6.283, r() * 6.283]
  const pts: [number, number][] = []
  for (let x = -48; x <= 1248; x += step) {
    const n = Math.sin(x / 190 + p1) * 0.5 + Math.sin(x / 83 + p2) * 0.3 + Math.sin(x / 37 + p3) * 0.12
    pts.push([x, base + amp * n + (r() - 0.5) * 2 * fine])
  }
  const f = (n: number) => n.toFixed(1)
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const a = pts[i]
    const b = pts[i + 1]
    const c = pts[Math.min(pts.length - 1, i + 2)]
    d += ` C${f(a[0] + (b[0] - p0[0]) / 6)} ${f(a[1] + (b[1] - p0[1]) / 6)} ${f(b[0] - (c[0] - a[0]) / 6)} ${f(b[1] - (c[1] - a[1]) / 6)} ${f(b[0])} ${f(b[1])}`
  }
  return `${d} L1248 60 L-48 60 Z`
}

const TORN = {
  // back sheet (sand) → fibrous paper rim → front sheet (the section's own colour), each torn a little lower
  story: {
    sand: tearPath(11, 14, 9, 0.9),
    paper: tearPath(23, 26, 8, 1.8, 14),
    front: tearPath(37, 34, 8, 0.7),
  },
  // simpler: a single softly irregular edge for the dark closing section
  closing: { front: tearPath(91, 30, 6, 0.9) },
} as const

/**
 * Decorative torn-paper section transition. Lives inside the section it introduces, above its top edge.
 * `slice` + bottom anchoring keeps feature proportions natural at every width (no stretched tears).
 */
export function TornEdge({ variant, className = '' }: { variant: 'story' | 'closing'; className?: string }) {
  const id = `scp-torn-${variant}`
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`${s.torn} ${className}`}
      viewBox="0 0 1200 56"
      preserveAspectRatio="xMidYMax slice"
    >
      {variant === 'story' ? (
        <>
          <defs>
            <filter id={id} x="-2%" y="-60%" width="104%" height="220%" colorInterpolationFilters="sRGB">
              <feDropShadow dx="0" dy="-1" stdDeviation="1.3" floodColor="#26241f" floodOpacity="0.1" />
            </filter>
          </defs>
          <path d={TORN.story.sand} className={s.tornSand} />
          <path d={TORN.story.paper} className={s.tornPaper} filter={`url(#${id})`} />
          <path d={TORN.story.front} className={s.tornBand} filter={`url(#${id})`} />
        </>
      ) : (
        <path d={TORN.closing.front} className={s.tornCharcoal} />
      )}
    </svg>
  )
}
