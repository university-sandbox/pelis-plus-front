import { type Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';

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

  // ── Public ──────────────────────────────────────────
  {
    path: 'landing',
    loadComponent: () =>
      import('./features/landing/landing-page.component').then((c) => c.LandingPageComponent),
  },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./features/catalog/catalog-page.component').then((c) => c.CatalogPageComponent),
  },

  // ── Admin (protected) ────────────────────────────────
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((r) => r.adminRoutes),
  },

  // ── Catch-all ────────────────────────────────────────
  {
    path: '**',
    redirectTo: '',
  },
];
