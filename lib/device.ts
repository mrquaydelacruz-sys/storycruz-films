/** True for phones / tablets where the light (non-WebGL) experience is preferred. */
export function isMobileUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
    userAgent
  )
}
