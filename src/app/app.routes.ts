import { type Routes } from '@angular/router';
import { environment } from '../environments/environment';

const indexRoute = environment.app.indexPage;

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: indexRoute,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login-page.component').then((c) => c.LoginPageComponent),
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./features/landing/landing-page.component').then((c) => c.LandingPageComponent),
  },
  {
    path: '**',
    redirectTo: indexRoute,
  },
];
