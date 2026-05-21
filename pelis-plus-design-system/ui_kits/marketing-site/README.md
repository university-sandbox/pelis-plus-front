# Marketing site — UI kit

Hi-fi recreation of PelisPlus' public-facing marketing site. Click-thru prototype demonstrating:

1. **Home** — Hero film, cartelera grid, next-week strip
2. **Film detail** — Big hero, synopsis, cast, showtimes
3. **Showtimes / cines** — City-level showtime grid

## Files

- `index.html` — App shell + routing
- `app.jsx` — View switcher and click-thru state
- `components.jsx` — Nav, Footer, FilmCard, ShowtimeStrip, BadgeRow, Hero
- `data.js` — Stub films, showtimes, locations (no real titles used)

## Conventions

- Uses `colors_and_type.css` from project root (no per-kit CSS variables).
- Posters are SVG placeholders from `assets/poster-placeholder.svg` plus per-film gradient swaps. Drop real poster art via `<image-slot>` for client mocks.
