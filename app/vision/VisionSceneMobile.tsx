'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import BackgroundVideo from '@/components/BackgroundVideo'
import type { VisionData } from '@/app/vision/types'

const FeaturedFilms = dynamic(() => import('@/components/FeaturedFilms'), {
  loading: () => (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center text-sm uppercase tracking-widest text-white/40">
      Loading films…
    </div>
  ),
})

const ContactSection = dynamic(() => import('@/components/ContactSection'), {
  loading: () => <div className="min-h-[40vh] bg-black" aria-hidden />,
})

function FramedPhoto({
  src,
  alt,
  width,
  height,
  className = '',
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden border border-white/20 bg-black ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 85vw, 320px" className="object-cover" />
    </div>
  )
}

export default function VisionSceneMobile({ data }: { data: VisionData }) {
  const slideshow =
    data.introSlideshowUrls && data.introSlideshowUrls.length > 0
      ? data.introSlideshowUrls
      : [data.introCenterUrl]

  return (
    <main className="bg-[#050505] font-serif text-white">
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
        <BackgroundVideo
          src={data.heroVideoUrl}
          poster={data.heroPosterUrl}
          className="absolute inset-0"
          videoClassName="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505]" />

        <div className="relative z-10 flex flex-col items-center px-6 pt-24 pb-36">
          <div className="relative mb-10 h-24 w-24 md:h-28 md:w-28">
            <Image
              src="/logo.png"
              alt="StoryCruz Films"
              fill
              priority
              sizes="112px"
              className="object-contain drop-shadow-2xl"
            />
          </div>

          <div className="max-w-lg text-center">
            <h2 className="mb-2 text-3xl font-normal drop-shadow-2xl md:text-5xl">
              Capturing the Unscripted
            </h2>
            <p className="text-xs uppercase tracking-widest text-white/70 md:text-sm">
              Cinematic Details That Make Your Story Truly Yours
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-16 px-4 pb-20 md:px-8">
        <div className="mx-auto flex max-w-lg flex-col gap-6">
          {data.introLeftUrl && (
            <FramedPhoto src={data.introLeftUrl} alt="" width={3} height={4} className="w-[72%] self-start" />
          )}

          <div className="-mx-2 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {slideshow.map((url, i) => (
              <FramedPhoto
                key={`${url}-${i}`}
                src={url}
                alt=""
                width={3}
                height={4}
                className="h-64 w-48 shrink-0 snap-center"
              />
            ))}
          </div>

          {data.introRightUrl && (
            <FramedPhoto src={data.introRightUrl} alt="" width={3} height={2} className="w-full" />
          )}
        </div>
      </section>

      {data.dividerImageUrl && (
        <section className="relative w-full overflow-hidden">
          <div className="relative aspect-[2/1] w-full">
            <Image src={data.dividerImageUrl} alt="" fill sizes="100vw" className="object-cover opacity-90" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
        </section>
      )}

      <FeaturedFilms films={data.featuredVideos.map((v) => ({ ...v, youtubeUrl: v.videoUrl }))} />

      <section className="px-4 py-20 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-3 text-2xl tracking-[0.4em] text-white/90" aria-hidden>
            ☆ ☆ ☆ ☆ ☆
          </div>
          <h3 className="mb-2 font-serif text-3xl text-white md:text-5xl">
            Kind Words From Our Couples
          </h3>
          <p className="mb-12 text-sm uppercase tracking-widest text-neutral-400">
            Love Letters That Inspire Us
          </p>
          <div className="flex flex-col gap-8">
            {data.testimonials?.slice(0, 3).map((t, i) => (
              <blockquote
                key={i}
                className="rounded-lg border border-white/10 bg-black/40 p-8 text-left backdrop-blur-md"
              >
                <p className="mb-6 text-lg italic">&ldquo;{t.quote}&rdquo;</p>
                <footer className="text-sm font-bold uppercase text-neutral-400">— {t.couple}</footer>
                {t.location && <p className="mt-2 text-xs text-neutral-600">{t.location}</p>}
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  )
}
