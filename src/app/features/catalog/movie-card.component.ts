import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe, NgOptimizedImage, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Star, Clock } from 'lucide-angular';

import { type Movie } from '../../core/models/movie.model';
import { TMDB } from '../../core/api/endpoints';

@Component({
  selector: 'app-movie-card',
  imports: [NgOptimizedImage, RouterLink, LucideAngularModule, DecimalPipe, SlicePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  readonly movie = input.required<Movie>();

  readonly Star = Star;
  readonly Clock = Clock;

  posterUrl(): string | null {
    const path = this.movie().posterPath;
    if (!path) return null;
    return TMDB.imageUrl('w342', path);
  }

  /** "Estreno" label: released within last 30 days */
  isNewRelease(): boolean {
    const date = this.movie().releaseDate;
    if (!date) return false;
    const releaseMs = new Date(date).getTime();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return releaseMs >= thirtyDaysAgo && releaseMs <= Date.now();
  }
}
