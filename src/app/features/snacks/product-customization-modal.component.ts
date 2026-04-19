import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { LucideAngularModule, X, ShoppingCart, Plus, Minus } from 'lucide-angular';

import { type Snack } from '../../core/models/snack.model';
import { type CartSnackItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-product-customization-modal',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-customization-modal.component.html',
})
export class ProductCustomizationModalComponent implements OnInit {
  readonly snack = input.required<Snack>();
  readonly added = output<CartSnackItem>();
  readonly cancelled = output<void>();

  readonly quantity = signal(1);
  readonly selectedOptions = signal<Record<string, string>>({});

  readonly X = X;
  readonly ShoppingCart = ShoppingCart;
  readonly Plus = Plus;
  readonly Minus = Minus;

  readonly missingOptions = computed(() => {
    const opts = this.snack().options ?? [];
    const selected = this.selectedOptions();
    return opts.filter((o) => o.choices.length > 0 && !selected[o.label]).map((o) => o.label);
  });

  readonly lineTotal = computed(() => (this.snack().price * this.quantity()).toFixed(2));

  ngOnInit(): void {
    // Pre-select first choice for each option
    const defaults: Record<string, string> = {};
    for (const opt of this.snack().options ?? []) {
      if (opt.choices.length > 0) defaults[opt.label] = opt.choices[0];
    }
    this.selectedOptions.set(defaults);
  }

  selectOption(label: string, choice: string): void {
    this.selectedOptions.update((o) => ({ ...o, [label]: choice }));
  }

  increment(): void { this.quantity.update((q) => q + 1); }
  decrement(): void { this.quantity.update((q) => Math.max(1, q - 1)); }

  addToCart(): void {
    if (this.missingOptions().length > 0) return;
    const item: CartSnackItem = {
      snack: this.snack(),
      quantity: this.quantity(),
      selectedOptions: Object.keys(this.selectedOptions()).length > 0 ? { ...this.selectedOptions() } : undefined,
    };
    this.added.emit(item);
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancelled.emit();
  }
}
