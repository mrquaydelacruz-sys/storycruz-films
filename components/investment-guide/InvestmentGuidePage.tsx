import Image from 'next/image'
import Link from 'next/link'
import { Suspense, type ReactNode } from 'react'
import InvestmentGuideHashScroll from '@/components/investment-guide/InvestmentGuideHashScroll'
import InvestmentGuideVideoHero from '@/components/investment-guide/InvestmentGuideVideoHero'
import {
  ADDON_DISPLAY_GROUPS,
  INTIMATE_TIER_CARDS,
  INVESTMENT_GUIDE_FAQS,
  INVESTMENT_GUIDE_IMAGES,
  PROCESS_STEPS,
  STANDARD_ITEMS,
  WEDDING_TIER_CARDS,
} from '@/lib/investment-guide-data'
import './investment-guide.css'

function formatPrice(n: number): string {
  return `$${n.toLocaleString('en-CA')}`
}

function GoldRule() {
  return (
    <div className="ig-rule" aria-hidden>
      <span />
    </div>
  )
}

function TierCard({
  numeral,
  name,
  hours,
  priceLabel,
  price,
  alt,
  description,
  inclusions,
  featured,
  cta,
  image,
  imageAlt,
}: {
  numeral: string
  name: string
  hours: string
  priceLabel: string
  price: number
  alt: string
  description: string
  inclusions: readonly string[]
  featured: boolean
  cta: string
  image: string
  imageAlt: string
}) {
  return (
    <article className={`ig-tier${featured ? ' feature' : ''}`}>
      {featured ? <span className="ig-badge">Most Booked</span> : null}
      <div className="ig-tier-ph">
        <Image src={image} alt={imageAlt} fill sizes="(max-width:1024px) 100vw, 360px" />
      </div>
      <div className="ig-tier-body">
        <span className="ig-tier-num">{numeral}</span>
        <h4>{name}</h4>
        <span className="ig-tier-hours">{hours}</span>
        <div className="ig-price">
          <small>{priceLabel}</small>
          {formatPrice(price)} <i>+ GST</i>
        </div>
        <div className="ig-alt">{alt}</div>
        <p className="ig-tier-desc">{description}</p>
        <ul>
          {inclusions.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <Link className="ig-btn" href="/inquire">
          {cta}
        </Link>
      </div>
    </article>
  )
}

type Props = {
  builder: ReactNode
  /** Same looping hero video as the live investment / package-builder header. */
  heroVideoSrc?: string | null
}

export default function InvestmentGuidePage({ builder, heroVideoSrc }: Props) {
  const faqCategories = Array.from(new Set(INVESTMENT_GUIDE_FAQS.map((f) => f.category)))

  return (
    <div className="ig">
      <Suspense fallback={null}>
        <InvestmentGuideHashScroll />
      </Suspense>

      <InvestmentGuideVideoHero videoSrc={heroVideoSrc} />

      <nav className="ig-jump" aria-label="Sections">
        <div className="ig-wrap">
          <a href="#choose">How to Choose</a>
          <a href="#intimate">Elopements &amp; Intimate</a>
          <a href="#weddings">Weddings</a>
          <a href="#availability">Availability</a>
          <a href="#addons">Enhancements</a>
          <a href="#process">Booking</a>
          <a href="#faq">FAQ</a>
        </div>
      </nav>

      <section className="ig-section">
        <div className="ig-wrap ig-intro-grid">
          <figure className="ig-intro-figure">
            <Image
              src={INVESTMENT_GUIDE_IMAGES.story}
              alt="Couple at golden hour on the Alberta prairie"
              width={1100}
              height={1375}
              sizes="(max-width:1024px) 100vw, 520px"
            />
          </figure>
          <div className="ig-intro-copy">
            <span className="ig-eyebrow">Our Story</span>
            <h2 style={{ margin: '18px 0 26px' }}>
              Love that defied <em>distance.</em>
            </h2>
            <p className="ig-lead">
              For four years our own story was written across oceans: late-night calls, timezone
              calculations, and the belief that we were meant to be together. In 2019 we closed that
              distance for good and got married.
            </p>
            <p>
              That day gave us our calling. Today Quay leads the cinematography and Christine leads
              the photography: candid, documentary, warm and moody, with gentle guidance for refined
              portraits. Because we take only a handful of celebrations each year, every couple has
              our full creative energy.
            </p>
            <div className="ig-sig">Love, Quay &amp; Christine</div>
          </div>
        </div>
      </section>

      <section className="ig-section ig-compare" id="choose">
        <div className="ig-wrap">
          <div className="ig-center ig-narrow">
            <span className="ig-eyebrow">How to Choose</span>
            <h2 style={{ marginTop: 18 }}>
              Elopement, or <em>full wedding?</em>
            </h2>
            <GoldRule />
            <p className="ig-lead">
              Two distinct experiences, each with its own collections. Choose by the shape of your
              day, not just the hours.
            </p>
          </div>
          <table className="ig-cmp">
            <thead>
              <tr>
                <th />
                <th>
                  <span>Collections I–III</span>Elopement &amp; Intimate
                </th>
                <th>
                  <span>Collections IV–VI</span>Full Wedding
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Best for</th>
                <td data-l="Elopement & Intimate">
                  Courthouse signings, mountain vow exchanges and micro-weddings
                </td>
                <td data-l="Full Wedding">
                  A complete wedding day, from getting ready through the last dance
                </td>
              </tr>
              <tr>
                <th>Guest count</th>
                <td data-l="Elopement & Intimate">
                  <b>40 guests or fewer</b>
                </td>
                <td data-l="Full Wedding">
                  <b>Any size</b>
                </td>
              </tr>
              <tr>
                <th>Coverage</th>
                <td data-l="Elopement & Intimate">
                  <b>1 – 4 hours</b>
                </td>
                <td data-l="Full Wedding">
                  <b>8 – 12 hours</b>
                </td>
              </tr>
              <tr>
                <th>Your team</th>
                <td data-l="Elopement & Intimate">One creator, or Quay &amp; Christine together</td>
                <td data-l="Full Wedding">Quay &amp; Christine, plus an associate on larger days</td>
              </tr>
              <tr>
                <th>Your film</th>
                <td data-l="Elopement & Intimate">Vow edit, or a 3–4 minute storytelling film</td>
                <td data-l="Full Wedding">
                  4–10 minute cinematic film, plus ceremony and speech edits
                </td>
              </tr>
              <tr>
                <th>Availability</th>
                <td data-l="Elopement & Intimate">Inquire for your date</td>
                <td data-l="Full Wedding">Inquire for your date</td>
              </tr>
              <tr>
                <th>Investment</th>
                <td data-l="Elopement & Intimate">
                  <b>From $850</b>
                </td>
                <td data-l="Full Wedding">
                  <b>From $4,400</b> for photo + film
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="ig-section" id="intimate">
        <div className="ig-wrap">
          <div className="ig-col-head">
            <div>
              <span className="ig-eyebrow">Elopement &amp; Intimate Collections</span>
              <h2 style={{ marginTop: 18 }}>
                Small days,
                <br />
                <em>told in full.</em>
              </h2>
            </div>
            <p>
              Designed for 40 guests or fewer. The focus stays on the &quot;I do&quot;, and nothing
              is missed. Each collection is shown as photo and film by Quay &amp; Christine, with
              single-medium options below.
            </p>
          </div>
          <div className="ig-tiers">
            {INTIMATE_TIER_CARDS.map((card) => (
              <TierCard key={card.name} {...card} />
            ))}
          </div>
          <p className="ig-small ig-center" style={{ marginTop: 44 }}>
            Strictly 40 guests or fewer. Additional coverage $250/hr for the two-person team. A
            National/Provincial Park location fee of $100–$500 may apply.
          </p>
        </div>
      </section>

      <section className="ig-section" id="weddings" style={{ paddingTop: 40 }}>
        <div className="ig-wrap">
          <div className="ig-rule" style={{ marginBottom: 90 }} aria-hidden>
            <span />
          </div>
          <div className="ig-col-head">
            <div>
              <span className="ig-eyebrow">Wedding Collections · Photo + Film</span>
              <h2 style={{ marginTop: 18 }}>
                The whole day,
                <br />
                <em>in perfect sync.</em>
              </h2>
            </div>
            <p>
              Our signature experience: Quay and Christine capturing your day together, photo and
              film in one vision, with an associate joining on larger celebrations. Booking both
              together is always the better value compared with booking them separately.
            </p>
          </div>
          <div className="ig-tiers">
            {WEDDING_TIER_CARDS.map((card) => (
              <TierCard key={card.name} {...card} />
            ))}
          </div>

          <div className="ig-single">
            <div className="ig-single-card">
              <span className="ig-eyebrow">Photography Only</span>
              <h5 style={{ marginTop: 10 }}>Lead Photographer</h5>
              <p className="ig-small" style={{ marginBottom: 10 }}>
                Curated gallery · private online gallery · personal printing rights
              </p>
              <div className="ig-single-row">
                <span>
                  Collection I · 6 hours
                  <em>Getting ready through your first dance</em>
                </span>
                <span>$2,200</span>
              </div>
              <div className="ig-single-row">
                <span>
                  Collection II · 8 hours
                  <em>+ 30-min engagement session</em>
                </span>
                <span>$2,800</span>
              </div>
              <div className="ig-single-row">
                <span>
                  Collection III · 10 hours
                  <em>+ 2nd photographer (3 hrs) &amp; 1-hr engagement session</em>
                </span>
                <span>$3,400</span>
              </div>
            </div>
            <div className="ig-single-card">
              <span className="ig-eyebrow">Cinematography Only</span>
              <h5 style={{ marginTop: 10 }}>Two Cinematographers</h5>
              <p className="ig-small" style={{ marginBottom: 10 }}>
                Digital delivery · music licensed and selected for you
              </p>
              <div className="ig-single-row">
                <span>
                  The Signature Film · 8 hours
                  <em>3–4 min highlight film · full ceremony edit</em>
                </span>
                <span>$2,800</span>
              </div>
              <div className="ig-single-row">
                <span>
                  The Legacy Film · 10 hours
                  <em>5–8 min film · ceremony &amp; speeches · 60-sec teaser</em>
                </span>
                <span>$3,500</span>
              </div>
              <div className="ig-single-row">
                <span>
                  The Masterpiece Film · 10 hours
                  <em>8–10 min feature · ceremony, speeches, first dances · teaser · drone</em>
                </span>
                <span>$4,200</span>
              </div>
            </div>
          </div>
          <p className="ig-small ig-center" style={{ marginTop: 30 }}>
            All prices in Canadian dollars, plus GST.
          </p>
        </div>
      </section>

      <section className="ig-section ig-band" id="availability">
        <Image
          className="ig-band-bg"
          src={INVESTMENT_GUIDE_IMAGES.hero}
          alt=""
          fill
          sizes="100vw"
        />
        <div className="ig-wrap">
          <div className="ig-center ig-narrow">
            <span className="ig-eyebrow">Availability</span>
            <h2 style={{ marginTop: 18 }}>
              Every date is <em>personal.</em>
            </h2>
            <GoldRule />
            <p className="ig-lead" style={{ color: '#e2dacb', marginBottom: 40 }}>
              Tell us your date and location, and we&apos;ll share our availability in our very first
              conversation.
            </p>
            <Link className="ig-btn gold" href="/inquire">
              Inquire about your date
            </Link>
          </div>
        </div>
      </section>

      <section className="ig-section" id="addons">
        <div className="ig-wrap">
          <div className="ig-center ig-narrow">
            <span className="ig-eyebrow">À La Carte</span>
            <h2 style={{ marginTop: 18 }}>Enhancements</h2>
            <GoldRule />
            <p>Add to any collection. Prices plus GST.</p>
          </div>
          <div className="ig-addons">
            {ADDON_DISPLAY_GROUPS.map((group) => (
              <div key={group.title} style={{ display: 'contents' }}>
                <div className="ig-addon-group ig-eyebrow">{group.title}</div>
                {group.items.map((item) => (
                  <div className="ig-addon" key={item.name}>
                    <div>
                      <h6>{item.name}</h6>
                      {item.note ? <p>{item.note}</p> : null}
                    </div>
                    <span>{item.price}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="ig-small ig-center" style={{ marginTop: 44 }}>
            Need a shorter day? Coverage can be reduced with a credit of $150 per hour on
            single-medium collections and $250 per hour on photo + film collections.
          </p>
        </div>
      </section>

      <section className="ig-section ig-incl">
        <div className="ig-wrap">
          <div className="ig-center ig-narrow">
            <span className="ig-eyebrow">With Every Collection</span>
            <h2 style={{ marginTop: 18 }}>
              The Story Cruz <em>standard</em>
            </h2>
            <GoldRule />
          </div>
          <div className="ig-incl-grid">
            {STANDARD_ITEMS.map((item) => (
              <div key={item.n}>
                <span className="ig-incl-n">{item.n}</span>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ig-section" id="process">
        <div className="ig-wrap">
          <div className="ig-center ig-narrow">
            <span className="ig-eyebrow">Reserving Your Date</span>
            <h2 style={{ marginTop: 18 }}>
              Four simple <em>steps</em>
            </h2>
            <GoldRule />
          </div>
          <div className="ig-steps">
            {PROCESS_STEPS.map((step) => (
              <div key={step.n}>
                <span className="ig-steps-n">{step.n}</span>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ig-builder-section" id="builder">
        <div className="ig-wrap">
          <div className="ig-center ig-narrow" style={{ marginBottom: 50 }}>
            <span className="ig-eyebrow">Interactive Builder</span>
            <h2 style={{ marginTop: 18 }}>
              Build your <em>package</em>
            </h2>
            <GoldRule />
            <p className="ig-lead">
              Select collections, customize inclusions, and send your draft. Approximate totals are
              before tax (GST not included).
            </p>
          </div>
          <div className="ig-builder-shell">{builder}</div>
        </div>
      </section>

      <section className="ig-section ig-faq" id="faq">
        <div className="ig-wrap ig-narrow">
          <div className="ig-center">
            <span className="ig-eyebrow">Common Inquiries</span>
            <h2 style={{ marginTop: 18 }}>
              Questions, <em>answered</em>
            </h2>
            <GoldRule />
          </div>
          {faqCategories.map((cat) => (
            <div key={cat}>
              <p className="ig-eyebrow ig-faq-cat">{cat}</p>
              {INVESTMENT_GUIDE_FAQS.filter((f) => f.category === cat).map((faq, i) => (
                <details key={faq.question} open={cat === faqCategories[0] && i === 0}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="ig-cta">
        <Image
          src={INVESTMENT_GUIDE_IMAGES.cta}
          alt="Couple running through a field at sunset"
          fill
          sizes="100vw"
        />
        <div className="ig-wrap">
          <span className="ig-eyebrow">Now booking</span>
          <h2 style={{ margin: '20px 0 24px' }}>
            Let&apos;s tell <em>your story.</em>
          </h2>
          <p>
            We take on only 10–20 couples a year. Share your date and we&apos;ll be in touch within
            24–48 hours.
          </p>
          <Link className="ig-btn gold" href="/inquire">
            Inquire about your date
          </Link>
          <a className="ig-btn" href="#builder">
            Build a custom package
          </a>
        </div>
      </section>

      <p className="ig-small ig-center" style={{ padding: '40px 22px 60px' }}>
        Story Cruz Films · Investment Guide 2026 · All prices CAD, plus GST
      </p>
    </div>
  )
}
