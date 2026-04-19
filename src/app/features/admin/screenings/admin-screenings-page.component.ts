import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { LucideAngularModule, Plus, Pencil, Ban, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-angular';

import { AdminService, type PageResponse } from '../../../core/services/admin.service';
import { type Screening } from '../../../core/models/screening.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { AdminScreeningFormComponent } from './admin-screening-form.component';

@Component({
  selector: 'app-admin-screenings-page',
  imports: [LucideAngularModule, SkeletonLoaderComponent, AdminScreeningFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-screenings-page.component.html',
})
export class AdminScreeningsPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly screenings = signal<Screening[]>([]);
  readonly page = signal<PageResponse<Screening> | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly showForm = signal(false);
  readonly editingScreening = signal<Screening | null>(null);
  readonly cancelling = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly statusFilter = signal('');

  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly Ban = Ban;
  readonly RefreshCw = RefreshCw;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  readonly statusOptions = [
    { value: '', label: 'Todas' },
    { value: 'active', label: 'Activas' },
    { value: 'cancelled', label: 'Canceladas' },
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.adminService
      .getScreenings({ status: this.statusFilter() || undefined, page: this.currentPage() })
      .subscribe({
        next: (p) => {
          this.page.set(p);
          this.screenings.set(p.content);
          this.loading.set(false);
        },
        error: () => { this.error.set(true); this.loading.set(false); },
      });
  }

  setStatus(s: string): void {
    this.statusFilter.set(s);
    this.currentPage.set(1);
    this.load();
  }

  goPage(p: number): void {
    this.currentPage.set(p);
    this.load();
  }

  openCreate(): void {
    this.editingScreening.set(null);
    this.showForm.set(true);
  }

  openEdit(s: Screening): void {
    this.editingScreening.set(s);
    this.showForm.set(true);
  }

  cancel(s: Screening): void {
    if (!confirm(`¿Cancelar la función "${s.movieTitle}" del ${s.date}?`)) return;
    this.cancelling.set(s.id);
    this.adminService.cancelScreening(s.id).subscribe({
      next: (updated) => {
        this.screenings.update((list) => list.map((x) => (x.id === updated.id ? updated : x)));
        this.cancelling.set(null);
      },
      error: () => this.cancelling.set(null),
    });
  }

  onSaved(s: Screening): void {
    this.screenings.update((list) => {
      const idx = list.findIndex((x) => x.id === s.id);
      return idx >= 0 ? list.map((x) => (x.id === s.id ? s : x)) : [s, ...list];
    });
    this.showForm.set(false);
  }
}
