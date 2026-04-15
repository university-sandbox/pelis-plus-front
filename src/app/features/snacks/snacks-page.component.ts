import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, ShoppingCart, ChevronRight } from 'lucide-angular';

import { SnackService } from '../../core/services/snack.service';
import { CartService } from '../../core/services/cart.service';
import { type Snack, type SnackCategory } from '../../core/models/snack.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { SnackCardComponent } from './snack-card.component';

const CATEGORY_LABELS: Record<SnackCategory, string> = {
  popcorn: 'Canchitas',
  drinks: 'Bebidas',
  combos: 'Combos',
  sweets: 'Dulces',
  extras: 'Extras',
};

@Component({
  selector: 'app-snacks-page',
  imports: [
    LucideAngularModule,
    NavbarComponent,
    SkeletonLoaderComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    SnackCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar />

    <main class="min-h-dvh pb-28" style="background: var(--color-bg);">
      <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

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
            <h1 class="text-xl font-bold" style="color: var(--color-text-primary);">Confitería</h1>
            <p class="text-sm" style="color: var(--color-text-secondary);">Agrega snacks a tu pedido (opcional)</p>
          </div>
        </div>

        <!-- Category tabs -->
        @if (!loading() && !error()) {
          <div class="mb-6 flex gap-2 overflow-x-auto pb-2" style="scrollbar-width: none;">
            <button
              type="button"
              (click)="selectedCategory.set(null)"
              class="flex-none rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
              [style.background]="selectedCategory() === null ? 'var(--color-accent)' : 'var(--color-surface-raised)'"
              [style.color]="selectedCategory() === null ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)'"
            >Todos</button>
            @for (cat of categories(); track cat) {
              <button
                type="button"
                (click)="selectedCategory.set(cat)"
                class="flex-none rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
                [style.background]="selectedCategory() === cat ? 'var(--color-accent)' : 'var(--color-surface-raised)'"
                [style.color]="selectedCategory() === cat ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)'"
              >{{ categoryLabel(cat) }}</button>
            }
          </div>
        }

        <!-- Content -->
        @if (loading()) {
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            @for (n of [1,2,3,4,5,6,7,8]; track n) {
              <app-skeleton-loader height="220px" radius="12px" />
            }
          </div>
        } @else if (error()) {
          <app-error-state title="No pudimos cargar la confitería" (retry)="loadSnacks()" />
        } @else if (filteredSnacks().length === 0) {
          <app-empty-state title="Sin productos" description="No hay productos en esta categoría." />
        } @else {
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            @for (snack of filteredSnacks(); track snack.id) {
              <app-snack-card
                [snack]="snack"
                [quantity]="snackQuantity(snack.id)"
                (increment)="addSnack($event)"
                (decrement)="removeSnack($event)"
              />
            }
          </div>
        }
      </div>
    </main>

    <!-- Bottom bar -->
    <div
      class="fixed bottom-0 left-0 right-0 border-t p-4 sm:px-8"
      style="background: var(--color-surface); border-color: var(--color-border);"
      role="complementary"
      aria-label="Resumen del carrito"
    >
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div>
          @if (cartService.itemCount() > 0) {
            <p class="text-sm font-semibold" style="color: var(--color-text-primary);">
              {{ cartService.itemCount() }} item{{ cartService.itemCount() !== 1 ? 's' : '' }} en tu carrito
            </p>
            <p class="text-xs" style="color: var(--color-text-secondary);">Total: S/ {{ cartService.total() }}</p>
          } @else {
            <p class="text-sm" style="color: var(--color-text-secondary);">Tu carrito está vacío</p>
          }
        </div>
        <div class="flex gap-3">
          <button
            type="button"
            (click)="skipAndCheckout()"
            class="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
            style="border-color: var(--color-border-strong); color: var(--color-text-secondary);"
          >
            Omitir
          </button>
          <button
            type="button"
            (click)="goToCheckout()"
            class="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
            style="background: var(--color-accent); color: var(--color-text-inverse);"
          >
            Ir al pago
            <lucide-icon [img]="ChevronRight" [size]="14" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SnacksPageComponent implements OnInit {
  private readonly snackService = inject(SnackService);
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);

  readonly snacks = signal<Snack[]>([]);
  readonly categories = signal<SnackCategory[]>([]);
  readonly selectedCategory = signal<SnackCategory | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly ArrowLeft = ArrowLeft;
  readonly ShoppingCart = ShoppingCart;
  readonly ChevronRight = ChevronRight;

  readonly filteredSnacks = computed(() => {
    const cat = this.selectedCategory();
    return cat ? this.snacks().filter((s) => s.category === cat) : this.snacks();
  });

  ngOnInit(): void {
    this.loadSnacks();
  }

  loadSnacks(): void {
    this.loading.set(true);
    this.error.set(false);
    this.snackService.getSnacks().subscribe({
      next: (list) => {
        this.snacks.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
    this.snackService.getCategories().subscribe({ next: (c) => this.categories.set(c) });
  }

  snackQuantity(snackId: string): number {
    return this.cartService.cart().snacks
      .filter((i) => i.snack.id === snackId)
      .reduce((sum, i) => sum + i.quantity, 0);
  }

  addSnack(snack: Snack): void {
    this.cartService.addSnack({ snack, quantity: 1 });
  }

  removeSnack(snack: Snack): void {
    const current = this.snackQuantity(snack.id);
    if (current <= 1) {
      this.cartService.removeSnack(snack.id);
    } else {
      this.cartService.updateSnackQuantity(snack.id, current - 1);
    }
  }

  categoryLabel(cat: SnackCategory): string {
    return CATEGORY_LABELS[cat] ?? cat;
  }

  goBack(): void {
    void this.router.navigate(['/']);
  }

  skipAndCheckout(): void {
    void this.router.navigate(['/checkout']);
  }

  goToCheckout(): void {
    void this.router.navigate(['/checkout']);
  }
}
