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
import { ProductCustomizationModalComponent } from './product-customization-modal.component';
import { type CartSnackItem } from '../../core/models/cart.model';

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
    ProductCustomizationModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './snacks-page.component.html',
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
  readonly customizingSnack = signal<Snack | null>(null);

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

  onSnackIncrement(snack: Snack): void {
    // If snack has options, open customization modal
    if (snack.options && snack.options.length > 0) {
      this.customizingSnack.set(snack);
    } else {
      this.cartService.addSnack({ snack, quantity: 1 });
    }
  }

  onCustomizationAdded(item: CartSnackItem): void {
    this.cartService.addSnack(item);
    this.customizingSnack.set(null);
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
