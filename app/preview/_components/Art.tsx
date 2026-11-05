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

/** A gently undulating section edge. `fill` must be one of the approved section colours. */
export function Edge({ fill, className = '' }: { fill: 'band' | 'charcoal'; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`${s.edge} ${fill === 'band' ? s.edgeBand : s.edgeCharcoal} ${className}`}
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
    >
      <path d="M0 40 V22 C 140 4, 260 4, 400 20 S 680 40, 820 22 S 1080 2, 1200 18 V40 Z" />
    </svg>
  )
}
