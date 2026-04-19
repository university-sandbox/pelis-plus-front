import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, X, Trash2, Minus, Plus, ShoppingCart, ChevronRight } from 'lucide-angular';

import { CartService } from '../../core/services/cart.service';
import { type CartTicket, type CartSnackItem } from '../../core/models/cart.model';

const FORMAT_LABELS: Record<string, string> = {
  standard: '2D', '3d': '3D', imax: 'IMAX', dbox: 'D-BOX',
};

@Component({
  selector: 'app-cart-sidebar',
  imports: [RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-sidebar.component.html',
})
export class CartSidebarComponent {
  readonly cartService = inject(CartService);

  readonly X = X;
  readonly Trash2 = Trash2;
  readonly Minus = Minus;
  readonly Plus = Plus;
  readonly ShoppingCart = ShoppingCart;
  readonly ChevronRight = ChevronRight;

  formatLabel(format: string): string {
    return FORMAT_LABELS[format] ?? format.toUpperCase();
  }

  removeTicket(ticket: CartTicket): void {
    this.cartService.removeTicket(ticket.seat.id);
  }

  incrementSnack(item: CartSnackItem): void {
    this.cartService.updateSnackQuantity(item.snack.id, item.quantity + 1, item.selectedOptions);
  }

  decrementSnack(item: CartSnackItem): void {
    this.cartService.updateSnackQuantity(item.snack.id, item.quantity - 1, item.selectedOptions);
  }
}
