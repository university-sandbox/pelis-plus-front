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

### AUTH — `AuthService.login()`

| Field | Value |
|-------|-------|
| File | `src/app/core/services/auth.service.ts` |
| Mock data | Hardcoded demo credentials from `environment.auth.demoEmail / demoPassword` |
| Current behaviour | Calls real backend at `environment.backend.baseUrl/v1/auth/login`. Fails silently if backend is unreachable. |
| Needed mock | If `email === environment.auth.demoEmail && password === environment.auth.demoPassword` → return `of(FAKE_JWT)`. Otherwise throw `401`. |
| Mock file | `src/app/core/mocks/auth.mock.ts` |

**Cleanup when backend is ready:**
- [ ] Remove the `if (environment.mock.enabled)` guard in `AuthService.login()`
- [ ] Delete `src/app/core/mocks/auth.mock.ts`
- [ ] Remove `NG_APP_MOCK_ENABLED` from `.env`
- [ ] Remove `mock` block from `environment.model.ts` and `environment.ts`

---

### AUTH — `AuthService.register()` / `forgotPassword()` / `resetPassword()`

| Field | Value |
|-------|-------|
| File | `src/app/core/services/auth.service.ts` |
| Current behaviour | Methods do not exist yet |
| Needed mock | `register()` → return `of(FAKE_JWT)` after 600 ms delay. `forgotPassword()` / `resetPassword()` → return `of(void 0)`. |
| Mock file | `src/app/core/mocks/auth.mock.ts` |

**Cleanup when backend is ready:**
- [ ] Replace mock return with real HTTP call in each method
- [ ] Verify response shape matches and update adapter if needed

---

### MOVIES — `MovieService` (entire service, not yet created)

| Field | Value |
|-------|-------|
| File | `src/app/core/services/movie.service.ts` — not yet created |
| Data source | **TMDB** (not mocked — real HTTP calls via `TMDB.*` endpoints) |
| Auth | `TmdbInterceptor` attaches bearer token — not yet created |
| Note | TMDB is the real data source for movies, not a mock. No cleanup needed here beyond the TMDB → backend migration described in `docs/api.md`. |

---

### SCREENINGS — `ScreeningService` (not yet created)

| Field | Value |
|-------|-------|
| Needed mock | Return a static list of 3–4 screenings per movie with varied dates/times/formats |
| Mock file | `src/app/core/mocks/screening.mock.ts` |

**Cleanup:** replace `of(MOCK_SCREENINGS)` with `BACKEND.SCREENINGS.*` HTTP calls.

---

### SEATS — `SeatService` (not yet created)

| Field | Value |
|-------|-------|
| Needed mock | Return a 10×8 seat grid with ~20% occupied seats randomly pre-set |
| Mock file | `src/app/core/mocks/seat.mock.ts` |

**Cleanup:** replace with `BACKEND.SCREENINGS.SEATS(id)` HTTP call.

---

### SNACKS — `SnackService` (not yet created)

| Field | Value |
|-------|-------|
| Needed mock | Return 8–12 static products across 4 categories |
| Mock file | `src/app/core/mocks/snack.mock.ts` |

**Cleanup:** replace with `BACKEND.SNACKS.LIST` HTTP call.

---

### ORDERS — `OrderService` (not yet created)

| Field | Value |
|-------|-------|
| Needed mock | `createOrder()` → return `{ orderId: 'mock-001', formToken: 'FAKE_TOKEN' }`. Izipay sandbox will be used for actual payment UI even in mock mode. |
| Mock file | `src/app/core/mocks/order.mock.ts` |

**Cleanup:** replace with `BACKEND.ORDERS.CREATE` POST call.

---

### MEMBERSHIPS — `MembershipService` (not yet created)

| Field | Value |
|-------|-------|
| Needed mock | Return 3 static plans (Plata, Oro, Black). `getMyPlan()` returns `null` (no active plan). |
| Mock file | `src/app/core/mocks/membership.mock.ts` |

**Cleanup:** replace with `BACKEND.MEMBERSHIPS.*` HTTP calls.

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
| File | `src/app/core/guards/auth.guard.ts` — not yet created |
| Needed mock | Check if a JWT string exists in `localStorage` at `environment.auth.tokenStorageKey`. If yes → allow. If no → redirect to `/login`. The token itself is fake (not validated against a real backend). |
| Note | This is sufficient for frontend dev. The guard only checks presence, not validity. |

**Cleanup:** no code change needed in the guard itself. Once the backend validates JWTs on every API call, invalid/expired tokens will return 401, which the global error interceptor redirects to `/login`.

---

## Global cleanup checklist (run when backend is ready)

- [ ] Set `NG_APP_MOCK_ENABLED=false` in `.env`
- [ ] Go through every `if (environment.mock.enabled)` block and delete it
- [ ] Delete all files in `src/app/core/mocks/`
- [ ] Remove `mock` from `environment.model.ts`, `environment.ts`, and `.env`
- [ ] Follow TMDB → backend migration checklist in `docs/api.md`
- [ ] Run full Playwright e2e suite to verify nothing broke
