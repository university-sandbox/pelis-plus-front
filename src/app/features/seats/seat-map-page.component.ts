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
} from 'lucide-angular';

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
  template: `
    <app-navbar />

    <main class="min-h-dvh" style="background: var(--color-bg);">
      <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        <!-- Header -->
        <div class="mb-6 flex items-center gap-3">
          <button
            type="button"
            (click)="goBack()"
            class="flex items-center gap-2 rounded-full p-2 transition-colors"
            style="background: var(--color-surface-raised); color: var(--color-text-secondary);"
            aria-label="Volver"
          >
            <lucide-icon [img]="ArrowLeft" [size]="18" aria-hidden="true" />
          </button>
          <div>
            <h1 class="text-xl font-bold" style="color: var(--color-text-primary);">
              Elige tus asientos
            </h1>
            @if (screening()) {
              <p class="text-sm" style="color: var(--color-text-secondary);">
                {{ screening()!.venue.name }} · {{ screening()!.room.name }} ·
                {{ screening()!.date }} {{ screening()!.time }} ·
                {{ formatLabel(screening()!.format) }}
              </p>
            }
          </div>
        </div>

        @if (loading()) {
          <app-skeleton-loader height="320px" radius="12px" />
        } @else if (error()) {
          <app-error-state title="No pudimos cargar el mapa de asientos" (retry)="loadSeatMap()" />
        } @else if (seatMap(); as map) {

          <!-- Screen indicator -->
          <div class="mb-8 text-center">
            <div
              class="mx-auto mb-2 h-2 rounded-full"
              style="width: 60%; max-width: 360px; background: linear-gradient(to bottom, var(--color-accent), transparent);"
            ></div>
            <p class="text-xs font-semibold uppercase tracking-widest" style="color: var(--color-text-disabled);">Pantalla</p>
          </div>

          <!-- Seat grid — horizontally scrollable on mobile -->
          <div class="overflow-x-auto pb-4">
            <div class="inline-block min-w-max">
              @for (row of map.rows; track row; let ri = $index) {
                <div class="mb-1.5 flex items-center gap-1.5">
                  <span class="w-5 text-center text-xs font-semibold" style="color: var(--color-text-disabled);">{{ row }}</span>
                  @for (seat of map.seats[ri]; track seat.id) {
                    <button
                      type="button"
                      [attr.aria-label]="'Asiento ' + seat.row + seat.col + ' — ' + seatStatusLabel(seat)"
                      [attr.aria-pressed]="seat.status === 'selected'"
                      [disabled]="seat.status === 'occupied' || seat.status === 'reserved'"
                      (click)="toggleSeat(seat, ri)"
                      class="seat-btn h-7 w-7 rounded-md text-xs font-bold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-1"
                      [style.background]="seatBg(seat)"
                      [style.cursor]="seat.status === 'occupied' || seat.status === 'reserved' ? 'not-allowed' : 'pointer'"
                      style="focus-visible:outline-color: var(--color-accent);"
                    >
                      {{ seat.col }}
                    </button>
                  }
                  <span class="w-5 text-center text-xs font-semibold" style="color: var(--color-text-disabled);">{{ row }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Legend -->
          <div class="mt-6 flex flex-wrap justify-center gap-4">
            @for (item of legend; track item.label) {
              <div class="flex items-center gap-2">
                <div class="h-4 w-4 rounded" [style.background]="item.color"></div>
                <span class="text-xs" style="color: var(--color-text-secondary);">{{ item.label }}</span>
              </div>
            }
          </div>

        }
      </div>
    </main>

    <!-- Bottom bar — sticky summary -->
    @if (selectedSeats().length > 0) {
      <div
        class="fixed bottom-0 left-0 right-0 border-t p-4 sm:px-8"
        style="background: var(--color-surface); border-color: var(--color-border);"
        role="complementary"
        aria-label="Resumen de selección"
      >
        <div class="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div>
            <p class="text-sm font-semibold" style="color: var(--color-text-primary);">
              {{ selectedSeats().length }} asiento{{ selectedSeats().length !== 1 ? 's' : '' }} seleccionado{{ selectedSeats().length !== 1 ? 's' : '' }}
            </p>
            <p class="text-xs mt-0.5" style="color: var(--color-text-secondary);">
              {{ selectedSeatLabels() }}
            </p>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-lg font-bold" style="color: var(--color-text-primary);">
                S/ {{ subtotal() }}
              </p>
              <p class="text-xs" style="color: var(--color-text-secondary);">Total</p>
            </div>
            <button
              type="button"
              (click)="addToCartAndContinue()"
              [disabled]="adding()"
              class="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
              style="background: var(--color-accent); color: var(--color-text-inverse);"
            >
              <lucide-icon [img]="ShoppingCart" [size]="16" aria-hidden="true" />
              {{ adding() ? 'Agregando...' : 'Agregar al carrito' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .seat-btn:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 1px;
    }
    .seat-btn:not(:disabled):hover {
      transform: scale(1.15);
    }
  `,
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

  readonly selectedIds = signal<Set<string>>(new Set());

  readonly ArrowLeft = ArrowLeft;
  readonly ShoppingCart = ShoppingCart;
  readonly Info = Info;

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
    // Release seats if user navigates away without completing purchase
    const sc = this.screening();
    if (sc && this.selectedSeats().length > 0) {
      this.seatService.releaseSeats(sc.id).subscribe();
    }
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
      ids.add(seat.id);
      map.seats[rowIndex] = map.seats[rowIndex].map((s) =>
        s.id === seat.id ? { ...s, status: 'selected' as const } : s,
      );
    }
    this.selectedIds.set(ids);
    // Trigger change detection for seatMap signal
    this.seatMap.set({ ...map });
  }

  addToCartAndContinue(): void {
    const sc = this.screening();
    const m = this.movie();
    if (!sc || this.selectedSeats().length === 0) return;

    this.adding.set(true);
    // Reserve seats on backend
    this.seatService.reserveSeats(sc.id, this.selectedSeats().map((s) => s.id)).subscribe({
      next: () => {
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
      error: () => {
        this.adding.set(false);
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
