import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreditCard, LucideAngularModule, ShieldCheck } from 'lucide-angular';

import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-stripe-success-page',
  imports: [LucideAngularModule, NavbarComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar />

    <main class="min-h-dvh px-4 py-10" style="background: var(--color-bg)">
      <section
        class="mx-auto max-w-md rounded-xl p-6 text-center"
        style="background: var(--color-surface); border: 1px solid var(--color-border)"
        aria-live="polite"
      >
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style="background: var(--color-accent-muted); color: var(--color-accent)"
        >
          <lucide-icon [img]="statusIcon()" [size]="24" aria-hidden="true" />
        </div>

        <h1 class="text-xl font-bold" style="color: var(--color-text-primary)">
          {{ title() }}
        </h1>
        <p class="mt-2 text-sm leading-6" style="color: var(--color-text-secondary)">
          {{ message() }}
        </p>

        @if (error()) {
          <a
            routerLink="/checkout"
            class="mt-5 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold"
            style="background: var(--color-accent); color: var(--color-text-inverse)"
          >
            Volver al checkout
          </a>
        }
      </section>
    </main>
  `,
})
export class StripeSuccessPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);
  private readonly cartService = inject(CartService);

  readonly error = signal(false);
  readonly title = signal('Verificando pago');
  readonly message = signal('Estamos confirmando tu pago con Stripe y preparando tus entradas.');
  readonly statusIcon = signal(CreditCard);

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (!sessionId) {
      this.showError('No encontramos la sesión de Stripe para verificar el pago.');
      return;
    }

    this.orderService.confirmStripeCheckout(sessionId).subscribe({
      next: (order) => {
        this.cartService.clear();
        void this.router.navigate(['/confirmation', order.id], { state: { order } });
      },
      error: () => {
        this.showError('Stripe todavía no reporta este pago como completado. Inténtalo nuevamente.');
      },
    });
  }

  private showError(message: string): void {
    this.error.set(true);
    this.title.set('No pudimos confirmar el pago');
    this.message.set(message);
    this.statusIcon.set(ShieldCheck);
  }
}
