import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { TMDB } from '../api/endpoints';
import {
  adaptTmdbMovie,
  type Genre,
  type Movie,
  type MovieListResponse,
  type TmdbListRaw,
  type TmdbMovieRaw,
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
    const params = buildTmdbParams(filters);
    return this.http
      .get<TmdbListRaw>(TMDB.url(TMDB.MOVIES.NOW_PLAYING), { params })
      .pipe(map(adaptList));
  }

  /** Próximos estrenos */
  getUpcoming(filters: MovieFilters = {}): Observable<MovieListResponse> {
    const params = buildTmdbParams(filters);
    return this.http
      .get<TmdbListRaw>(TMDB.url(TMDB.MOVIES.UPCOMING), { params })
      .pipe(map(adaptList));
  }

  /** Populares */
  getPopular(filters: MovieFilters = {}): Observable<MovieListResponse> {
    const params = buildTmdbParams(filters);
    return this.http
      .get<TmdbListRaw>(TMDB.url(TMDB.MOVIES.POPULAR), { params })
      .pipe(map(adaptList));
  }

  /** Detalle de película */
  getDetail(id: number): Observable<Movie> {
    return this.http
      .get<TmdbMovieRaw>(TMDB.url(TMDB.MOVIES.DETAIL(id)), {
        params: { language: 'es', append_to_response: 'videos,credits' },
      })
      .pipe(map(adaptTmdbMovie));
  }

  /** Búsqueda por título */
  search(query: string, page = 1): Observable<MovieListResponse> {
    return this.http
      .get<TmdbListRaw>(TMDB.url(TMDB.SEARCH.MOVIES), {
        params: { query, language: 'es', page },
      })
      .pipe(map(adaptList));
  }

  /** Lista de géneros */
  getGenres(): Observable<Genre[]> {
    return this.http
      .get<{ genres: Array<{ id: number; name: string }> }>(TMDB.url(TMDB.GENRES.LIST), {
        params: { language: 'es' },
      })
      .pipe(map((r) => r.genres));
  }

  /** Discover por género */
  discover(filters: MovieFilters & { genreId?: number } = {}): Observable<MovieListResponse> {
    let params = buildTmdbParams(filters);
    if (filters.genreId) {
      params = params.set('with_genres', filters.genreId.toString());
    }
    return this.http
      .get<TmdbListRaw>(TMDB.url(TMDB.DISCOVER.MOVIES), { params })
      .pipe(map(adaptList));
  }
}

function buildTmdbParams(filters: MovieFilters): HttpParams {
  let params = new HttpParams()
    .set('language', filters.language ?? 'es')
    .set('page', (filters.page ?? 1).toString());

  if (filters.region) params = params.set('region', filters.region);

  return params;
}

function adaptList(raw: TmdbListRaw): MovieListResponse {
  return {
    page: raw.page,
    results: raw.results.map(adaptTmdbMovie),
    totalPages: raw.total_pages,
    totalResults: raw.total_results,
  };
}
