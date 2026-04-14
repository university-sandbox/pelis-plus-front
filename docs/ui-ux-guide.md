# UI / UX Design Guide — Pelis Plus

This document is the single source of truth for visual design and interaction patterns across the entire platform.
Every screen — public, private, and admin — must follow these rules.
Reference images are in `pelis-plus-references/`.

---

## 1. Design Principles

1. **Cinema first.** Every screen should feel like a premium movie experience, not a generic e-commerce site.
2. **Dark by default.** The entire product uses a dark theme. Light mode is not planned for MVP.
3. **Content is the hero.** Movie posters, backdrops, and imagery carry the visual weight. UI chrome stays minimal.
4. **Clarity over decoration.** Every element earns its place. No gratuitous gradients, shadows, or animations.
5. **One primary action per screen.** The most important CTA is always the most prominent element.
6. **Mobile-first.** Design and build at 375 px, then scale up. Nothing should break between 375 px and 1440 px.

---

## 2. Design Tokens

### 2.1 Color palette

```css
/* Base */
--color-bg:           #09090F;   /* page background */
--color-surface:      #111118;   /* cards, panels, drawers */
--color-surface-raised: #1A1A24; /* elevated elements: modals, dropdowns */
--color-border:       #2A2A38;   /* subtle dividers */
--color-border-strong:#3D3D52;   /* visible borders, inputs */

/* Brand accent — teal/cyan (taken from Moviestan reference) */
--color-accent:       #00C9A7;   /* primary interactive: buttons, links, active state */
--color-accent-hover: #00B394;   /* hover state */
--color-accent-muted: #00C9A720; /* tinted backgrounds, badges */

/* Text */
--color-text-primary:  #F1F1F5;  /* headings, body */
--color-text-secondary:#9090A8;  /* subtitles, metadata, placeholders */
--color-text-disabled: #4A4A60;  /* disabled labels */
--color-text-inverse:  #09090F;  /* text on accent bg */

/* Semantic */
--color-success:  #22C55E;
--color-warning:  #F59E0B;
--color-error:    #EF4444;
--color-info:     #3B82F6;

/* Seat states */
--color-seat-free:       #2A2A38;
--color-seat-selected:   #00C9A7;
--color-seat-occupied:   #3D2A2A;
--color-seat-preferential: #7C3AED;
```

### 2.2 Typography

Font stack: `'Inter', system-ui, sans-serif`
Fallback for display titles: `'Inter', sans-serif` with `font-weight: 800`

| Token | Size | Weight | Line height | Usage |
|-------|------|--------|-------------|-------|
| `text-display` | 48–64 px | 800 | 1.1 | Hero movie title |
| `text-heading-1` | 32 px | 700 | 1.2 | Page titles |
| `text-heading-2` | 24 px | 700 | 1.3 | Section titles |
| `text-heading-3` | 18 px | 600 | 1.4 | Card titles, modal headings |
| `text-body-lg` | 16 px | 400 | 1.6 | Body copy, descriptions |
| `text-body` | 14 px | 400 | 1.6 | Default body, labels |
| `text-small` | 12 px | 400 | 1.5 | Metadata, captions, badges |
| `text-micro` | 10 px | 500 | 1.4 | Tags, duration chips |

### 2.3 Spacing scale

Use multiples of 4 px. Core values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.

### 2.4 Border radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4 px | Badges, chips |
| `radius-md` | 8 px | Inputs, small cards |
| `radius-lg` | 12 px | Movie cards, panels |
| `radius-xl` | 16 px | Modals, drawers |
| `radius-full` | 9999 px | Pills, avatars, icon buttons |

### 2.5 Shadows

```css
--shadow-card:   0 4px 24px rgba(0,0,0,.45);
--shadow-modal:  0 8px 48px rgba(0,0,0,.70);
--shadow-glow:   0 0 24px rgba(0,201,167,.25); /* accent glow on hover */
```

---

## 3. Core Components

### 3.1 Navigation bar

- Full-width, sticky at top, `background: rgba(9,9,15,.85)` with `backdrop-filter: blur(12px)`.
- Left: logo `PELIS+` in accent color, bold.
- Center (desktop): Inicio · Cartelera · Snacks · Membresías.
- Right: search icon · cart icon with badge · user avatar / "Ingresar" button.
- On mobile: hamburger menu opens a full-height drawer from the left.
- Active nav item: accent color underline, not background fill.

### 3.2 Movie card (poster)

Aspect ratio: **2 : 3** (portrait poster).

```
┌──────────────────┐
│                  │
│    POSTER IMG    │  ← NgOptimizedImage, object-fit: cover
│                  │
│ ░░░░░░░░░░░░░░░░ │  ← gradient overlay (bottom 40%)
│ Title            │  ← text-heading-3, white
│ Genre · Duration │  ← text-small, secondary
└──────────────────┘
```

States:
- **Default**: slight dark overlay on poster (15% black).
- **Hover / focus**: overlay lifts, scale 1.04, shadow-glow appears, "Comprar" pill CTA fades in.
- **Inactive / unavailable**: grayscale filter + "No disponible" badge top-right.

Sizes:
- `sm` — 120 × 180 px (mobile horizontal scroll)
- `md` — 160 × 240 px (catalog grid, default)
- `lg` — 200 × 300 px (featured row)

### 3.3 Hero banner

Full viewport-width section. Occupies 70 vh (desktop) / 55 vh (mobile).

```
┌─────────────────────────────────────────────────────┐
│  BACKDROP IMAGE (full bleed, object-fit: cover)     │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Left gradient overlay (75% → transparent)          │
│                                                     │
│  BADGE  "Estreno"                                   │
│  ★★★★☆  Acción · Drama · 2h 14min                  │
│  TITLE (text-display)                               │
│  Synopsis (2 lines max, text-body-lg, secondary)    │
│  [▶ Comprar entradas]  [+ Más info]                 │
└─────────────────────────────────────────────────────┘
```

- Backdrop image uses the movie's wide/landscape image, not the poster.
- Gradient: `linear-gradient(to right, #09090F 35%, transparent 75%)`.
- On mobile, gradient covers full height from bottom-up.
- Auto-rotates between featured movies every 6 s with a fade transition.

### 3.4 Section row (horizontal scroll)

Used for: "En cartelera", "Próximos estrenos", "Populares", etc.

```
Section Title          [Ver todo →]
──────────────────────────────────
[Card] [Card] [Card] [Card] [Card]  ← horizontal scroll, hide scrollbar
```

- Section title: `text-heading-2`, left-aligned.
- "Ver todo" link: `text-body`, accent color, right-aligned.
- Cards: `gap-4`, `overflow-x-auto`, `scroll-snap-type: x mandatory`, each card `scroll-snap-align: start`.
- On desktop: show partial last card to signal more content.
- Navigation arrows (left/right) appear on desktop hover.

### 3.5 Genre / filter pills

```
[Todos]  [Acción]  [Drama]  [Comedia]  [Terror]  [Animación]
```

- Default: `bg: surface-raised`, `color: text-secondary`, `radius-full`.
- Active: `bg: accent`, `color: text-inverse`, `font-weight: 600`.
- Hover: `border-color: accent`.
- Horizontal scroll on mobile, no wrapping.

### 3.6 Buttons

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| `primary` | `accent` | `text-inverse` | none | Main CTA: Comprar, Pagar |
| `secondary` | transparent | `accent` | `1px accent` | Secondary: Más info, Ver trailer |
| `ghost` | transparent | `text-secondary` | none | Tertiary: Cancelar |
| `danger` | `error` | white | none | Destructive: Cancelar función |
| `icon` | transparent | `text-primary` | none | Icon-only: search, close |

All buttons: `radius-full`, `font-weight: 600`, min-height `44 px` (touch target).
Loading state: spinner replaces text/icon, button width stays fixed.
Disabled state: `opacity: 0.4`, `cursor: not-allowed`.

### 3.7 Inputs & forms

- Background: `surface-raised`, border: `border-strong`, radius: `radius-md`.
- Focus ring: `2px solid accent`, `outline: none`.
- Error state: border `error`, error message below in `text-small error` color.
- Labels always visible above the field — no placeholder-as-label pattern.
- Min height: `48 px`.

### 3.8 Badges & tags

```
[Estreno]  [Subtitulada]  [+18]  [IMAX]  [2D]  [Casi llena]
```

- Small pill: `radius-sm`, `text-micro`, `font-weight: 600`, `padding: 2px 8px`.
- Color per meaning: accent (format/feature), warning (almost full), error (sold out), surface-raised (genre).

### 3.9 Skeleton loader

- Match the shape of the real content exactly (same width, height, radius).
- Background: `surface-raised` with a shimmer animation (left-to-right gradient sweep, 1.5 s loop).
- Never show an empty container — skeleton appears immediately while data loads.

### 3.10 Toast / notification

- Bottom-right on desktop, bottom-center on mobile.
- Auto-dismiss after 4 s; manual close button always visible.
- Variants: success (green left border), error (red), warning (amber), info (blue).

---

## 4. Page-by-page Design

### 4.1 Home / Cartelera principal

**Reference:** `home-current-movies.webp`, `all-movies.webp`

Layout (top → bottom):
1. **Hero banner** — featured / now-showing movie, full bleed.
2. **Filter pills** — Todos · Acción · Drama · Comedia · Terror (horizontal scroll).
3. **En cartelera** — horizontal scroll row, `md` poster cards.
4. **Próximos estrenos** — horizontal scroll row with "Próximamente" badge on cards.
5. **Populares esta semana** — horizontal scroll row.

Design notes:
- Hero cycles through 3–5 featured movies.
- The transition between hero items uses a 400 ms cross-fade.
- Pill filters instantly filter the rows below without a page reload.

---

### 4.2 Todas las películas (catalog)

**Reference:** `complete-view.png`

Layout:
1. **Sticky filter bar** — search input + genre pills + format selector.
2. **Grid** — responsive: 2 col mobile → 3 col tablet → 5 col desktop, `gap-4`.
3. **Pagination or infinite scroll** at the bottom.

Design notes:
- Cards in grid use the `md` poster size.
- Empty state: illustration + "No encontramos películas con esos filtros. Intenta con otros."
- Active filters show as dismissible chips above the grid: `[Acción ×]  [3D ×]`.

---

### 4.3 Detalle de película

Layout (desktop: 2-column; mobile: stacked):

**Left column (60%):**
- Backdrop image, full-width, 40 vh, gradient to bg.
- Below: title, rating stars, genre chips, duration, classification, languages.
- Synopsis (collapsible after 4 lines on mobile).
- Trailer embed (16:9, lazy-loaded).

**Right column / sticky panel (40%):**
- **Selector de función**: venue → date picker → time slots → format.
- Price preview per ticket.
- "Seleccionar asientos" CTA (primary, full-width).

Mobile: stacked. Sticky CTA button fixed to bottom of screen.

---

### 4.4 Selección de asientos

Full-screen modal or dedicated route.

```
┌────────────────────────────────────────────┐
│ PANTALLA                                   │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                            │
│  A  [■][■][■][□][□][□][□][■][■][■]        │  □ libre  ■ ocupado  ◆ seleccionado
│  B  [■][□][□][□][□][□][□][□][□][■]        │
│  ...                                       │
└────────────────────────────────────────────┘
Leyenda:  □ Libre  ■ Ocupado  ◆ Seleccionado  ◈ Preferencial
                              Subtotal: S/ 28.00  [Continuar →]
```

- "PANTALLA" bar at the top: rounded pill, `bg: border-strong`, `text-small secondary`.
- Seats are SVG or CSS grid squares: 28–32 px on desktop, 22–24 px on mobile.
- Selected seats pulse with the accent color on selection.
- Bottom bar: selected seats list + subtotal + timer countdown + CTA.
- Timer: red when under 2 min.
- Mobile: the map is horizontally scrollable inside a pinch-to-zoom container.

---

### 4.5 Tienda de snacks

Layout (top → bottom):
1. **Category tabs**: Todos · Canchitas · Bebidas · Combos · Dulces · Extras.
2. **Product grid**: 2 col mobile → 3 col tablet → 4 col desktop.

Product card:
```
┌─────────────────┐
│   PRODUCT IMG   │  square, object-fit: cover
│  Nombre         │  text-heading-3
│  Descripción    │  text-small, secondary, 2 lines max
│  S/ 12.00       │  text-body-lg, accent color
│  [− 0 +]        │  quantity stepper or "Agregar" button
└─────────────────┘
```

- Quantity stepper appears in place of "Agregar" once item is in cart.
- A floating mini-cart bar sticks to the bottom: "3 productos · S/ 36.00  [Ir al carrito]".
- Upsell banner between categories: "Agrega una bebida por S/ 5 más con cualquier combo".

---

### 4.6 Membresías

Layout: 3-column comparison card (horizontal scroll on mobile).

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  PLATA   │  │   ORO    │  │  BLACK   │
│  S/29/mes│  │  S/49/mes│  │  S/79/mes│
│──────────│  │──────────│  │──────────│
│ ✓ 1 ent. │  │ ✓ 2 ent. │  │ ✓ 4 ent. │
│ ✓ 10% dc │  │ ✓ 20% dc │  │ ✓ 30% dc │
│          │  │ ✓ Snack  │  │ ✓ Snack  │
│          │  │          │  │ ✓ Acceso │
│[Suscrib.]│  │[DESTACADO]│  │[Suscrib.]│
└──────────┘  └──────────┘  └──────────┘
```

- Recommended plan (Oro): accent-color border, "Más popular" badge top-center, slightly larger card.
- Current user plan: "Tu plan actual" badge, CTA changes to "Administrar".
- Estimated savings callout below each card: "Ahorras S/ 45 al mes".

---

### 4.7 Carrito unificado

Right-side drawer (desktop) or full bottom sheet (mobile).

Structure:
```
Carrito (3 ítems)                    [×]
─────────────────────────────────────
🎬 Entradas
   El Señor de los Anillos · Sala 3
   Asientos B4, B5 · Sáb 18 ene 20:00
   2 × S/ 16.00                S/ 32.00

🍿 Snacks
   Combo Duo                   S/ 24.00
   Gaseosa grande              S/  9.00  [−][1][+]

─────────────────────────────────────
Membresía Oro             − S/ 6.40
─────────────────────────────────────
Total                         S/ 58.60
─────────────────────────────────────
         [Proceder al pago →]
```

- Section headers with emoji icon for quick scanning.
- Inline edit (quantity stepper) only for snacks; seats require going back.
- Discount line in accent/success color.
- CTA full-width primary button at the bottom.

---

### 4.8 Checkout (Izipay)

Minimal, distraction-free layout. Single column, max-width 480 px, centered.

```
  ← Volver al carrito

  Resumen del pedido
  ─────────────────────────────
  El Señor de los Anillos × 2      S/ 32.00
  Combo Duo                         S/ 24.00
  Descuento Membresía Oro          − S/ 6.40
  ─────────────────────────────
  Total a pagar                     S/ 49.60
  ─────────────────────────────

  [  Izipay payment widget area  ]
  (mounted here via Izipay JS SDK)

  🔒 Pago seguro procesado por Izipay
```

- Izipay widget mounts inside a clearly bordered container.
- Security badge below widget.
- No other distractions — navbar is hidden on this page (or minimized).

---

### 4.9 Confirmación y ticket digital

Full-page celebration screen, then ticket card.

```
        ✓
  ¡Compra exitosa!
  Tu reserva está confirmada.

  ┌────────────────────────────────┐
  │  PELIS+               #PX-4821 │
  │  ────────────────────────────  │
  │  EL SEÑOR DE LOS ANILLOS       │
  │  Cineplanet Salaverry · Sala 3  │
  │  Sáb 18 ene 2025 · 20:00       │
  │  Asientos: B4, B5              │
  │  ────────────────────────────  │
  │         [QR CODE 200px]        │
  │  ────────────────────────────  │
  │  🍿 Combo Duo × 1              │
  │     Gaseosa grande × 1         │
  │  ────────────────────────────  │
  │  Total pagado: S/ 49.60        │
  └────────────────────────────────┘

  [⬇ Descargar ticket]  [Ver mis tickets]
```

- Confetti animation plays for 2 s on enter.
- Ticket card has a white/light-surface background — high contrast for readability.
- QR code: minimum 180 × 180 px, black on white, high contrast.
- "Descargar ticket" exports the ticket card as a PNG.

---

### 4.10 Perfil del usuario

Sidebar layout (desktop) / tabs (mobile).

Navigation items: Mis datos · Seguridad · Mi membresía · Mis tickets · Mis compras.

**Mis datos**: form with name, email. Editable inline.
**Mi membresía**: plan card (same style as memberships page), benefits progress bars (used/remaining per month).
**Mis tickets**: vertical list of ticket cards, compact version, each expandable to show QR.
**Mis compras**: table with: date · movie · total · status badge · "Ver ticket" link.

---

### 4.11 Admin panel

Intentionally lighter styling: still dark theme but with a left sidebar nav.

```
┌──────────┬──────────────────────────────────────┐
│ PELIS+   │  Page title                           │
│ Admin    │  ─────────────────────────────────── │
│ ──────── │  Content area (table / form)          │
│ Películas│                                       │
│ Funciones│                                       │
│ Salas    │                                       │
│ Snacks   │                                       │
│ Órdenes  │                                       │
│ Usuarios │                                       │
│          │                                       │
│ ──────── │                                       │
│ Salir    │                                       │
└──────────┴──────────────────────────────────────┘
```

- Sidebar width: 220 px. Collapsible to icon-only (60 px) on smaller screens.
- Tables: striped rows using `surface` / `surface-raised` alternation, hover highlight.
- Status badges follow the semantic color system (active = success, inactive = surface-raised).
- Forms open in a right-side drawer over the table, not a new page.
- Destructive actions (cancel screening, deactivate user) open a `ConfirmDialog` first.

---

## 5. Motion & Animation

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page transition | fade + slide-up 8 px | 250 ms | ease-out |
| Hero banner rotation | cross-fade | 400 ms | ease-in-out |
| Card hover scale | scale 1 → 1.04 | 200 ms | ease-out |
| Drawer open | slide-in from edge | 300 ms | cubic-bezier(.32,0,.67,0) |
| Modal enter | fade + scale .95 → 1 | 200 ms | ease-out |
| Skeleton shimmer | gradient sweep | 1500 ms | linear, infinite |
| Toast enter/exit | slide-up + fade | 250 ms | ease-out |
| Confetti (confirmation) | burst | 2000 ms | one-shot |
| Seat selection pulse | scale 1 → 1.15 → 1 | 300 ms | ease-out |

Rule: **never animate layout properties** (width, height, top, left). Animate `transform` and `opacity` only.
Respect `prefers-reduced-motion`: disable all animations except instant state changes when set.

---

## 6. Responsive Breakpoints

```
xs:  375 px   (mobile baseline — design starts here)
sm:  640 px   (large mobile / small tablet)
md:  768 px   (tablet portrait)
lg:  1024 px  (tablet landscape / small desktop)
xl:  1280 px  (desktop)
2xl: 1536 px  (large desktop)
```

Key layout shifts:
- `< md`: single column, bottom-sheet drawers, sticky bottom CTA bar.
- `md – lg`: 2-column layouts start appearing (detail page, profile).
- `>= lg`: sidebar nav in admin, hero gradient goes left-to-right, seat map full view.

---

## 7. Accessibility Checklist (per component)

- [ ] Color is never the only indicator of state (seat map uses icons + color).
- [ ] Every interactive element is reachable and operable by keyboard.
- [ ] Focus ring is always visible (`outline: 2px solid accent`).
- [ ] All images have meaningful `alt` text; decorative images use `alt=""`.
- [ ] Modals trap focus and restore it on close.
- [ ] Error messages are announced via `aria-live="polite"`.
- [ ] Touch targets are minimum 44 × 44 px.
- [ ] Contrast ratio ≥ 4.5 : 1 for normal text, ≥ 3 : 1 for large text.

---

## 8. Iconography

Use a single icon library throughout — **Lucide** (MIT licensed, tree-shakable, clean style).
Never mix icon families.
Icon size: 16 px (inline/badge), 20 px (button), 24 px (nav), 32 px (empty state).

---

## 9. Illustration & Empty States

Every empty state must have:
1. A subtle illustration or icon (not stock photography).
2. A clear heading in Spanish.
3. A short explanation sentence.
4. An optional CTA button.

Examples:
- Empty cart → popcorn bucket icon → "Tu carrito está vacío" → "Explorar cartelera"
- No orders → ticket icon → "Aún no tienes compras" → "Ver películas"
- No results → magnifier icon → "No encontramos resultados" → "Limpiar filtros"

---

## 10. Writing style (UI copy)

- **Tú** form, friendly but not informal — cinema premium experience.
- CTAs: verb-first, action-oriented: "Comprar entradas", "Elegir asientos", "Agregar al carrito".
- Error messages: explain what happened and what to do: "Tu sesión expiró. Ingresa nuevamente."
- Never say "Error 500" or raw HTTP codes to the user.
- Loader messages: "Cargando películas…", "Procesando tu pago…"
- Success messages: specific, not generic: "¡Listo! Tu reserva fue confirmada." not "Operación exitosa."
