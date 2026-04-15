import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BACKEND } from '../api/endpoints';
import { type Snack, type SnackCategory } from '../models/snack.model';
import { MOCK_SNACKS } from '../mocks/snack.mock';

@Injectable({ providedIn: 'root' })
export class SnackService {
  private readonly http = inject(HttpClient);

  /** All snacks, optionally filtered by category */
  getSnacks(category?: SnackCategory): Observable<Snack[]> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      const result = category
        ? MOCK_SNACKS.filter((s) => s.category === category && s.status === 'active')
        : MOCK_SNACKS.filter((s) => s.status === 'active');
      return of(result).pipe(delay(400));
    }

    const url = category
      ? `${BACKEND.url(BACKEND.SNACKS.LIST)}?category=${category}`
      : BACKEND.url(BACKEND.SNACKS.LIST);
    return this.http.get<Snack[]>(url);
  }

  /** All active categories */
  getCategories(): Observable<SnackCategory[]> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      const cats = [...new Set(MOCK_SNACKS.map((s) => s.category))] as SnackCategory[];
      return of(cats).pipe(delay(200));
    }

    return this.http
      .get<string[]>(BACKEND.url(BACKEND.SNACKS.CATEGORIES))
      .pipe(map((c) => c as SnackCategory[]));
  }
}
