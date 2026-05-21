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
  active?: boolean;
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
