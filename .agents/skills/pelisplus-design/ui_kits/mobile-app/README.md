# Mobile app — UI kit

Native-feeling cinema app inside an iPhone bezel. Four primary screens accessible from a brand-styled bottom tab bar:

1. **Cartelera** — Hero film, scroll-stripe of releases, próximos.
2. **Tickets** — Wallet of upcoming + past tickets, with QR.
3. **PelisPlus Club** — Loyalty program, points, perks.
4. **Cuenta** — Profile, settings.

## Files

- `index.html` — Lays out all four screens side-by-side in their own iPhone frames so the kit shows the full app at a glance.
- `ios-frame.jsx` — Vendored iPhone bezel (status bar, dynamic island, home indicator).
- `screens.jsx` — One component per screen.
- `app.jsx` — Stage that mounts the four phones.
- `styles.css` — Mobile-only styles. Note the namespacing prefix `m-`.
