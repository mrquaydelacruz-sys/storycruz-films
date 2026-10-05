import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  /** Aspect / sizing for the media well (e.g. aspect-video, aspect-[3/4]). */
  contentClassName?: string
}

/**
 * Single thin white frame — same treatment as the /photos album cards
 * (`bg-[#fdfdfd] p-[3px]`).
 */
export default function WhitePhotoFrame({
  children,
  className = '',
  contentClassName = '',
}: Props) {
  return (
    <div
      className={`relative min-w-0 bg-[#fdfdfd] p-[3px] shadow-lg ${className}`}
    >
      <div className={`relative w-full overflow-hidden bg-neutral-900 ${contentClassName}`}>
        {children}
      </div>
    </div>
  )
}
