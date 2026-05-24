import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  type OnInit,
} from '@angular/core';
import {
  LucideAngularModule,
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-angular';

import { AdminService } from '../../../core/services/admin.service';
import { type Movie } from '../../../core/models/movie.model';
import { movieImageUrl } from '../../../core/api/media-url';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { PelisToastService } from '../../../shared/services/pelis-toast.service';
import { AdminMovieFormComponent } from './admin-movie-form.component';

type MovieSection = 'all' | NonNullable<Movie['status']>;

@Component({
  selector: 'app-admin-movies-page',
  imports: [LucideAngularModule, SkeletonLoaderComponent, AdminMovieFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-movies-page.component.html',
})
export class AdminMoviesPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toast = inject(PelisToastService);
  private readonly pageSize = 10;

  readonly movies = signal<Movie[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly showForm = signal(false);
  readonly editingMovie = signal<Movie | null>(null);
  readonly toggling = signal<number | null>(null);
  readonly currentPage = signal(1);
  readonly activeSection = signal<MovieSection>('all');
  readonly movieSections: Array<{ value: MovieSection; label: string }> = [
    { value: 'all', label: 'Todas' },
    { value: 'now_playing', label: 'En cartelera' },
    { value: 'upcoming', label: 'Próximamente' },
    { value: 'popular', label: 'Popular' },
  ];
  readonly filteredMovies = computed(() => {
    const section = this.activeSection();
    return section === 'all'
      ? this.movies()
      : this.movies().filter((movie) => movie.status === section);
  });
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredMovies().length / this.pageSize)),
  );
  readonly pagedMovies = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredMovies().slice(start, start + this.pageSize);
  });

  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly ToggleLeft = ToggleLeft;
  readonly ToggleRight = ToggleRight;
  readonly RefreshCw = RefreshCw;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.adminService.getMovies().subscribe({
      next: (list) => {
        this.movies.set(list);
        this.ensureValidPage();
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  goPage(page: number): void {
    this.currentPage.set(Math.min(Math.max(page, 1), this.totalPages()));
  }

  setSection(section: MovieSection): void {
    this.activeSection.set(section);
    this.currentPage.set(1);
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
        this.ensureValidPage();
        this.toggling.set(null);
        if (updated.active === false) {
          this.toast.warning(
            'Película desactivada. El backend canceló las funciones sin tickets vendidos y mantuvo válidas las que ya tenían tickets.',
          );
          return;
        }
        this.toast.info('Película activada para cartelera y nuevas funciones.');
      },
      error: () => this.toggling.set(null),
    });
  }

  onSaved(movie: Movie): void {
    this.movies.update((list) => {
      const idx = list.findIndex((m) => m.id === movie.id);
      return idx >= 0 ? list.map((m) => (m.id === movie.id ? movie : m)) : [movie, ...list];
    });
    this.ensureValidPage();
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

  sectionCount(section: MovieSection): number {
    return section === 'all'
      ? this.movies().length
      : this.movies().filter((movie) => movie.status === section).length;
  }

  posterUrl(path: string | null): string | null {
    return movieImageUrl(path, 'w92');
  }

  private ensureValidPage(): void {
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(this.totalPages());
    }
  }
}
