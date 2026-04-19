import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { LucideAngularModule, Plus, Minus, ShoppingCart } from 'lucide-angular';

import { type Snack } from '../../core/models/snack.model';
import { type CartSnackItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-snack-card',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './snack-card.component.html',
})
export class SnackCardComponent {
  readonly snack = input.required<Snack>();
  readonly quantity = input<number>(0);
  readonly increment = output<Snack>();
  readonly decrement = output<Snack>();

  readonly Plus = Plus;
  readonly Minus = Minus;
  readonly ShoppingCart = ShoppingCart;

  categoryEmoji(cat: string): string {
    const map: Record<string, string> = {
      popcorn: '🍿', drinks: '🥤', combos: '🎬', sweets: '🍬', extras: '🌮',
    };
    return map[cat] ?? '🍽️';
  }
}
