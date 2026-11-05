'use client'

import { useState } from 'react'
import s from '../site.module.css'

/**
 * Click-to-load player. No third-party embed is requested until the visitor presses play
 * (privacy-friendly and keeps preview navigation free of external requests).
 */
export default function FilmPlayer({
  youtubeId,
  title,
  poster,
}: {
  youtubeId: string | null
  title: string
  poster: string | null
}) {
  const [on, setOn] = useState(false)

  if (!youtubeId) {
    return (
      <div className={s.player}>
        <div className={s.placeholder} style={{ color: '#e9e2d2' }}>
          This film does not have a playable video link yet.
        </div>
      </div>
    )
  }

  return (
    <div className={s.player}>
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" className={s.playBtn} onClick={() => setOn(true)} aria-label={`Play film: ${title}`}>
          {poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" />
          )}
          <span className={s.playDisc} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4l14 8-14 8z" />
            </svg>
          </span>
          <span className={s.playLabel}>Play film</span>
        </button>
      )}
    </div>
  )
}
