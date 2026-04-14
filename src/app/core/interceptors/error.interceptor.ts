import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

/**
 * Global error interceptor.
 * - 401 from the backend → redirect to /login (session expired or invalid token)
 * - 403 from the backend → redirect to /catalog (forbidden)
 * - Errors from third-party APIs (TMDB, etc.) are re-thrown without redirecting.
 * - All other errors are re-thrown for the caller to handle.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const isBackendRequest = req.url.startsWith(environment.backend.baseUrl);
        if (isBackendRequest) {
          if (error.status === 401) {
            void router.navigateByUrl('/login');
          } else if (error.status === 403) {
            void router.navigateByUrl('/catalog');
          }
        }
      }
      return throwError(() => error);
    }),
  );
};
