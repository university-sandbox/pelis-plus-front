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
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
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
