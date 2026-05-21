import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import {
  type Genre,
  type Movie,
  type MovieListResponse,
} from '../models/movie.model';

export interface MovieFilters {
  page?: number;
  language?: string;
  region?: string;
  genre?: number | null;
  query?: string;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);

  /** Películas en cartelera */
  getNowPlaying(filters: MovieFilters = {}): Observable<MovieListResponse> {
    const params = buildBackendParams({ ...filters, status: 'now_playing' });
    return this.http.get<MovieListResponse>(BACKEND.url(BACKEND.MOVIES.LIST), { params });
  }

  /** Próximos estrenos */
  getUpcoming(filters: MovieFilters = {}): Observable<MovieListResponse> {
    const params = buildBackendParams({ ...filters, status: 'upcoming' });
    return this.http.get<MovieListResponse>(BACKEND.url(BACKEND.MOVIES.LIST), { params });
  }

  /** Populares */
  getPopular(filters: MovieFilters = {}): Observable<MovieListResponse> {
    const params = buildBackendParams({ ...filters, status: 'popular' });
    return this.http.get<MovieListResponse>(BACKEND.url(BACKEND.MOVIES.LIST), { params });
  }

  /** Detalle de película */
  getDetail(id: number): Observable<Movie> {
    return this.http.get<Movie>(BACKEND.url(BACKEND.MOVIES.DETAIL(id)));
  }

  /** Búsqueda por título */
  search(query: string, page = 1): Observable<MovieListResponse> {
    const params = buildBackendParams({ query, page });
    return this.http.get<MovieListResponse>(BACKEND.url(BACKEND.MOVIES.LIST), { params });
  }

  /** Lista de géneros */
  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(BACKEND.url(BACKEND.MOVIES.GENRES));
  }

  /** Discover por género */
  discover(filters: MovieFilters & { genreId?: number } = {}): Observable<MovieListResponse> {
    const params = buildBackendParams({
      ...filters,
      genre: filters.genreId ?? filters.genre ?? null,
    });
    return this.http.get<MovieListResponse>(BACKEND.url(BACKEND.MOVIES.LIST), { params });
  }
}

function buildBackendParams(filters: MovieFilters & { status?: string }): HttpParams {
  let params = new HttpParams().set('page', (filters.page ?? 1).toString());

  if (filters.status) params = params.set('status', filters.status);
  if (filters.genre) params = params.set('genre', filters.genre.toString());
  if (filters.query?.trim()) params = params.set('search', filters.query.trim());

  return params;
}
