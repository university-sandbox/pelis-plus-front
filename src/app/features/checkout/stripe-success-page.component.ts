import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CheckCircle, CreditCard, LogIn, LucideAngularModule, RefreshCw, ShieldCheck, Ticket, User } from 'lucide-angular';

import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { type Order } from '../../core/models/order.model';
import { AuthService } from '../../core/services/auth.service';

type PaymentFeedbackStatus = 'verifying' | 'confirmed' | 'failed' | 'auth-required';
const MINIMUM_FEEDBACK_MS = 1500;

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

        @if (confirmedOrder(); as order) {
          <div
            class="mt-4 rounded-lg px-3 py-2 text-sm"
            style="background: var(--color-surface-raised); color: var(--color-text-secondary); border: 1px solid var(--color-border)"
          >
            Pedido {{ order.id }}
          </div>
        }

        <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          @if (status() === 'confirmed' && confirmedOrder(); as order) {
            <a
              [routerLink]="['/confirmation', order.id]"
              class="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
              style="background: var(--color-accent); color: var(--color-text-inverse)"
            >
              <lucide-icon [img]="TicketIcon" [size]="16" aria-hidden="true" />
              Ver entradas
            </a>
            <a
              routerLink="/profile"
              class="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
              style="background: var(--color-surface-raised); color: var(--color-text-primary); border: 1px solid var(--color-border)"
            >
              <lucide-icon [img]="User" [size]="16" aria-hidden="true" />
              Ir a mi perfil
            </a>
          } @else if (status() === 'auth-required') {
            <a
              routerLink="/login"
              [queryParams]="{ redirect: currentUrl() }"
              class="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
              style="background: var(--color-accent); color: var(--color-text-inverse)"
            >
              <lucide-icon [img]="LogIn" [size]="16" aria-hidden="true" />
              Iniciar sesión para verificar
            </a>
          } @else if (status() === 'failed') {
            <button
              type="button"
              (click)="retryConfirmation()"
              class="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
              style="background: var(--color-accent); color: var(--color-text-inverse)"
            >
              <lucide-icon [img]="RefreshCw" [size]="16" aria-hidden="true" />
              Reintentar verificación
            </button>
            <a
              routerLink="/checkout"
              class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold"
              style="background: var(--color-surface-raised); color: var(--color-text-primary); border: 1px solid var(--color-border)"
            >
              Volver al checkout
            </a>
          }
        </div>

        @if (status() === 'verifying') {
          <p class="mt-5 text-xs" style="color: var(--color-text-secondary)">
            No cierres esta ventana mientras validamos la respuesta de Stripe.
          </p>
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
  private readonly authService = inject(AuthService);

  readonly status = signal<PaymentFeedbackStatus>('verifying');
  readonly confirmedOrder = signal<Order | null>(null);
  readonly currentUrl = signal('');
  readonly title = signal('Verificando pago');
  readonly message = signal('Estamos confirmando tu pago con Stripe y preparando tus entradas.');
  readonly statusIcon = signal(CreditCard);
  readonly TicketIcon = Ticket;
  readonly User = User;
  readonly RefreshCw = RefreshCw;
  readonly LogIn = LogIn;

  ngOnInit(): void {
    this.currentUrl.set(this.router.url);
    this.confirmPayment();
  }

  retryConfirmation(): void {
    this.confirmPayment();
  }

  private confirmPayment(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (!sessionId) {
      this.showError('No encontramos la sesión de Stripe para verificar el pago.');
      return;
    }

    if (!this.authService.isClient()) {
      this.status.set('auth-required');
      this.confirmedOrder.set(null);
      this.title.set('Pago recibido por Stripe');
      this.message.set('Inicia sesión para verificar el pago en PelisPlus y emitir tus entradas.');
      this.statusIcon.set(ShieldCheck);
      return;
    }

    this.status.set('verifying');
    this.confirmedOrder.set(null);
    this.title.set('Verificando pago');
    this.message.set('Estamos confirmando tu pago con Stripe y preparando tus entradas.');
    this.statusIcon.set(CreditCard);
    const startedAt = Date.now();

    this.orderService.confirmStripeCheckout(sessionId).subscribe({
      next: (order) => {
        this.afterMinimumFeedbackTime(startedAt, () => {
          this.cartService.clear();
          this.confirmedOrder.set(order);
          this.status.set('confirmed');
          this.title.set('Pago confirmado');
          this.message.set('Tu pago fue aprobado y tus entradas ya están listas.');
          this.statusIcon.set(CheckCircle);
        });
      },
      error: () => {
        this.afterMinimumFeedbackTime(startedAt, () => {
          this.showError('Stripe todavía no reporta este pago como completado. Inténtalo nuevamente.');
        });
      },
    });
  }

  private afterMinimumFeedbackTime(startedAt: number, callback: () => void): void {
    const remainingMs = Math.max(0, MINIMUM_FEEDBACK_MS - (Date.now() - startedAt));
    setTimeout(callback, remainingMs);
  }

  private showError(message: string): void {
    this.status.set('failed');
    this.title.set('No pudimos confirmar el pago');
    this.message.set(message);
    this.statusIcon.set(ShieldCheck);
  }
}
