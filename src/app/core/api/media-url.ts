import { environment } from '../../../environments/environment';

type MovieImageSize = 'w92' | 'w342' | 'w500' | 'w1280';

const MOVIE_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export function movieImageUrl(
  path: string | null | undefined,
  size: MovieImageSize,
): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${MOVIE_IMAGE_BASE_URL}/${size}${path.startsWith('/') ? path : `/${path}`}`;
}

export function backendMediaUrl(path: string | null | undefined): string | null {
  const value = path?.trim();
  if (!value) return null;
  if (/^(https?:)?\/\//i.test(value) || /^(blob|data):/i.test(value)) return value;

  const backendUrl = new URL(environment.backend.baseUrl);
  if (value.startsWith('/')) {
    return `${backendUrl.origin}${value}`;
  }

  return `${environment.backend.baseUrl.replace(/\/$/, '')}/${value}`;
}
