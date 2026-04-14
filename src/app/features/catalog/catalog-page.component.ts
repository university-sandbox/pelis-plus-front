import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NgOptimizedImage, DecimalPipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, X, Star, Clock, Play, Info, ChevronRight } from 'lucide-angular';

import { MovieService } from '../../core/services/movie.service';
import { type Genre, type Movie } from '../../core/models/movie.model';
import { TMDB } from '../../core/api/endpoints';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { MovieCardComponent } from './movie-card.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-catalog-page',
  imports: [
    NgOptimizedImage,
    RouterLink,
    FormsModule,
    DecimalPipe,
    SlicePipe,
    LucideAngularModule,
    NavbarComponent,
    MovieCardComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar />

    <main class="min-h-dvh" style="background: var(--color-bg);">

      <!-- ── Hero Banner ─────────────────────────────────────── -->
      @if (heroMovies().length > 0) {
        <section
          class="relative w-full overflow-hidden"
          style="height: 55vh; min-height: 320px; max-height: 600px;"
          aria-label="Película destacada"
        >
          @for (movie of heroMovies(); track movie.id; let i = $index) {
            <div
              class="absolute inset-0 transition-opacity duration-500"
              [style.opacity]="i === heroIndex() ? '1' : '0'"
            >
              @if (movie.backdropPath) {
                <img
                  [ngSrc]="backdropUrl(movie.backdropPath)"
                  [alt]="movie.title"
                  fill
                  priority
                  class="object-cover"
                />
              }
              <!-- Gradient overlays -->
              <div
                class="absolute inset-0"
                style="background: linear-gradient(to right, #09090F 25%, transparent 70%);"
              ></div>
              <div
                class="absolute inset-0"
                style="background: linear-gradient(to top, #09090F 0%, transparent 40%);"
              ></div>
            </div>
          }

          <!-- Hero content -->
          @if (currentHeroMovie(); as hero) {
            <div class="absolute bottom-0 left-0 p-6 sm:p-10 lg:p-16 max-w-2xl">
              <p class="mb-2 text-xs font-semibold uppercase tracking-widest" style="color: var(--color-accent);">
                En cartelera
              </p>
              <h1 class="mb-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl" style="color: var(--color-text-primary);">
                {{ hero.title }}
              </h1>
              <div class="mb-3 flex flex-wrap items-center gap-3 text-sm" style="color: var(--color-text-secondary);">
                <span class="flex items-center gap-1">
                  <lucide-icon [img]="Star" [size]="14" style="color: var(--color-warning);" aria-hidden="true" />
                  {{ hero.voteAverage | number:'1.1-1' }}
                </span>
                @if (hero.releaseDate) {
                  <span>{{ hero.releaseDate | slice:0:4 }}</span>
                }
              </div>
              <p class="mb-5 hidden text-sm leading-relaxed sm:line-clamp-2" style="color: var(--color-text-secondary);">
                {{ hero.overview }}
              </p>
              <div class="flex flex-wrap gap-3">
                <a
                  [routerLink]="['/movie', hero.id]"
                  class="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
                  style="background: var(--color-accent); color: var(--color-text-inverse);"
                >
                  <lucide-icon [img]="Play" [size]="16" aria-hidden="true" />
                  Comprar entradas
                </a>
                <a
                  [routerLink]="['/movie', hero.id]"
                  class="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors"
                  style="border-color: rgba(255,255,255,.25); color: var(--color-text-primary);"
                >
                  <lucide-icon [img]="Info" [size]="16" aria-hidden="true" />
                  Más info
                </a>
              </div>
            </div>
          }

          <!-- Hero dots -->
          @if (heroMovies().length > 1) {
            <div class="absolute bottom-4 right-6 flex gap-1.5" role="tablist" aria-label="Seleccionar película destacada">
              @for (m of heroMovies(); track m.id; let i = $index) {
                <button
                  type="button"
                  role="tab"
                  [attr.aria-selected]="i === heroIndex()"
                  [attr.aria-label]="'Película ' + (i + 1)"
                  (click)="setHeroIndex(i)"
                  class="h-1.5 rounded-full transition-all duration-300"
                  [style.width]="i === heroIndex() ? '24px' : '6px'"
                  [style.background]="i === heroIndex() ? 'var(--color-accent)' : 'rgba(255,255,255,.3)'"
                ></button>
              }
            </div>
          }
        </section>
      }

      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">

        <!-- ── Search & Filter ──────────────────────────────── -->
        <section aria-label="Filtros">
          <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <!-- Search input -->
            <div class="relative flex-1 max-w-sm">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <lucide-icon [img]="Search" [size]="16" style="color: var(--color-text-secondary);" aria-hidden="true" />
              </span>
              <input
                type="search"
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange($event)"
                placeholder="Buscar película..."
                class="search-input w-full rounded-full py-2.5 pl-9 pr-4 text-sm"
                aria-label="Buscar película"
              />
              @if (searchQuery) {
                <button
                  type="button"
                  (click)="clearSearch()"
                  class="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style="color: var(--color-text-secondary);"
                  aria-label="Limpiar búsqueda"
                >
                  <lucide-icon [img]="X" [size]="14" aria-hidden="true" />
                </button>
              }
            </div>
          </div>

          <!-- Genre pills -->
          @if (genres().length > 0) {
            <div
              class="flex gap-2 overflow-x-auto pb-2"
              style="scroll-snap-type: x mandatory; scrollbar-width: none;"
              role="listbox"
              aria-label="Filtrar por género"
            >
              <button
                type="button"
                role="option"
                [attr.aria-selected]="selectedGenreId() === null"
                (click)="selectGenre(null)"
                class="genre-pill flex-none rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
                [style.background]="selectedGenreId() === null ? 'var(--color-accent)' : 'var(--color-surface-raised)'"
                [style.color]="selectedGenreId() === null ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)'"
              >
                Todos
              </button>
              @for (genre of genres(); track genre.id) {
                <button
                  type="button"
                  role="option"
                  [attr.aria-selected]="selectedGenreId() === genre.id"
                  (click)="selectGenre(genre.id)"
                  class="genre-pill flex-none rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
                  [style.background]="selectedGenreId() === genre.id ? 'var(--color-accent)' : 'var(--color-surface-raised)'"
                  [style.color]="selectedGenreId() === genre.id ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)'"
                >
                  {{ genre.name }}
                </button>
              }
            </div>
          }
        </section>

        <!-- ── Search results ───────────────────────────────── -->
        @if (searchQuery) {
          <section aria-label="Resultados de búsqueda">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-bold" style="color: var(--color-text-primary);">
                Resultados para "{{ searchQuery }}"
              </h2>
            </div>

            @if (searchLoading()) {
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                @for (n of skeletonArray; track n) {
                  <app-skeleton-loader height="0" radius="12px" class="block" style="aspect-ratio: 2/3;" />
                }
              </div>
            } @else if (searchResults().length === 0) {
              <app-empty-state
                title="Sin resultados"
                [description]="noResultsDescription"
                actionLabel="Limpiar búsqueda"
                (action)="clearSearch()"
              ></app-empty-state>
            } @else {
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                @for (movie of searchResults(); track movie.id) {
                  <app-movie-card [movie]="movie" />
                }
              </div>
            }
          </section>
        } @else {
          <!-- ── En cartelera ───────────────────────────────── -->
          <section aria-label="En cartelera">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-bold" style="color: var(--color-text-primary);">En cartelera</h2>
              <a
                routerLink="/catalog"
                class="flex items-center gap-1 text-sm font-medium transition-colors"
                style="color: var(--color-accent);"
              >
                Ver todo
                <lucide-icon [img]="ChevronRight" [size]="14" aria-hidden="true" />
              </a>
            </div>

            @if (nowPlayingLoading()) {
              <div class="flex gap-4 overflow-hidden">
                @for (n of skeletonArray; track n) {
                  <app-skeleton-loader height="0" radius="12px" class="flex-none" style="width: 160px; aspect-ratio: 2/3;" />
                }
              </div>
            } @else if (nowPlayingError()) {
              <app-error-state
                title="No pudimos cargar las películas"
                description="Verifica tu conexión e inténtalo de nuevo."
                (retry)="loadNowPlaying()"
              />
            } @else if (filteredNowPlaying().length === 0) {
              <app-empty-state
                title="Sin películas disponibles"
                description="No hay películas en cartelera con el filtro seleccionado."
              />
            } @else {
              <div
                class="movie-scroll flex gap-4 overflow-x-auto pb-4"
                style="scroll-snap-type: x mandatory;"
              >
                @for (movie of filteredNowPlaying(); track movie.id) {
                  <div class="flex-none" style="width: 160px; scroll-snap-align: start;">
                    <app-movie-card [movie]="movie" />
                  </div>
                }
              </div>
            }
          </section>

          <!-- ── Próximos estrenos ──────────────────────────── -->
          <section aria-label="Próximos estrenos">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-bold" style="color: var(--color-text-primary);">Próximos estrenos</h2>
              <a
                routerLink="/catalog"
                class="flex items-center gap-1 text-sm font-medium transition-colors"
                style="color: var(--color-accent);"
              >
                Ver todo
                <lucide-icon [img]="ChevronRight" [size]="14" aria-hidden="true" />
              </a>
            </div>

            @if (upcomingLoading()) {
              <div class="flex gap-4 overflow-hidden">
                @for (n of skeletonArray; track n) {
                  <app-skeleton-loader height="0" radius="12px" class="flex-none" style="width: 160px; aspect-ratio: 2/3;" />
                }
              </div>
            } @else if (upcomingError()) {
              <app-error-state
                title="No pudimos cargar los próximos estrenos"
                (retry)="loadUpcoming()"
              />
            } @else {
              <div
                class="movie-scroll flex gap-4 overflow-x-auto pb-4"
                style="scroll-snap-type: x mandatory;"
              >
                @for (movie of filteredUpcoming(); track movie.id) {
                  <div class="flex-none relative" style="width: 160px; scroll-snap-align: start;">
                    <app-movie-card [movie]="movie" />
                    <!-- Próximamente badge -->
                    <span
                      class="absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold"
                      style="background: var(--color-warning); color: var(--color-text-inverse);"
                    >
                      Pronto
                    </span>
                  </div>
                }
              </div>
            }
          </section>

          <!-- ── Populares ──────────────────────────────────── -->
          <section aria-label="Populares esta semana">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-bold" style="color: var(--color-text-primary);">Populares esta semana</h2>
            </div>

            @if (popularLoading()) {
              <div class="flex gap-4 overflow-hidden">
                @for (n of skeletonArray; track n) {
                  <app-skeleton-loader height="0" radius="12px" class="flex-none" style="width: 160px; aspect-ratio: 2/3;" />
                }
              </div>
            } @else if (popularError()) {
              <app-error-state
                title="No pudimos cargar las películas populares"
                (retry)="loadPopular()"
              />
            } @else {
              <div
                class="movie-scroll flex gap-4 overflow-x-auto pb-4"
                style="scroll-snap-type: x mandatory;"
              >
                @for (movie of filteredPopular(); track movie.id) {
                  <div class="flex-none" style="width: 160px; scroll-snap-align: start;">
                    <app-movie-card [movie]="movie" />
                  </div>
                }
              </div>
            }
          </section>
        }
      </div>
    </main>
  `,
  styles: `
    .movie-scroll {
      scrollbar-width: none;
    }
    .movie-scroll::-webkit-scrollbar {
      display: none;
    }

    .search-input {
      background: var(--color-surface-raised);
      border: 1px solid var(--color-border-strong);
      color: var(--color-text-primary);
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .search-input::placeholder { color: var(--color-text-disabled); }
    .search-input:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px var(--color-accent-muted);
    }

    .genre-pill:hover {
      opacity: 0.85;
    }
    .genre-pill:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
  `,
})
export class CatalogPageComponent implements OnInit {
  private readonly movieService = inject(MovieService);

  readonly nowPlaying = signal<Movie[]>([]);
  readonly upcoming = signal<Movie[]>([]);
  readonly popular = signal<Movie[]>([]);
  readonly genres = signal<Genre[]>([]);
  readonly searchResults = signal<Movie[]>([]);

  readonly nowPlayingLoading = signal(true);
  readonly upcomingLoading = signal(true);
  readonly popularLoading = signal(true);
  readonly searchLoading = signal(false);

  readonly nowPlayingError = signal(false);
  readonly upcomingError = signal(false);
  readonly popularError = signal(false);

  readonly selectedGenreId = signal<number | null>(null);
  readonly heroIndex = signal(0);

  searchQuery = '';
  private heroTimer?: ReturnType<typeof setInterval>;

  readonly skeletonArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  readonly Search = Search;
  readonly X = X;
  readonly Star = Star;
  readonly Clock = Clock;
  readonly Play = Play;
  readonly Info = Info;
  readonly ChevronRight = ChevronRight;

  readonly heroMovies = computed(() => this.nowPlaying().slice(0, 5));

  readonly currentHeroMovie = computed(() => {
    const movies = this.heroMovies();
    return movies[this.heroIndex()] ?? null;
  });

  readonly filteredNowPlaying = computed(() => filterByGenre(this.nowPlaying(), this.selectedGenreId()));
  readonly filteredUpcoming = computed(() => filterByGenre(this.upcoming(), this.selectedGenreId()));
  readonly filteredPopular = computed(() => filterByGenre(this.popular(), this.selectedGenreId()));
  get noResultsDescription(): string {
    return `No encontramos películas para "${this.searchQuery}". Intenta con otro término.`;
  }

  ngOnInit(): void {
    this.loadNowPlaying();
    this.loadUpcoming();
    this.loadPopular();
    this.loadGenres();
    this.startHeroTimer();
  }

  loadNowPlaying(): void {
    this.nowPlayingLoading.set(true);
    this.nowPlayingError.set(false);
    this.movieService.getNowPlaying({ region: 'PE' }).subscribe({
      next: (res) => {
        this.nowPlaying.set(res.results);
        this.nowPlayingLoading.set(false);
      },
      error: () => {
        this.nowPlayingError.set(true);
        this.nowPlayingLoading.set(false);
      },
    });
  }

  loadUpcoming(): void {
    this.upcomingLoading.set(true);
    this.upcomingError.set(false);
    this.movieService.getUpcoming({ region: 'PE' }).subscribe({
      next: (res) => {
        this.upcoming.set(res.results);
        this.upcomingLoading.set(false);
      },
      error: () => {
        this.upcomingError.set(true);
        this.upcomingLoading.set(false);
      },
    });
  }

  loadPopular(): void {
    this.popularLoading.set(true);
    this.popularError.set(false);
    this.movieService.getPopular().subscribe({
      next: (res) => {
        this.popular.set(res.results);
        this.popularLoading.set(false);
      },
      error: () => {
        this.popularError.set(true);
        this.popularLoading.set(false);
      },
    });
  }

  private loadGenres(): void {
    this.movieService.getGenres().subscribe({
      next: (g) => this.genres.set(g),
      error: () => {},
    });
  }

  onSearchChange(query: string): void {
    if (!query.trim()) {
      this.searchResults.set([]);
      return;
    }

    this.searchLoading.set(true);
    this.movieService.search(query).subscribe({
      next: (res) => {
        this.searchResults.set(res.results);
        this.searchLoading.set(false);
      },
      error: () => {
        this.searchLoading.set(false);
      },
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults.set([]);
  }

  selectGenre(id: number | null): void {
    this.selectedGenreId.set(id);
  }

  setHeroIndex(i: number): void {
    this.heroIndex.set(i);
    this.resetHeroTimer();
  }

  backdropUrl(path: string): string {
    return TMDB.imageUrl('w1280', path);
  }

  private startHeroTimer(): void {
    this.heroTimer = setInterval(() => {
      const total = this.heroMovies().length;
      if (total > 1) {
        this.heroIndex.update((i) => (i + 1) % total);
      }
    }, 6000);
  }

  private resetHeroTimer(): void {
    if (this.heroTimer) clearInterval(this.heroTimer);
    this.startHeroTimer();
  }
}

function filterByGenre(movies: Movie[], genreId: number | null): Movie[] {
  if (!genreId) return movies;
  return movies.filter((m) => m.genreIds.includes(genreId));
}
