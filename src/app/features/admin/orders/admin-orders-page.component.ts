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
  templateUrl: './admin-orders-page.component.html',
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
