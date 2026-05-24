import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, type Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import { type Screening } from '../models/screening.model';
import { type Venue } from '../models/screening.model';

type ListResponse<T> = T[] | { content: T[] };

@Injectable({ providedIn: 'root' })
export class ScreeningService {
  private readonly http = inject(HttpClient);

  /** Screenings available for a given movie */
  getForMovie(movieId: number, movieTitle?: string): Observable<Screening[]> {
    void movieTitle;
    return this.http
      .get<ListResponse<Screening>>(BACKEND.url(BACKEND.MOVIES.SCREENINGS(movieId)))
      .pipe(map(normalizeListResponse));
  }

  /** All venues */
  getVenues(): Observable<Venue[]> {
    return this.http
      .get<ListResponse<Venue>>(BACKEND.url(BACKEND.VENUES.LIST))
      .pipe(map(normalizeListResponse));
  }

  /** Detail for a single screening */
  getDetail(screeningId: string): Observable<Screening> {
    return this.http.get<Screening>(BACKEND.url(BACKEND.SCREENINGS.DETAIL(screeningId)));
  }
}

function normalizeListResponse<T>(response: ListResponse<T>): T[] {
  return Array.isArray(response) ? response : response.content;
}
