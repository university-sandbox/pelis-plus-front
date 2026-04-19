import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft, CreditCard, ShieldCheck, Minus, Plus, Trash2, Tag } from 'lucide-angular';

import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { MembershipService } from '../../core/services/membership.service';
import { type CartTicket, type CartSnackItem, cartSubtotal } from '../../core/models/cart.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

const FORMAT_LABELS: Record<string, string> = {
  standard: '2D', '3d': '3D', imax: 'IMAX', dbox: 'D-BOX',
};

@Component({
  selector: 'app-checkout-page',
  imports: [RouterLink, LucideAngularModule, NavbarComponent],

  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkout-page.component.html',
})
export class CheckoutPageComponent implements OnInit {
  readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly membershipService = inject(MembershipService);
  private readonly router = inject(Router);

  readonly paying = signal(false);
  readonly paymentError = signal(false);
  readonly membershipName = signal<string | null>(null);

  readonly ArrowLeft = ArrowLeft;
  readonly CreditCard = CreditCard;
  readonly ShieldCheck = ShieldCheck;
  readonly Minus = Minus;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Tag = Tag;

  ngOnInit(): void {
    this.applyMembershipDiscount();
  }

  private applyMembershipDiscount(): void {
    this.membershipService.getMyPlan().subscribe({
      next: (membership) => {
        if (!membership) return;
        // Check quota hasn't been exhausted
        if (membership.ticketsUsed >= membership.ticketsTotal) return;

        const ticketSubtotal = this.cartService.cart().tickets.reduce((s, t) => s + t.price, 0);

        // Fetch full plan to get discountPercentage
        this.membershipService.getPlans().subscribe({
          next: (plans) => {
            const plan = plans.find((p) => p.id === membership.planId);
            if (!plan) return;
            const discountAmount = parseFloat(
              (ticketSubtotal * plan.discountPercentage / 100).toFixed(2),
            );
            if (discountAmount > 0) {
              this.cartService.applyMembershipDiscount(discountAmount);
              this.membershipName.set(plan.name);
            }
          },
        });
      },
    });
  }

  ticketTotal(): number {
    return this.cartService.cart().tickets.reduce((s, t) => s + t.price, 0);
  }

  snackTotal(): number {
    return this.cartService.cart().snacks.reduce((s, i) => s + i.snack.price * i.quantity, 0);
  }

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

  removeSnack(item: CartSnackItem): void {
    this.cartService.removeSnack(item.snack.id, item.selectedOptions);
  }

  pay(): void {
    this.paying.set(true);
    this.paymentError.set(false);
    const cart = this.cartService.cart();
    this.orderService.createOrder({
      tickets: cart.tickets,
      snacks: cart.snacks,
      membershipDiscount: cart.membershipDiscount,
    }).subscribe({
      next: (res) => {
        // In mock mode: skip real Izipay and confirm immediately
        this.orderService.confirmOrder(res.orderId, { mock: true }).subscribe({
          next: (order) => {
            this.cartService.clear();
            this.paying.set(false);
            void this.router.navigate(['/confirmation', order.id], {
              state: { order, cart },
            });
          },
          error: () => {
            this.paying.set(false);
            this.paymentError.set(true);
          },
        });
      },
      error: () => {
        this.paying.set(false);
        this.paymentError.set(true);
      },
    });
  }
}
