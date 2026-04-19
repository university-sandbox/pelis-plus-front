## About this project

**Pelis Plus** — cinema web platform. Users browse movies, book tickets, select seats, buy snacks, subscribe memberships, get digital QR tickets.

### Core user flows
1. Register / log in
2. Browse catalog, view movie details
3. Select screening (venue, date, time, format)
4. Pick seats on interactive map
5. Add snacks/combos to cart
6. Subscribe membership (Plata / Oro / Black)
7. Unified checkout — payment via **Izipay** (sandbox for demo)
8. Receive digital ticket, consult purchase history from profile

### Admin panel (MVP)
Internal role: manage movies, screenings, rooms, snacks, orders, users. Protected `/admin` route.

### Tech stack
- **Framework**: Angular 21 (standalone components, signals, SSR)
- **Styling**: Tailwind CSS v4 + Angular Material
- **Forms**: Reactive Forms + Zod validation
- **HTTP**: Angular `HttpClient` with `resource()` / `httpResource()`
- **Auth**: JWT (`jwt-decode`) with route guards
- **Payments**: Izipay (sandbox environment for demo)
- **Testing**: Vitest + Playwright
- **Package manager**: Bun

### Language conventions
- **Code**: English — file names, variables, functions, classes, types, comments, git commits, component selectors, route paths, all developer-facing text.
- **UI / content**: Spanish — labels, buttons, errors, page titles, placeholders, tooltips, all user-facing copy.

### Key business rules
- Seats temporarily locked during checkout; released if payment incomplete
- Membership benefits auto-applied at checkout
- Payment fully delegated to **Izipay**; app never handles raw card data
- No ticket issued without confirmed payment from Izipay
- Each ticket unique; re-consultable from user profile

---

Expert in TypeScript, Angular, scalable web apps. Write functional, maintainable, performant, accessible code following Angular/TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when type obvious
- Avoid `any`; use `unknown` when type uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. Default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use `@HostBinding` / `@HostListener`. Put host bindings inside `host` object of `@Component` or `@Directive` instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` doesn't work for inline base64 images.

## Accessibility Requirements

- Must pass all AXE checks.
- Must follow all WCAG AA minimums: focus management, color contrast, ARIA attributes.

### Components

- Keep components small, single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component`
- **Always use external files**: `templateUrl` + `styleUrl` — never inline `template:` or `styles:` in the decorator, regardless of component size
- Prefer Reactive forms over Template-driven
- Do NOT use `ngClass`, use `class` bindings
- Do NOT use `ngStyle`, use `style` bindings
- External templates/styles: use paths relative to component TS file.

## State Management

- Signals for local component state
- `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals; use `update` or `set`

## Templates

- Keep templates simple, avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) not `*ngIf`, `*ngFor`, `*ngSwitch`
- Use async pipe for observables
- Do not assume globals like `new Date()` available.

## Services & Data Layer

- Services: single responsibility
- Use `providedIn: 'root'` for singleton services
- Use `inject()` not constructor injection
- **Components must NEVER call `HttpClient` directly.** All HTTP calls go through a service.
- Each feature has own service (e.g. `MovieService`, `CartService`). Services only place that import from `src/core/api/endpoints.ts`.
- All API endpoint paths live exclusively in `src/core/api/endpoints.ts`. Only file needing update when real backend ready.
- Frontend-only dev: services return **mock data** using same return type as real HTTP call. Mock data defined inside service file — never inline in component.
- Use `httpResource()` for reads, `HttpClient` for mutations (POST / PUT / PATCH / DELETE).

## Progress tracking

- After completing any task in `docs/developmentPhases.md`, immediately mark done: `- [ ]` → `- [x]`. No batching — mark each task when finished.
- Partially done: add inline note: `- [x] Task title — ⚠️ partially done: what remains`.
- New work not in file: add it and mark done.

## Mock tracking

- Any faked service method, guard, or behaviour **must be logged in `docs/mocks.md`** immediately — before moving on.
- Follow mocking pattern in `docs/mocks.md`: environment flag `mock.enabled`, mock data in `src/app/core/mocks/<feature>.mock.ts`, `delay(400)` for simulated latency.
- Never inline mock data in component or template.
- Auth: fake via demo credentials from `environment.auth.demoEmail / demoPassword`, return hardcoded JWT string. Log in `docs/mocks.md`.

## API Endpoint Management

- Source of truth for every URL: `src/app/core/api/endpoints.ts`. Import `TMDB` or `BACKEND` from there — never write URL string elsewhere.
- Movie catalog from **TMDB** (`TMDB.MOVIES.*`) while backend not ready. Everything else (auth, orders, etc.) uses `BACKEND.*` constants pointing to mock returns in services.
- `TmdbInterceptor` (`src/app/core/interceptors/tmdb.interceptor.ts`) auto-attaches TMDB bearer token to requests whose URL starts with `environment.tmdb.baseUrl`. Services must not add auth headers manually for TMDB.
- See `docs/api.md` for full endpoint catalogue and TMDB → backend migration checklist.

## Testing

- Every feature must have **Playwright e2e tests**. Not optional.
- Use `playwright-cli` skill to write and run Playwright tests.
- Tests in `e2e/`, organized by feature (e.g. `e2e/auth/`, `e2e/catalog/`, `e2e/checkout/`).
- Each feature e2e suite must cover at minimum:
  - happy path (golden path)
  - most critical error/edge case (e.g. invalid form, failed payment, sold-out screening)
- Use Page Object Model (POM) — one class per page/feature in `e2e/pages/`.
- Tests run in Playwright sandbox against dev server (`ng serve`).
- Every new component or page must have corresponding e2e test added/updated same work session.

## UI / UX Standards

Full design system in **`docs/ui-ux-guide.md`**. Source of truth for colors, typography, spacing, component specs, motion rules, per-page layout. Read before building any screen.

Quick rules:
- Dark theme only. Use CSS design tokens from `docs/ui-ux-guide.md` — never hardcode hex.
- Primary accent: `#00C9A7`. All interactive elements use consistently.
- Clear visual hierarchy every screen: most important action always most prominent.
- Skeleton loaders for async content — never empty container while loading.
- Destructive/irreversible actions require explicit confirmation via `ConfirmDialog`.
- Forms: inline validation errors below each field; never clear field values on failed submit.
- Cover all interactive states: default, hover, focus, active, disabled, loading, error, empty.
- Animate only `transform` and `opacity`. Respect `prefers-reduced-motion`.
- Mobile-first: every layout usable on 375 px before scaling up.
- Icons: **Lucide** only — never mix libraries.
- UI copy in Spanish, verb-first CTAs, friendly "tú" form. See `docs/ui-ux-guide.md` section 10.