import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly token = signal(this.storage.getToken());

  readonly isAuthenticated = computed(() => this.token() !== null);

  login(email: string, password: string): Observable<boolean> {
    const loginUrl = `${environment.backend.baseUrl}/v1/auth/login`;
    return this.httpClient.post<LoginResponse>(loginUrl, { email, password }).pipe(
      map((response) => getTokenFromResponse(response)),
      tap((jwtToken) => {
        this.storage.setToken(jwtToken);
        this.token.set(jwtToken);
      }),
      map(() => true),
    );
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
