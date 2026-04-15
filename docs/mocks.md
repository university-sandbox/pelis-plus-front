# Mock & Fake Implementations — Pelis Plus

This file tracks every piece of functionality that is currently faked or mocked
because the real backend is not yet available.

**Rule:** any time a service method, guard, or interceptor is faked, it must be
logged here with its cleanup instructions. When the backend is ready, work through
this list top to bottom and delete each entry as it is resolved.

---

## Mocking pattern

Services use a simple environment flag to switch between mock and real HTTP:

```typescript
// src/environments/environment.model.ts
export interface AppEnvironment {
  // ...
  mock: {
    /** When true, service methods return fake data instead of calling the backend. */
    enabled: boolean;
  };
}
```

Inside every service method that talks to the backend:

```typescript
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MOCK_<FEATURE> } from '../mocks/<feature>.mock';

someMethod(): Observable<SomeType> {
  // ⚠️ MOCK — remove this block and the import above when backend is ready
  if (environment.mock.enabled) {
    return of(MOCK_<FEATURE>).pipe(delay(400)); // delay simulates network
  }
  // real HTTP call below
  return this.http.get<SomeType>(BACKEND.url(BACKEND.<DOMAIN>.<ENDPOINT>));
}
```

Mock data files live in `src/app/core/mocks/` and are **never imported in components** —
only in services.

### Adding `mock` to the environment

Add to `.env`:
```bash
NG_APP_MOCK_ENABLED=true   # set to false when backend is ready
```

Add to `environment.model.ts`:
```typescript
mock: { enabled: boolean };
```

Add to `environment.ts` schema and export:
```typescript
NG_APP_MOCK_ENABLED: z.enum(['true','false']).default('true').transform(v => v === 'true'),
// ...
mock: { enabled: parsedEnv.data.NG_APP_MOCK_ENABLED },
```

---

## Active mocks

### AUTH — `AuthService` (all methods)

| Field | Value |
|-------|-------|
| File | `src/app/core/services/auth.service.ts` |
| Mock data | `src/app/core/mocks/auth.mock.ts` — `MOCK_JWT` constant |
| Current behaviour | `login()`: checks demo credentials, returns `MOCK_JWT`. Others (`register`, `forgotPassword`, `resetPassword`): return success after delay. |
| Status | ✅ Implemented with `environment.mock.enabled` guard |

**Cleanup when backend is ready:**
- [ ] Remove all `if (environment.mock.enabled)` guards in `AuthService`
- [ ] Delete `src/app/core/mocks/auth.mock.ts`
- [ ] Set `NG_APP_MOCK_ENABLED=false` in `.env`

---

### MOVIES — `MovieService`

| Field | Value |
|-------|-------|
| File | `src/app/core/services/movie.service.ts` |
| Data source | **TMDB** (not mocked — real HTTP calls via `TMDB.*` endpoints) |
| Auth | `TmdbInterceptor` attaches bearer token automatically |
| Note | TMDB is the real data source for movies, not a mock. No cleanup needed here beyond the TMDB → backend migration described in `docs/api.md`. |

---

### SCREENINGS — `ScreeningService` ✅ Implemented

| Field | Value |
|-------|-------|
| File | `src/app/core/services/screening.service.ts` |
| Mock data | `src/app/core/mocks/screening.mock.ts` — `buildMockScreenings(movieId, title)` |
| Current behaviour | Returns 6 screenings per movie across 3 venues and 4 dates. Includes varied formats (2D, 3D, IMAX) and one sold-out screening. |
| Latency simulation | `delay(400)` |
| Status | ✅ Implemented with `environment.mock.enabled` guard |

**Expected backend shape** (`GET /movies/:id/screenings`):
```json
[
  {
    "id": "sc-123-1",
    "movieId": 123,
    "movieTitle": "Dune: Part Two",
    "venue": { "id": "v1", "name": "PelisPlus Miraflores", "address": "...", "city": "Lima" },
    "room": { "id": "r1", "venueId": "v1", "name": "Sala 1", "capacity": 80, "rows": 8, "cols": 10 },
    "date": "2024-04-15",
    "time": "15:30",
    "format": "standard",
    "price": 22,
    "availableSeats": 48,
    "totalSeats": 80,
    "status": "active"
  }
]
```

**Cleanup:** remove `if (environment.mock.enabled)` block and import in `ScreeningService`. Replace with real HTTP calls to `BACKEND.MOVIES.SCREENINGS(movieId)`.

---

### VENUES — `ScreeningService.getVenues()` ✅ Implemented

| Field | Value |
|-------|-------|
| File | `src/app/core/services/screening.service.ts` |
| Mock data | `src/app/core/mocks/venue.mock.ts` — `MOCK_VENUES` |
| Current behaviour | Returns 3 static venues in Lima. |
| Status | ✅ Implemented |

**Expected backend shape** (`GET /venues`):
```json
[{ "id": "v1", "name": "PelisPlus Miraflores", "address": "Av. Larco 345", "city": "Lima" }]
```

**Cleanup:** replace with `BACKEND.VENUES.LIST` HTTP call in a dedicated `VenueService`.

---

### SEATS — `SeatService` ✅ Implemented

| Field | Value |
|-------|-------|
| File | `src/app/core/services/seat.service.ts` |
| Mock data | `src/app/core/mocks/seat.mock.ts` — `buildMockSeatMap(screeningId)` |
| Current behaviour | Returns 10-column × 8-row grid. ~20% occupied (hardcoded IDs). Rows D–E are preferential. |
| Latency simulation | `delay(400)` |
| Status | ✅ Implemented with `environment.mock.enabled` guard |

**Expected backend shape** (`GET /screenings/:id/seats`):
```json
{
  "screeningId": "sc-123-1",
  "rows": ["A","B","C","D","E","F","G","H"],
  "cols": [1,2,3,4,5,6,7,8,9,10],
  "seats": [
    [
      { "id": "A1", "row": "A", "col": 1, "status": "free", "type": "standard" },
      ...
    ]
  ]
}
```

`status` values: `"free"` | `"occupied"` | `"reserved"` (reserved = temp lock by another user)
`type` values: `"standard"` | `"preferential"`

**Cleanup:** replace `buildMockSeatMap()` with `BACKEND.SCREENINGS.SEATS(screeningId)` HTTP call.

---

### SNACKS — `SnackService` ✅ Implemented

| Field | Value |
|-------|-------|
| File | `src/app/core/services/snack.service.ts` |
| Mock data | `src/app/core/mocks/snack.mock.ts` — `MOCK_SNACKS` (11 products, 5 categories) |
| Current behaviour | Returns all active snacks, supports category filter. |
| Latency simulation | `delay(400)` |
| Status | ✅ Implemented with `environment.mock.enabled` guard |

**Expected backend shape** (`GET /snacks?category=popcorn`):
```json
[
  {
    "id": "sn-1",
    "name": "Canchita Clásica",
    "description": "...",
    "category": "popcorn",
    "price": 12,
    "image": null,
    "status": "active",
    "options": [{ "label": "Tamaño", "choices": ["Pequeño","Mediano","Grande"] }]
  }
]
```

**Cleanup:** replace `MOCK_SNACKS` filter with `BACKEND.SNACKS.LIST` HTTP call.

---

### ORDERS — `OrderService` ✅ Implemented

| Field | Value |
|-------|-------|
| File | `src/app/core/services/order.service.ts` |
| Mock data | `src/app/core/mocks/order.mock.ts` — `MOCK_CREATE_ORDER_RESPONSE`, `MOCK_ORDER` |
| Current behaviour | `createOrder()` returns a fake `{ orderId, formToken }`. `confirmOrder()` returns a confirmed order immediately (skips real Izipay). |
| Latency simulation | `delay(600)` on create, `delay(400)` on confirm |
| Status | ✅ Implemented with `environment.mock.enabled` guard |

**Expected backend shape** (`POST /orders`):
- Request: `{ tickets: CartTicket[], snacks: CartSnackItem[], membershipDiscount: number }`
- Response: `{ orderId: string, formToken: string }` (Izipay form token)

**`POST /orders/:id/confirm`**:
- Request: `{ paymentResult: object }` (Izipay callback payload)
- Response: `Order` object

**Cleanup:**
1. Implement real `createOrder()` POST to `BACKEND.ORDERS.CREATE`
2. Load Izipay SDK, mount embedded form using `formToken`
3. On Izipay callback, call `confirmOrder()` with `paymentResult`
4. Remove mock blocks

---

### TICKETS — `TicketService` ✅ Implemented

| Field | Value |
|-------|-------|
| File | `src/app/core/services/ticket.service.ts` |
| Mock data | `src/app/core/mocks/ticket.mock.ts` — `MOCK_TICKETS` (1 demo ticket) |
| Current behaviour | `getMyTickets()` returns 1 demo ticket. `buildTicketsFromOrder()` constructs ticket objects from cart data for immediate display on `ConfirmationPage`. |
| Status | ✅ Implemented with `environment.mock.enabled` guard |

**Expected backend shape** (`GET /tickets/me`):
```json
[
  {
    "id": "tk-001",
    "orderId": "order-001",
    "bookingCode": "PLX-2024-001",
    "userName": "Usuario Demo",
    "movie": "Dune: Part Two",
    "moviePosterPath": "/abc123.jpg",
    "venue": "PelisPlus Miraflores",
    "room": "Sala IMAX",
    "date": "2024-04-20",
    "time": "19:00",
    "seat": "D5",
    "format": "imax",
    "totalPaid": 38,
    "qrData": "PLX-2024-001",
    "issuedAt": "2024-04-15T10:00:00Z"
  }
]
```

**Cleanup:** replace `MOCK_TICKETS` with real `BACKEND.TICKETS.MY_TICKETS` HTTP call. Remove `buildTicketsFromOrder()` helper.

---

### MEMBERSHIPS — `MembershipService` ✅ Implemented

| Field | Value |
|-------|-------|
| File | `src/app/core/services/membership.service.ts` |
| Mock data | `src/app/core/mocks/membership.mock.ts` — `MOCK_MEMBERSHIP_PLANS` (Plata/Oro/Black) |
| Current behaviour | `getPlans()` returns 3 static plans. `getMyPlan()` returns `null` (no active plan). `subscribe()` + `confirmSubscription()` mock a successful Izipay flow. |
| Latency simulation | `delay(400)` |
| Status | ✅ Implemented with `environment.mock.enabled` guard |

**Expected backend shapes:**

`GET /memberships/plans`:
```json
[{
  "id": "plan-oro",
  "name": "Oro",
  "price": 59,
  "validity": "1 mes",
  "discountPercentage": 20,
  "ticketsPerMonth": 4,
  "recommended": true,
  "color": "#F59E0B",
  "benefits": [{ "label": "4 entradas al mes", "description": "..." }]
}]
```

`GET /memberships/me`:
```json
{
  "planId": "plan-oro",
  "planName": "Oro",
  "expiresAt": "2024-05-15",
  "ticketsUsed": 1,
  "ticketsTotal": 4,
  "discountUsed": 22
}
```
Returns `null` (or 404) when user has no active plan.

**Cleanup:** replace all mock blocks with `BACKEND.MEMBERSHIPS.*` HTTP calls.

---

### USER — `UserService` ✅ Implemented

| Field | Value |
|-------|-------|
| File | `src/app/core/services/user.service.ts` |
| Mock data | `src/app/core/mocks/user.mock.ts` — `MOCK_USER_PROFILE` |
| Current behaviour | `getProfile()` returns static demo user. `updateProfile()` merges changes onto mock. `changePassword()` returns success after delay. |
| Latency simulation | `delay(300–500)` |
| Status | ✅ Implemented with `environment.mock.enabled` guard |

**Expected backend shape** (`GET /auth/me`):
```json
{
  "id": "user-123",
  "name": "Usuario Demo",
  "email": "demo@pelisplus.com",
  "avatar": null,
  "membership": null,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**Cleanup:** replace `MOCK_USER_PROFILE` with `BACKEND.AUTH.ME` HTTP call.

---

### ADMIN — all admin services (not yet created)

| Field | Value |
|-------|-------|
| Needed mock | Each admin service returns small static lists (3–5 items) for movies, screenings, rooms, snacks, orders, users |
| Mock files | `src/app/core/mocks/admin-*.mock.ts` |

**Cleanup:** replace all `of(MOCK_*)` calls with `BACKEND.ADMIN.*` HTTP calls.

---

## AuthGuard — fake until backend is ready

| Field | Value |
|-------|-------|
| File | `src/app/core/guards/auth.guard.ts` ✅ created |
| Current mock | Checks if a JWT string exists in `localStorage` at `environment.auth.tokenStorageKey`. If yes → allow. If no → redirect to `/login`. Token itself not validated against backend. |
| Note | Sufficient for frontend dev. Guard only checks presence, not validity. |

**Cleanup:** no code change needed in the guard itself. Once the backend validates JWTs on every API call, invalid/expired tokens will return 401, which the global error interceptor redirects to `/login`.

---

## Global cleanup checklist (run when backend is ready)

- [ ] Set `NG_APP_MOCK_ENABLED=false` in `.env`
- [ ] Go through every `if (environment.mock.enabled)` block and delete it
- [ ] Delete all files in `src/app/core/mocks/`
- [ ] Remove `mock` from `environment.model.ts`, `environment.ts`, and `.env`
- [ ] Follow TMDB → backend migration checklist in `docs/api.md`
- [ ] Run full Playwright e2e suite to verify nothing broke
