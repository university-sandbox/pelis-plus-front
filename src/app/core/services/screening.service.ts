import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import { type Screening } from '../models/screening.model';
import { type Venue } from '../models/screening.model';

@Injectable({ providedIn: 'root' })
export class ScreeningService {
  private readonly http = inject(HttpClient);

  /** Screenings available for a given movie */
  getForMovie(movieId: number, movieTitle?: string): Observable<Screening[]> {
    void movieTitle;
    return this.http.get<Screening[]>(BACKEND.url(BACKEND.MOVIES.SCREENINGS(movieId)));
  }

  /** All venues */
  getVenues(): Observable<Venue[]> {
    return this.http.get<Venue[]>(BACKEND.url(BACKEND.VENUES.LIST));
  }

  /** Detail for a single screening */
  getDetail(screeningId: string): Observable<Screening> {
    return this.http.get<Screening>(BACKEND.url(BACKEND.SCREENINGS.DETAIL(screeningId)));
  }
}
