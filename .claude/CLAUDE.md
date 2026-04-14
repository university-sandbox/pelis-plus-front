
## About this project

**Pelis Plus** is a cinema web platform that allows users to browse movies, book tickets, select seats, buy snacks, subscribe to membership plans, and receive digital tickets with QR codes.

### Core user flows
1. Register / log in
2. Browse the movie catalog and view movie details
3. Select a screening (venue, date, time, format)
4. Pick seats on an interactive map
5. Add snacks and combos to the cart
6. Subscribe to a membership plan (Plata / Oro / Black)
7. Unified checkout — payment handled by **Izipay** (sandbox for demo)
8. Receive a digital ticket and consult purchase history from the profile

### Admin panel (MVP)
Internal role for managing movies, screenings, rooms, snacks, orders, and users. Accessed via a protected `/admin` route.

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
- **Code**: everything in English — file names, variables, functions, classes, types, comments, git commits, component selectors, route paths, and all developer-facing text.
- **UI / content**: all user-facing text in Spanish — labels, buttons, error messages, page titles, placeholders, tooltips, and any copy the end user reads.

### Key business rules
- Seats are temporarily locked during checkout and released if payment is not completed
- Membership benefits are applied automatically at checkout
- Payment processing is fully delegated to **Izipay**; the app must never handle raw card data
- No ticket is issued without a confirmed payment notification from Izipay
- Each ticket is unique and can be re-consulted from the user profile

---

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services & Data Layer

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
- **Components must NEVER call `HttpClient` directly.** All HTTP calls go through a service.
- Each feature has its own service (e.g. `MovieService`, `CartService`). Services are the only place that import from `src/core/api/endpoints.ts`.
- All API endpoint paths live exclusively in `src/core/api/endpoints.ts`. When the real backend is ready, only that file needs updating.
- During frontend-only development, services return **mock data** using the same return type that the real HTTP call will use. Mock data must be defined inside the service file — never inline in a component.
- Use `httpResource()` for read operations and `HttpClient` for mutations (POST / PUT / PATCH / DELETE).

## API Endpoint Management

- The source of truth for all backend URLs is `src/core/api/endpoints.ts`.
- Group endpoints by feature domain. Each entry is a function or string constant — never a hardcoded URL inside a service method.
- See `docs/api.md` for the full catalogue of expected endpoints.

## Testing

- Every feature must have **Playwright e2e tests**. They are not optional.
- Use the `playwright-cli` skill to write and run Playwright tests.
- Tests live in `e2e/` and are organized by feature (e.g. `e2e/auth/`, `e2e/catalog/`, `e2e/checkout/`).
- Each feature's e2e suite must cover at minimum:
  - the happy path (golden path)
  - the most critical error/edge case (e.g. invalid form, failed payment, sold-out screening)
- Use Page Object Model (POM) — one class per page/feature in `e2e/pages/`.
- Tests must run in the Playwright sandbox environment against the dev server (`ng serve`).
- Every new component or page added must have a corresponding e2e test added or updated in the same work session.

## UI / UX Standards

- Every screen must have a clear visual hierarchy: the most important action is always the most prominent element.
- Use skeleton loaders for any async content — never show an empty container while data is loading.
- Every destructive or irreversible action (delete, cancel, log out) must ask for explicit confirmation.
- Forms must show inline validation errors below each field; never clear field values on failed submission.
- All interactive states must be covered: default, hover, focus, active, disabled, loading, error, empty.
- Transitions and micro-animations should be subtle and purposeful — they communicate state changes, not decoration.
- Mobile-first: every layout must be usable on a 375 px screen before scaling up.
