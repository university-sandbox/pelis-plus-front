# API Reference — Pelis Plus Frontend

The frontend now uses the Pelis Plus backend as its only data API. URL constants live in `src/app/core/api/endpoints.ts`; services should import `BACKEND` from that file instead of hardcoding API URLs.

## Environment

```env
NG_APP_BACKEND_BASE_URL=http://127.0.0.1:8080/api
```

## Backend Endpoints Used By The Frontend

### Auth

| Constant | Method | Path |
| --- | --- | --- |
| `BACKEND.AUTH.LOGIN` | POST | `/auth/login` |
| `BACKEND.AUTH.REGISTER` | POST | `/auth/register` |
| `BACKEND.AUTH.LOGOUT` | POST | `/auth/logout` |
| `BACKEND.AUTH.FORGOT_PASSWORD` | POST | `/auth/forgot-password` |
| `BACKEND.AUTH.RESET_PASSWORD` | POST | `/auth/reset-password` |
| `BACKEND.AUTH.ME` | GET | `/auth/me` |

### Movies

| Constant | Method | Path |
| --- | --- | --- |
| `BACKEND.MOVIES.LIST` | GET | `/movies?status=&genre=&search=&page=` |
| `BACKEND.MOVIES.DETAIL(id)` | GET | `/movies/{id}` |
| `BACKEND.MOVIES.SCREENINGS(id)` | GET | `/movies/{id}/screenings?venueId=&date=&format=` |
| `BACKEND.MOVIES.GENRES` | GET | `/movies/genres` |

### Venues, Screenings, And Seats

| Constant | Method | Path |
| --- | --- | --- |
| `BACKEND.VENUES.LIST` | GET | `/venues` |
| `BACKEND.VENUES.ROOMS(venueId)` | GET | `/venues/{venueId}/rooms` |
| `BACKEND.SCREENINGS.DETAIL(id)` | GET | `/screenings/{id}` |
| `BACKEND.SCREENINGS.SEATS(id)` | GET | `/screenings/{id}/seats` |
| `BACKEND.SCREENINGS.RESERVE_SEATS(id)` | POST | `/screenings/{id}/seats/reserve` |
| `BACKEND.SCREENINGS.RELEASE_SEATS(id)` | DELETE | `/screenings/{id}/seats/reserve` |

### Snacks

| Constant | Method | Path |
| --- | --- | --- |
| `BACKEND.SNACKS.LIST` | GET | `/snacks?category=` |
| `BACKEND.SNACKS.CATEGORIES` | GET | `/snacks/categories` |

### Orders And Tickets

| Constant | Method | Path |
| --- | --- | --- |
| `BACKEND.ORDERS.CREATE` | POST | `/orders` |
| `BACKEND.ORDERS.CONFIRM(id)` | POST | `/orders/{id}/confirm` |
| `BACKEND.ORDERS.DETAIL(id)` | GET | `/orders/{id}` |
| `BACKEND.ORDERS.MY_ORDERS` | GET | `/orders/me` |
| `BACKEND.TICKETS.MY_TICKETS` | GET | `/tickets/me` |
| `BACKEND.TICKETS.DETAIL(id)` | GET | `/tickets/{id}` |

### Memberships

| Constant | Method | Path |
| --- | --- | --- |
| `BACKEND.MEMBERSHIPS.PLANS` | GET | `/memberships/plans` |
| `BACKEND.MEMBERSHIPS.MY_PLAN` | GET | `/memberships/me` |
| `BACKEND.MEMBERSHIPS.MY_BENEFITS` | GET | `/memberships/me/benefits` |
| `BACKEND.MEMBERSHIPS.SUBSCRIBE` | POST | `/memberships/subscribe` |
| `BACKEND.MEMBERSHIPS.CONFIRM` | POST | `/memberships/me/confirm` |
| `BACKEND.MEMBERSHIPS.CANCEL` | PATCH | `/memberships/me/cancel` |

### User Profile

| Constant | Method | Path |
| --- | --- | --- |
| `BACKEND.USERS.UPDATE_PROFILE` | PUT | `/users/me` |
| `BACKEND.USERS.CHANGE_PASSWORD` | PUT | `/users/me/password` |

### Admin

| Constant group | Paths |
| --- | --- |
| `BACKEND.ADMIN.MOVIES` | `/admin/movies`, `/admin/movies/{id}`, `/admin/movies/{id}/status` |
| `BACKEND.ADMIN.ROOMS` | `/admin/rooms`, `/admin/rooms/{id}`, `/admin/rooms/{id}/status` |
| `BACKEND.ADMIN.SCREENINGS` | `/admin/screenings`, `/admin/screenings/{id}`, `/admin/screenings/{id}/cancel` |
| `BACKEND.ADMIN.SNACKS` | `/admin/snacks`, `/admin/snacks/{id}`, `/admin/snacks/{id}/status` |
| `BACKEND.ADMIN.ORDERS` | `/admin/orders`, `/admin/orders/{id}` |
| `BACKEND.ADMIN.USERS` | `/admin/users`, `/admin/users/{id}`, `/admin/users/{id}/status` |

## Gaps

Backend behavior that is still incomplete is tracked in `docs/backend-integration-gaps.md`.
