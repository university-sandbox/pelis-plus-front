# PelisPlus — Design System

> El cine, como debe verse.

PelisPlus is a (fictional, for-design-purposes) modern cinema brand serving Spanish-speaking markets. The system was built from a brief asking for a cinema web app that merges polished UX with the cinematic, neon-tinged energy of Rockstar's *GTA VI* reveal — applied to the conventions of contemporary cinema sites (Pathé, Odeon, Cineplexx, Cinemark, Cineplanet).

This is a **net-new design system**: no codebase, Figma, or brand assets were provided. Everything here was authored from the reference brief.

---

## Brief & references

**Brief (from product owner):**
- Modern web app for a cinema, all copy in Spanish.
- Merge good UX with a strong UI personality.
- Smooth transitions / animations inspired by *GTA VI*.
- Responsive across phone, tablet, desktop.

**Reference sites studied (publicly browsable — assume reader does not have access):**
- https://www.pathe.fr/ — dark, editorial, big poster grids
- https://www.odeon.co.uk/ — clean, refined, image-led
- https://cineplexx.at/film — dense booking-first grid
- https://www.cinemark-peru.com/ — energetic, brand-color-driven
- https://www.cineplanet.com.pe/ — friendly LATAM cinema standard

**Visual North Star:**
- https://www.rockstargames.com/VI — scroll-driven storytelling, neon Miami palette, big condensed type, generous grain, parallax video.

**Resolved direction:** *Cinematic noir × Vice neon.* Deep near-black canvas, hot magenta as a marquee accent, condensed display type, restrained UI chrome, motion that feels like a slow camera dolly rather than a UI animation.

---

## Index — what's in this folder

| Path | What it is |
|---|---|
| `README.md` | This file. Start here. |
| `SKILL.md` | Front-matter wrapper so this folder can be installed as an Agent Skill. |
| `colors_and_type.css` | All design tokens — colors, type, spacing, radii, shadows, motion. Import this in every artifact. |
| `fonts/README.md` | Notes about font substitutions (we use Google Fonts as best-guess matches; see flag). |
| `assets/logo-wordmark.svg` | "PELISPLUS" wordmark — "PELIS" in `currentColor`, "PLUS" in `--marquee-400` magenta. |
| `assets/logo-mark.svg` | Aperture / iris mark. Use at favicon size and as a navigation glyph. |
| `assets/poster-placeholder.svg` | 2:3 poster placeholder — vice-gradient + grain. |
| `assets/hero-backdrop.svg` | Cinematic hero atmosphere — magenta + cyan glows on near-black. |
| `preview/` | 26 small HTML cards that populate the Design System review tab. |
| `ui_kits/marketing-site/` | Hi-fi recreation: homepage hero, cartelera grid, film detail with showtimes. |
| `ui_kits/booking-flow/` | Hi-fi recreation: 4-step Butacas → Snacks → Pago → Listo. |
| `ui_kits/mobile-app/` | Hi-fi recreation: four-screen iPhone app (Cartelera, Tickets, PelisPlus Club, Cuenta). |

**Quick-start for new artifacts:**

```html
<link rel="stylesheet" href="path/to/colors_and_type.css"/>
<body class="pelisplus-root">
  <h1 class="display-l">Función exacta. Butaca exacta.</h1>
  <p class="body">Reserva en sesenta segundos.</p>
</body>
```

Pull any component you need by reading the source in `ui_kits/<kit>/*.jsx`. They are intentionally small, mostly cosmetic, and free of build tooling — drop them straight into a Babel `<script type="text/babel">`.

---

## Brand snapshot

- **Name:** PelisPlus
- **Wordmark:** "PELISPLUS" — set in Anton condensed. The "PELIS" sits in `currentColor` and the "PLUS" lifts to `--marquee-400` magenta so the brand accent is baked into the wordmark itself.
- **Voice:** *Cinéfilo premium.* Confident, short, sensorial. Avoids exclamation-stacking and emoji.
- **Tagline:** *El cine, como debe verse.*
- **Secondary phrases:** *Función exacta. Butaca exacta.* / *La pantalla grande, sin compromisos.*

---

---

## Content fundamentals

PelisPlus writes like a knowing cinéfilo programmer. Confident, short, sensorial. We are speaking about the *thing* itself — the film, the seat, the moment when the lights drop — not about ourselves.

### Language

- **Spanish, LATAM-neutral.** Use *tú* in the public marketing site for warmth ("Reserva tu butaca"), and *tú* in the app too. Avoid *vosotros* (excludes LATAM) and avoid *usted* unless a customer-service touchpoint genuinely calls for it.
- **Cinema-accurate vocabulary.** Use the right words: *butaca* (not asiento), *función* (not show or pase), *cartelera* (not catálogo), *sala* (not auditorio), *VOSE* / *doblada* (not "original" / "español"), *preventa*, *aforo*.
- **Numbers as marquee.** Times in 24-hour clock (`20:30`, never `8:30 PM`). Currency with locale-appropriate symbol and ISO code on receipts (`S/ 28.50`, `MXN 145`, `€ 9,50`).

### Tone

- **Sí:** *"Función exacta. Butaca exacta."* / *"La sala apaga las luces a las 20:30."* / *"Tu acceso cierra cinco minutos antes."*
- **No:** *"¡¡¡Reserva AHORA!!!"* / *"Una experiencia única e inolvidable"* / *"Vive la magia del séptimo arte"*. We don't stack exclamations and we don't write travel-brochure prose.
- **Verb-first CTAs.** *Reservar entradas*, *Ver tráiler*, *Elegir butaca*, *Confirmar pago*. Avoid *Click aquí*, *Más info*, *Saber más*.
- **Sentence case for UI**, *Title Case For Marquees and Posters*, **ALL CAPS** is reserved for display type (set in Anton, never typed in body copy).

### Punctuation & glyphs

- Spanish opening punctuation is mandatory: *¿Cuál es tu sala más cercana?* / *¡Hoy estrena Ciudad Eléctrica.*
- Em dash with thin spaces — like this — for editorial asides. Curly quotes (`«» / "..."`), never straight.
- Ellipsis as a single glyph: `…`.

### Emoji & symbols

- **No emoji in product UI.** Ever. Tickets, snacks, hearts, popcorn — all handled with Lucide icons in `currentColor`. The grease-stain-popcorn-emoji vibe is the opposite of this brand.
- Unicode ★ is OK for ratings; arrows (→) are OK as inline glyphs in copy ("Ver cartelera →"). Use sparingly.

### Microcopy snippets (drop-in)

| Surface | Copy |
|---|---|
| Hero CTA | *Reservar entradas* |
| Secondary CTA | *Ver tráiler* |
| Empty cart | *Aún no has elegido butacas. Ábrenos una sala.* |
| Seat sold-out | *Esta función está agotada. Te avisamos si se libera.* |
| Booking success | *Listo. Te esperamos en la Sala 4 a las 20:30.* |
| Loyalty pitch | *Únete a PelisPlus Club. Una función gratis cada cuatro.* |
| 404 | *La sala está vacía. Vuelve a la cartelera.* |

---

## Visual foundations

The whole system asks: *what does it feel like the moment before a film starts?* Lights drop, the marquee outside still glowing magenta through the doors, a single warm spot on the screen. Everything below serves that mood.

### Canvas & color

- **Default canvas is `--ink-1` (#0B0B0D)**, never pure black, never gray. Surfaces step up via color (ink-1 → ink-2 → ink-3) rather than shadow.
- **One accent at a time.** Magenta (`--marquee-400`) is the primary brand color. Amber and cyan only appear in poster art, gradients, or rare semantic states. Avoid using all three in the same screen — it stops feeling cinematic and starts feeling like an arcade.
- **Imagery runs warm.** Posters lean toward magenta-into-deep-red-into-cyan. We avoid cold blue tech-gradients (Slack-purple, Stripe-blue) — they read as SaaS, not cinema.
- **Grain everywhere it matters.** Hero modules and full-bleed imagery carry a 6–10% SVG fractalNoise overlay (`.grain` utility). It's the closest we get to a "film print" texture.

### Type

- **Anton condensed display** does the heavy lifting for headlines, film titles, showtimes, format tags (IMAX, 4DX). Always uppercase, slightly negative tracking.
- **Manrope body** for everything else. Weights 400 / 500 / 600 / 700.
- **Instrument Serif (italic)** is the editorial voice — film quotes, programmer's notes, captions on hero modules. Never used for UI labels.
- **JetBrains Mono** for any *fact*: ticket IDs, seat codes, countdowns, prices in receipts.
- Hero copy uses `clamp()` so a title is genuinely huge on desktop (up to 220px) but never blows out a phone.

### Spacing & layout

- 4px base unit. Common rhythms: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.
- Marketing pages use a wide-but-not-bleed grid (`--w-wide: 1280px`), centered, with generous vertical breathing (`--s-24` between sections).
- Booking and app surfaces are denser — 16/24 between blocks, full-bleed inner content.
- Mobile: 20px horizontal padding (`--s-5`), full-width cards with rounded `r-3` corners.

### Backgrounds & atmosphere

- Hero modules combine a deep `ink-0` base with a radial magenta glow (top-right) and an optional cyan glow (bottom-left), capped with a bottom scrim that fades back to `ink-0`.
- No literal stock photos of theaters, popcorn, or red curtains. We pull in **real poster art via `<image-slot>`** in mocks — never fake posters with invented film titles in production.
- Repeating patterns: avoid. No film-strip borders, no clapperboard motifs, no reel cutouts. The aperture mark is the only cinema-clichéd shape allowed, and we use it sparingly.

### Motion

- **Cinematic, not bouncy.** Default easing is `cubic-bezier(0.16, 1, 0.3, 1)` — a slow dolly out.
- Durations: 120 / 220 / 420 / 800ms. The 800ms "scene" duration is reserved for full-page transitions (e.g., film detail expanding into seat picker).
- **Page transitions:** parallax-scroll the hero as the seat picker slides up over it. Inspired directly by GTA VI's scroll-driven storytelling.
- **Hover:** `translateY(-4px)` plus a magenta border tint on cards. Buttons keep an opaque fill and brighten one step (400 → 300); never fade the background or switch to transparent on hover because CTA text must remain readable.
- **Press:** `translateY(1px) scale(0.99)`, no color change. Marquee buttons pick up the brand glow shadow.
- **Loading:** content shimmers between `ink-2` and `ink-3`, never a spinner.
- Respect `prefers-reduced-motion` — collapse the parallax to a simple fade.

### Borders, shadows, depth

- Borders are `1px solid var(--border)` (ink-4) for hairlines. Strong borders bump to ink-5.
- Shadows are soft, downward, almost-black. We mostly elevate with surface color shifts (ink-1 → ink-2 → ink-3). Shadow is supplemental.
- **No glassmorphism** in product UI. Backdrop-blur is reserved for one place: floating badges *over* a poster image (e.g., the rating pill on a film card).
- The brand "glow" (`--shadow-glow`) is rare — hero CTAs, selected showtime, premium upsell. If glow is on every card it's no longer glow.

### Corners & cards

- Default card radius: **8px** (`--r-3`). Big modules: 12 (`--r-4`). Hero panels: 20 (`--r-5`).
- Inputs and chips: **4px** (`--r-2`) or **2px** (`--r-1`). Sharp like a ticket stub.
- Buttons: pill (`--r-pill`). Marquee variant breaks rank to 4px to evoke a ticket.
- Card composition: image at top, content padding 12–16px, no per-side dividers — the dark surface alone does the separating.

### Imagery color & treatment

- Warm. Magentas, deep reds, ambers, with cyan as the cool counter. Avoid neutral grays, mustard yellows, and forest greens — they don't sit on this canvas.
- Posters and hero stills carry a subtle film-grain overlay (8–10% opacity, `mix-blend-mode: overlay`).
- Photos of food (snack menu) are the one exception — they read better with their natural color, but we still grade them slightly warmer.

### Layout rules

- The brand mark, when present in the nav, stays fixed top-left at all viewports.
- Search lives top-right on desktop; collapses to an icon-only button at <900px.
- The bottom of the viewport is reserved for **the sticky purchase bar** in booking flows (shows: film title, time, # selected, "Continuar →"). Never put marketing CTAs there.
- Mobile bottom nav is 4 items max: *Cartelera*, *Tickets*, *PelisPlus Club*, *Cuenta*.

### Accessibility floor

- Body text contrast ratio ≥ 4.5:1 against its surface; large display text ≥ 3:1.
- Focus rings use `--ring` token (2px ink-0 + 2px marquee-400), never `outline: none` without a visible replacement.
- All form controls have an `<label>`; the overline above an input doubles as one.
- Seat picker labels every seat with a screen-reader accessible name (e.g., "Fila H, Butaca 12, libre, VIP").

---

## Iconography

We use **[Lucide](https://lucide.dev)** via CDN. It's a community-maintained fork of Feather, generous coverage, single stroke style, free.

**Defaults applied across the system:**
- `stroke-width="1.75"` (the Lucide default of 2 is slightly heavy alongside Anton)
- `stroke-linecap="round"`, `stroke-linejoin="round"`
- `stroke="currentColor"` — every icon inherits its container's color
- `width="20" height="20"` for inline UI, `24` for nav, `16` for chips and inline glyphs

**Load path:**
```html
<!-- Lucide icons via CDN -->
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>
```
…or inline the SVGs directly when you only need a handful (we do this in the preview cards to avoid runtime JS).

**Icons used in this system:** `play`, `film`, `ticket`, `clock`, `map-pin`, `heart`, `search`, `bookmark`, `star`, `calendar`, `refresh-ccw`, plus a custom-drawn `snack` glyph for the concessions surface.

**Emoji policy:** none in product UI. The brand mark (aperture) is our one decorative glyph. Unicode `★` is allowed in ratings, `→` in inline copy.

**Substitution flag:** Lucide is a substitution for a possible custom icon set. If PelisPlus commissions one, swap by re-implementing the same 11 glyph names with the same 1.75 stroke style. The design system will continue to work.
