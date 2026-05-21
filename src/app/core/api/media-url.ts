type MovieImageSize = 'w92' | 'w342' | 'w500' | 'w1280';

const MOVIE_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export function movieImageUrl(path: string | null | undefined, size: MovieImageSize): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${MOVIE_IMAGE_BASE_URL}/${size}${path.startsWith('/') ? path : `/${path}`}`;
}
