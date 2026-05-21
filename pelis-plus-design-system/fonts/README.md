# Fonts

This brand uses **Google Fonts** as substitutes for what would otherwise be licensed type. All four are loaded via the `@import` at the top of `colors_and_type.css`. No `.ttf`/`.woff2` files are bundled — Google's CDN delivers them.

| Role | Family | Notes |
|---|---|---|
| Display | **Anton** | Tall, single-weight condensed sans. Stands in for the kind of custom condensed face you'd see in a cinema marquee or a *GTA VI*-style poster. |
| Editorial | **Instrument Serif** | Italics for film quotes, credits, atmospheric captions. Modern editorial cut. |
| Body / UI | **Manrope** | Humanist geometric sans with seven weights. Replaces Inter; warmer, more cinematic. |
| Mono | **JetBrains Mono** | Timestamps, seat codes, ticket IDs, technical metadata. |

## ⚠️ Substitution flag — please review

These are **best-guess matches**, not your real brand fonts. If PelisPlus licenses or commissions display type, swap **Anton** first — it's the most expressive face and carries the most brand weight. Drop the licensed files into this folder and update the `@font-face` block in `colors_and_type.css`.

Good upgrade candidates if you want to license:
- **Display:** *Druk Wide*, *Migra Italic*, *Gerstner Programm*, *Reckless Neue Condensed*.
- **Body:** *Söhne*, *Neue Haas Grotesk*, *GT America*, *Inter Display* (custom variant).
