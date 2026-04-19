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
  templateUrl: './admin-movies-page.component.html',
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
