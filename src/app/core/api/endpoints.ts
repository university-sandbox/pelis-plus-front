/**
 * @file endpoints.ts
 * @description Single source of truth for every API URL used in the application.
 *
 * ## Data source strategy
 *
 * The app currently uses two data sources in parallel:
 *
 *  - **TMDB** (The Movie Database) — movie catalog, search, genres, videos.
 *    Active now because the real backend is not yet implemented.
 *    Requires `NG_APP_TMDB_ACCESS_TOKEN` in the environment.
 *
 *  - **BACKEND** — auth, screenings, seats, snacks, orders, memberships, admin.
 *    Mocked in services while the backend is being built.
 *    Will become the sole data source once the backend is ready.
 *
 * ## How to migrate from TMDB → backend (when backend is ready)
 *
 *  1. Implement the backend endpoints listed under `BACKEND.MOVIES.*`.
 *  2. Ensure the response shape matches the `Movie` model in `src/app/core/models/movie.model.ts`
 *     (or update the adapter in `MovieService` to transform the new shape).
 *  3. In `MovieService`, replace every `TMDB.MOVIES.*` reference with `BACKEND.MOVIES.*`.
 *  4. Remove the `TmdbInterceptor` from `app.config.ts` (or scope it to TMDB requests only).
 *  5. Delete the `TMDB` block below once fully migrated.
 *
 * ## Usage in services
 *
 *  import { TMDB, BACKEND } from '@core/api/endpoints';
 *
 *  // TMDB (movie catalog — active now)
 *  const url = TMDB.url(TMDB.MOVIES.NOW_PLAYING);
 *
 *  // Backend (auth, orders, etc.)
 *  const url = BACKEND.url(BACKEND.AUTH.LOGIN);
 */

import { environment } from '../../../environments/environment';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildUrl(base: string, path: string): string {
  return `${base}${path}`;
}

// ---------------------------------------------------------------------------
// TMDB — The Movie Database (active during frontend-only phase)
// Docs: https://developer.themoviedb.org/reference/getting-started
//
// ⚠️  Replace usages with BACKEND.MOVIES.* once the real backend is ready.
// ---------------------------------------------------------------------------

export const TMDB = {
  /** Constructs a full TMDB API URL */
  url: (path: string) => buildUrl(environment.tmdb.baseUrl, path),

  /**
   * Constructs a full image URL.
   * @param size - TMDB image size (e.g. 'w500', 'w780', 'original')
   * @param filePath - The `poster_path` or `backdrop_path` field from TMDB response
   */
  imageUrl: (size: TmdbImageSize, filePath: string) =>
    `${environment.tmdb.imageBaseUrl}/${size}${filePath}`,

  // --- Movie catalog ---

  MOVIES: {
    /** GET /movie/now_playing?language=es&page=1&region=PE
     *  → backend equivalent: GET /movies?status=now_playing */
    NOW_PLAYING: '/movie/now_playing',

    /** GET /movie/upcoming?language=es&page=1&region=PE
     *  → backend equivalent: GET /movies?status=upcoming */
    UPCOMING: '/movie/upcoming',

    /** GET /movie/popular?language=es&page=1&region=PE
     *  → backend equivalent: GET /movies?sort=popular */
    POPULAR: '/movie/popular',

    /** GET /movie/{id}?language=es&append_to_response=videos,credits
     *  → backend equivalent: GET /movies/:id */
    DETAIL: (id: number) => `/movie/${id}`,

    /** GET /movie/{id}/videos?language=es
     *  → backend equivalent: included in GET /movies/:id (via append_to_response) */
    VIDEOS: (id: number) => `/movie/${id}/videos`,
  },

  // --- Search ---

  SEARCH: {
    /** GET /search/movie?query=&language=es&page=1
     *  → backend equivalent: GET /movies?search= */
    MOVIES: '/search/movie',
  },

  // --- Genres ---

  GENRES: {
    /** GET /genre/movie/list?language=es
     *  → backend equivalent: GET /movies/genres */
    LIST: '/genre/movie/list',
  },

  // --- Discover (filtered queries) ---

  DISCOVER: {
    /** GET /discover/movie?with_genres=&sort_by=&page=
     *  → backend equivalent: GET /movies?genre=&sort= */
    MOVIES: '/discover/movie',
  },
} as const;

/**
 * TMDB poster/backdrop image sizes.
 * Use 'w342' for cards, 'w780' for detail page, 'original' for hero backdrop.
 */
export type TmdbImageSize =
  | 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'  // poster
  | 'w300' | 'w780' | 'w1280';                                          // backdrop

// ---------------------------------------------------------------------------
// BACKEND — Pelis Plus API
// Mocked in services now; will be the real endpoints once backend is live.
// ---------------------------------------------------------------------------

export const BACKEND = {
  /** Constructs a full backend API URL */
  url: (path: string) => buildUrl(environment.backend.baseUrl, path),

  // --- Auth ---
  AUTH: {
    /** POST /auth/login → { token } */
    LOGIN: '/auth/login',
    /** POST /auth/register → { token } */
    REGISTER: '/auth/register',
    /** POST /auth/logout */
    LOGOUT: '/auth/logout',
    /** POST /auth/forgot-password → sends email */
    FORGOT_PASSWORD: '/auth/forgot-password',
    /** POST /auth/reset-password → { token, newPassword } */
    RESET_PASSWORD: '/auth/reset-password',
    /** GET /auth/me → current user profile */
    ME: '/auth/me',
  },

  // --- Movies (backend version — mirrors TMDB shape but served from our DB) ---
  MOVIES: {
    /** GET /movies?genre=&format=&search=&status=&page= */
    LIST: '/movies',
    /** GET /movies/:id */
    DETAIL: (id: number | string) => `/movies/${id}`,
    /** GET /movies/:id/screenings?venueId=&date=&format= */
    SCREENINGS: (id: number | string) => `/movies/${id}/screenings`,
    /** GET /movies/genres */
    GENRES: '/movies/genres',
  },

  // --- Venues & Rooms ---
  VENUES: {
    /** GET /venues */
    LIST: '/venues',
    /** GET /venues/:id/rooms */
    ROOMS: (venueId: number | string) => `/venues/${venueId}/rooms`,
  },

  // --- Screenings ---
  SCREENINGS: {
    /** GET /screenings/:id */
    DETAIL: (id: number | string) => `/screenings/${id}`,
    /** GET /screenings/:id/seats */
    SEATS: (id: number | string) => `/screenings/${id}/seats`,
    /** POST /screenings/:id/seats/reserve → { expiresAt } */
    RESERVE_SEATS: (id: number | string) => `/screenings/${id}/seats/reserve`,
    /** DELETE /screenings/:id/seats/reserve */
    RELEASE_SEATS: (id: number | string) => `/screenings/${id}/seats/reserve`,
  },

  // --- Snacks ---
  SNACKS: {
    /** GET /snacks?category= */
    LIST: '/snacks',
    /** GET /snacks/categories */
    CATEGORIES: '/snacks/categories',
  },

  // --- Orders & Checkout ---
  ORDERS: {
    /** POST /orders → { orderId, formToken } (Izipay formToken) */
    CREATE: '/orders',
    /** POST /orders/:id/confirm → { order } (verify Izipay paymentResult server-side) */
    CONFIRM: (id: number | string) => `/orders/${id}/confirm`,
    /** GET /orders/:id */
    DETAIL: (id: number | string) => `/orders/${id}`,
    /** GET /orders/me */
    MY_ORDERS: '/orders/me',
  },

  // --- Tickets ---
  TICKETS: {
    /** GET /tickets/me */
    MY_TICKETS: '/tickets/me',
    /** GET /tickets/:id */
    DETAIL: (id: number | string) => `/tickets/${id}`,
  },

  // --- Memberships ---
  MEMBERSHIPS: {
    /** GET /memberships/plans */
    PLANS: '/memberships/plans',
    /** GET /memberships/me */
    MY_PLAN: '/memberships/me',
    /** GET /memberships/me/benefits */
    MY_BENEFITS: '/memberships/me/benefits',
    /** POST /memberships/subscribe → { orderId, formToken } */
    SUBSCRIBE: '/memberships/subscribe',
    /** POST /memberships/me/confirm */
    CONFIRM: '/memberships/me/confirm',
    /** PATCH /memberships/me/cancel */
    CANCEL: '/memberships/me/cancel',
  },

  // --- User profile ---
  USERS: {
    /** PUT /users/me */
    UPDATE_PROFILE: '/users/me',
    /** PUT /users/me/password */
    CHANGE_PASSWORD: '/users/me/password',
  },

  // --- Admin ---
  ADMIN: {
    MOVIES: {
      /** GET /admin/movies */
      LIST: '/admin/movies',
      /** POST /admin/movies */
      CREATE: '/admin/movies',
      /** PUT /admin/movies/:id */
      UPDATE: (id: number | string) => `/admin/movies/${id}`,
      /** PATCH /admin/movies/:id/status */
      TOGGLE_STATUS: (id: number | string) => `/admin/movies/${id}/status`,
    },
    ROOMS: {
      /** GET /admin/rooms */
      LIST: '/admin/rooms',
      /** POST /admin/rooms */
      CREATE: '/admin/rooms',
      /** PUT /admin/rooms/:id */
      UPDATE: (id: number | string) => `/admin/rooms/${id}`,
      /** PATCH /admin/rooms/:id/status */
      TOGGLE_STATUS: (id: number | string) => `/admin/rooms/${id}/status`,
    },
    SCREENINGS: {
      /** GET /admin/screenings?date=&status=&movieId= */
      LIST: '/admin/screenings',
      /** POST /admin/screenings */
      CREATE: '/admin/screenings',
      /** PUT /admin/screenings/:id */
      UPDATE: (id: number | string) => `/admin/screenings/${id}`,
      /** PATCH /admin/screenings/:id/cancel */
      CANCEL: (id: number | string) => `/admin/screenings/${id}/cancel`,
    },
    SNACKS: {
      /** GET /admin/snacks */
      LIST: '/admin/snacks',
      /** POST /admin/snacks */
      CREATE: '/admin/snacks',
      /** PUT /admin/snacks/:id */
      UPDATE: (id: number | string) => `/admin/snacks/${id}`,
      /** PATCH /admin/snacks/:id/status */
      TOGGLE_STATUS: (id: number | string) => `/admin/snacks/${id}/status`,
    },
    ORDERS: {
      /** GET /admin/orders?date=&status=&movieId= */
      LIST: '/admin/orders',
      /** GET /admin/orders/:id */
      DETAIL: (id: number | string) => `/admin/orders/${id}`,
    },
    USERS: {
      /** GET /admin/users */
      LIST: '/admin/users',
      /** GET /admin/users/:id */
      DETAIL: (id: number | string) => `/admin/users/${id}`,
      /** PATCH /admin/users/:id/status */
      TOGGLE_STATUS: (id: number | string) => `/admin/users/${id}/status`,
    },
  },
} as const;
