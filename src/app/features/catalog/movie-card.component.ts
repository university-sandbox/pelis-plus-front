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
  template: `
    <a
      [routerLink]="['/movie', movie().id]"
      class="movie-card group relative block overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2"
      style="aspect-ratio: 2/3; focus-visible:outline-color: var(--color-accent);"
      [attr.aria-label]="movie().title"
    >
      <!-- Poster -->
      @if (posterUrl()) {
        <img
          [ngSrc]="posterUrl()!"
          [alt]="movie().title"
          fill
          priority
          class="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      } @else {
        <div
          class="flex h-full w-full items-center justify-center"
          style="background: var(--color-surface-raised);"
        >
          <span class="text-xs" style="color: var(--color-text-disabled);">Sin imagen</span>
        </div>
      }

      <!-- Gradient overlay -->
      <div
        class="absolute inset-0 transition-opacity duration-300"
        style="background: linear-gradient(to top, rgba(9,9,15,.95) 0%, rgba(9,9,15,.4) 50%, transparent 75%);"
      ></div>

      <!-- Hover overlay -->
      <div
        class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style="background: rgba(9,9,15,.35);"
      ></div>

      <!-- Labels: premiere, upcoming, inactive -->
      <div class="absolute left-2 top-2 flex flex-col gap-1">
        @if (movie().active === false) {
          <span class="rounded px-1.5 py-0.5 text-xs font-bold"
            style="background: rgba(0,0,0,0.75); color: var(--color-text-disabled);">
            Inactiva
          </span>
        } @else if (movie().status === 'upcoming') {
          <span class="rounded px-1.5 py-0.5 text-xs font-bold"
            style="background: rgba(99,102,241,0.85); color: #fff;">
            Próximamente
          </span>
        } @else if (isNewRelease()) {
          <span class="rounded px-1.5 py-0.5 text-xs font-bold"
            style="background: rgba(0,201,167,0.85); color: #fff;">
            Estreno
          </span>
        }
        @if (movie().adult) {
          <span class="rounded px-1.5 py-0.5 text-xs font-bold"
            style="background: rgba(239,68,68,0.85); color: #fff;">
            +18
          </span>
        }
      </div>

      <!-- Inactive overlay -->
      @if (movie().active === false) {
        <div class="absolute inset-0" style="background: rgba(0,0,0,0.5);"></div>
      }

      <!-- Info overlay (always visible at bottom) -->
      <div class="absolute bottom-0 left-0 right-0 p-3">
        <p class="truncate text-sm font-semibold leading-tight" style="color: var(--color-text-primary);">
          {{ movie().title }}
        </p>
        <div class="mt-1 flex items-center gap-2 text-xs" style="color: var(--color-text-secondary);">
          <span class="flex items-center gap-0.5">
            <lucide-icon [img]="Star" [size]="11" style="color: var(--color-warning);" aria-hidden="true" />
            {{ movie().voteAverage | number:'1.1-1' }}
          </span>
          @if (movie().releaseDate) {
            <span>{{ movie().releaseDate | slice:0:4 }}</span>
          }
        </div>
      </div>

      <!-- Hover CTA -->
      <div
        class="absolute inset-x-0 bottom-12 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <span
          class="rounded-full px-4 py-1.5 text-xs font-semibold"
          style="background: var(--color-accent); color: var(--color-text-inverse);"
        >
          Comprar
        </span>
      </div>
    </a>
  `,
  styles: `
    .movie-card {
      background: var(--color-surface);
      box-shadow: var(--shadow-card);
      cursor: pointer;
    }

    .movie-card:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
  `,
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
