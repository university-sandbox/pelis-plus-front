import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { LucideAngularModule, Plus, Pencil, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-angular';

import { AdminService } from '../../../core/services/admin.service';
import { type Movie } from '../../../core/models/movie.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { AdminMovieFormComponent } from './admin-movie-form.component';

@Component({
  selector: 'app-admin-movies-page',
  imports: [LucideAngularModule, SkeletonLoaderComponent, AdminMovieFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold" style="color: var(--color-text-primary);">Películas</h1>
          <p class="text-sm" style="color: var(--color-text-secondary);">{{ movies().length }} películas</p>
        </div>
        <button
          type="button"
          (click)="openCreate()"
          class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
          style="background: var(--color-accent); color: var(--color-text-inverse);"
        >
          <lucide-icon [img]="Plus" [size]="15" aria-hidden="true" />
          Nueva película
        </button>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="space-y-3">
          @for (n of [1,2,3,4,5]; track n) {
            <app-skeleton-loader height="56px" radius="8px" />
          }
        </div>
      } @else if (error()) {
        <div
          class="rounded-xl p-6 text-center"
          style="background: var(--color-surface); border: 1px solid var(--color-border);"
        >
          <p class="mb-3 text-sm" style="color: var(--color-text-secondary);">Error al cargar películas.</p>
          <button type="button" (click)="load()" class="text-sm" style="color: var(--color-accent);">
            <lucide-icon [img]="RefreshCw" [size]="14" class="inline mr-1" />
            Reintentar
          </button>
        </div>
      } @else {
        <!-- Table -->
        <div
          class="overflow-hidden rounded-xl"
          style="border: 1px solid var(--color-border); background: var(--color-surface);"
        >
          <table class="w-full text-sm">
            <thead>
              <tr style="border-bottom: 1px solid var(--color-border); background: var(--color-surface-raised);">
                <th class="px-4 py-3 text-left font-semibold" style="color: var(--color-text-secondary);">Título</th>
                <th class="px-4 py-3 text-left font-semibold hidden sm:table-cell" style="color: var(--color-text-secondary);">Estado</th>
                <th class="px-4 py-3 text-left font-semibold hidden md:table-cell" style="color: var(--color-text-secondary);">Activa</th>
                <th class="px-4 py-3 text-left font-semibold hidden lg:table-cell" style="color: var(--color-text-secondary);">Año</th>
                <th class="px-4 py-3 text-right font-semibold" style="color: var(--color-text-secondary);">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (movie of movies(); track movie.id) {
                <tr
                  class="transition-colors"
                  style="border-bottom: 1px solid var(--color-border);"
                >
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      @if (movie.posterPath) {
                        <img
                          [src]="'https://image.tmdb.org/t/p/w92' + movie.posterPath"
                          [alt]="movie.title"
                          class="h-10 w-7 rounded object-cover flex-none"
                          loading="lazy"
                        />
                      } @else {
                        <div class="h-10 w-7 flex-none rounded" style="background: var(--color-surface-raised);"></div>
                      }
                      <span class="font-medium" style="color: var(--color-text-primary);">{{ movie.title }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 hidden sm:table-cell">
                    <span
                      class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      [style.background]="statusBg(movie.status)"
                      [style.color]="statusColor(movie.status)"
                    >{{ statusLabel(movie.status) }}</span>
                  </td>
                  <td class="px-4 py-3 hidden md:table-cell">
                    <button
                      type="button"
                      (click)="toggleStatus(movie)"
                      [disabled]="toggling() === movie.id"
                      class="transition-opacity"
                      [title]="movie.active ? 'Desactivar' : 'Activar'"
                    >
                      @if (movie.active !== false) {
                        <lucide-icon [img]="ToggleRight" [size]="22" style="color: var(--color-success);" aria-hidden="true" />
                      } @else {
                        <lucide-icon [img]="ToggleLeft" [size]="22" style="color: var(--color-text-disabled);" aria-hidden="true" />
                      }
                    </button>
                  </td>
                  <td class="px-4 py-3 hidden lg:table-cell" style="color: var(--color-text-secondary);">
                    {{ movie.releaseDate?.slice(0, 4) ?? '—' }}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button
                      type="button"
                      (click)="openEdit(movie)"
                      class="rounded-lg p-2 transition-colors"
                      style="color: var(--color-text-secondary);"
                      title="Editar"
                    >
                      <lucide-icon [img]="Pencil" [size]="15" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <!-- Movie form modal -->
    @if (showForm()) {
      <app-admin-movie-form
        [movie]="editingMovie()"
        (saved)="onSaved($event)"
        (cancelled)="showForm.set(false)"
      />
    }
  `,
})
export class AdminMoviesPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly movies = signal<Movie[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly showForm = signal(false);
  readonly editingMovie = signal<Movie | null>(null);
  readonly toggling = signal<number | null>(null);

  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly ToggleLeft = ToggleLeft;
  readonly ToggleRight = ToggleRight;
  readonly RefreshCw = RefreshCw;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.adminService.getMovies().subscribe({
      next: (list) => { this.movies.set(list); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  openCreate(): void {
    this.editingMovie.set(null);
    this.showForm.set(true);
  }

  openEdit(movie: Movie): void {
    this.editingMovie.set(movie);
    this.showForm.set(true);
  }

  toggleStatus(movie: Movie): void {
    this.toggling.set(movie.id);
    this.adminService.toggleMovieStatus(movie.id).subscribe({
      next: (updated) => {
        this.movies.update((list) => list.map((m) => (m.id === updated.id ? updated : m)));
        this.toggling.set(null);
      },
      error: () => this.toggling.set(null),
    });
  }

  onSaved(movie: Movie): void {
    this.movies.update((list) => {
      const idx = list.findIndex((m) => m.id === movie.id);
      return idx >= 0 ? list.map((m) => (m.id === movie.id ? movie : m)) : [movie, ...list];
    });
    this.showForm.set(false);
  }

  statusLabel(status?: string): string {
    const map: Record<string, string> = {
      now_playing: 'En cartelera',
      upcoming: 'Próximamente',
      popular: 'Popular',
    };
    return map[status ?? ''] ?? status ?? '—';
  }

  statusBg(status?: string): string {
    if (status === 'now_playing') return 'rgba(0,201,167,0.15)';
    if (status === 'upcoming') return 'rgba(99,102,241,0.15)';
    return 'var(--color-surface-raised)';
  }

  statusColor(status?: string): string {
    if (status === 'now_playing') return 'var(--color-accent)';
    if (status === 'upcoming') return '#818cf8';
    return 'var(--color-text-secondary)';
  }
}
