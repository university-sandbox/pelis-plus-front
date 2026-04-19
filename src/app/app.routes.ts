import { type Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ── Root — public catalog ────────────────────────────
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/catalog/catalog-page.component').then((c) => c.CatalogPageComponent),
  },

  // ── Auth ────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login-page.component').then((c) => c.LoginPageComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register-page.component').then((c) => c.RegisterPageComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password-page.component').then(
        (c) => c.ForgotPasswordPageComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password-page.component').then(
        (c) => c.ResetPasswordPageComponent,
      ),
  },

  // ── Public catalog ───────────────────────────────────
  {
    path: 'catalog',
    loadComponent: () =>
      import('./features/catalog/catalog-page.component').then((c) => c.CatalogPageComponent),
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./features/landing/landing-page.component').then((c) => c.LandingPageComponent),
  },

  // ── Movie detail & booking flow ──────────────────────
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/movie/movie-detail-page.component').then(
        (c) => c.MovieDetailPageComponent,
      ),
  },
  {
    path: 'seats/:screeningId',
    loadComponent: () =>
      import('./features/seats/seat-map-page.component').then((c) => c.SeatMapPageComponent),
  },
  {
    path: 'snacks',
    loadComponent: () =>
      import('./features/snacks/snacks-page.component').then((c) => c.SnacksPageComponent),
  },

  // ── Checkout (auth required) ─────────────────────────
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/checkout-page.component').then((c) => c.CheckoutPageComponent),
  },
  {
    path: 'confirmation/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/confirmation-page.component').then(
        (c) => c.ConfirmationPageComponent,
      ),
  },

  // ── User profile (auth required) ─────────────────────
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile-page.component').then((c) => c.ProfilePageComponent),
  },

  // ── Memberships (public) ─────────────────────────────
  {
    path: 'memberships',
    loadComponent: () =>
      import('./features/memberships/memberships-page.component').then(
        (c) => c.MembershipsPageComponent,
      ),
  },

  // ── Admin (protected) ────────────────────────────────
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((r) => r.adminRoutes),
  },

  // ── Catch-all — 404 ─────────────────────────────────
  {
    path: '**',
    loadComponent: () =>
      import('./features/errors/not-found-page.component').then((c) => c.NotFoundPageComponent),
    title: '404 — Página no encontrada',
  },
];
