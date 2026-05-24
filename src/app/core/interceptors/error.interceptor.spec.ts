import { HttpErrorResponse, HttpRequest, type HttpHandlerFn } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  const navigateByUrl = vi.fn();
  const logout = vi.fn();

  beforeEach(() => {
    navigateByUrl.mockReset();
    logout.mockReset();

    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Router, useValue: { navigateByUrl } },
        { provide: AuthService, useValue: { logout } },
      ],
    });
  });

  it('clears the session and redirects to catalog when a backend request returns 401', () => {
    const request = new HttpRequest('GET', `${environment.backend.baseUrl}/auth/me`);
    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 401, url: request.url }));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(request, next).subscribe({ error: () => undefined });
    });

    expect(logout).toHaveBeenCalledOnce();
    expect(navigateByUrl).toHaveBeenCalledWith('/catalog');
  });
});
