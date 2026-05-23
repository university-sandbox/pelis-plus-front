import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const clientGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  if (authService.isClient()) {
    return true;
  }

  return router.parseUrl('/catalog');
};
