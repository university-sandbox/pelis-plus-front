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
  templateUrl: './admin-order-detail-page.component.html',
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
