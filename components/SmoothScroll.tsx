'use client'

import { ReactLenis } from '@studio-freight/react-lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // duration: 1.5 makes the scroll longer/smoother (luxury feel)
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children as any}
    </ReactLenis>
  )
}