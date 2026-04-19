import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  ArrowLeft,
  ShoppingCart,
  Info,
  Timer,
  AlertCircle,
} from 'lucide-angular';

const MAX_SEATS = 6;
const RESERVATION_SECONDS = 10 * 60; // 10 minutes

import { SeatService } from '../../core/services/seat.service';
import { CartService } from '../../core/services/cart.service';
import { type Seat, type SeatMap } from '../../core/models/seat.model';
import { type Screening } from '../../core/models/screening.model';
import { type Movie } from '../../core/models/movie.model';
import { type CartTicket } from '../../core/models/cart.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

const FORMAT_LABELS: Record<string, string> = {
  standard: '2D', '3d': '3D', imax: 'IMAX', dbox: 'D-BOX',
};

@Component({
  selector: 'app-seat-map-page',
  imports: [
    LucideAngularModule,
    NavbarComponent,
    SkeletonLoaderComponent,
    ErrorStateComponent,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './seat-map-page.component.html',
  styleUrl: './seat-map-page.component.scss',
})
export class SeatMapPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly seatService = inject(SeatService);
  private readonly cartService = inject(CartService);

  readonly screening = signal<Screening | null>(null);
  readonly movie = signal<Movie | null>(null);
  readonly seatMap = signal<SeatMap | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly adding = signal(false);
  readonly conflictError = signal('');

  readonly reservationExpiresAt = signal<string | null>(null);
  readonly countdownSeconds = signal(0);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  readonly selectedIds = signal<Set<string>>(new Set());

  readonly maxSeats = MAX_SEATS;

  readonly ArrowLeft = ArrowLeft;
  readonly ShoppingCart = ShoppingCart;
  readonly Info = Info;
  readonly Timer = Timer;
  readonly AlertCircle = AlertCircle;

  readonly legend = [
    { label: 'Libre', color: 'var(--color-seat-free)' },
    { label: 'Seleccionado', color: 'var(--color-seat-selected)' },
    { label: 'Ocupado', color: 'var(--color-seat-occupied)' },
    { label: 'Preferencial', color: 'var(--color-seat-preferential)' },
  ];

  readonly selectedSeats = computed<Seat[]>(() => {
    const map = this.seatMap();
    if (!map) return [];
    const ids = this.selectedIds();
    return map.seats.flat().filter((s) => ids.has(s.id));
  });

  readonly selectedSeatLabels = computed(() =>
    this.selectedSeats().map((s) => `${s.row}${s.col}`).join(', '),
  );

  readonly subtotal = computed(() => {
    const sc = this.screening();
    if (!sc) return 0;
    return this.selectedSeats().length * sc.price;
  });

  ngOnInit(): void {
    const nav = history.state as { screening?: Screening; movie?: Movie };
    if (!nav?.screening) {
      void this.router.navigate(['/']);
      return;
    }
    this.screening.set(nav.screening);
    this.movie.set(nav.movie ?? null);
    this.loadSeatMap();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
    const sc = this.screening();
    if (sc && this.selectedSeats().length > 0) {
      this.seatService.releaseSeats(sc.id).subscribe();
    }
  }

  startCountdown(expiresAt: string): void {
    this.reservationExpiresAt.set(expiresAt);
    this.stopCountdown();
    this.updateCountdown(expiresAt);
    this.countdownInterval = setInterval(() => this.updateCountdown(expiresAt), 1000);
  }

  private updateCountdown(expiresAt: string): void {
    const remaining = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
    this.countdownSeconds.set(remaining);
    if (remaining === 0) {
      this.stopCountdown();
      this.onReservationExpired();
    }
  }

  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  private onReservationExpired(): void {
    this.conflictError.set('Tu reserva de asientos ha expirado. Selecciona de nuevo.');
    this.reservationExpiresAt.set(null);
    this.selectedIds.set(new Set());
    this.loadSeatMap();
  }

  countdownDisplay(): string {
    const s = this.countdownSeconds();
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  loadSeatMap(): void {
    const sc = this.screening();
    if (!sc) return;
    this.loading.set(true);
    this.error.set(false);
    this.seatService.getSeatMap(sc.id).subscribe({
      next: (map) => {
        this.seatMap.set(map);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  toggleSeat(seat: Seat, rowIndex: number): void {
    if (seat.status === 'occupied' || seat.status === 'reserved') return;
    const map = this.seatMap();
    if (!map) return;

    const ids = new Set(this.selectedIds());
    if (ids.has(seat.id)) {
      ids.delete(seat.id);
      map.seats[rowIndex] = map.seats[rowIndex].map((s) =>
        s.id === seat.id ? { ...s, status: 'free' as const } : s,
      );
    } else {
      // Enforce max seats
      if (ids.size >= MAX_SEATS) return;
      ids.add(seat.id);
      map.seats[rowIndex] = map.seats[rowIndex].map((s) =>
        s.id === seat.id ? { ...s, status: 'selected' as const } : s,
      );
    }
    this.selectedIds.set(ids);
    this.seatMap.set({ ...map });
  }

  addToCartAndContinue(): void {
    const sc = this.screening();
    const m = this.movie();
    if (!sc || this.selectedSeats().length === 0) return;

    this.adding.set(true);
    // Reserve seats on backend
    this.seatService.reserveSeats(sc.id, this.selectedSeats().map((s) => s.id)).subscribe({
      next: (reservation) => {
        // Start countdown with expiry from backend
        if (reservation.expiresAt) {
          this.startCountdown(reservation.expiresAt);
        }
        this.conflictError.set('');
        this.selectedSeats().forEach((seat) => {
          const ticket: CartTicket = {
            screeningId: sc.id,
            movieId: sc.movieId,
            movieTitle: sc.movieTitle,
            moviePosterPath: m?.posterPath ?? null,
            date: sc.date,
            time: sc.time,
            venue: sc.venue.name,
            room: sc.room.name,
            format: sc.format,
            seat: { id: seat.id, row: seat.row, col: seat.col, type: seat.type },
            price: sc.price,
          };
          this.cartService.addTicket(ticket);
        });
        this.adding.set(false);
        void this.router.navigate(['/snacks']);
      },
      error: (err) => {
        this.adding.set(false);
        const msg = err?.error?.message ?? '';
        if (msg.toLowerCase().includes('reserv') || msg.toLowerCase().includes('conflict') || err?.status === 409) {
          this.conflictError.set('Uno o más asientos ya fueron tomados. Por favor selecciona otros.');
          this.loadSeatMap();
        } else {
          this.conflictError.set('Error al reservar asientos. Intenta de nuevo.');
        }
      },
    });
  }

  goBack(): void {
    const sc = this.screening();
    if (sc) {
      void this.router.navigate(['/movie', sc.movieId]);
    } else {
      void this.router.navigate(['/']);
    }
  }

  seatBg(seat: Seat): string {
    if (seat.status === 'selected') return 'var(--color-seat-selected)';
    if (seat.status === 'occupied' || seat.status === 'reserved') return 'var(--color-seat-occupied)';
    if (seat.type === 'preferential') return 'var(--color-seat-preferential)';
    return 'var(--color-seat-free)';
  }

  seatStatusLabel(seat: Seat): string {
    if (seat.status === 'occupied') return 'ocupado';
    if (seat.status === 'selected') return 'seleccionado';
    if (seat.type === 'preferential') return 'preferencial';
    return 'libre';
  }

  formatLabel(format: string): string {
    return FORMAT_LABELS[format] ?? format.toUpperCase();
  }
}
