import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BACKEND } from '../api/endpoints';
import { type UserProfile } from '../models/user.model';
import { MOCK_USER_PROFILE } from '../mocks/user.mock';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  /** Fetch current user's profile */
  getProfile(): Observable<UserProfile> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of(MOCK_USER_PROFILE).pipe(delay(300));
    }

    return this.http.get<UserProfile>(BACKEND.url(BACKEND.AUTH.ME));
  }

  /** Update name and/or email */
  updateProfile(data: { name: string; email: string }): Observable<UserProfile> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of({ ...MOCK_USER_PROFILE, ...data }).pipe(delay(500));
    }

    return this.http.put<UserProfile>(BACKEND.url(BACKEND.USERS.UPDATE_PROFILE), data);
  }

  /** Change password */
  changePassword(current: string, newPassword: string): Observable<void> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      void current;
      void newPassword;
      return of(undefined).pipe(delay(500));
    }

    return this.http.put<void>(BACKEND.url(BACKEND.USERS.CHANGE_PASSWORD), {
      current,
      newPassword,
    });
  }
}
