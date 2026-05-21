/**
 * @file endpoints.ts
 * @description Single source of truth for every API URL used in the application.
 *
 * ## Data source strategy
 *
 * ## Usage in services
 *
 *  import { BACKEND } from '@core/api/endpoints';
 *
 *  const url = BACKEND.url(BACKEND.AUTH.LOGIN);
 */

import { environment } from '../../../environments/environment';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildUrl(base: string, path: string): string {
  return `${base}${path}`;
}

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

  // --- Movies ---
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
