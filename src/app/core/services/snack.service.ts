import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import type { Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import { backendMediaUrl } from '../api/media-url';
import { type Snack, type SnackCategory } from '../models/snack.model';

type ListResponse<T> = T[] | { content: T[] } | { results: T[] } | { data: T[] };

@Injectable({ providedIn: 'root' })
export class SnackService {
  private readonly http = inject(HttpClient);

  /** All snacks, optionally filtered by category */
  getSnacks(category?: SnackCategory): Observable<Snack[]> {
    const url = category
      ? `${BACKEND.url(BACKEND.SNACKS.LIST)}?category=${category}`
      : BACKEND.url(BACKEND.SNACKS.LIST);
    return this.http.get<ListResponse<Snack>>(url).pipe(
      map((response) =>
        normalizeListResponse(response).map((snack) => ({
          ...snack,
          image: backendMediaUrl(snack.image),
        })),
      ),
    );
  }

  /** All active categories */
  getCategories(): Observable<SnackCategory[]> {
    return this.http
      .get<ListResponse<string>>(BACKEND.url(BACKEND.SNACKS.CATEGORIES))
      .pipe(map((categories) => normalizeListResponse(categories) as SnackCategory[]));
  }
}

function normalizeListResponse<T>(response: ListResponse<T>): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  if ('content' in response) {
    return response.content;
  }

  if ('results' in response) {
    return response.results;
  }

  return response.data;
}
