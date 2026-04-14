import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Global error interceptor.
 * - 401 → redirect to /login (session expired or invalid token)
 * - 403 → redirect to /catalog (forbidden)
 * - All other errors are re-thrown for the caller to handle.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          void router.navigateByUrl('/login');
        } else if (error.status === 403) {
          void router.navigateByUrl('/catalog');
        }
      }
      return throwError(() => error);
    }),
  );
};
