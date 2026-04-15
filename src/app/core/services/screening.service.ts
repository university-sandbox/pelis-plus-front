import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BACKEND } from '../api/endpoints';
import { type Screening } from '../models/screening.model';
import { type Venue } from '../models/screening.model';
import { buildMockScreenings } from '../mocks/screening.mock';
import { MOCK_VENUES } from '../mocks/venue.mock';

@Injectable({ providedIn: 'root' })
export class ScreeningService {
  private readonly http = inject(HttpClient);

  /** Screenings available for a given movie */
  getForMovie(movieId: number, movieTitle: string): Observable<Screening[]> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of(buildMockScreenings(movieId, movieTitle)).pipe(delay(400));
    }

    return this.http.get<Screening[]>(BACKEND.url(BACKEND.MOVIES.SCREENINGS(movieId)));
  }

  /** All venues */
  getVenues(): Observable<Venue[]> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of(MOCK_VENUES).pipe(delay(300));
    }

    return this.http.get<Venue[]>(BACKEND.url(BACKEND.VENUES.LIST));
  }

  /** Detail for a single screening */
  getDetail(screeningId: string): Observable<Screening | null> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      const all = buildMockScreenings(0, '');
      const found = all.find((s) => s.id === screeningId) ?? null;
      return of(found).pipe(delay(300));
    }

    return this.http.get<Screening>(BACKEND.url(BACKEND.SCREENINGS.DETAIL(screeningId)));
  }
}
