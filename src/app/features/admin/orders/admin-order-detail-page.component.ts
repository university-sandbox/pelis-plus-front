import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';

import { AdminService } from '../../../core/services/admin.service';
import { type Order } from '../../../core/models/order.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-admin-order-detail-page',
  imports: [RouterLink, SlicePipe, LucideAngularModule, SkeletonLoaderComponent, ErrorStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="mb-6 flex items-center gap-3">
        <a routerLink="/admin/orders"
          class="rounded-lg p-2 transition-colors" style="color: var(--color-text-secondary);" aria-label="Volver">
          <lucide-icon [img]="ArrowLeft" [size]="18" />
        </a>
        <h1 class="text-xl font-bold" style="color: var(--color-text-primary);">Detalle del pedido</h1>
      </div>

      @if (loading()) {
        <app-skeleton-loader height="400px" radius="16px" />
      } @else if (error()) {
        <app-error-state title="No se pudo cargar el pedido" (retry)="load()" />
      } @else if (order(); as o) {
        <div class="grid gap-4 lg:grid-cols-3">
          <!-- Info general -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Tickets -->
            <section class="rounded-xl p-5" style="background: var(--color-surface); border: 1px solid var(--color-border);">
              <h2 class="mb-3 text-sm font-bold" style="color: var(--color-text-secondary);">Entradas</h2>
              @if (o.tickets?.length) {
                <div class="space-y-2">
                  @for (t of o.tickets; track $index) {
                    <div class="flex items-center justify-between gap-2 rounded-lg px-3 py-2"
                      style="background: var(--color-surface-raised);">
                      <div>
                        <p class="text-sm font-medium" style="color: var(--color-text-primary);">{{ t.movieTitle }}</p>
                        <p class="text-xs" style="color: var(--color-text-secondary);">
                          {{ t.venue }} · {{ t.room }} · {{ t.date }} {{ t.time }} · Asiento {{ t.seat?.row }}{{ t.seat?.col }}
                        </p>
                      </div>
                      <span class="text-sm font-semibold" style="color: var(--color-text-primary);">S/ {{ t.price }}</span>
                    </div>
                  }
                </div>
              } @else {
                <p class="text-sm" style="color: var(--color-text-secondary);">Sin entradas</p>
              }
            </section>

            <!-- Snacks -->
            @if (o.snacks?.length) {
              <section class="rounded-xl p-5" style="background: var(--color-surface); border: 1px solid var(--color-border);">
                <h2 class="mb-3 text-sm font-bold" style="color: var(--color-text-secondary);">Confitería</h2>
                <div class="space-y-2">
                  @for (s of o.snacks; track $index) {
                    <div class="flex items-center justify-between gap-2 rounded-lg px-3 py-2"
                      style="background: var(--color-surface-raised);">
                      <span class="text-sm" style="color: var(--color-text-primary);">
                        {{ s.snack?.name ?? 'Producto' }} × {{ s.quantity }}
                      </span>
                      <span class="text-sm font-semibold" style="color: var(--color-text-primary);">
                        S/ {{ (s.snack?.price ?? 0) * s.quantity }}
                      </span>
                    </div>
                  }
                </div>
              </section>
            }
          </div>

          <!-- Summary panel -->
          <div class="space-y-4">
            <section class="rounded-xl p-5" style="background: var(--color-surface); border: 1px solid var(--color-border);">
              <h2 class="mb-4 text-sm font-bold" style="color: var(--color-text-secondary);">Resumen</h2>

              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span style="color: var(--color-text-secondary);">ID</span>
                  <span class="font-mono text-xs" style="color: var(--color-text-primary);">{{ o.id.slice(0,8) }}...</span>
                </div>
                <div class="flex justify-between">
                  <span style="color: var(--color-text-secondary);">Fecha</span>
                  <span style="color: var(--color-text-primary);">{{ o.createdAt | slice:0:10 }}</span>
                </div>
                <div class="flex justify-between">
                  <span style="color: var(--color-text-secondary);">Subtotal</span>
                  <span style="color: var(--color-text-primary);">S/ {{ o.subtotal }}</span>
                </div>
                @if (o.discount > 0) {
                  <div class="flex justify-between">
                    <span style="color: var(--color-text-secondary);">Descuento</span>
                    <span style="color: var(--color-accent);">-S/ {{ o.discount }}</span>
                  </div>
                }
                <div class="flex justify-between border-t pt-2" style="border-color: var(--color-border);">
                  <span class="font-bold" style="color: var(--color-text-primary);">Total</span>
                  <span class="font-bold" style="color: var(--color-text-primary);">S/ {{ o.total }}</span>
                </div>
              </div>

              <div class="mt-4 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs" style="color: var(--color-text-secondary);">Estado pedido</span>
                  <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    [style.background]="o.status === 'confirmed' ? 'rgba(0,201,167,0.15)' : 'var(--color-surface-raised)'"
                    [style.color]="o.status === 'confirmed' ? 'var(--color-accent)' : 'var(--color-text-secondary)'">
                    {{ orderLabel(o.status) }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs" style="color: var(--color-text-secondary);">Estado pago</span>
                  <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    [style.background]="o.paymentStatus === 'approved' ? 'rgba(0,201,167,0.15)' : o.paymentStatus === 'rejected' ? 'rgba(239,68,68,0.1)' : 'var(--color-surface-raised)'"
                    [style.color]="o.paymentStatus === 'approved' ? 'var(--color-accent)' : o.paymentStatus === 'rejected' ? 'var(--color-error)' : 'var(--color-text-secondary)'">
                    {{ paymentLabel(o.paymentStatus) }}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminOrderDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdminService);

  readonly order = signal<Order | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly ArrowLeft = ArrowLeft;

  ngOnInit(): void { this.load(); }

  load(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.loading.set(true);
    this.error.set(false);
    this.adminService.getOrderDetail(id).subscribe({
      next: (o) => { this.order.set(o); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  orderLabel(s: string): string {
    const map: Record<string, string> = { pending: 'Pendiente', confirmed: 'Confirmado', cancelled: 'Cancelado' };
    return map[s] ?? s;
  }

  paymentLabel(s: string): string {
    const map: Record<string, string> = { pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado', expired: 'Expirado', processing: 'Procesando', cancelled: 'Cancelado' };
    return map[s] ?? s;
  }
}
