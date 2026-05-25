import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import type { OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Minus,
  Plus,
  Trash2,
  Tag,
  TicketCheck,
} from 'lucide-angular';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { MembershipService } from '../../core/services/membership.service';
import { type CartTicket, type CartSnackItem } from '../../core/models/cart.model';
import { type CreateOrderResponse } from '../../core/models/order.model';
import { type ActiveMembership, type MembershipPlan } from '../../core/models/membership.model';
import { summarizeMembershipDiscount } from '../../core/models/membership-discount';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

const FORMAT_LABELS: Record<string, string> = {
  standard: '2D',
  '3d': '3D',
  imax: 'IMAX',
  dbox: 'D-BOX',
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
  private readonly authService = inject(AuthService);
  private readonly membershipService = inject(MembershipService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly paying = signal(false);
  readonly paymentError = signal<string | null>(null);
  readonly paymentCancelled = signal(false);
  readonly membershipLoading = signal(true);
  readonly activeMembership = signal<ActiveMembership | null>(null);
  readonly activeMembershipPlan = signal<MembershipPlan | null>(null);
  readonly pendingPayment = signal<CreateOrderResponse | null>(null);
  readonly membershipBenefit = computed(() =>
    summarizeMembershipDiscount(
      this.cartService.cart().tickets,
      this.cartService.cart().snacks,
      this.activeMembership(),
      this.activeMembershipPlan(),
    ),
  );
  readonly displayDiscount = computed(
    () => this.pendingPayment()?.order.discount ?? this.membershipBenefit().discount,
  );
  readonly displayTotal = computed(
    () =>
      this.pendingPayment()?.order.total ??
      Math.max(0, this.cartService.subtotal() - this.displayDiscount()),
  );
  readonly membershipTicketsApplied = computed(
    () =>
      this.pendingPayment()?.membershipTicketsApplied ??
      this.membershipBenefit().freeTicketsApplied,
  );
  readonly membershipSnacksApplied = computed(() => this.membershipBenefit().freeSnacksApplied);
  readonly membershipTicketDiscount = computed(() =>
    this.pendingPayment()
      ? Math.max(0, this.displayDiscount() - this.membershipSnackDiscount())
      : this.membershipBenefit().ticketDiscount,
  );
  readonly membershipSnackDiscount = computed(() => this.membershipBenefit().snackDiscount);

  readonly ArrowLeft = ArrowLeft;
  readonly CreditCard = CreditCard;
  readonly ShieldCheck = ShieldCheck;
  readonly Minus = Minus;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Tag = Tag;
  readonly TicketCheck = TicketCheck;

  ngOnInit(): void {
    if (!this.authService.isClient()) {
      void this.router.navigate(['/catalog']);
      return;
    }

    this.loadMembershipBenefit();
    this.paymentCancelled.set(this.route.snapshot.queryParamMap.get('payment') === 'cancelled');
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
    this.syncMembershipDiscount();
    this.pendingPayment.set(null);
  }

  incrementSnack(item: CartSnackItem): void {
    this.cartService.updateSnackQuantity(item.snack.id, item.quantity + 1, item.selectedOptions);
    this.syncMembershipDiscount();
    this.pendingPayment.set(null);
  }

  decrementSnack(item: CartSnackItem): void {
    this.cartService.updateSnackQuantity(item.snack.id, item.quantity - 1, item.selectedOptions);
    this.syncMembershipDiscount();
    this.pendingPayment.set(null);
  }

  removeSnack(item: CartSnackItem): void {
    this.cartService.removeSnack(item.snack.id, item.selectedOptions);
    this.syncMembershipDiscount();
    this.pendingPayment.set(null);
  }

  pay(): void {
    if (this.paying()) {
      return;
    }

    if (!this.authService.isClient()) {
      void this.router.navigate(['/catalog']);
      return;
    }

    if (this.membershipLoading()) {
      return;
    }

    this.syncMembershipDiscount();
    this.paying.set(true);
    this.paymentError.set(null);
    this.paymentCancelled.set(false);
    this.pendingPayment.set(null);
    const cart = this.cartService.cart();
    this.orderService
      .createOrder({
        tickets: cart.tickets,
        snacks: cart.snacks,
        membershipDiscount: cart.membershipDiscount,
      })
      .subscribe({
        next: (res) => {
          if (!res.requiresPayment) {
            this.cartService.clear();
            this.paying.set(false);
            void this.router.navigate(['/confirmation', res.order.id], {
              state: { order: res.order, cart },
            });
            return;
          }

          this.pendingPayment.set(res);
          if (res.checkoutUrl) {
            window.location.assign(res.checkoutUrl);
            return;
          }

          this.paying.set(false);
          this.paymentError.set('Stripe no devolvió una URL de checkout para este pedido.');
        },
        error: (error: unknown) => {
          this.paying.set(false);
          this.paymentError.set(this.paymentErrorMessage(error));
        },
      });
  }

  private loadMembershipBenefit(): void {
    this.membershipLoading.set(true);
    this.cartService.applyMembershipDiscount(0);

    forkJoin({
      membership: this.membershipService.getMyPlan().pipe(catchError(() => of(null))),
      plans: this.membershipService.getPlans().pipe(catchError(() => of<MembershipPlan[]>([]))),
    })
      .pipe(finalize(() => this.membershipLoading.set(false)))
      .subscribe(({ membership, plans }) => {
        this.activeMembership.set(membership);
        this.activeMembershipPlan.set(
          membership ? this.findPlanForMembership(membership, plans) : null,
        );
        this.syncMembershipDiscount();
      });
  }

  private findPlanForMembership(
    membership: ActiveMembership,
    plans: readonly MembershipPlan[],
  ): MembershipPlan | null {
    return (
      plans.find((plan) => String(plan.id) === String(membership.planId)) ??
      plans.find((plan) => plan.name === membership.planName) ??
      null
    );
  }

  private syncMembershipDiscount(): void {
    this.cartService.applyMembershipDiscount(this.membershipBenefit().discount);
  }

  private paymentErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const message = typeof error.error?.message === 'string' ? error.error.message : '';
      if (message.includes('STRIPE_SECRET_KEY')) {
        return 'Falta configurar STRIPE_SECRET_KEY en el backend para crear la sesión de Stripe.';
      }
      if (message) {
        return message;
      }
    }

    return 'No pudimos preparar el pedido. Revisa la configuración de Stripe e inténtalo de nuevo.';
  }
}
