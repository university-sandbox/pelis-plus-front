import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Eye, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-angular';

import { AdminService, type PageResponse } from '../../../core/services/admin.service';
import { type Order } from '../../../core/models/order.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-admin-orders-page',
  imports: [RouterLink, SlicePipe, LucideAngularModule, SkeletonLoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-xl font-bold" style="color: var(--color-text-primary);">Pedidos</h1>
        <p class="text-sm" style="color: var(--color-text-secondary);">{{ page()?.totalElements ?? 0 }} pedidos en total</p>
      </div>

      @if (loading()) {
        <div class="space-y-3">@for (n of [1,2,3,4,5]; track n) { <app-skeleton-loader height="56px" radius="8px" /> }</div>
      } @else if (error()) {
        <div class="rounded-xl p-6 text-center" style="background: var(--color-surface); border: 1px solid var(--color-border);">
          <p class="mb-3 text-sm" style="color: var(--color-text-secondary);">Error al cargar pedidos.</p>
          <button type="button" (click)="load()" class="text-sm" style="color: var(--color-accent);">
            <lucide-icon [img]="RefreshCw" [size]="14" class="inline mr-1" />Reintentar</button>
        </div>
      } @else {
        <div class="overflow-hidden rounded-xl" style="border: 1px solid var(--color-border); background: var(--color-surface);">
          <table class="w-full text-sm">
            <thead>
              <tr style="border-bottom: 1px solid var(--color-border); background: var(--color-surface-raised);">
                <th class="px-4 py-3 text-left font-semibold" style="color: var(--color-text-secondary);">ID</th>
                <th class="px-4 py-3 text-left font-semibold hidden sm:table-cell" style="color: var(--color-text-secondary);">Fecha</th>
                <th class="px-4 py-3 text-left font-semibold hidden md:table-cell" style="color: var(--color-text-secondary);">Total</th>
                <th class="px-4 py-3 text-left font-semibold hidden sm:table-cell" style="color: var(--color-text-secondary);">Estado</th>
                <th class="px-4 py-3 text-left font-semibold hidden lg:table-cell" style="color: var(--color-text-secondary);">Pago</th>
                <th class="px-4 py-3 text-right font-semibold" style="color: var(--color-text-secondary);">Ver</th>
              </tr>
            </thead>
            <tbody>
              @for (order of orders(); track order.id) {
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td class="px-4 py-3 font-mono text-xs" style="color: var(--color-text-primary);">
                    {{ order.id.slice(0, 8) }}...
                  </td>
                  <td class="px-4 py-3 hidden sm:table-cell" style="color: var(--color-text-secondary);">
                    {{ order.createdAt | slice:0:10 }}
                  </td>
                  <td class="px-4 py-3 hidden md:table-cell font-semibold" style="color: var(--color-text-primary);">
                    S/ {{ order.total }}
                  </td>
                  <td class="px-4 py-3 hidden sm:table-cell">
                    <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      [style.background]="orderStatusBg(order.status)"
                      [style.color]="orderStatusColor(order.status)">
                      {{ orderStatusLabel(order.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 hidden lg:table-cell">
                    <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      [style.background]="paymentStatusBg(order.paymentStatus)"
                      [style.color]="paymentStatusColor(order.paymentStatus)">
                      {{ paymentStatusLabel(order.paymentStatus) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <a [routerLink]="['/admin/orders', order.id]"
                      class="rounded-lg p-2 transition-colors inline-flex"
                      style="color: var(--color-accent);" title="Ver detalle">
                      <lucide-icon [img]="Eye" [size]="15" />
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if ((page()?.totalPages ?? 0) > 1) {
          <div class="mt-4 flex items-center justify-center gap-3">
            <button type="button" [disabled]="currentPage() === 1" (click)="goPage(currentPage() - 1)"
              class="rounded-lg p-2 disabled:opacity-40" style="color: var(--color-text-secondary);">
              <lucide-icon [img]="ChevronLeft" [size]="18" />
            </button>
            <span class="text-sm" style="color: var(--color-text-secondary);">
              Página {{ currentPage() }} de {{ page()?.totalPages ?? 1 }}
            </span>
            <button type="button" [disabled]="currentPage() >= (page()?.totalPages ?? 1)" (click)="goPage(currentPage() + 1)"
              class="rounded-lg p-2 disabled:opacity-40" style="color: var(--color-text-secondary);">
              <lucide-icon [img]="ChevronRight" [size]="18" />
            </button>
          </div>
        }
      }
    </div>
  `,
})
export class AdminOrdersPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly orders = signal<Order[]>([]);
  readonly page = signal<PageResponse<Order> | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly currentPage = signal(1);

  readonly Eye = Eye;
  readonly RefreshCw = RefreshCw;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.adminService.getOrders(this.currentPage()).subscribe({
      next: (p) => { this.page.set(p); this.orders.set(p.content); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  goPage(p: number): void { this.currentPage.set(p); this.load(); }

  orderStatusLabel(s: string): string {
    return { pending: 'Pendiente', confirmed: 'Confirmado', cancelled: 'Cancelado' }[s] ?? s;
  }
  orderStatusBg(s: string): string {
    return s === 'confirmed' ? 'rgba(0,201,167,0.15)' : s === 'cancelled' ? 'rgba(239,68,68,0.1)' : 'var(--color-surface-raised)';
  }
  orderStatusColor(s: string): string {
    return s === 'confirmed' ? 'var(--color-accent)' : s === 'cancelled' ? 'var(--color-error)' : 'var(--color-text-secondary)';
  }
  paymentStatusLabel(s: string): string {
    return { pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado', expired: 'Expirado' }[s] ?? s;
  }
  paymentStatusBg(s: string): string {
    return s === 'approved' ? 'rgba(0,201,167,0.15)' : s === 'rejected' ? 'rgba(239,68,68,0.1)' : 'var(--color-surface-raised)';
  }
  paymentStatusColor(s: string): string {
    return s === 'approved' ? 'var(--color-accent)' : s === 'rejected' ? 'var(--color-error)' : 'var(--color-text-secondary)';
  }
}
