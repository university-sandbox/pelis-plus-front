import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe, NgOptimizedImage, SlicePipe } from '@angular/common';
import {
  LucideAngularModule,
  Star,
  Clock,
  Globe,
  Play,
  ArrowLeft,
  ShoppingCart,
  Calendar,
  MapPin,
  ChevronRight,
} from 'lucide-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { MovieService } from '../../core/services/movie.service';
import { ScreeningService } from '../../core/services/screening.service';
import { CartService } from '../../core/services/cart.service';
import { type Movie } from '../../core/models/movie.model';
import { type Screening, type ScreeningFormat, type Venue } from '../../core/models/screening.model';
import { TMDB } from '../../core/api/endpoints';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

interface TmdbVideoResult {
  key: string;
  name: string;
  type: string;
  site: string;
}

const FORMAT_LABELS: Record<ScreeningFormat, string> = {
  standard: '2D',
  '3d': '3D',
  imax: 'IMAX',
  dbox: 'D-BOX',
};

@Component({
  selector: 'app-movie-detail-page',
  imports: [
    RouterLink,
    DecimalPipe,
    SlicePipe,
    NgOptimizedImage,
    LucideAngularModule,
    NavbarComponent,
    SkeletonLoaderComponent,
    ErrorStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movie-detail-page.component.html',
  styleUrl: './movie-detail-page.component.scss',
})
export class MovieDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly movieService = inject(MovieService);
  private readonly screeningService = inject(ScreeningService);
  private readonly cartService = inject(CartService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly movie = signal<Movie | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly screenings = signal<Screening[]>([]);
  readonly screeningsLoading = signal(true);
  readonly screeningsError = signal(false);

  readonly selectedVenueId = signal<string | null>(null);
  readonly selectedDate = signal<string | null>(null);
  readonly showTrailer = signal(false);

  readonly Star = Star;
  readonly Clock = Clock;
  readonly Globe = Globe;
  readonly Play = Play;
  readonly ArrowLeft = ArrowLeft;
  readonly ShoppingCart = ShoppingCart;
  readonly Calendar = Calendar;
  readonly MapPin = MapPin;
  readonly ChevronRight = ChevronRight;

  readonly venues = computed<Venue[]>(() => {
    const seen = new Set<string>();
    return this.screenings()
      .map((s) => s.venue)
      .filter((v) => { if (seen.has(v.id)) return false; seen.add(v.id); return true; });
  });

  readonly availableDates = computed<string[]>(() => {
    const sc = this.selectedVenueId()
      ? this.screenings().filter((s) => s.venue.id === this.selectedVenueId())
      : this.screenings();
    return [...new Set(sc.map((s) => s.date))].sort();
  });

  readonly filteredScreenings = computed<Screening[]>(() => {
    let list = this.screenings().filter((s) => s.status !== 'cancelled');
    if (this.selectedVenueId()) {
      list = list.filter((s) => s.venue.id === this.selectedVenueId());
    }
    const date = this.selectedDate() ?? this.availableDates()[0] ?? null;
    if (date) {
      list = list.filter((s) => s.date === date);
    }
    return list.sort((a, b) => a.time.localeCompare(b.time));
  });

  readonly trailerKey = computed<string | null>(() => {
    const m = this.movie();
    if (!m) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const videos: TmdbVideoResult[] = (m as any).videos?.results ?? [];
    const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
    return trailer?.key ?? null;
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      void this.router.navigate(['/']);
      return;
    }
    this.loadMovie(id);
  }

  loadMovie(id?: number): void {
    const movieId = id ?? Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);
    this.error.set(false);
    this.movieService.getDetail(movieId).subscribe({
      next: (m) => {
        this.movie.set(m);
        this.loading.set(false);
        this.loadScreenings(movieId, m.title);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  loadScreenings(movieId?: number, title?: string): void {
    const id = movieId ?? Number(this.route.snapshot.paramMap.get('id'));
    const t = title ?? this.movie()?.title ?? '';
    this.screeningsLoading.set(true);
    this.screeningsError.set(false);
    this.screeningService.getForMovie(id, t).subscribe({
      next: (list) => {
        this.screenings.set(list);
        this.screeningsLoading.set(false);
        if (list.length > 0) {
          this.selectedDate.set(list[0].date);
        }
      },
      error: () => {
        this.screeningsError.set(true);
        this.screeningsLoading.set(false);
      },
    });
  }

  goToSeats(screening: Screening): void {
    void this.router.navigate(['/seats', screening.id], {
      state: { screening, movie: this.movie() },
    });
  }

  backdropUrl(path: string): string {
    return TMDB.imageUrl('w1280', path);
  }

  posterUrl(path: string | null): string | null {
    return path ? TMDB.imageUrl('w500', path) : null;
  }

  safeTrailerUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.trailerKey()}?autoplay=1`,
    );
  }

  formatRuntime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  }

  formatLabel(format: ScreeningFormat): string {
    return FORMAT_LABELS[format] ?? format.toUpperCase();
  }

  dayLabel(dateStr: string): string {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', '');
  }

  dateNum(dateStr: string): string {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  }
}
