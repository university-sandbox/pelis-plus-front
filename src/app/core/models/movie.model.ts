export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  genres?: Genre[];
  runtime?: number;
  status?: 'now_playing' | 'upcoming' | 'popular';
  originalLanguage: string;
  popularity: number;
  adult: boolean;
  video: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}

/** TMDB raw response shape — adapted in MovieService */
export interface TmdbMovieRaw {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres?: Array<{ id: number; name: string }>;
  runtime?: number;
  original_language: string;
  popularity: number;
  adult: boolean;
  video: boolean;
}

export interface TmdbListRaw {
  page: number;
  results: TmdbMovieRaw[];
  total_pages: number;
  total_results: number;
}

export function adaptTmdbMovie(raw: TmdbMovieRaw): Movie {
  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    releaseDate: raw.release_date,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    genreIds: raw.genre_ids,
    genres: raw.genres?.map((g) => ({ id: g.id, name: g.name })),
    runtime: raw.runtime,
    originalLanguage: raw.original_language,
    popularity: raw.popularity,
    adult: raw.adult,
    video: raw.video,
  };
}
