import { RenderMode, type ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Routes with dynamic params: render on the server per request
  { path: 'movie/:id', renderMode: RenderMode.Server },
  { path: 'seats/:screeningId', renderMode: RenderMode.Server },
  { path: 'confirmation/:id', renderMode: RenderMode.Server },

  // Auth-required routes: render on the server (not prerendered, needs auth state)
  { path: 'checkout', renderMode: RenderMode.Server },
  { path: 'profile', renderMode: RenderMode.Server },

  // Admin routes with dynamic params: render on the server
  { path: 'admin/orders/:id', renderMode: RenderMode.Server },
  { path: 'admin/**', renderMode: RenderMode.Server },

  // Everything else: prerender
  { path: '**', renderMode: RenderMode.Prerender },
];
