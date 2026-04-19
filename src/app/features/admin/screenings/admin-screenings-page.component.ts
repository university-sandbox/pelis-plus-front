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
  template: `
    <div>
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold" style="color: var(--color-text-primary);">Funciones</h1>
          <p class="text-sm" style="color: var(--color-text-secondary);">
            {{ page()?.totalElements ?? 0 }} funciones en total
          </p>
        </div>
        <button
          type="button"
          (click)="openCreate()"
          class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
          style="background: var(--color-accent); color: var(--color-text-inverse);"
        >
          <lucide-icon [img]="Plus" [size]="15" aria-hidden="true" />
          Nueva función
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-4 flex gap-2">
        @for (s of statusOptions; track s.value) {
          <button
            type="button"
            (click)="setStatus(s.value)"
            class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            [style.background]="statusFilter() === s.value ? 'var(--color-accent)' : 'var(--color-surface-raised)'"
            [style.color]="statusFilter() === s.value ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)'"
          >{{ s.label }}</button>
        }
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="space-y-3">
          @for (n of [1,2,3,4,5]; track n) {
            <app-skeleton-loader height="56px" radius="8px" />
          }
        </div>
      } @else if (error()) {
        <div class="rounded-xl p-6 text-center" style="background: var(--color-surface); border: 1px solid var(--color-border);">
          <p class="mb-3 text-sm" style="color: var(--color-text-secondary);">Error al cargar funciones.</p>
          <button type="button" (click)="load()" class="text-sm" style="color: var(--color-accent);">
            <lucide-icon [img]="RefreshCw" [size]="14" class="inline mr-1" />Reintentar
          </button>
        </div>
      } @else {
        <div class="overflow-hidden rounded-xl" style="border: 1px solid var(--color-border); background: var(--color-surface);">
          <table class="w-full text-sm">
            <thead>
              <tr style="border-bottom: 1px solid var(--color-border); background: var(--color-surface-raised);">
                <th class="px-4 py-3 text-left font-semibold" style="color: var(--color-text-secondary);">Película</th>
                <th class="px-4 py-3 text-left font-semibold hidden sm:table-cell" style="color: var(--color-text-secondary);">Sede / Sala</th>
                <th class="px-4 py-3 text-left font-semibold hidden md:table-cell" style="color: var(--color-text-secondary);">Fecha</th>
                <th class="px-4 py-3 text-left font-semibold hidden lg:table-cell" style="color: var(--color-text-secondary);">Formato</th>
                <th class="px-4 py-3 text-left font-semibold hidden lg:table-cell" style="color: var(--color-text-secondary);">Precio</th>
                <th class="px-4 py-3 text-left font-semibold hidden sm:table-cell" style="color: var(--color-text-secondary);">Estado</th>
                <th class="px-4 py-3 text-right font-semibold" style="color: var(--color-text-secondary);">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (s of screenings(); track s.id) {
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td class="px-4 py-3 font-medium" style="color: var(--color-text-primary);">{{ s.movieTitle }}</td>
                  <td class="px-4 py-3 hidden sm:table-cell" style="color: var(--color-text-secondary);">
                    {{ s.venue.name }} · {{ s.room.name }}
                  </td>
                  <td class="px-4 py-3 hidden md:table-cell" style="color: var(--color-text-secondary);">
                    {{ s.date }} {{ s.time }}
                  </td>
                  <td class="px-4 py-3 hidden lg:table-cell" style="color: var(--color-text-secondary);">
                    {{ s.format.toUpperCase() }}
                  </td>
                  <td class="px-4 py-3 hidden lg:table-cell" style="color: var(--color-text-secondary);">S/ {{ s.price }}</td>
                  <td class="px-4 py-3 hidden sm:table-cell">
                    <span
                      class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      [style.background]="s.status === 'active' ? 'rgba(0,201,167,0.15)' : 'rgba(239,68,68,0.1)'"
                      [style.color]="s.status === 'active' ? 'var(--color-accent)' : 'var(--color-error)'"
                    >{{ s.status === 'active' ? 'Activa' : 'Cancelada' }}</span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-1">
                      @if (s.status === 'active') {
                        <button
                          type="button"
                          (click)="openEdit(s)"
                          class="rounded-lg p-2 transition-colors"
                          style="color: var(--color-text-secondary);"
                          title="Editar"
                        >
                          <lucide-icon [img]="Pencil" [size]="14" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          (click)="cancel(s)"
                          [disabled]="cancelling() === s.id"
                          class="rounded-lg p-2 transition-colors disabled:opacity-50"
                          style="color: var(--color-error);"
                          title="Cancelar función"
                        >
                          <lucide-icon [img]="Ban" [size]="14" aria-hidden="true" />
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if ((page()?.totalPages ?? 0) > 1) {
          <div class="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              [disabled]="currentPage() === 1"
              (click)="goPage(currentPage() - 1)"
              class="rounded-lg p-2 transition-colors disabled:opacity-40"
              style="color: var(--color-text-secondary);"
            >
              <lucide-icon [img]="ChevronLeft" [size]="18" />
            </button>
            <span class="text-sm" style="color: var(--color-text-secondary);">
              Página {{ currentPage() }} de {{ page()?.totalPages ?? 1 }}
            </span>
            <button
              type="button"
              [disabled]="currentPage() >= (page()?.totalPages ?? 1)"
              (click)="goPage(currentPage() + 1)"
              class="rounded-lg p-2 transition-colors disabled:opacity-40"
              style="color: var(--color-text-secondary);"
            >
              <lucide-icon [img]="ChevronRight" [size]="18" />
            </button>
          </div>
        }
      }
    </div>

    @if (showForm()) {
      <app-admin-screening-form
        [screening]="editingScreening()"
        (saved)="onSaved($event)"
        (cancelled)="showForm.set(false)"
      />
    }
  `,
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
