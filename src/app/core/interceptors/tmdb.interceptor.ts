import { type HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../../../environments/environment';

/**
 * Attaches the TMDB Bearer token to every request whose URL starts with
 * environment.tmdb.baseUrl. Services must NOT add auth headers manually
 * for TMDB requests.
 */
export const tmdbInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.tmdb.baseUrl)) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${environment.tmdb.accessToken}`,
    },
  });

  return next(authReq);
};
