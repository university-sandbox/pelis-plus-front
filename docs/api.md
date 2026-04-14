# API Endpoints — Pelis Plus

This file is the single source of truth for every backend endpoint the frontend expects.
It maps directly to `src/core/api/endpoints.ts`.

**Current status**: frontend-only development — all services return mock data.
When the real backend is ready, update `src/core/api/endpoints.ts` and swap the mock
implementations in each service for real `httpResource()` / `HttpClient` calls.

---

## Base URL

```
// src/core/api/endpoints.ts
export const API_BASE = environment.apiUrl; // set via environment file
```

---

## Auth

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Log in, returns JWT |
| `POST` | `/auth/logout` | Invalidate session |
| `POST` | `/auth/forgot-password` | Send password reset email |
| `POST` | `/auth/reset-password` | Set new password via token |
| `GET` | `/auth/me` | Get current authenticated user |

---

## Movies

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/movies` | List all active movies (supports `?genre=&format=&search=`) |
| `GET` | `/movies/:id` | Movie detail |
| `GET` | `/movies/:id/screenings` | All screenings for a movie (supports `?venueId=&date=&format=`) |

### Admin — Movies

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/movies` | List all movies including inactive |
| `POST` | `/admin/movies` | Create a movie |
| `PUT` | `/admin/movies/:id` | Update a movie |
| `PATCH` | `/admin/movies/:id/status` | Toggle active / inactive |

---

## Venues & Rooms

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/venues` | List all venues |
| `GET` | `/venues/:id/rooms` | List rooms for a venue |

### Admin — Rooms

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/rooms` | List all rooms |
| `POST` | `/admin/rooms` | Create a room |
| `PUT` | `/admin/rooms/:id` | Update a room |
| `PATCH` | `/admin/rooms/:id/status` | Toggle active / inactive |

---

## Screenings

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/screenings/:id` | Screening detail with availability |
| `GET` | `/screenings/:id/seats` | Seat map for a screening |

### Admin — Screenings

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/screenings` | List all screenings (supports `?date=&status=&movieId=`) |
| `POST` | `/admin/screenings` | Create a screening |
| `PUT` | `/admin/screenings/:id` | Update a screening |
| `PATCH` | `/admin/screenings/:id/cancel` | Cancel a screening (releases reserved seats) |

---

## Seats

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/screenings/:id/seats/reserve` | Temporarily reserve seats (returns expiry timestamp) |
| `DELETE` | `/screenings/:id/seats/reserve` | Release a temporary reservation |

---

## Snacks

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/snacks` | List all active snacks (supports `?category=`) |
| `GET` | `/snacks/categories` | List all snack categories |

### Admin — Snacks

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/snacks` | List all snacks including inactive |
| `POST` | `/admin/snacks` | Create a snack |
| `PUT` | `/admin/snacks/:id` | Update a snack |
| `PATCH` | `/admin/snacks/:id/status` | Toggle active / inactive |

---

## Orders & Checkout

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/orders` | Create an order from the cart, returns Izipay `formToken` |
| `POST` | `/orders/:id/confirm` | Verify Izipay `paymentResult` server-side and confirm the order |
| `GET` | `/orders/:id` | Order detail |
| `GET` | `/orders/me` | Current user's order history |

### Admin — Orders

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/orders` | List all orders (supports `?date=&status=&movieId=`) |
| `GET` | `/admin/orders/:id` | Order detail |

---

## Tickets

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/tickets/me` | Current user's ticket list |
| `GET` | `/tickets/:id` | Ticket detail with QR payload |

---

## Memberships

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/memberships/plans` | List available membership plans |
| `GET` | `/memberships/me` | Current user's active membership |
| `POST` | `/memberships/subscribe` | Subscribe to a plan (creates order via Izipay) |
| `POST` | `/memberships/me/confirm` | Confirm membership payment (Izipay callback) |
| `PATCH` | `/memberships/me/cancel` | Cancel current membership |
| `GET` | `/memberships/me/benefits` | List benefits with consumed / remaining counts |

---

## Users (Admin)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/users` | List all users |
| `GET` | `/admin/users/:id` | User detail |
| `PATCH` | `/admin/users/:id/status` | Toggle user active / inactive |

---

## User Profile

| Method | Path | Description |
|--------|------|-------------|
| `PUT` | `/users/me` | Update profile (name, email) |
| `PUT` | `/users/me/password` | Change password |

---

## Notes for implementation

- All authenticated endpoints require `Authorization: Bearer <token>` header — handled globally by the JWT interceptor in `src/core/interceptors/auth.interceptor.ts`.
- All admin endpoints require the user role to be `admin` — enforced by `AdminGuard` on the route and validated server-side.
- Temporary seat reservations expire after a configurable TTL (suggested: 10 minutes). The frontend must display a countdown and release the reservation if the user abandons checkout.
- Izipay payment results must always be **verified server-side** via `/orders/:id/confirm` before the order status is updated. Never trust the client-side result alone.
