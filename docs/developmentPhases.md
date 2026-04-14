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

1. - [ ] Configure Angular project structure (`src/core`, `src/features`, `src/shared` folders)
2. - [ ] Set up Tailwind CSS v4 and Angular Material theme (define design tokens: colors, spacing, typography)
3. - [ ] Configure ESLint, Prettier, and Husky pre-commit hooks
4. - [ ] Set up environment files and `generate-env-ts` script
5. - [ ] Create `src/core/api/endpoints.ts` — single source of truth for all backend URLs (see `docs/api.md`)
6. - [ ] Define global routing structure with lazy-loaded feature modules
7. - [ ] Create `AuthGuard` and `AdminGuard` for protected routes
8. - [ ] Create JWT interceptor (`src/core/interceptors/auth.interceptor.ts`) — attaches `Authorization` header to every request
9. - [ ] Create global error interceptor — handles 401, 403, 500 responses uniformly
10. - [ ] Create shared layout components: `Navbar`, `Footer`, `PageWrapper`
11. - [ ] Create shared UI primitives: `SkeletonLoader`, `EmptyState`, `ErrorState`, `ConfirmDialog`
12. - [ ] Set up Vitest unit test configuration
13. - [ ] Set up Playwright e2e configuration (`playwright.config.ts`, base URL pointing to dev server)
14. - [ ] Create `e2e/pages/` folder and establish the Page Object Model (POM) base class

---

## Phase 2 — Authentication

11. - [ ] Build `RegisterPage` component with reactive form
    - [ ] Fields: full name, email, password, confirm password
    - [ ] Real-time field validation (format, min length, match)
    - [ ] Inline error messages per field
12. - [ ] Build `LoginPage` component with reactive form
    - [ ] Fields: email, password
    - [ ] Error message on invalid credentials
13. - [ ] Build `ForgotPasswordPage` — send recovery link by email
14. - [ ] Build `ResetPasswordPage` — set new password via token
15. - [ ] Implement `AuthService`
    - [ ] `register()`, `login()`, `logout()`, `forgotPassword()`, `resetPassword()`
    - [ ] Store JWT in memory or `localStorage` with expiry handling
    - [ ] Persistent session across page reloads
16. - [ ] Protect private routes with `AuthGuard`
17. - [ ] Auto-login after successful registration
18. - [ ] Add password strength indicator to register form

---

## Phase 3 — Movie Catalog

19. - [ ] Build `CatalogPage` — grid of movie cards
    - [ ] Card fields: poster, title, genre, duration, rating, short synopsis, status badge
20. - [ ] Build `MovieCard` component
    - [ ] Quick-preview on hover/focus: synopsis, trailer link, "Buy" CTA
21. - [ ] Build `MovieDetailPage`
    - [ ] Full synopsis, trailer embed, duration, genre, rating, languages, formats, schedules
22. - [ ] Implement `MovieService` — fetch catalog and movie detail
23. - [ ] Add search by movie title
24. - [ ] Add filters: genre, format (2D / 3D / XD), showtime, venue
25. - [ ] Show active vs. inactive movies distinctly
26. - [ ] Add visual labels: premiere, children, subtitled, dubbed

---

## Phase 4 — Screening Selection

27. - [ ] Build `ScreeningPickerComponent` (step-by-step inside `MovieDetailPage`)
    - [ ] Step 1: select venue
    - [ ] Step 2: select date
    - [ ] Step 3: select showtime
    - [ ] Step 4: select format
28. - [ ] Implement `ScreeningService` — fetch available screenings for a movie
29. - [ ] Show remaining capacity per screening
30. - [ ] Show price before proceeding to seat selection
31. - [ ] Block sold-out screenings and suggest the nearest alternative
32. - [ ] Display a fixed selection summary bar/panel during the flow

---

## Phase 5 — Seat Selection

33. - [ ] Build `SeatMapComponent` — interactive seat grid
    - [ ] Visual legend: available, occupied, selected, preferential
    - [ ] Click/tap to select or deselect a seat
    - [ ] Real-time subtotal update on selection
34. - [ ] Enforce maximum seats per purchase
35. - [ ] Temporarily lock selected seats on the backend (timed reservation)
36. - [ ] Release seats if checkout is not completed within the time limit
37. - [ ] Show countdown timer for the seat reservation
38. - [ ] Handle concurrent seat conflicts (invalidate if taken by another user)
39. - [ ] Mobile-friendly map with pinch-to-zoom support

---

## Phase 6 — Unified Cart

40. - [ ] Implement `CartService` with signal-based state
    - [ ] Add / remove / update tickets, snacks, and memberships
    - [ ] Persist cart across navigation (in-memory signal + optional `sessionStorage`)
41. - [ ] Build `CartSidebarComponent` — slide-in panel visible from any page
    - [ ] Show: selected movie, screening, seats, snacks, membership
    - [ ] Show subtotal per section, applied discounts, and final total
    - [ ] Edit quantities and remove items inline
42. - [ ] Apply membership benefits automatically when cart is updated
43. - [ ] Validate cart before proceeding to checkout (availability, prices)
44. - [ ] Show alerts for price or availability changes

---

## Phase 7 — Checkout & Payments (Izipay)

> Payment processing is fully delegated to **Izipay**. The frontend must never collect or handle raw card data. Use the **Izipay sandbox** environment for the demo.

45. - [ ] Build `CheckoutPage`
    - [ ] Order summary: tickets, seats, snacks, membership, discounts, total
    - [ ] "Pagar" CTA that initiates the Izipay payment session
46. - [ ] Integrate Izipay JavaScript SDK
    - [ ] Load the Izipay sandbox script from the CDN
    - [ ] Initialize the payment form token received from the backend
    - [ ] Mount the Izipay embedded form inside `CheckoutPage`
47. - [ ] Implement `PaymentService`
    - [ ] `createOrder()` — send cart to backend, receive Izipay `formToken`
    - [ ] `confirmPayment()` — send Izipay `paymentResult` to backend for server-side verification
    - [ ] Handle statuses: pending / processing / approved / rejected / expired / cancelled
48. - [ ] Handle Izipay payment result callbacks
    - [ ] On success: call backend to verify and confirm order, then navigate to `ConfirmationPage`
    - [ ] On failure/cancellation: show error message, allow retry without duplicating the order
49. - [ ] Show clear payment state feedback at every step (pending, processing, approved, rejected)
50. - [ ] Allow returning to cart without losing order data if payment is abandoned

---

## Phase 8 — Digital Ticket & Confirmation

52. - [ ] Build `ConfirmationPage` — shown after successful payment
    - [ ] Order summary + digital ticket preview
53. - [ ] Build `TicketComponent`
    - [ ] Fields: user name, QR code, booking code, movie, venue, room, date/time, seats, snacks, total paid
    - [ ] Downloadable QR (canvas or SVG export)
54. - [ ] Send confirmation email with ticket attached
55. - [ ] Store ticket in user profile for future access
56. - [ ] Add "Add to wallet" action (post-MVP placeholder)

---

## Phase 9 — User Profile

57. - [ ] Build `ProfilePage` with tab or sidebar navigation
    - [ ] Tab: Personal data — edit name, email
    - [ ] Tab: Security — change password
    - [ ] Tab: My tickets — list with QR access
    - [ ] Tab: Purchase history — list with filters
    - [ ] Tab: My membership — active plan, benefits used/remaining
58. - [ ] Implement `UserService` — fetch and update profile data
59. - [ ] Protect all profile routes with `AuthGuard`

---

## Phase 10 — Snacks & Combos

60. - [ ] Build `SnacksPage` — catalog by category
    - [ ] Categories: popcorn, drinks, combos, sweets, extras
61. - [ ] Build `SnackCard` component — image, name, size, price, "Add" button
62. - [ ] Build `ProductCustomizationModal` for products that require options
    - [ ] Options: type, size, flavor, extras
63. - [ ] Implement `SnacksService` — fetch catalog
64. - [ ] Add mini-cart indicator visible from the snacks page
65. - [ ] Add upsell suggestions: "Add a drink for S/ 5 more"
66. - [ ] Add cross-sell: "Most bought snack with this movie"

---

## Phase 11 — Memberships

67. - [ ] Build `MembershipsPage` — side-by-side plan comparison
    - [ ] Plans: Plata, Oro, Black
    - [ ] Show: price, validity, benefits, estimated savings
    - [ ] Highlight recommended plan
68. - [ ] Build `MembershipCheckoutFlow` — select plan → pay → activate
69. - [ ] Implement `MembershipService`
    - [ ] Subscribe, check active plan, consume benefit, renew, cancel
70. - [ ] Apply membership discounts automatically at checkout
71. - [ ] Show consumed vs. remaining benefits in profile
72. - [ ] Block benefit use when the monthly quota is exhausted
73. - [ ] Send renewal reminder notification (email or in-app)

---

## Phase 12 — Admin Panel (MVP)

74. - [ ] Set up `/admin` lazy-loaded route protected by `AdminGuard`
75. - [ ] Build `AdminLayoutComponent` — sidebar navigation

### Movies
76. - [ ] Build `AdminMoviesPage` — paginated movie list
77. - [ ] Build `AdminMovieFormComponent` — create / edit movie
    - [ ] Fields: title, synopsis, duration, genre, rating, languages, formats, poster, trailer URL
78. - [ ] Toggle movie active / inactive (no hard delete)

### Screenings
79. - [ ] Build `AdminScreeningsPage` — paginated screening list with date filter
80. - [ ] Build `AdminScreeningFormComponent` — create / edit screening
    - [ ] Fields: movie, venue, room, date, time, format
    - [ ] Validate no room-time conflict before saving
81. - [ ] Cancel screening (sets status to cancelled, releases reserved seats)

### Rooms & Seats
82. - [ ] Build `AdminRoomsPage` — list rooms per venue
83. - [ ] Build `AdminRoomFormComponent` — create room
    - [ ] Fields: name, total capacity, rows, columns
    - [ ] Mark individual seats as standard or preferential
84. - [ ] Toggle room active / inactive

### Snacks
85. - [ ] Build `AdminSnacksPage` — paginated snack list
86. - [ ] Build `AdminSnackFormComponent` — create / edit snack
    - [ ] Fields: name, category, price, image, status
87. - [ ] Toggle snack active / inactive

### Orders
88. - [ ] Build `AdminOrdersPage` — paginated order list with filters (date, status, movie)
89. - [ ] Build `AdminOrderDetailPage` — read-only view of order: user, tickets, seats, snacks, payment status

### Users
90. - [ ] Build `AdminUsersPage` — paginated user list
    - [ ] Columns: name, email, registration date, active membership
91. - [ ] Toggle user account active / inactive

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
98. - [ ] Add global error pages: 404, 500, and generic fallback

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
