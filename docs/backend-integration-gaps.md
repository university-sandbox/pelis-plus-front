# Backend Integration Gaps

The frontend no longer contains mock services or mock data files. Every service now calls the Pelis Plus backend through `BACKEND` endpoints.

## Connected Frontend Areas

| Frontend area | Backend endpoints used |
| --- | --- |
| Auth | `POST /auth/login`, `POST /auth/register`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `GET /auth/me` |
| Movies | `GET /movies`, `GET /movies/{id}`, `GET /movies/genres`, `GET /movies/{id}/screenings` |
| Venues and screenings | `GET /venues`, `GET /screenings/{id}` |
| Seats | `GET /screenings/{screeningId}/seats`, `POST /screenings/{screeningId}/seats/reserve`, `DELETE /screenings/{screeningId}/seats/reserve` |
| Snacks | `GET /snacks`, `GET /snacks/categories` |
| Orders | `POST /orders`, `POST /orders/{id}/confirm`, `GET /orders/{id}`, `GET /orders/me` |
| Tickets | `GET /tickets/me`, `GET /tickets/{id}` |
| Memberships | `GET /memberships/plans`, `GET /memberships/me`, `POST /memberships/subscribe`, `POST /memberships/me/confirm`, `PATCH /memberships/me/cancel` |
| Profile | `PUT /users/me`, `PUT /users/me/password` |
| Admin | `/admin/movies`, `/admin/screenings`, `/admin/rooms`, `/admin/snacks`, `/admin/orders`, `/admin/users` |

## Missing Or Incomplete Backend Work

| Gap | Current backend behavior | Needed backend behavior |
| --- | --- | --- |
| Real Izipay order payment | `OrderService.createOrder()` returns a generated `MOCK_IZIPAY_*` token and `confirmOrder()` approves any payload. | Generate a real Izipay form token, validate the payment callback/result server-side, and only approve paid orders. |
| Real Izipay membership payment | `MembershipService.subscribe()` returns a generated `MOCK_IZIPAY_MEMBERSHIP_*` token and `confirmSubscription()` only needs `planId`. | Generate a real membership payment token and confirm membership only after verified payment. |
| Password recovery | `/auth/forgot-password` and `/auth/reset-password` return `204` without creating reset tokens, sending email, or changing passwords. | Persist reset tokens, send recovery email, validate token expiry, and update the password. |
| Movie image ownership | Backend returns `posterPath` and `backdropPath` values that are currently external relative paths. Frontend normalizes them in `core/api/media-url.ts`. | Prefer returning absolute image URLs or backend-hosted asset URLs so the frontend does not need external image-source assumptions. |
| Movie trailers/videos | Frontend can display a YouTube trailer key if present on the movie object, but `MovieDto` has no trailer/video payload. | Add trailer/video metadata to `GET /movies/{id}` if trailers should remain in the movie detail page. |

## Frontend Notes

- `NG_APP_MOCK_ENABLED` and all mock data files were removed.
- Movie catalog data now comes from `GET /movies` instead of an external movie API.
- The checkout and membership pages still confirm immediately after receiving a backend token because the backend does not yet provide a real payment redirect/callback flow.
