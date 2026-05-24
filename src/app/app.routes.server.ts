import { RenderMode, type ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Routes with dynamic params: render on the server per request
  { path: 'movie/:id', renderMode: RenderMode.Server },
  { path: 'seats/:screeningId', renderMode: RenderMode.Client },
  { path: 'confirmation/:id', renderMode: RenderMode.Client },

  // Auth-required routes rely on localStorage tokens, so guard them in the browser.
  { path: 'checkout', renderMode: RenderMode.Client },
  { path: 'profile', renderMode: RenderMode.Client },

  // Admin routes also rely on browser-only auth state.
  { path: 'admin/orders/:id', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },

  // Everything else: prerender
  { path: '**', renderMode: RenderMode.Prerender },
];
