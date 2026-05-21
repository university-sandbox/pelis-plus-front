import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { LucideAngularModule, Plus, Minus, Popcorn, CupSoda, Candy, Utensils, PackagePlus } from 'lucide-angular';

import { type Snack } from '../../core/models/snack.model';

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
  readonly Popcorn = Popcorn;
  readonly CupSoda = CupSoda;
  readonly Candy = Candy;
  readonly Utensils = Utensils;
  readonly PackagePlus = PackagePlus;
}
