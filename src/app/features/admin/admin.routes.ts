import { type Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-layout.component').then((c) => c.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'movies' },
      {
        path: 'movies',
        loadComponent: () =>
          import('./movies/admin-movies-page.component').then((c) => c.AdminMoviesPageComponent),
      },
      {
        path: 'screenings',
        loadComponent: () =>
          import('./screenings/admin-screenings-page.component').then(
            (c) => c.AdminScreeningsPageComponent,
          ),
      },
      {
        path: 'rooms',
        loadComponent: () =>
          import('./rooms/admin-rooms-page.component').then((c) => c.AdminRoomsPageComponent),
      },
      {
        path: 'snacks',
        loadComponent: () =>
          import('./snacks/admin-snacks-page.component').then((c) => c.AdminSnacksPageComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./orders/admin-orders-page.component').then((c) => c.AdminOrdersPageComponent),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./orders/admin-order-detail-page.component').then(
            (c) => c.AdminOrderDetailPageComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users/admin-users-page.component').then((c) => c.AdminUsersPageComponent),
      },
    ],
  },
];
