export type FrameCopy = {
  title: string
  story: string
}

/** Approved per-frame stories for the homepage pin-and-swap sequence. */
export const PHOTO_FRAMES: FrameCopy[] = [
  {
    title: 'Getting Ready',
    story:
      'Soft light, quiet nerves, the dress waiting. These are the breaths before forever begins.',
  },
  {
    title: 'First Look',
    story: 'The world goes still. Two hands find each other before anyone else sees.',
  },
  {
    title: 'The Vows',
    story: 'Unscripted promises, spoken soft enough that only love needs to hear them.',
  },
  {
    title: 'Portraits',
    story: 'Golden hush between the rush—just the two of you, unhurried and close.',
  },
  {
    title: 'The Details',
    story: 'Rings, lace, a handwritten note. The small things that become heirlooms.',
  },
  {
    title: 'The Dance',
    story: 'Music, laughter, and the kind of joy you feel in your chest for years.',
  },
  {
    title: 'Forever',
    story: 'Not an ending—a beginning held in light, kept for every tomorrow.',
  },
]

export function frameCopyFor(index: number): FrameCopy {
  return PHOTO_FRAMES[index % PHOTO_FRAMES.length]!
}
