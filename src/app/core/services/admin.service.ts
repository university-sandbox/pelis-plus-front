import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, type Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import { type Movie, type Genre } from '../models/movie.model';
import { type Screening } from '../models/screening.model';
import { type Snack } from '../models/snack.model';
import { type Order } from '../models/order.model';

export interface AdminMoviePayload {
  id?: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  runtime: number | null;
  status: string;
  originalLanguage: string;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  adult: boolean;
  video: boolean;
  active: boolean;
}

export interface AdminScreeningPayload {
  movieId: number;
  roomId: string;
  date: string;
  time: string;
  format?: string;
  price: number;
}

export interface AdminRoomPayload {
  venueId: string;
  roomTypeId: string;
  roomLayoutId: string;
  name: string;
  capacity?: number;
  rows?: number;
  cols?: number;
}

export interface AdminRoomTypePayload {
  code: string;
  name: string;
  description: string;
  active: boolean;
}

export interface AdminRoomLayoutPayload {
  name: string;
  rows: number;
  cols: number;
  capacity: number;
  seatMap: unknown | null;
  active: boolean;
}

export interface AdminSnackPayload {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string | null;
  status: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  membership: unknown;
  createdAt: string;
}

export interface AdminRoom {
  id: string;
  venueId: string;
  name: string;
  capacity: number;
  rows: number;
  cols: number;
  active?: boolean;
  roomType?: AdminRoomType;
  roomLayout?: AdminRoomLayout;
}

export interface AdminRoomType {
  id: string;
  code: string;
  name: string;
  description: string;
  active: boolean;
}

export interface AdminRoomLayout {
  id: string;
  name: string;
  rows: number;
  cols: number;
  capacity: number;
  seatMap: unknown | null;
  active: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

type AdminMoviesResponse = Movie[] | PageResponse<Movie> | { results: Movie[] };

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  // ── Movies ──────────────────────────────────────────────────────────────

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<AdminMoviesResponse>(BACKEND.url(BACKEND.ADMIN.MOVIES.LIST))
      .pipe(map((response) => normalizeMoviesResponse(response)));
  }

  createMovie(payload: AdminMoviePayload): Observable<Movie> {
    return this.http.post<Movie>(BACKEND.url(BACKEND.ADMIN.MOVIES.CREATE), payload);
  }

  updateMovie(id: number, payload: AdminMoviePayload): Observable<Movie> {
    return this.http.put<Movie>(BACKEND.url(BACKEND.ADMIN.MOVIES.UPDATE(id)), payload);
  }

  toggleMovieStatus(id: number): Observable<Movie> {
    return this.http.patch<Movie>(BACKEND.url(BACKEND.ADMIN.MOVIES.TOGGLE_STATUS(id)), {});
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(BACKEND.url(BACKEND.MOVIES.GENRES));
  }

  // ── Screenings ──────────────────────────────────────────────────────────

  getScreenings(params?: {
    status?: string;
    movieId?: number;
    page?: number;
  }): Observable<PageResponse<Screening>> {
    let httpParams = new HttpParams();
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.movieId) httpParams = httpParams.set('movieId', params.movieId.toString());
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    return this.http.get<PageResponse<Screening>>(BACKEND.url(BACKEND.ADMIN.SCREENINGS.LIST), {
      params: httpParams,
    });
  }

  createScreening(payload: AdminScreeningPayload): Observable<Screening> {
    return this.http.post<Screening>(BACKEND.url(BACKEND.ADMIN.SCREENINGS.CREATE), payload);
  }

  updateScreening(id: string, payload: AdminScreeningPayload): Observable<Screening> {
    return this.http.put<Screening>(BACKEND.url(BACKEND.ADMIN.SCREENINGS.UPDATE(id)), payload);
  }

  cancelScreening(id: string): Observable<Screening> {
    return this.http.patch<Screening>(BACKEND.url(BACKEND.ADMIN.SCREENINGS.CANCEL(id)), {});
  }

  // ── Rooms ───────────────────────────────────────────────────────────────

  getRooms(): Observable<AdminRoom[]> {
    return this.http.get<AdminRoom[]>(BACKEND.url(BACKEND.ADMIN.ROOMS.LIST));
  }

  createRoom(payload: AdminRoomPayload): Observable<AdminRoom> {
    return this.http.post<AdminRoom>(BACKEND.url(BACKEND.ADMIN.ROOMS.CREATE), payload);
  }

  updateRoom(id: string, payload: AdminRoomPayload): Observable<AdminRoom> {
    return this.http.put<AdminRoom>(BACKEND.url(BACKEND.ADMIN.ROOMS.UPDATE(id)), payload);
  }

  toggleRoomStatus(id: string): Observable<AdminRoom> {
    return this.http.patch<AdminRoom>(BACKEND.url(BACKEND.ADMIN.ROOMS.TOGGLE_STATUS(id)), {});
  }

  getRoomTypes(): Observable<AdminRoomType[]> {
    return this.http.get<AdminRoomType[]>(BACKEND.url(BACKEND.ADMIN.ROOM_TYPES.LIST));
  }

  createRoomType(payload: AdminRoomTypePayload): Observable<AdminRoomType> {
    return this.http.post<AdminRoomType>(BACKEND.url(BACKEND.ADMIN.ROOM_TYPES.CREATE), payload);
  }

  updateRoomType(id: string, payload: AdminRoomTypePayload): Observable<AdminRoomType> {
    return this.http.put<AdminRoomType>(BACKEND.url(BACKEND.ADMIN.ROOM_TYPES.UPDATE(id)), payload);
  }

  toggleRoomTypeStatus(id: string): Observable<AdminRoomType> {
    return this.http.patch<AdminRoomType>(
      BACKEND.url(BACKEND.ADMIN.ROOM_TYPES.TOGGLE_STATUS(id)),
      {},
    );
  }

  getRoomLayouts(): Observable<AdminRoomLayout[]> {
    return this.http.get<AdminRoomLayout[]>(BACKEND.url(BACKEND.ADMIN.ROOM_LAYOUTS.LIST));
  }

  createRoomLayout(payload: AdminRoomLayoutPayload): Observable<AdminRoomLayout> {
    return this.http.post<AdminRoomLayout>(BACKEND.url(BACKEND.ADMIN.ROOM_LAYOUTS.CREATE), payload);
  }

  updateRoomLayout(id: string, payload: AdminRoomLayoutPayload): Observable<AdminRoomLayout> {
    return this.http.put<AdminRoomLayout>(
      BACKEND.url(BACKEND.ADMIN.ROOM_LAYOUTS.UPDATE(id)),
      payload,
    );
  }

  toggleRoomLayoutStatus(id: string): Observable<AdminRoomLayout> {
    return this.http.patch<AdminRoomLayout>(
      BACKEND.url(BACKEND.ADMIN.ROOM_LAYOUTS.TOGGLE_STATUS(id)),
      {},
    );
  }

  getVenues(): Observable<Array<{ id: string; name: string; address: string; city: string }>> {
    return this.http.get<Array<{ id: string; name: string; address: string; city: string }>>(
      BACKEND.url(BACKEND.VENUES.LIST),
    );
  }

  // ── Snacks ──────────────────────────────────────────────────────────────

  getAdminSnacks(): Observable<Snack[]> {
    return this.http.get<Snack[]>(BACKEND.url(BACKEND.ADMIN.SNACKS.LIST));
  }

  createSnack(payload: AdminSnackPayload): Observable<Snack> {
    return this.http.post<Snack>(BACKEND.url(BACKEND.ADMIN.SNACKS.CREATE), payload);
  }

  updateSnack(id: string, payload: AdminSnackPayload): Observable<Snack> {
    return this.http.put<Snack>(BACKEND.url(BACKEND.ADMIN.SNACKS.UPDATE(id)), payload);
  }

  toggleSnackStatus(id: string): Observable<Snack> {
    return this.http.patch<Snack>(BACKEND.url(BACKEND.ADMIN.SNACKS.TOGGLE_STATUS(id)), {});
  }

  // ── Orders ──────────────────────────────────────────────────────────────

  getOrders(page = 1): Observable<PageResponse<Order>> {
    return this.http.get<PageResponse<Order>>(BACKEND.url(BACKEND.ADMIN.ORDERS.LIST), {
      params: new HttpParams().set('page', page.toString()),
    });
  }

  getOrderDetail(id: string): Observable<Order> {
    return this.http.get<Order>(BACKEND.url(BACKEND.ADMIN.ORDERS.DETAIL(id)));
  }

  // ── Users ───────────────────────────────────────────────────────────────

  getUsers(page = 1): Observable<PageResponse<AdminUser>> {
    return this.http.get<PageResponse<AdminUser>>(BACKEND.url(BACKEND.ADMIN.USERS.LIST), {
      params: new HttpParams().set('page', page.toString()),
    });
  }

  toggleUserStatus(id: string, status: 'active' | 'inactive'): Observable<void> {
    return this.http.patch<void>(BACKEND.url(BACKEND.ADMIN.USERS.TOGGLE_STATUS(id)), { status });
  }
}

function normalizeMoviesResponse(response: AdminMoviesResponse): Movie[] {
  if (Array.isArray(response)) {
    return response;
  }

  return 'results' in response ? response.results : response.content;
}
