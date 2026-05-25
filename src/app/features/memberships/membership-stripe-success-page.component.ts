import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CheckCircle, Clapperboard, CreditCard, LogIn, LucideAngularModule, RefreshCw, ShieldCheck, User } from 'lucide-angular';

import { MembershipService } from '../../core/services/membership.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { type ActiveMembership } from '../../core/models/membership.model';
import { AuthService } from '../../core/services/auth.service';

type MembershipFeedbackStatus = 'verifying' | 'confirmed' | 'failed' | 'auth-required';
const MINIMUM_FEEDBACK_MS = 1500;

@Component({
  selector: 'app-membership-stripe-success-page',
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

        @if (activeMembership(); as membership) {
          <div
            class="mt-4 rounded-lg px-3 py-2 text-sm"
            style="background: var(--color-surface-raised); color: var(--color-text-secondary); border: 1px solid var(--color-border)"
          >
            {{ membership.planName }} activa hasta {{ membership.expiresAt }}
          </div>
        }

        <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          @if (status() === 'confirmed') {
            <a
              routerLink="/profile"
              class="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
              style="background: var(--color-accent); color: var(--color-text-inverse)"
            >
              <lucide-icon [img]="User" [size]="16" aria-hidden="true" />
              Ver mi perfil
            </a>
            <a
              routerLink="/catalog"
              class="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
              style="background: var(--color-surface-raised); color: var(--color-text-primary); border: 1px solid var(--color-border)"
            >
              <lucide-icon [img]="Clapperboard" [size]="16" aria-hidden="true" />
              Explorar cartelera
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
              routerLink="/memberships"
              class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold"
              style="background: var(--color-surface-raised); color: var(--color-text-primary); border: 1px solid var(--color-border)"
            >
              Volver a membresías
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
export class MembershipStripeSuccessPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly membershipService = inject(MembershipService);
  private readonly authService = inject(AuthService);

  readonly status = signal<MembershipFeedbackStatus>('verifying');
  readonly activeMembership = signal<ActiveMembership | null>(null);
  readonly currentUrl = signal('');
  readonly title = signal('Verificando membresía');
  readonly message = signal('Estamos confirmando tu pago sandbox con Stripe y activando tu membresía.');
  readonly statusIcon = signal(CreditCard);
  readonly User = User;
  readonly Clapperboard = Clapperboard;
  readonly RefreshCw = RefreshCw;
  readonly LogIn = LogIn;

  ngOnInit(): void {
    this.currentUrl.set(this.router.url);
    this.confirmMembership();
  }

  retryConfirmation(): void {
    this.confirmMembership();
  }

  private confirmMembership(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (!sessionId) {
      this.showError('No encontramos la sesión de Stripe para activar tu membresía.');
      return;
    }

    if (!this.authService.isClient()) {
      this.status.set('auth-required');
      this.activeMembership.set(null);
      this.title.set('Pago recibido por Stripe');
      this.message.set('Inicia sesión para verificar el pago en PelisPlus y activar tu membresía.');
      this.statusIcon.set(ShieldCheck);
      return;
    }

    this.status.set('verifying');
    this.activeMembership.set(null);
    this.title.set('Verificando membresía');
    this.message.set('Estamos confirmando tu pago sandbox con Stripe y activando tu membresía.');
    this.statusIcon.set(CreditCard);
    const startedAt = Date.now();

    this.membershipService.confirmStripeCheckout(sessionId).subscribe({
      next: (membership) => {
        this.afterMinimumFeedbackTime(startedAt, () => {
          this.activeMembership.set(membership);
          this.status.set('confirmed');
          this.title.set('Membresía activada');
          this.message.set('Tu pago fue aprobado y tus beneficios de PelisPlus Club ya están activos.');
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
    this.title.set('No pudimos activar la membresía');
    this.message.set(message);
    this.statusIcon.set(ShieldCheck);
  }
}
