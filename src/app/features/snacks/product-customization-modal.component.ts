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
  template: `
    <div
      class="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4"
      style="background: rgba(0,0,0,0.7);"
      (click)="onBackdrop($event)"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="'Personalizar ' + snack().name"
    >
      <div
        class="w-full max-w-sm rounded-2xl pb-safe"
        style="background: var(--color-surface); border: 1px solid var(--color-border);"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-5 py-4"
          style="border-bottom: 1px solid var(--color-border);"
        >
          <h2 class="text-base font-bold" style="color: var(--color-text-primary);">
            {{ snack().name }}
          </h2>
          <button
            type="button"
            (click)="cancelled.emit()"
            class="rounded-lg p-1.5 transition-colors"
            style="color: var(--color-text-secondary);"
            aria-label="Cerrar"
          >
            <lucide-icon [img]="X" [size]="18" aria-hidden="true" />
          </button>
        </div>

        <div class="px-5 py-4 space-y-4">
          <!-- Snack image + description -->
          @if (snack().image) {
            <img
              [src]="snack().image"
              [alt]="snack().name"
              class="w-full h-40 rounded-xl object-cover"
            />
          }
          @if (snack().description) {
            <p class="text-sm" style="color: var(--color-text-secondary);">{{ snack().description }}</p>
          }

          <!-- Options -->
          @for (option of snack().options ?? []; track option.label) {
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide" style="color: var(--color-text-secondary);">
                {{ option.label }}
              </p>
              <div class="flex flex-wrap gap-2">
                @for (choice of option.choices; track choice) {
                  <button
                    type="button"
                    (click)="selectOption(option.label, choice)"
                    class="rounded-full border px-3 py-1.5 text-sm font-medium transition-colors"
                    [style.background]="selectedOptions()[option.label] === choice ? 'var(--color-accent)' : 'var(--color-surface-raised)'"
                    [style.border-color]="selectedOptions()[option.label] === choice ? 'var(--color-accent)' : 'var(--color-border)'"
                    [style.color]="selectedOptions()[option.label] === choice ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)'"
                  >
                    {{ choice }}
                  </button>
                }
              </div>
            </div>
          }

          <!-- Quantity -->
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold" style="color: var(--color-text-secondary);">Cantidad</p>
            <div class="flex items-center gap-3">
              <button
                type="button"
                (click)="decrement()"
                [disabled]="quantity() <= 1"
                class="flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-40"
                style="background: var(--color-surface-raised); color: var(--color-text-primary);"
                aria-label="Reducir cantidad"
              >
                <lucide-icon [img]="Minus" [size]="14" aria-hidden="true" />
              </button>
              <span class="w-6 text-center font-bold" style="color: var(--color-text-primary);">{{ quantity() }}</span>
              <button
                type="button"
                (click)="increment()"
                class="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                style="background: var(--color-surface-raised); color: var(--color-text-primary);"
                aria-label="Aumentar cantidad"
              >
                <lucide-icon [img]="Plus" [size]="14" aria-hidden="true" />
              </button>
            </div>
          </div>

          <!-- Missing option validation -->
          @if (missingOptions().length > 0) {
            <p class="text-xs" style="color: var(--color-error);">
              Selecciona: {{ missingOptions().join(', ') }}
            </p>
          }
        </div>

        <!-- Footer -->
        <div class="px-5 pb-5">
          <button
            type="button"
            (click)="addToCart()"
            [disabled]="missingOptions().length > 0"
            class="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-colors disabled:opacity-50"
            style="background: var(--color-accent); color: var(--color-text-inverse);"
          >
            <lucide-icon [img]="ShoppingCart" [size]="16" aria-hidden="true" />
            Agregar · S/ {{ lineTotal() }}
          </button>
        </div>
      </div>
    </div>
  `,
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
