# API Reference — Pelis Plus

This file documents every external data source the frontend talks to.
The single source of truth for all URLs is **`src/app/core/api/endpoints.ts`**.
Never hardcode a URL anywhere else — import from that file.

---

## Data Source Strategy

The app uses two data sources in parallel:

| Domain | Source now | Source after backend |
|--------|-----------|---------------------|
| Movie catalog, search, genres, videos | **TMDB API** | Pelis Plus backend |
| Auth, screenings, seats, snacks, orders, memberships, admin | **Mock data in services** | Pelis Plus backend |

When the backend is ready, the migration is intentionally minimal:
1. Replace `TMDB.MOVIES.*` references in `MovieService` with `BACKEND.MOVIES.*`.
2. Update the response adapter in `MovieService` if the backend shape differs from TMDB's.
3. Remove the `TmdbInterceptor` from `app.config.ts`.
4. Everything else (auth, orders, etc.) already points to `BACKEND.*` — just remove the mock return and uncomment the real HTTP call.

---

## Environment variables required

Add these to your `.env` file:

```bash
# Pelis Plus backend (mocked until backend is ready — must still be a valid URL)
NG_APP_BACKEND_BASE_URL=http://localhost:3000

# TMDB (active data source for movie catalog)
NG_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
NG_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NG_APP_TMDB_ACCESS_TOKEN=your_tmdb_bearer_token_here
```

Get your TMDB access token at: https://www.themoviedb.org/settings/api

---

## TMDB API (active — movie catalog)

Base URL: `https://api.themoviedb.org/3`
Auth: `Authorization: Bearer <NG_APP_TMDB_ACCESS_TOKEN>` — injected by `TmdbInterceptor`.
Docs: https://developer.themoviedb.org/reference/getting-started

### Interceptor

`TmdbInterceptor` (`src/app/core/interceptors/tmdb.interceptor.ts`) intercepts every
request whose URL starts with `environment.tmdb.baseUrl` and attaches the bearer token.
No service needs to handle auth headers manually for TMDB.

### Image URLs

```
TMDB.imageUrl(size, filePath)
// e.g. TMDB.imageUrl('w342', movie.poster_path)
// → https://image.tmdb.org/t/p/w342/abc123.jpg
```

| Size token | Use case |
|-----------|----------|
| `w185` | Thumbnail |
| `w342` | Movie card (catalog, rows) |
| `w500` | Movie card (large / hover) |
| `w780` | Detail page poster |
| `w1280` | Hero backdrop |
| `original` | Download, print |

### Movie endpoints

| Constant | Method | TMDB path | Query params | Backend equivalent |
|----------|--------|-----------|--------------|--------------------|
| `TMDB.MOVIES.NOW_PLAYING` | GET | `/movie/now_playing` | `language`, `page`, `region` | `BACKEND.MOVIES.LIST?status=now_playing` |
| `TMDB.MOVIES.UPCOMING` | GET | `/movie/upcoming` | `language`, `page`, `region` | `BACKEND.MOVIES.LIST?status=upcoming` |
| `TMDB.MOVIES.POPULAR` | GET | `/movie/popular` | `language`, `page`, `region` | `BACKEND.MOVIES.LIST?sort=popular` |
| `TMDB.MOVIES.DETAIL(id)` | GET | `/movie/{id}` | `language`, `append_to_response` | `BACKEND.MOVIES.DETAIL(id)` |
| `TMDB.MOVIES.VIDEOS(id)` | GET | `/movie/{id}/videos` | `language` | included in `BACKEND.MOVIES.DETAIL(id)` |

### Search

| Constant | Method | TMDB path | Query params | Backend equivalent |
|----------|--------|-----------|--------------|--------------------|
| `TMDB.SEARCH.MOVIES` | GET | `/search/movie` | `query` *(required)*, `language`, `page` | `BACKEND.MOVIES.LIST?search=` |

### Genres

| Constant | Method | TMDB path | Query params | Backend equivalent |
|----------|--------|-----------|--------------|--------------------|
| `TMDB.GENRES.LIST` | GET | `/genre/movie/list` | `language` | `BACKEND.MOVIES.GENRES` |

### Discover (filtered queries)

| Constant | Method | TMDB path | Key query params | Backend equivalent |
|----------|--------|-----------|------------------|--------------------|
| `TMDB.DISCOVER.MOVIES` | GET | `/discover/movie` | `with_genres`, `sort_by`, `page`, `primary_release_year`, `vote_average.gte` | `BACKEND.MOVIES.LIST?genre=&sort=` |

### TMDB response shape → internal `Movie` model mapping

```
TMDB field           → App model field
─────────────────────────────────────────
id                   → id
title                → title
overview             → synopsis
poster_path          → posterPath   (use TMDB.imageUrl('w342', value))
backdrop_path        → backdropPath (use TMDB.imageUrl('w1280', value))
genre_ids            → genreIds     (resolve names via TMDB.GENRES.LIST)
vote_average         → rating
release_date         → releaseDate
original_language    → language
runtime              → duration     (only in DETAIL response)
videos.results[]     → trailers     (filter by type === 'Trailer', site === 'YouTube')
```

Adapter lives in `MovieService`. When migrating to backend, update only this adapter.

---

## Pelis Plus Backend (mocked — will be real endpoints)

Base URL: `environment.backend.baseUrl`
Auth: `Authorization: Bearer <jwt>` — injected globally by `AuthInterceptor`.

### Auth

| Constant | Method | Path | Body / Params | Response |
|----------|--------|------|---------------|----------|
| `BACKEND.AUTH.LOGIN` | POST | `/auth/login` | `{ email, password }` | `{ token }` |
| `BACKEND.AUTH.REGISTER` | POST | `/auth/register` | `{ name, email, password }` | `{ token }` |
| `BACKEND.AUTH.LOGOUT` | POST | `/auth/logout` | — | `204` |
| `BACKEND.AUTH.FORGOT_PASSWORD` | POST | `/auth/forgot-password` | `{ email }` | `204` |
| `BACKEND.AUTH.RESET_PASSWORD` | POST | `/auth/reset-password` | `{ token, newPassword }` | `204` |
| `BACKEND.AUTH.ME` | GET | `/auth/me` | — | `User` |

### Movies (backend version)

| Constant | Method | Path | Params | Response |
|----------|--------|------|--------|----------|
| `BACKEND.MOVIES.LIST` | GET | `/movies` | `?genre=&format=&search=&status=&page=` | `PaginatedList<Movie>` |
| `BACKEND.MOVIES.DETAIL(id)` | GET | `/movies/:id` | — | `Movie` |
| `BACKEND.MOVIES.SCREENINGS(id)` | GET | `/movies/:id/screenings` | `?venueId=&date=&format=` | `Screening[]` |
| `BACKEND.MOVIES.GENRES` | GET | `/movies/genres` | — | `Genre[]` |

### Venues & Rooms

| Constant | Method | Path | Response |
|----------|--------|------|----------|
| `BACKEND.VENUES.LIST` | GET | `/venues` | `Venue[]` |
| `BACKEND.VENUES.ROOMS(venueId)` | GET | `/venues/:id/rooms` | `Room[]` |

### Screenings

| Constant | Method | Path | Body / Params | Response |
|----------|--------|------|---------------|----------|
| `BACKEND.SCREENINGS.DETAIL(id)` | GET | `/screenings/:id` | — | `Screening` |
| `BACKEND.SCREENINGS.SEATS(id)` | GET | `/screenings/:id/seats` | — | `SeatMap` |
| `BACKEND.SCREENINGS.RESERVE_SEATS(id)` | POST | `/screenings/:id/seats/reserve` | `{ seatIds[] }` | `{ expiresAt }` |
| `BACKEND.SCREENINGS.RELEASE_SEATS(id)` | DELETE | `/screenings/:id/seats/reserve` | — | `204` |

### Snacks

| Constant | Method | Path | Params | Response |
|----------|--------|------|--------|----------|
| `BACKEND.SNACKS.LIST` | GET | `/snacks` | `?category=` | `Snack[]` |
| `BACKEND.SNACKS.CATEGORIES` | GET | `/snacks/categories` | — | `string[]` |

### Orders & Checkout

| Constant | Method | Path | Body | Response |
|----------|--------|------|------|----------|
| `BACKEND.ORDERS.CREATE` | POST | `/orders` | `CartPayload` | `{ orderId, formToken }` |
| `BACKEND.ORDERS.CONFIRM(id)` | POST | `/orders/:id/confirm` | `{ paymentResult }` | `Order` |
| `BACKEND.ORDERS.DETAIL(id)` | GET | `/orders/:id` | — | `Order` |
| `BACKEND.ORDERS.MY_ORDERS` | GET | `/orders/me` | — | `Order[]` |

### Tickets

| Constant | Method | Path | Response |
|----------|--------|------|----------|
| `BACKEND.TICKETS.MY_TICKETS` | GET | `/tickets/me` | `Ticket[]` |
| `BACKEND.TICKETS.DETAIL(id)` | GET | `/tickets/:id` | `Ticket` |

### Memberships

| Constant | Method | Path | Body | Response |
|----------|--------|------|------|----------|
| `BACKEND.MEMBERSHIPS.PLANS` | GET | `/memberships/plans` | — | `Plan[]` |
| `BACKEND.MEMBERSHIPS.MY_PLAN` | GET | `/memberships/me` | — | `ActiveMembership` |
| `BACKEND.MEMBERSHIPS.MY_BENEFITS` | GET | `/memberships/me/benefits` | — | `Benefit[]` |
| `BACKEND.MEMBERSHIPS.SUBSCRIBE` | POST | `/memberships/subscribe` | `{ planId }` | `{ orderId, formToken }` |
| `BACKEND.MEMBERSHIPS.CONFIRM` | POST | `/memberships/me/confirm` | `{ paymentResult }` | `ActiveMembership` |
| `BACKEND.MEMBERSHIPS.CANCEL` | PATCH | `/memberships/me/cancel` | — | `204` |

### User Profile

| Constant | Method | Path | Body | Response |
|----------|--------|------|------|----------|
| `BACKEND.USERS.UPDATE_PROFILE` | PUT | `/users/me` | `{ name, email }` | `User` |
| `BACKEND.USERS.CHANGE_PASSWORD` | PUT | `/users/me/password` | `{ current, newPassword }` | `204` |

### Admin

All admin routes are protected by `AdminGuard` client-side and validated server-side.

#### Movies

| Constant | Method | Path |
|----------|--------|------|
| `BACKEND.ADMIN.MOVIES.LIST` | GET | `/admin/movies` |
| `BACKEND.ADMIN.MOVIES.CREATE` | POST | `/admin/movies` |
| `BACKEND.ADMIN.MOVIES.UPDATE(id)` | PUT | `/admin/movies/:id` |
| `BACKEND.ADMIN.MOVIES.TOGGLE_STATUS(id)` | PATCH | `/admin/movies/:id/status` |

#### Rooms

| Constant | Method | Path |
|----------|--------|------|
| `BACKEND.ADMIN.ROOMS.LIST` | GET | `/admin/rooms` |
| `BACKEND.ADMIN.ROOMS.CREATE` | POST | `/admin/rooms` |
| `BACKEND.ADMIN.ROOMS.UPDATE(id)` | PUT | `/admin/rooms/:id` |
| `BACKEND.ADMIN.ROOMS.TOGGLE_STATUS(id)` | PATCH | `/admin/rooms/:id/status` |

#### Screenings

| Constant | Method | Path |
|----------|--------|------|
| `BACKEND.ADMIN.SCREENINGS.LIST` | GET | `/admin/screenings` |
| `BACKEND.ADMIN.SCREENINGS.CREATE` | POST | `/admin/screenings` |
| `BACKEND.ADMIN.SCREENINGS.UPDATE(id)` | PUT | `/admin/screenings/:id` |
| `BACKEND.ADMIN.SCREENINGS.CANCEL(id)` | PATCH | `/admin/screenings/:id/cancel` |

#### Snacks

| Constant | Method | Path |
|----------|--------|------|
| `BACKEND.ADMIN.SNACKS.LIST` | GET | `/admin/snacks` |
| `BACKEND.ADMIN.SNACKS.CREATE` | POST | `/admin/snacks` |
| `BACKEND.ADMIN.SNACKS.UPDATE(id)` | PUT | `/admin/snacks/:id` |
| `BACKEND.ADMIN.SNACKS.TOGGLE_STATUS(id)` | PATCH | `/admin/snacks/:id/status` |

#### Orders

| Constant | Method | Path |
|----------|--------|------|
| `BACKEND.ADMIN.ORDERS.LIST` | GET | `/admin/orders` |
| `BACKEND.ADMIN.ORDERS.DETAIL(id)` | GET | `/admin/orders/:id` |

#### Users

| Constant | Method | Path |
|----------|--------|------|
| `BACKEND.ADMIN.USERS.LIST` | GET | `/admin/users` |
| `BACKEND.ADMIN.USERS.DETAIL(id)` | GET | `/admin/users/:id` |
| `BACKEND.ADMIN.USERS.TOGGLE_STATUS(id)` | PATCH | `/admin/users/:id/status` |

---

## Migration checklist (TMDB → backend)

When the backend is implemented, complete these steps in order:

- [ ] Backend implements `GET /movies` with same query params as documented above
- [ ] Backend implements `GET /movies/:id` including a `videos` array (trailers)
- [ ] Verify backend response matches `Movie` model or update `MovieService` adapter
- [ ] Replace `TMDB.MOVIES.*` with `BACKEND.MOVIES.*` in `MovieService`
- [ ] Replace `TMDB.SEARCH.MOVIES` with `BACKEND.MOVIES.LIST?search=` in `MovieService`
- [ ] Replace `TMDB.GENRES.LIST` with `BACKEND.MOVIES.GENRES` in `GenreService`
- [ ] Replace `TMDB.DISCOVER.MOVIES` with `BACKEND.MOVIES.LIST` in `MovieService`
- [ ] Remove `TmdbInterceptor` from `app.config.ts`
- [ ] Remove `TMDB` block from `endpoints.ts`
- [ ] Remove `tmdb` block from `environment.model.ts` and `environment.ts`
- [ ] Remove `NG_APP_TMDB_*` vars from `.env`
