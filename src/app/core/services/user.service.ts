import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import { type UserProfile } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  /** Fetch current user's profile */
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(BACKEND.url(BACKEND.AUTH.ME));
  }

  /** Update name and/or email */
  updateProfile(data: { name: string; email: string }): Observable<UserProfile> {
    return this.http.put<UserProfile>(BACKEND.url(BACKEND.USERS.UPDATE_PROFILE), data);
  }

  /** Change password */
  changePassword(current: string, newPassword: string): Observable<void> {
    return this.http.put<void>(BACKEND.url(BACKEND.USERS.CHANGE_PASSWORD), {
      currentPassword: current,
      newPassword,
    });
  }
}
