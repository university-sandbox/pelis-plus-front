import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * Global error interceptor.
 * - 401 from the backend → clear session and redirect to /catalog (session expired or invalid token)
 * - 403 from the backend → redirect to /catalog (forbidden)
 * - Errors from third-party APIs are re-thrown without redirecting.
 * - All other errors are re-thrown for the caller to handle.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (isPlatformBrowser(platformId) && error instanceof HttpErrorResponse) {
        const isBackendRequest = req.url.startsWith(environment.backend.baseUrl);
        if (isBackendRequest) {
          if (error.status === 401) {
            authService.logout();
            void router.navigateByUrl('/catalog');
          } else if (error.status === 403) {
            void router.navigateByUrl('/catalog');
          }
        }
      }
      return throwError(() => error);
    }),
  );
};
