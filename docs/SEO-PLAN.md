# SEO Plan: Rank #1 in Our Area

**Goal:** Rank first for relevant searches in your service area (wedding videography, wedding photography, cinematic films, branding).

**Current state (storycruz-films):**
- ✅ Root metadata (title, description, Open Graph, Twitter) in `app/layout.tsx`
- ✅ `metadataBase` and domain set to `https://www.storycruzfilms.com`
- ❌ No `sitemap.xml` or `robots.txt`
- ❌ No per-page meta (title/description) on About, Films, Photos, Commercial, Inquire
- ❌ No local/geographic targeting (city, region, “area”)
- ❌ No Local Business / Organization structured data
- ❌ No explicit location in content or footer (address, service area)

---

## 1. Define “Our Area”

Before implementation, lock in:

- **Primary location:** City + state/region (e.g. “Austin, TX” or “California Central Coast”).
- **Service area:** Same city only, or city + surrounding cities/regions.
- **Target phrases:** e.g. “wedding videographer [City]”, “cinematic wedding films [Region]”, “wedding photographer [City]”.

Use these everywhere: meta, headings, schema, and content.

---

## 2. Technical SEO (Quick Wins)

| Task | Purpose | Where |
|------|--------|--------|
| **Add `app/sitemap.ts`** | Help Google discover all pages | Next.js App Router sitemap |
| **Add `app/robots.ts`** | Control crawling, point to sitemap | Next.js App Router robots |
| **Canonical URLs** | Avoid duplicate signals | Per-page `metadata` or layout |
| **Structured data** | Rich results, knowledge panel | JSON-LD in layout + key pages |

**Sitemap:** Include `/`, `/about`, `/films`, `/photos`, `/commercial`, `/inquire`, and dynamic routes for `/films/[slug]`, `/photos/[slug]`, `/projects/[slug]`. Use `metadataBase` for absolute URLs.

**Robots:** Allow all, reference sitemap URL. Keep `/studio` and `/investment` noindex if they already are.

---

## 3. Local SEO (Critical for “Rank in Our Area”)

| Task | Purpose |
|------|--------|
| **LocalBusiness (or Organization) JSON-LD** | Tells Google who you are, where you serve, what you do. |
| **NAP on site** | Name, full Address, Phone in footer and/or contact page. Same format everywhere. |
| **Location in title/description** | e.g. “Cinematic Wedding Films in [City] \| StoryCruz Films”. |
| **Service area page(s)** | Optional: “Serving [City] and [Region]” with a short, natural list of areas. |
| **Google Business Profile** | Claim/optimize; same NAP and category (e.g. “Wedding videographer”). |

**Schema:** Include at least:
- `@type`: `LocalBusiness` or `ProfessionalService`
- `name`, `url`, `description`
- `address` (full, one canonical)
- `telephone`
- `areaServed` (city/region)
- `priceRange` if relevant
- `image`, `sameAs` (social URLs)

---

## 4. On-Page SEO (Every Important Page)

| Page | Title pattern | Description |
|------|----------------|-------------|
| **Home** | Already set | Add location: “… in [City/Region]” in description. |
| **About** | `About Us \| StoryCruz Films` | 1–2 sentences with location + what you do. |
| **Films** | `Wedding Films \| StoryCruz Films` | “… cinematic wedding films and [City] videography.” |
| **Photos** | `Wedding Photography \| StoryCruz Films` | “… wedding photography in [City/Region].” |
| **Commercial** | `Commercial Videography \| StoryCruz Films` | “… branding and commercial video in [Area].” |
| **Inquire** | `Inquire \| StoryCruz Films` | “… book your [City] wedding film.” |

- Use **dynamic metadata** for `/films/[slug]`, `/photos/[slug]`, `/projects/[slug]` (title + description from CMS).
- Add **canonical** for each page using `metadataBase` + pathname.

---

## 5. Content & Keywords

- **Headings:** Use target phrases naturally in `h1`/`h2` (e.g. “Wedding Videography in [City]” once per page).
- **Body:** Mention city/region 1–2 times per page without stuffing.
- **FAQ:** Add an FAQ section (or expand existing) with questions like “Do you film weddings in [City]?” and “What areas do you serve?” — can use FAQ schema.
- **Testimonials:** Where possible, mention location (“Our wedding in [Venue], [City]…”).

---

## 6. Performance & UX (Support Rankings)

- **Core Web Vitals:** Already on Next.js; keep images optimized (next/image), limit heavy JS.
- **Mobile:** Ensure forms (inquire, contact) and nav work well on mobile.
- **Internal links:** Link from home/About to Films, Photos, Commercial, Inquire with descriptive anchor text.

---

## 7. Implementation Order

1. **Define area + target keywords** (no code).
2. **Add `app/sitemap.ts` and `app/robots.ts`.**
3. **Add LocalBusiness (or Organization) JSON-LD** in `app/layout.tsx` (or a dedicated component) with NAP + area.
4. **Add NAP to Footer** (and/or contact section) — same as schema.
5. **Per-page metadata** for About, Films, Photos, Commercial, Inquire (and dynamic routes).
6. **Weave location into existing copy** and add a short “Service area” line or section.
7. **Optional:** FAQ schema and service-area page.
8. **Submit sitemap in Google Search Console** and verify; fix any crawl errors.

---

## 8. Success Metrics

- **Rankings:** Track “wedding videographer [City]”, “wedding photographer [City]”, “StoryCruz” in Google Search Console or a rank tracker.
- **Impressions/clicks:** GSC performance for your property.
- **Local:** Google Business Profile views, direction requests, and “wedding videographer near me” type queries.

---

## Next Step

**Decide and share:**
- Your **primary city/region** and **service area** (e.g. “San Diego and surrounding counties”).
- Whether you have a **physical address** to show (or “service area only”).
- **Phone number** and **social URLs** for NAP and schema.

Then we can implement in this order: sitemap + robots → schema + NAP → per-page metadata → copy tweaks.
