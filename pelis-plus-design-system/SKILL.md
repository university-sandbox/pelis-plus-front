---
name: pelisplus-design
description: Use this skill to generate well-branded interfaces and assets for PelisPlus (a modern cinema brand in Spanish), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

# PelisPlus — design skill

Read the `README.md` file within this skill, and explore the other available files.

**Where to look first:**
- `README.md` — Brand context, content fundamentals, visual foundations, iconography.
- `colors_and_type.css` — All design tokens. Import this in every artifact.
- `assets/` — Logos and brand textures (wordmark, mark, poster placeholder, hero backdrop).
- `fonts/README.md` — Note that fonts are Google Fonts substitutes pending real brand files.
- `ui_kits/marketing-site/` — Public marketing site recreation (hero, cartelera, film detail).
- `ui_kits/booking-flow/` — Seat picker, snacks, payment, ticket success.
- `ui_kits/mobile-app/` — iPhone app: Cartelera, Tickets, PelisPlus Club, Cuenta.
- `preview/` — Small design-system cards (typography, colors, components, brand).

**If creating visual artifacts** (slides, mocks, throwaway prototypes), copy `colors_and_type.css` and any used assets out into the new artifact's folder and create static HTML files. Compose UI from the components in `ui_kits/*` — they are written as small JSX files attached to `window`, so they can be lifted and dropped into a new prototype with minimal rewiring.

**If working on production code**, copy assets and read the rules in `README.md` to become an expert in designing with this brand.

**If the user invokes this skill without other guidance**, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts *or* production code, depending on the need.

**Non-negotiables when designing with PelisPlus:**
- Spanish copy, LATAM-neutral, *tú* form.
- Dark canvas (`--ink-1`), magenta accent (`--marquee-400`), one accent at a time.
- Anton condensed display in uppercase for hero copy and film titles.
- No emoji in product UI. Iconography is Lucide.
- 24-hour clock, never AM/PM.
- Avoid bouncy springs in motion — cinematic ease-out, never UI-bouncy.
