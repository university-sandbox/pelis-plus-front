import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import { type SeatMap, type SeatReservation } from '../models/seat.model';

@Injectable({ providedIn: 'root' })
export class SeatService {
  private readonly http = inject(HttpClient);

  /** Fetch seat map for a screening */
  getSeatMap(screeningId: string): Observable<SeatMap> {
    return this.http.get<SeatMap>(BACKEND.url(BACKEND.SCREENINGS.SEATS(screeningId)));
  }

  /** Temporarily reserve selected seats */
  reserveSeats(screeningId: string, seatIds: string[]): Observable<SeatReservation> {
    return this.http.post<SeatReservation>(
      BACKEND.url(BACKEND.SCREENINGS.RESERVE_SEATS(screeningId)),
      { seatIds },
    );
  }

  /** Release reserved seats (called on timeout or navigation away) */
  releaseSeats(screeningId: string): Observable<void> {
    return this.http.delete<void>(BACKEND.url(BACKEND.SCREENINGS.RELEASE_SEATS(screeningId)));
  }
}
