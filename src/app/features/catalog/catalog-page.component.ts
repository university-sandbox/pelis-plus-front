import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import type { ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NgOptimizedImage, DecimalPipe, SlicePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {
  LucideAngularModule,
  Search,
  X,
  Star,
  Clock,
  Play,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-angular';

import { MovieService } from '../../core/services/movie.service';
import { type Movie } from '../../core/models/movie.model';
import { movieImageUrl } from '../../core/api/media-url';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { MovieCardComponent } from './movie-card.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

type CatalogCarousel = 'nowPlaying' | 'upcoming' | 'popular';
type CatalogSection = CatalogCarousel;
type HeroMovie = Movie & { backdropPath: string };

const catalogSections = [
  'nowPlaying',
  'upcoming',
  'popular',
] as const satisfies readonly CatalogSection[];

function parseCatalogSection(section: string | null): CatalogSection | null {
  return catalogSections.some((value) => value === section) ? (section as CatalogSection) : null;
}

function hasBackdropImage(movie: Movie): movie is HeroMovie {
  return Boolean(movie.backdropPath?.trim());
}

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
export class CatalogPageComponent implements OnInit, OnDestroy {
  private readonly movieService = inject(MovieService);
  private readonly route = inject(ActivatedRoute);
  private readonly nowPlayingCarousel = viewChild<ElementRef<HTMLElement>>('nowPlayingCarousel');
  private readonly upcomingCarousel = viewChild<ElementRef<HTMLElement>>('upcomingCarousel');
  private readonly popularCarousel = viewChild<ElementRef<HTMLElement>>('popularCarousel');

  readonly nowPlaying = signal<Movie[]>([]);
  readonly upcoming = signal<Movie[]>([]);
  readonly popular = signal<Movie[]>([]);
  readonly searchResults = signal<Movie[]>([]);

  readonly nowPlayingLoading = signal(true);
  readonly upcomingLoading = signal(true);
  readonly popularLoading = signal(true);
  readonly searchLoading = signal(false);

  readonly nowPlayingError = signal(false);
  readonly upcomingError = signal(false);
  readonly popularError = signal(false);

  readonly heroIndex = signal(0);
  readonly activeSection = toSignal(
    this.route.queryParamMap.pipe(map((params) => parseCatalogSection(params.get('section')))),
    { initialValue: null },
  );

  readonly activeSectionTitle = computed(() => {
    switch (this.activeSection()) {
      case 'nowPlaying':
        return 'En cartelera';
      case 'upcoming':
        return 'Próximos estrenos';
      case 'popular':
        return 'Populares esta semana';
      default:
        return '';
    }
  });

  readonly activeSectionDescription = computed(() => {
    switch (this.activeSection()) {
      case 'nowPlaying':
        return 'Todas las películas disponibles para reservar ahora.';
      case 'upcoming':
        return 'Estrenos que llegan pronto a nuestras salas.';
      case 'popular':
        return 'Las películas que más se están viendo esta semana.';
      default:
        return '';
    }
  });

  readonly activeSectionMovies = computed(() => {
    switch (this.activeSection()) {
      case 'nowPlaying':
        return this.nowPlaying();
      case 'upcoming':
        return this.upcoming();
      case 'popular':
        return this.popular();
      default:
        return [];
    }
  });

  readonly activeSectionLoading = computed(() => {
    switch (this.activeSection()) {
      case 'nowPlaying':
        return this.nowPlayingLoading();
      case 'upcoming':
        return this.upcomingLoading();
      case 'popular':
        return this.popularLoading();
      default:
        return false;
    }
  });

  readonly activeSectionError = computed(() => {
    switch (this.activeSection()) {
      case 'nowPlaying':
        return this.nowPlayingError();
      case 'upcoming':
        return this.upcomingError();
      case 'popular':
        return this.popularError();
      default:
        return false;
    }
  });

  searchQuery = '';
  private heroTouchStartX: number | null = null;
  private heroTimer?: ReturnType<typeof setInterval>;

  readonly skeletonArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  readonly Search = Search;
  readonly X = X;
  readonly Star = Star;
  readonly Clock = Clock;
  readonly Play = Play;
  readonly Info = Info;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  readonly heroMovies = computed(() => this.nowPlaying().filter(hasBackdropImage).slice(0, 5));

  readonly currentHeroMovie = computed(() => {
    const movies = this.heroMovies();
    return movies[this.heroIndex()] ?? null;
  });

  get noResultsDescription(): string {
    return `No encontramos películas para "${this.searchQuery}". Intenta con otro término.`;
  }

  ngOnInit(): void {
    this.loadNowPlaying();
    this.loadUpcoming();
    this.loadPopular();
    this.startHeroTimer();
  }

  ngOnDestroy(): void {
    if (this.heroTimer) clearInterval(this.heroTimer);
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

  setHeroIndex(i: number): void {
    this.heroIndex.set(i);
    this.resetHeroTimer();
  }

  showPreviousHero(): void {
    this.moveHero(-1);
  }

  showNextHero(): void {
    this.moveHero(1);
  }

  onHeroTouchStart(event: TouchEvent): void {
    this.heroTouchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  onHeroTouchEnd(event: TouchEvent): void {
    if (this.heroTouchStartX === null) return;

    const endX = event.changedTouches[0]?.clientX;
    if (endX === undefined) {
      this.heroTouchStartX = null;
      return;
    }

    const deltaX = endX - this.heroTouchStartX;
    this.heroTouchStartX = null;

    if (Math.abs(deltaX) < 48) return;

    if (deltaX > 0) {
      this.showPreviousHero();
    } else {
      this.showNextHero();
    }
  }

  backdropUrl(path: string): string {
    return movieImageUrl(path, 'w1280') ?? '';
  }

  scrollCarousel(section: CatalogCarousel, direction: 'left' | 'right'): void {
    const carousel = this.getCarousel(section)?.nativeElement;
    if (!carousel) return;

    const cardWidth = 176;
    const visibleCards = Math.max(1, Math.floor(carousel.clientWidth / cardWidth));
    const distance = visibleCards * cardWidth;

    carousel.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  }

  reloadActiveSection(): void {
    switch (this.activeSection()) {
      case 'nowPlaying':
        this.loadNowPlaying();
        break;
      case 'upcoming':
        this.loadUpcoming();
        break;
      case 'popular':
        this.loadPopular();
        break;
    }
  }

  private getCarousel(section: CatalogCarousel): ElementRef<HTMLElement> | undefined {
    switch (section) {
      case 'nowPlaying':
        return this.nowPlayingCarousel();
      case 'upcoming':
        return this.upcomingCarousel();
      case 'popular':
        return this.popularCarousel();
    }
  }

  private moveHero(offset: number): void {
    const total = this.heroMovies().length;
    if (total <= 1) return;

    this.heroIndex.update((index) => (index + offset + total) % total);
    this.resetHeroTimer();
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
