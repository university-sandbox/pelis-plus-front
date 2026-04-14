import { type Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-layout.component').then((c) => c.AdminLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'movies',
      },
      {
        path: 'movies',
        loadComponent: () =>
          import('./movies/admin-movies-page.component').then(
            (c) => c.AdminMoviesPageComponent,
          ),
      },
    ],
  },
];
