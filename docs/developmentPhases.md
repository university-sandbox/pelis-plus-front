# Development Phases — Pelis Plus

This document tracks the implementation progress of every feature defined in `flujos_plataforma_cine.md`.
Check each task off as it is completed.

## Conventions

- **Code language**: English — file names, variables, functions, classes, types, comments, route paths, selectors.
- **UI language**: Spanish — all text visible to the end user (labels, buttons, errors, titles, placeholders).
- **Payments**: handled entirely by **Izipay**. Use the sandbox environment for development and demo. The app never collects or stores raw card data.
- **Data layer**: components never call `HttpClient` directly — all HTTP goes through a service. All endpoint paths live in `src/core/api/endpoints.ts` (see `docs/api.md`).
- **Mock-first**: during frontend-only development services return typed mock data. Swapping to real calls = updating `endpoints.ts` + replacing the mock return in the service method.
- **UI/UX**: every screen needs skeleton loaders, all interactive states (hover, focus, disabled, loading, error, empty), and mobile-first layout starting at 375 px.

---

## Phase 1 — Project Setup & Architecture

1. - [x] Configure Angular project structure (`src/core`, `src/features`, `src/shared` folders)
2. - [x] Set up Tailwind CSS v4 and Angular Material theme (define design tokens: colors, spacing, typography)
3. - [x] Configure ESLint and Prettier — ⚠️ Husky not yet installed
4. - [x] Set up environment files and `generate-env-ts` script (Zod-validated, SSR-safe)
5. - [x] Create `src/app/core/api/endpoints.ts` — single source of truth for all URLs (TMDB + backend); see `docs/api.md`
6. - [x] Define global routing structure with lazy-loaded feature modules
7. - [x] Create `AuthGuard` and `AdminGuard` for protected routes
8. - [x] Create JWT interceptor (`src/app/core/interceptors/auth-interceptor.ts`) — attaches `Authorization: Bearer` to every backend request
9. - [x] Create TMDB interceptor (`src/app/core/interceptors/tmdb.interceptor.ts`) — attaches TMDB bearer token only to requests matching `environment.tmdb.baseUrl`
10. - [x] Create global error interceptor — handles 401 (redirect to login), 403, 500 uniformly
11. - [x] Create shared layout components: `Navbar` — ⚠️ partially done: Footer and PageWrapper pending
12. - [x] Create shared UI primitives: `SkeletonLoader`, `EmptyState`, `ErrorState` — ⚠️ partially done: `ConfirmDialog` pending
13. - [ ] Set up Vitest unit test configuration
14. - [x] Set up Playwright e2e configuration (`playwright.config.ts`, base URL pointing to dev server)
15. - [x] Create `e2e/pages/` folder and establish the Page Object Model (POM) base class

---

## Phase 2 — Authentication

11. - [x] Build `RegisterPage` component with reactive form
    - [x] Fields: full name, email, password, confirm password
    - [x] Real-time field validation (format, min length, match)
    - [x] Inline error messages per field
12. - [x] Build `LoginPage` component with reactive form
    - [x] Fields: email, password
    - [x] Inline error message on invalid credentials
    - [x] `isSubmitting` signal disables form during request
13. - [x] Build `ForgotPasswordPage` — send recovery link by email
14. - [x] Build `ResetPasswordPage` — set new password via token
15. - [x] Implement `AuthService` — `login()`, `logout()`, `register()`, `forgotPassword()`, `resetPassword()`, session persistence via `localStorage` — ⚠️ all mocked (see `docs/mocks.md`)
16. - [x] Protect private routes with `AuthGuard`
17. - [x] Auto-login after successful registration
18. - [x] Add password strength indicator to register form

---

## Phase 3 — Movie Catalog

19. - [x] Build `CatalogPage` — hero banner + horizontal scroll rows + grid search results
    - [x] Card fields: poster, title, rating, year
20. - [x] Build `MovieCard` component
    - [x] Quick-preview on hover/focus: "Comprar" CTA
21. - [x] Build `MovieDetailPage`
    - [x] Full synopsis, trailer embed, duration, genre, rating, languages, formats, schedules
22. - [x] Implement `MovieService` — fetch catalog and movie detail (TMDB)
23. - [x] Add search by movie title
24. - [x] Add filters: genre pills — ⚠️ partially done: format/showtime/venue filters pending
25. - [x] Show active vs. inactive movies distinctly — inactive overlay + badge on `MovieCardComponent`
26. - [x] Add visual labels: premiere, upcoming, +18 — ⚠️ partially done: subtitled/dubbed require backend schema change

---

## Phase 4 — Screening Selection

27. - [x] Build `MovieDetailPage` includes inline screening picker (step-by-step)
    - [x] Step 1: select venue (tab filter)
    - [x] Step 2: select date (date tabs)
    - [x] Step 3: select showtime (time + format per screening card)
    - [x] Step 4: navigate to seat selection page
28. - [x] Implement `ScreeningService` — fetch available screenings for a movie
29. - [x] Show remaining capacity per screening
30. - [x] Show price before proceeding to seat selection
31. - [x] Block sold-out screenings and suggest the nearest alternative
32. - [ ] Display a fixed selection summary bar/panel during the flow — ⚠️ partial: bottom bar on seat page only

---

## Phase 5 — Seat Selection

33. - [x] Build `SeatMapComponent` — interactive seat grid (`SeatMapPageComponent` at `/seats/:screeningId`)
    - [x] Visual legend: available, occupied, selected, preferential
    - [x] Click/tap to select or deselect a seat
    - [x] Real-time subtotal update on selection
34. - [x] Enforce maximum seats per purchase — max 6, enforced in `toggleSeat()`
35. - [x] Temporarily lock selected seats on the backend (via `SeatService.reserveSeats()`)
36. - [x] Release seats if checkout is not completed (on component destroy)
37. - [x] Show countdown timer for the seat reservation — 10 min countdown with expiry callback
38. - [x] Handle concurrent seat conflicts (invalidate if taken by another user) — 409 error triggers seat refresh
39. - [ ] Mobile-friendly map with pinch-to-zoom support

---

## Phase 6 — Unified Cart

40. - [x] Implement `CartService` with signal-based state
    - [x] Add / remove / update tickets, snacks, and memberships
    - [x] Persist cart across navigation (in-memory signal)
41. - [x] Build `CartSidebarComponent` — slide-in panel visible from any page
    - [x] Show: selected movie, screening, seats, snacks, membership
    - [x] Show subtotal per section, applied discounts, and final total
    - [x] Edit quantities and remove items inline
42. - [x] Apply membership benefits automatically when cart is updated — applied in `CheckoutPageComponent.ngOnInit()`
43. - [ ] Validate cart before proceeding to checkout (availability, prices)
44. - [ ] Show alerts for price or availability changes

---

## Phase 7 — Checkout & Payments (Izipay)

> Payment processing is fully delegated to **Izipay**. The frontend must never collect or handle raw card data. Use the **Izipay sandbox** environment for the demo.

45. - [x] Build `CheckoutPage`
    - [x] Order summary: tickets, seats, snacks, membership, discounts, total
    - [x] "Pagar" CTA that initiates the Izipay payment session
46. - [ ] Integrate Izipay JavaScript SDK — ⚠️ mocked: payment confirmed immediately in dev mode
    - [ ] Load the Izipay sandbox script from the CDN
    - [ ] Initialize the payment form token received from the backend
    - [ ] Mount the Izipay embedded form inside `CheckoutPage`
47. - [x] Implement `PaymentService` / `OrderService`
    - [x] `createOrder()` — send cart to backend, receive Izipay `formToken`
    - [x] `confirmOrder()` — send Izipay `paymentResult` to backend for server-side verification
    - [x] Handle statuses: pending / processing / approved / rejected / expired / cancelled
48. - [x] Handle Izipay payment result callbacks
    - [x] On success: navigate to `ConfirmationPage`
    - [x] On failure: show error message, allow retry
49. - [x] Show clear payment state feedback at every step
50. - [x] Allow returning to cart without losing order data

---

## Phase 8 — Digital Ticket & Confirmation

52. - [x] Build `ConfirmationPage` — shown after successful payment
    - [x] Order summary + digital ticket preview
53. - [x] Build `TicketComponent`
    - [x] Fields: user name, QR code, booking code, movie, venue, room, date/time, seats, snacks, total paid
    - [x] Downloadable QR — real QR via `qrcode` library, `afterNextRender` SSR-safe, download button
54. - [ ] Send confirmation email with ticket attached
55. - [x] Store ticket in user profile for future access (via `TicketService.getMyTickets()`)
56. - [ ] Add "Add to wallet" action (post-MVP placeholder)

---

## Phase 9 — User Profile

57. - [x] Build `ProfilePage` with tab or sidebar navigation
    - [x] Tab: Personal data — edit name, email
    - [x] Tab: Security — change password
    - [x] Tab: My tickets — list with QR access
    - [x] Tab: Purchase history — list with filters
    - [x] Tab: My membership — active plan, benefits used/remaining
58. - [x] Implement `UserService` — fetch and update profile data
59. - [x] Protect all profile routes with `AuthGuard`

---

## Phase 10 — Snacks & Combos

60. - [x] Build `SnacksPage` — catalog by category
    - [x] Categories: popcorn, drinks, combos, sweets, extras
61. - [x] Build `SnackCard` component — image, name, size, price, "Add" button
62. - [x] Build `ProductCustomizationModal` — opens for snacks with options; quantity + option selection
    - [x] Options: type, size, flavor, extras
63. - [x] Implement `SnacksService` — fetch catalog
64. - [x] Add mini-cart indicator visible from the snacks page
65. - [ ] Add upsell suggestions: "Add a drink for S/ 5 more"
66. - [ ] Add cross-sell: "Most bought snack with this movie"

---

## Phase 11 — Memberships

67. - [x] Build `MembershipsPage` — side-by-side plan comparison
    - [x] Plans: Plata, Oro, Black
    - [x] Show: price, validity, benefits, estimated savings
    - [x] Highlight recommended plan
68. - [x] Build `MembershipCheckoutFlow` — select plan → pay (mock) → activate
69. - [x] Implement `MembershipService`
    - [x] Subscribe, check active plan, consume benefit, renew, cancel
70. - [x] Apply membership discounts automatically at checkout — `CheckoutPage.ngOnInit()` fetches plan + applies %
71. - [x] Show consumed vs. remaining benefits in profile
72. - [ ] Block benefit use when the monthly quota is exhausted
73. - [ ] Send renewal reminder notification (email or in-app)

---

## Phase 12 — Admin Panel (MVP)

74. - [x] Set up `/admin` lazy-loaded route protected by `AdminGuard`
75. - [x] Build `AdminLayoutComponent` — collapsible sidebar with nav to all sections

### Movies
76. - [x] Build `AdminMoviesPage` — paginated movie list with status badge, active toggle
77. - [x] Build `AdminMovieFormComponent` — create / edit movie
    - [x] Fields: title, synopsis, duration, genre, rating, languages, formats, poster, active
78. - [x] Toggle movie active / inactive (no hard delete)

### Screenings
79. - [x] Build `AdminScreeningsPage` — paginated screening list with status filter
80. - [x] Build `AdminScreeningFormComponent` — create / edit screening
    - [x] Fields: movie, venue, room, date, time, format, price
    - [ ] Validate no room-time conflict before saving
81. - [x] Cancel screening (sets status to cancelled)

### Rooms & Seats
82. - [x] Build `AdminRoomsPage` — list rooms grouped by venue
83. - [x] Build `AdminRoomFormComponent` — create / edit room
    - [x] Fields: name, venue, capacity, rows, columns
    - [ ] Mark individual seats as standard or preferential
84. - [x] Toggle room active / inactive

### Snacks
85. - [x] Build `AdminSnacksPage` — snack list with active toggle
86. - [x] Build `AdminSnackFormComponent` — create / edit snack
    - [x] Fields: name, category, price, image, status
87. - [x] Toggle snack active / inactive

### Orders
88. - [x] Build `AdminOrdersPage` — paginated order list with status + payment badges
89. - [x] Build `AdminOrderDetailPage` — read-only order view: tickets, snacks, totals, statuses

### Users
90. - [x] Build `AdminUsersPage` — paginated user list with membership badge
    - [x] Columns: name, email, membership, registration date
91. - [x] Toggle user account active / inactive

---

## Phase 13 — Quality, Accessibility & Polish

> E2e tests using `playwright-cli` must be written alongside each feature — not deferred to this phase.
> This phase covers cross-cutting concerns and final audits only.

### Accessibility
92. - [ ] Run AXE checks on all public pages and fix every violation
93. - [ ] Verify WCAG AA contrast on all color combinations
94. - [ ] Add focus management for modals, drawers, and route transitions
95. - [ ] Add missing ARIA labels, roles, and live regions

### UI completeness
96. - [ ] Verify skeleton loaders are present on every async screen
97. - [ ] Verify all interactive states exist on every component (hover, focus, disabled, loading, error, empty)
98. - [x] Add global error pages: 404 — `NotFoundPageComponent` at catch-all route — ⚠️ 500 page pending

### Unit tests
99. - [ ] Write unit tests for all services (AuthService, CartService, PaymentService, MembershipService, etc.)

### E2e — final regression suite (playwright-cli)
100. - [ ] Full critical path: register → browse catalog → select screening → pick seats → add snacks → checkout (Izipay sandbox) → view ticket
101. - [ ] Auth edge cases: login with invalid credentials, expired session redirect
102. - [ ] Seat selection edge cases: sold-out screening, reservation timeout
103. - [ ] Cart edge cases: remove item, apply membership discount
104. - [ ] Admin happy path: create movie → create screening → view order

### Performance
105. - [ ] Audit bundle size and apply lazy loading where missing
106. - [ ] Test SSR hydration and verify no hydration mismatch errors
