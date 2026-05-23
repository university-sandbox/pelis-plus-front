import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import type { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { BACKEND } from '../api/endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly token = signal(this.storage.getToken());

  readonly isAuthenticated = computed(() => this.token() !== null);
  readonly currentRole = computed(() => getRoleFromToken(this.token()));
  readonly isAdmin = computed(() => this.currentRole() === 'admin');
  readonly isClient = computed(() => this.isAuthenticated() && !this.isAdmin());

  login(email: string, password: string): Observable<boolean> {
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
    return this.httpClient
      .post<void>(BACKEND.url(BACKEND.AUTH.FORGOT_PASSWORD), { email })
      .pipe(map(() => undefined));
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
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

interface JwtPayload {
  role?: unknown;
  roles?: unknown;
  authorities?: unknown;
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

function getRoleFromToken(token: string | null): 'admin' | 'client' | null {
  if (!token) {
    return null;
  }

  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) {
      return null;
    }

    const payload = JSON.parse(decodeBase64Url(payloadPart)) as JwtPayload;
    const roles = [
      payload.role,
      ...(Array.isArray(payload.roles) ? payload.roles : []),
      ...(Array.isArray(payload.authorities) ? payload.authorities : []),
    ];

    const normalizedRoles = roles
      .filter((role): role is string => typeof role === 'string')
      .map((role) => role.toLowerCase());

    if (normalizedRoles.some((role) => role === 'admin' || role === 'role_admin')) {
      return 'admin';
    }

    if (normalizedRoles.some((role) => role === 'client' || role === 'role_client' || role === 'user')) {
      return 'client';
    }

    return 'client';
  } catch {
    return null;
  }
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), '=');
  return atob(padded);
}
