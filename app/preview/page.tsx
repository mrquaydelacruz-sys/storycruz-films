import type { Metadata } from 'next'
import Link from 'next/link'
import s from './preview.module.css'
import Reveal from './_components/Reveal'
import { Arrow, Photo, PlayIcon } from './_components/ui'
import { Contour, TornEdge, Wash } from './_components/Art'
import { getAlbums, getFilms, getHome, getStory, matchPairs, formatDate } from './_lib/data'

export const revalidate = 300
export const metadata: Metadata = { title: { absolute: 'Home · Design preview' }, alternates: { canonical: '/preview' } }

export default async function PreviewHome() {
  const [home, albums, films, story] = await Promise.all([getHome(), getAlbums(), getFilms(), getStory()])
  const pairs = matchPairs(albums, films)
  const album = albums[0]
  const film = films[0]
  const quotes = home.testimonials.filter((t) => t.quote).slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section className={`${s.hero} ${s.artSection} ${s.grain}`} aria-labelledby="scp-h1">
        <div className={`${s.artLayer} ${s.fadeBottom}`} aria-hidden="true">
          <Wash tone="olive" className={s.heroWashA} />
          <Wash tone="sand" className={s.heroWashB} />
          <Contour variant="ridge" animate className={s.heroContour} />
        </div>
        <div className={`${s.wrap} ${s.heroGrid} ${s.above}`}>
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>Story Cruz Films · {story.location}</p>
            <h1 id="scp-h1" className={s.h1}>
              Wedding photography &amp; films that <em>feel like you.</em>
            </h1>
            <p className={s.lede}>Honest moments. Meaningful stories.</p>
            <div className={s.btnRow}>
              <Link href="/preview/photography" className={`${s.btn} ${s.btnSolid}`}>Explore Photography</Link>
              <Link href="/preview/films" className={`${s.btn} ${s.btnSolid}`}>Watch Our Films</Link>
            </div>
          </div>

          <div className={s.heroFrames}>
            {album && (
              <Link href="/preview/photography" className={s.heroFrame}>
                <div className={`${s.frame} ${s.kenburns}`}>
                  <span className={s.tag}>Photography</span>
                  <Photo src={album.coverUrl ?? home.heroUrl} alt={`Wedding photograph — ${album.couple}`} sizes="(max-width: 62rem) 50vw, 28vw" priority />
                </div>
                <span className={s.caption}>{album.couple}</span>
              </Link>
            )}
            {film && (
              <Link href="/preview/films" className={s.heroFrame}>
                <div className={`${s.frame} ${s.kenburns}`}>
                  <span className={s.tag}>Film</span>
                  <Photo src={film.thumbUrl} alt={`Wedding film still — ${film.couple}`} sizes="(max-width: 62rem) 50vw, 28vw" priority />
                  <span className={s.playBadge} aria-hidden="true"><PlayIcon /></span>
                </div>
                <span className={s.caption}>{film.couple}</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* TWO DOORS — equal weight */}
      <section className={`${s.section} ${s.artSection}`} style={{ paddingTop: 0 }} aria-labelledby="scp-two">
        <div className={`${s.wrap} ${s.above}`}>
          <Reveal>
            <p className={s.eyebrow}>Two ways we tell your story</p>
            <h2 id="scp-two" className={s.h2} style={{ maxWidth: '40rem' }}>
              One team. <em>Stills and motion,</em> side by side.
            </h2>
          </Reveal>
          <div className={s.doors} style={{ marginTop: 'clamp(2rem,4vw,3.5rem)' }}>
            <Reveal>
              <Link href="/preview/photography" className={s.door} style={{ display: 'block' }}>
                <div className={`${s.frame} ${s.zoom}`}>
                  <Photo src={albums[1]?.coverUrl ?? album?.coverUrl ?? null} alt="A recent wedding photograph" sizes="(max-width: 48rem) 100vw, 50vw" />
                </div>
                <div className={s.doorBody}>
                  <h3 className={s.h3}>Photography</h3>
                  <p>Candid, documentary-style wedding photographs with a warm, moody feel.</p>
                  <span className={s.arrowLink}>Explore Photography <Arrow /></span>
                </div>
              </Link>
            </Reveal>
            <Reveal delay={120}>
              <Link href="/preview/films" className={s.door} style={{ display: 'block' }}>
                <div className={`${s.frame} ${s.zoom}`}>
                  <Photo src={films[1]?.thumbUrl ?? film?.thumbUrl ?? null} alt="A recent wedding film still" sizes="(max-width: 48rem) 100vw, 50vw" />
                  <span className={s.playBadge} aria-hidden="true"><PlayIcon /></span>
                </div>
                <div className={s.doorBody}>
                  <h3 className={s.h3}>Films</h3>
                  <p>Wedding highlight films and trailers that let you feel the day again.</p>
                  <span className={s.arrowLink}>Watch Our Films <Arrow /></span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SAME-WEDDING PAIRS — rendered only when genuine matches exist */}
      {pairs.length > 0 && (
        <section className={`${s.section} ${s.band}`} aria-labelledby="scp-pairs">
          <div className={s.wrap}>
            <p className={s.eyebrow}>Same wedding, both ways</p>
            <h2 id="scp-pairs" className={s.h2}>Photographs and film from <em>one day.</em></h2>
            <div className={s.pairGrid} style={{ marginTop: '2.5rem' }}>
              {pairs.slice(0, 2).map(({ album: a, film: f }) => (
                <div key={a.slug}>
                  <div className={s.pair}>
                    <Link href={`/preview/photography/${a.slug}`} className={`${s.frame} ${s.zoom}`}>
                      <span className={s.tag}>Photos</span>
                      <Photo src={a.coverUrl} alt={`Photographs: ${a.couple}`} sizes="25vw" />
                    </Link>
                    <Link href={`/preview/films/${f.slug}`} className={`${s.frame} ${s.zoom}`}>
                      <span className={s.tag}>Film</span>
                      <Photo src={f.thumbUrl} alt={`Film: ${f.couple}`} sizes="25vw" />
                      <span className={s.playBadge} aria-hidden="true"><PlayIcon /></span>
                    </Link>
                  </div>
                  <p className={s.caption}>{a.couple}{formatDate(a.date) ? ` · ${formatDate(a.date)}` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OUR APPROACH — existing approved copy, with a fine-art collage */}
      <section className={`${s.section} ${s.artSection} ${pairs.length ? s.grain : s.band}`} aria-labelledby="scp-approach">
        {!pairs.length && <TornEdge variant="story" />}
        <div className={s.artLayer} aria-hidden="true">
          <Contour variant="drift" className={s.storyContour} />
        </div>
        <div className={`${s.wrap} ${s.split} ${s.above}`}>
          <Reveal>
            <div className={s.collage}>
              <Wash tone="sand" className={s.collageWash} />
              <div className={`${s.frame} ${s.collageMain}`}>
                <Photo src={story.christineImageUrl ?? story.aboutImageUrl} alt="Christine of Story Cruz Films" sizes="(max-width: 52rem) 80vw, 32vw" />
              </div>
              {story.christineImageUrl && story.aboutImageUrl && (
                <div className={`${s.frame} ${s.collageInset}`}>
                  <Photo src={story.aboutImageUrl} alt="About Story Cruz Films" sizes="(max-width: 52rem) 40vw, 16vw" />
                </div>
              )}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className={s.eyebrow}>Quay &amp; Christine</p>
            <h2 id="scp-approach" className={s.h2}>Photo and film, <em>together.</em></h2>
            <p className={s.pull}>
              We’re all about those candid moments, a documentary vibe, and a warm, moody aesthetic.
            </p>
            <div className={s.prose}>
              <p>
                We believe freezing memories in a snapshot is just as vital as capturing the magic on video. Book both of
                us and Christine is your main photographer; Quay is right alongside — and the same goes for film.
              </p>
            </div>
            <Link href="/preview/our-story" className={s.arrowLink}>Read our story <Arrow /></Link>
          </Reveal>
        </div>
      </section>

      {/* REAL REVIEWS from the existing site content */}
      {quotes.length > 0 && (
        <section className={s.section} style={{ paddingTop: 0 }} aria-labelledby="scp-kind">
          <div className={s.wrap}>
            <p className={s.eyebrow}>Kind words from couples</p>
            <h2 id="scp-kind" className={s.h2} style={{ marginBottom: '2.5rem' }}>In their <em>own words.</em></h2>
            <div className={s.quotes}>
              {quotes.map((q) => (
                <Reveal key={q.couple + q.quote.slice(0, 12)}>
                  <figure className={s.quote}>
                    <blockquote>“{q.quote.length > 260 ? q.quote.slice(0, 257).trimEnd() + '…' : q.quote}”</blockquote>
                    <figcaption>{q.couple}{q.location ? ` · ${q.location}` : ''}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={`${s.section} ${s.cta} ${s.artSection}`} aria-labelledby="scp-cta">
        <TornEdge variant="closing" />
        <div className={`${s.wrap} ${s.narrow} ${s.above}`}>
          <h2 id="scp-cta" className={s.h2}>Let’s talk about <em>your day.</em></h2>
          <p>We’d love to hear your story.</p>
          <div className={s.btnRow}>
            <Link href="/preview/inquire" className={`${s.btn} ${s.btnLight}`}>Start an inquiry (demo)</Link>
            <Link href="/preview/experience" className={`${s.btn} ${s.btnOutlineLight}`}>The experience</Link>
          </div>
        </div>
      </section>
    </>
  )
}
