import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { BACKEND } from '../api/endpoints';
import { MOCK_JWT } from '../mocks/auth.mock';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly token = signal(this.storage.getToken());

  readonly isAuthenticated = computed(() => this.token() !== null);
  readonly isAdmin = computed(() => {
    const t = this.token();
    if (!t) return false;
    try {
      const payload = JSON.parse(atob(t.split('.')[1])) as { role?: string };
      return payload.role === 'admin';
    } catch {
      return false;
    }
  });

  login(email: string, password: string): Observable<boolean> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      if (
        email === environment.auth.demoEmail &&
        password === environment.auth.demoPassword
      ) {
        return of(MOCK_JWT).pipe(
          delay(600),
          tap((jwt) => {
            this.storage.setToken(jwt);
            this.token.set(jwt);
          }),
          map(() => true),
        );
      }
      return of(null).pipe(
        delay(600),
        map(() => {
          throw { status: 401 };
        }),
      );
    }

    return this.httpClient
      .post<LoginResponse>(BACKEND.url(BACKEND.AUTH.LOGIN), { email, password })
      .pipe(
        map((response) => getTokenFromResponse(response)),
        tap((jwtToken) => {
          this.storage.setToken(jwtToken);
          this.token.set(jwtToken);
        }),
        map(() => true),
      );
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of(MOCK_JWT).pipe(
        delay(800),
        tap((jwt) => {
          this.storage.setToken(jwt);
          this.token.set(jwt);
        }),
        map(() => true),
      );
    }

    return this.httpClient
      .post<LoginResponse>(BACKEND.url(BACKEND.AUTH.REGISTER), { name, email, password })
      .pipe(
        map((response) => getTokenFromResponse(response)),
        tap((jwtToken) => {
          this.storage.setToken(jwtToken);
          this.token.set(jwtToken);
        }),
        map(() => true),
      );
  }

  forgotPassword(email: string): Observable<void> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      void email;
      return of(undefined).pipe(delay(600));
    }

    return this.httpClient
      .post<void>(BACKEND.url(BACKEND.AUTH.FORGOT_PASSWORD), { email })
      .pipe(map(() => undefined));
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      void token;
      void newPassword;
      return of(undefined).pipe(delay(600));
    }

    return this.httpClient
      .post<void>(BACKEND.url(BACKEND.AUTH.RESET_PASSWORD), { token, newPassword })
      .pipe(map(() => undefined));
  }

  logout(): void {
    this.storage.clearToken();
    this.token.set(null);
  }
}

@Injectable({
  providedIn: 'root',
})
class StorageService {
  private readonly platformId = inject(PLATFORM_ID);

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem(environment.auth.tokenStorageKey);
  }

  setToken(token: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(environment.auth.tokenStorageKey, token);
  }

  clearToken(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(environment.auth.tokenStorageKey);
  }
}

interface LoginResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  data?: {
    token?: string;
    accessToken?: string;
    jwt?: string;
  };
}

function getTokenFromResponse(response: LoginResponse): string {
  const token = response.token ?? response.accessToken ?? response.jwt;
  const nestedToken = response.data?.token ?? response.data?.accessToken ?? response.data?.jwt;
  const resolvedToken = token ?? nestedToken;

  if (!resolvedToken) {
    throw new Error('Login response does not include a JWT token.');
  }

  return resolvedToken;
}
