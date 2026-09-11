# Makeup by Mumbe — project context

A briefing for anyone (or any AI) picking this build up cold. Nothing here assumes you saw
the conversation that produced it.

---

## 1. The business

| | |
|---|---|
| **Name** | Makeup by Mumbe |
| **Owner / operator** | Mercy Mumbe (she/her) |
| **What she does** | Freelance makeup artist — bridal, photoshoots, special events, creative/editorial |
| **Location** | Nairobi, Kenya. Mobile/freelance — she travels to the client's venue |
| **Phone / WhatsApp** | 0796 042 515 → `+254796042515` → `wa.me/254796042515` (confirmed with the lead owner) |
| **Instagram** | [@makeupbymumbe_](https://www.instagram.com/makeupbymumbe_/) — 1,079 posts, 4,905 followers |
| **TikTok** | [@makeupbymumbe_](https://www.tiktok.com/@makeupbymumbe_) — 15.7K followers, 443.4K likes |
| **Second handle seen** | `simplymumbe_` (appears alongside her main handle on one story; not used on the site) |
| **Branch** | **A** — no existing website. Verified: her IG bio has no link, and a web search turns up no site |
| **Tier / model** | **Premium** — multi-page + exactly one functional feature |

### Google Business Profile — there isn't one

Searched, and found no Google listing, no address, no star rating, no reviews. She's a mobile
freelancer with only a phone number published. **By the lead owner's explicit decision, the
standard embedded Google Map and the "Leave us a review" Google deep link were both dropped**
and replaced with a plain "Where she works / Nairobi & surrounds" panel on the Contact page.

Two consequences worth knowing:

- **No Google API key is embedded anywhere in this build.** There is no key to restrict by HTTP
  referrer, so that usual pre-delivery action does not apply here. If a map is ever added, that
  restriction becomes mandatory before going live — the repo is public.
- The footer's reputation link points at her Instagram (where her Reviews/Testimonials highlights
  live) rather than at a Google review page.

---

## 2. Brand identity

There was no logo. Both the palette and the mark were designed for this build and then treated as
the source of truth, exactly as if she'd supplied them.

### Palette — "Ink & Blush"

Sampled at pixel level from four Instagram highlight covers she made herself.

| Token | Hex | Where it came from | Used for |
|---|---|---|---|
| `--ink` | `#293042` | Her "Testimonials" highlight cover | Headers, dark sections, primary type |
| `--ink-deep` | `#1B2030` | Darkened ink | Footer, hero ground, film cards |
| `--ink-soft` | `#4A5168` | Lightened ink | Body copy on light grounds |
| `--blush` | `#F4C6B7` | The peach heart on the same cover | Accent, CTA buttons, all WhatsApp icons |
| `--blush-deep` | `#E3A18A` | Deepened blush | Focus rings, progress bar |
| `--mauve` | `#B68AA2` | Her "Clients." highlight cover | **Decorative only** — borders, large type |
| `--mauve-text` | `#8A5F79` | Darkened mauve | **Small text on light grounds** (see note) |
| `--nude` | `#EEE1DB` | Her "glow." highlight cover | Alternate section ground |
| `--paper` | `#F9F7F8` | Off-white from "Clients." | Page ground |

> **Don't use `--mauve` for small text.** At `#B68AA2` it measures 2.76:1 on paper — a WCAG AA
> failure. That's why `--mauve-text` exists. `.sec-ink` overrides it to `#CFA8BE` and `.sec-nude`
> to `#7A5069` so the eyebrow labels clear 4.5:1 on every ground they actually sit on.

### Typography

- **Display:** Bodoni Moda (Google Fonts) — fashion-editorial serif, used for all headings,
  the wordmark and the monogram.
- **Body:** Jost (Google Fonts) — geometric sans, weights 300/400/500.
- Fallback stacks are declared on both.

### Logo — "The Reveal Mirror"

An oval hand-mirror containing an `MM` monogram, with a short handle below.

**Why that shape:** the oval wooden hand-mirror appears in nearly every one of her fourteen
reels — it's the object she hands the client for the reveal at the end of a session. The mark
draws something she already does rather than inventing a symbol.

It is **inline SVG**, not an image file — defined once as `MARK` in the generator and emitted into
the header, the footer and the preload splash. The favicon is the same shape as an SVG data URI in
each page's `<head>`. On the splash it animates: the ellipse strokes itself on, then the monogram
and handle fade in.

Three other concepts were designed and rejected in favour of this one (an arc-lettered seal, a
wordmark on a product swipe, and a type-only masthead). They're in the identity board artifact if
the direction ever needs revisiting.

---

## 3. What was built

### Live

- **Repo:** https://github.com/Ignatius-Kimeu/storyfront-makeup-by-mumbe (public)
- **Live site:** https://ignatius-kimeu.github.io/storyfront-makeup-by-mumbe/
- Pages serves from `main`, root folder.

### Pages

| File | What's on it |
|---|---|
| `index.html` | Hero, verified-stats strip, four-service snapshot, Erasty Victoria feature, 4 films in a 2×2 grid, 8-photo gallery preview, about teaser, booking CTA |
| `services.html` | Hero + six services in detail with tag chips, and a note on why no prices are listed |
| `gallery.html` | Hero + all 36 photos in a grid, fullscreen lightbox |
| `films.html` | Hero + all 14 films in a 2-column grid |
| `about.html` | Hero + her story, a working-method section |
| `contact.html` | Hero + **the booking flow**, contact panels, socials |
| `404.html` | On-brand not-found page (GitHub Pages serves it automatically) |
| `assets/site.css` | One stylesheet for all seven pages |
| `assets/site.js` | One script for all seven pages |
| `sitemap.xml`, `robots.txt`, `og-image.jpg` | At repo root |

Every page has an animated hero. Every page carries the floating WhatsApp button, inline WhatsApp
CTAs and click-to-call. Internal links are relative. The footer carries no page-to-page nav.

### The one Premium feature: a WhatsApp booking flow

On `contact.html` (anchor `#book`). **Why this one and not the other two options:** she's a solo
operator whose entire existing booking funnel is one phone number in a bio, and her diary is
date-and-headcount driven. A filterable gallery would have been decoration; a product catalogue
doesn't apply. Per the Fade Masters precedent, a solo operator gets a request flow, never a real
slot-booking calendar.

Three animated steps → service, then date/time/location/headcount, then name and notes. It shows a
live preview of the exact message, then opens `wa.me/254796042515` with it pre-filled. Entirely
front-end: no backend, no database, nothing sent anywhere until the user presses send inside
WhatsApp. Validation blocks empty required fields and the date picker can't be set in the past.

### Notable implementation details

- **Header** is fixed, goes solid past 40px, hides on scroll down and returns on any upward scroll
  from anywhere. No `backdrop-filter` (it breaks fixed mobile nav on Chromium).
- **Scroll reveals** are gated behind a `.js` class set inline in `<head>`. If the script never
  runs, every section is simply visible rather than stuck at `opacity: 0`.
- **Film cards** inject their `<video>` lazily on IntersectionObserver, `preload="none"`. The video
  is only uncovered on its actual `playing` event — if autoplay is refused (data saver, iOS low
  power) the poster stays put instead of going black. Only one card can have sound at a time;
  turning one on mutes whichever other one was loud.
- **Lightbox** is vanilla JS with prev/next, a counter, keyboard arrows and Esc, and focus returned
  to the thumbnail that opened it.
- `prefers-reduced-motion` disables all animation.

---

## 4. Content inventory

### Photos — 36, all hers, downloaded from her own Instagram

Processed to `images/<slug>.jpg` (1500px long edge, q82 progressive) plus
`images/thumbs/<slug>.jpg` (700px, q78). Every one has real alt text describing what's shown and a
lightbox caption saying what the job asked for. Roughly: 5 bridal, 4 graduation, 4 editorial,
10 celebration/event, 6 portrait, 5 studio, 2 behind-the-scenes.

Heroes live in `images/hero/` — `home`, `about`, `services`, `gallery`, `films`, `contact`,
`notfound`. They're kept portrait and positioned with a per-page `--pos` object-position rather
than being cropped to landscape, so the subject reads at both 390px and 1440px.

### Films — 14, all hers

Compressed with ffmpeg to **480px wide, CRF 31, light `hqdn3d` denoise, AAC 80k, `+faststart`**.
Poster frames pulled at 80% through each clip (where the mirror reveal lands) into
`images/posters/`.

| File | Title on the card | Views | Title source |
|---|---|---|---|
| `bride-and-her-girls.mp4` | Morning in with the bride and her girls | 678.9K | her on-screen caption |
| `erasty-victoria.mp4` | Full glam with Erasty Victoria | 613.3K | **descriptive — no caption in the clip** |
| `bridesmaids-edition.mp4` | Bridal mornings — bridesmaids edition | 271.0K | her on-screen caption |
| `bridal-trial-diaries.mp4` | Bridal trial diaries | 149.5K | her on-screen caption |
| `bride-ready.mp4` | Let us get the bride ready | 148.3K | her on-screen caption |
| `makeup-reveal.mp4` | The makeup reveal | 130.6K | her on-screen caption |
| `birthday-girl.mp4` | Birthday girl makeup reveal | 99.2K | her on-screen caption |
| `soft-glam-birthday.mp4` | Soft glam birthday look | 53.2K | her on-screen caption |
| `bridal-morning-routine.mp4` | Bridal morning makeup routine | 51.4K | her on-screen caption |
| `bridesmaid.mp4` | Bridesmaid glam | 46.7K | her on-screen caption |
| `graduation-shoot.mp4` | Graduation shoot makeup | 23.6K | her on-screen caption |
| `friday-weddings.mp4` | Friday weddings — bridal mornings as a MUA | 16.7K | her on-screen caption |
| `sixtieth-anniversary.mp4` | 60th wedding anniversary session | 13.3K | her on-screen caption |
| `at-home-session.mp4` | An at-home session | 12.8K | **descriptive — no caption in the clip** |

View counts came from the filenames the lead owner supplied, which match the counts shown on her
posts. Total video payload is **101MB** — see the flag in §5.

### Erasty Victoria

Featured on the home page by explicit decision, framed as **credit only**. She's genuinely
Mumbe's client: she appears in one of the uploaded photos and is the subject of the 613.3K-view
film, both posted on Mumbe's own accounts. The block states the view count and credits her as
"Erasty Victoria · @erastyvictoria · 227.2K followers". **No quote, testimonial or endorsement is
attributed to her, because none exists.** Don't add one.

### Reviews — there are none on the site

She has Reviews/Testimonials Instagram highlights, but no review text was ever supplied and she has
no Google listing. Nothing was invented. Social proof is entirely verified public numbers:
443.4K TikTok likes, 15.7K TikTok followers, 1,079 Instagram posts, and the 2024 nomination.

**If you later get her testimonial screenshots, that's the single biggest upgrade available to
this site** — it's the one form of proof it currently lacks.

---

## 5. Flagged, unconfirmed, or deliberately omitted

Read this section before changing copy.

1. **The People's Choice Awards Kenya 2024 nomination** is sourced from her own Instagram story
   graphic (contestant code 604064, "Make-Up Artist of the Year", powered by Tamasha). It could not
   be independently confirmed against a published nominee list. The site says **nominee** and never
   "award-winning". Keep it that way unless someone produces the official listing.
2. **Makeup classes** (service 06 on `services.html`) is evidenced only by her "Classes" Instagram
   highlight. There's no confirmation she currently takes students. It's marked with a code comment
   and is a single block to delete if she's stopped teaching.
3. **TV / commercial / billboard work** comes from her "TV! Commercials" and "Billboard" highlights
   plus L'Oréal-branded capes visible in several of her films. Real, but the scope of it is unknown.
4. **Hours** — she publishes none anywhere. The site says "By appointment" and notes bridal
   mornings start early. That's an inference from the content, not a stated policy.
5. **"She travels to your venue"** is inferred from her films, which are shot in homes and hotel
   rooms, plus "Freelance" in her bio. Not explicitly stated by her.
6. **No prices anywhere.** None are published and none were invented; `services.html` explains that
   jobs are quoted per session. Competitor research (Fresha, WedMeGood, Harusi Hub, Jana Tribe) puts
   Nairobi bridal makeup roughly in the KSh 8,000–25,000 band and event makeup around
   KSh 2,500–8,000, with 20–30% deposits and a travel surcharge common — **that's background for a
   pricing conversation with her, not site copy.**
7. **Total video payload is 101MB.** That's 32 minutes of source footage; it barely compresses
   because it's detail-heavy handheld phone video. Mitigated by lazy loading — the page itself loads
   only poster JPEGs (~12KB each) and no video byte is fetched until a card scrolls into view. A
   typical visitor watching 2–3 films pulls 10–20MB. If it ever needs to be smaller, the honest
   levers are trimming clip length (alters her content, so ask her) or dropping to 24fps
   (roughly 15–20% saving).
8. The `_source/` folder holds every original upload and is **gitignored** — the repo ships only
   compressed media.

---

## 6. Rebuilding the pages

The HTML is generated, not hand-maintained, so the shared header/footer/splash can't drift between
pages. The generator lives outside the repo, in the session scratchpad:

- `gen.py` — partials: `head()`, `header()`, `footer()`, `hero()`, `film_card()`, `gcell()`, the
  SVG mark, the icon set, the film list, `SITE`/`WA`/`TEL` constants.
- `pages.py` — the actual page bodies and copy. Run it to rewrite all seven HTML files plus
  `sitemap.xml` and `robots.txt`.
- It reads `_source/manifest.json` (written by the image pipeline) for photo slugs, captions,
  alt text and dimensions.

**If you only need a copy tweak, editing the HTML directly is fine — just make the same edit in
`pages.py`, or the next regeneration will overwrite it.** If the generator is gone, the HTML is
self-contained and can be maintained by hand; just apply header/footer changes to all seven files.

`SITE` in `gen.py` is already set to the live Pages URL.

---

## 7. QA that was run

- Playwright across all 7 pages at **390px and 1440px**: no console errors, no page errors, and
  **no request returning ≥400** — every image, video, stylesheet and internal link resolves.
- A scripted functional pass (19 assertions, all passing) covering: booking-flow validation on both
  gated steps, the generated WhatsApp message, the `wa.me` URL and its encoding round-trip, the
  past-date floor, lightbox open/next/arrow-keys/Esc and full-resolution sourcing, one-sound-at-a-time
  across film cards, poster/title/view-count presence on all 14 films, and header hide/reveal.
- A scripted WCAG AA contrast audit over every text node on every page. Three real failures were
  found and fixed (the mauve small-text problem in §2). The only remaining flags are nav links over
  the transparent header, which in reality sit on a darkened hero photo — the hero's top gradient
  was deepened to `rgba(27,32,48,.66)` to guarantee that.
- OG image visually checked at exactly 1200×630.

---

## 8. Open questions

1. **Testimonials.** Screenshots from her Reviews highlight would be the biggest single improvement.
   Needs her permission and the clients'.
2. **Does she still teach?** Decides whether service 06 stays (§5.2).
3. **Is there a studio address?** If she ever works from a fixed location, a Google Business Profile
   plus a map embed becomes worth adding — and the API key must then be referrer-restricted before
   going live, because the repo is public.
4. **Pricing.** Not on the site by design. Worth agreeing a "from KSh X" figure with her if she wants
   to filter enquiries.
5. **Has Erasty Victoria been told?** She's credited, not quoted, so nothing is misrepresented — but
   a courtesy heads-up before the site is promoted is sensible.
