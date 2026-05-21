import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import { type Snack, type SnackCategory } from '../models/snack.model';

@Injectable({ providedIn: 'root' })
export class SnackService {
  private readonly http = inject(HttpClient);

  /** All snacks, optionally filtered by category */
  getSnacks(category?: SnackCategory): Observable<Snack[]> {
    const url = category
      ? `${BACKEND.url(BACKEND.SNACKS.LIST)}?category=${category}`
      : BACKEND.url(BACKEND.SNACKS.LIST);
    return this.http.get<Snack[]>(url);
  }

  /** All active categories */
  getCategories(): Observable<SnackCategory[]> {
    return this.http
      .get<string[]>(BACKEND.url(BACKEND.SNACKS.CATEGORIES))
      .pipe(map((c) => c as SnackCategory[]));
  }
}
