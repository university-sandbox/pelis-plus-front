import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BACKEND } from '../api/endpoints';
import { type SeatMap, type SeatReservation } from '../models/seat.model';
import { buildMockSeatMap } from '../mocks/seat.mock';

@Injectable({ providedIn: 'root' })
export class SeatService {
  private readonly http = inject(HttpClient);

  /** Fetch seat map for a screening */
  getSeatMap(screeningId: string): Observable<SeatMap> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of(buildMockSeatMap(screeningId)).pipe(delay(400));
    }

    return this.http.get<SeatMap>(BACKEND.url(BACKEND.SCREENINGS.SEATS(screeningId)));
  }

  /** Temporarily reserve selected seats */
  reserveSeats(screeningId: string, seatIds: string[]): Observable<SeatReservation> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min
      return of({ seatIds, expiresAt }).pipe(delay(500));
    }

    return this.http.post<SeatReservation>(
      BACKEND.url(BACKEND.SCREENINGS.RESERVE_SEATS(screeningId)),
      { seatIds },
    );
  }

  /** Release reserved seats (called on timeout or navigation away) */
  releaseSeats(screeningId: string): Observable<void> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of(undefined).pipe(delay(200));
    }

    return this.http.delete<void>(BACKEND.url(BACKEND.SCREENINGS.RELEASE_SEATS(screeningId)));
  }
}
