import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule, CheckCircle, Home, User } from 'lucide-angular';

import { TicketService } from '../../core/services/ticket.service';
import { type Ticket } from '../../core/models/ticket.model';
import { type Order } from '../../core/models/order.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { TicketComponent } from './ticket.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-confirmation-page',
  imports: [RouterLink, LucideAngularModule, NavbarComponent, TicketComponent, SkeletonLoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar />

    <main class="min-h-dvh pb-16" style="background: var(--color-bg);">
      <div class="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">

        <!-- Success header -->
        <div class="mb-8 text-center">
          <div
            class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style="background: rgba(34,197,94,.15);"
          >
            <lucide-icon [img]="CheckCircle" [size]="36" style="color: var(--color-success);" aria-hidden="true" />
          </div>
          <h1 class="text-2xl font-extrabold" style="color: var(--color-text-primary);">¡Pago exitoso!</h1>
          <p class="mt-2 text-sm" style="color: var(--color-text-secondary);">
            Tu compra fue confirmada. Aquí están tus entradas digitales.
          </p>
        </div>

        <!-- Tickets -->
        @if (loading()) {
          <div class="space-y-4">
            @for (n of [1,2]; track n) {
              <app-skeleton-loader height="340px" radius="16px" />
            }
          </div>
        } @else {
          <div class="space-y-6">
            @for (ticket of tickets(); track ticket.id) {
              <app-ticket [ticket]="ticket" />
            }
          </div>
        }

        <!-- Actions -->
        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            routerLink="/"
            class="flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
            style="background: var(--color-surface-raised); border: 1px solid var(--color-border-strong); color: var(--color-text-primary);"
          >
            <lucide-icon [img]="Home" [size]="16" aria-hidden="true" />
            Ir al inicio
          </a>
          <a
            routerLink="/profile"
            class="flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
            style="background: var(--color-accent); color: var(--color-text-inverse);"
          >
            <lucide-icon [img]="User" [size]="16" aria-hidden="true" />
            Ver mis entradas
          </a>
        </div>
      </div>
    </main>
  `,
})
export class ConfirmationPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ticketService = inject(TicketService);

  readonly tickets = signal<Ticket[]>([]);
  readonly loading = signal(true);

  readonly CheckCircle = CheckCircle;
  readonly Home = Home;
  readonly User = User;

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id') ?? 'unknown';
    const state = history.state as { order?: Order; cart?: unknown };

    if (state?.order) {
      // Build tickets from order data immediately (no extra HTTP round-trip in mock mode)
      const tks = this.ticketService.buildTicketsFromOrder(orderId, 'Usuario Demo', state.order);
      this.tickets.set(tks);
      this.loading.set(false);
    } else {
      // Fallback: fetch from backend
      this.ticketService.getMyTickets().subscribe({
        next: (list) => {
          this.tickets.set(list.filter((t) => t.orderId === orderId));
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }
}
