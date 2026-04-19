import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { LucideAngularModule, Plus, Pencil, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-angular';

import { AdminService } from '../../../core/services/admin.service';
import { type Snack } from '../../../core/models/snack.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { AdminSnackFormComponent } from './admin-snack-form.component';

const CATEGORY_LABELS: Record<string, string> = {
  popcorn: 'Canchitas', drinks: 'Bebidas', combos: 'Combos', sweets: 'Dulces', extras: 'Extras',
};

@Component({
  selector: 'app-admin-snacks-page',
  imports: [LucideAngularModule, SkeletonLoaderComponent, AdminSnackFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold" style="color: var(--color-text-primary);">Confitería</h1>
          <p class="text-sm" style="color: var(--color-text-secondary);">{{ snacks().length }} productos</p>
        </div>
        <button type="button" (click)="openCreate()"
          class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          style="background: var(--color-accent); color: var(--color-text-inverse);">
          <lucide-icon [img]="Plus" [size]="15" />Nuevo producto
        </button>
      </div>

      @if (loading()) {
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          @for (n of [1,2,3,4,5,6]; track n) { <app-skeleton-loader height="120px" radius="12px" /> }
        </div>
      } @else if (error()) {
        <div class="rounded-xl p-6 text-center" style="background: var(--color-surface); border: 1px solid var(--color-border);">
          <p class="mb-3 text-sm" style="color: var(--color-text-secondary);">Error al cargar productos.</p>
          <button type="button" (click)="load()" class="text-sm" style="color: var(--color-accent);">
            <lucide-icon [img]="RefreshCw" [size]="14" class="inline mr-1" />Reintentar</button>
        </div>
      } @else {
        <div class="overflow-hidden rounded-xl" style="border: 1px solid var(--color-border); background: var(--color-surface);">
          <table class="w-full text-sm">
            <thead>
              <tr style="border-bottom: 1px solid var(--color-border); background: var(--color-surface-raised);">
                <th class="px-4 py-3 text-left font-semibold" style="color: var(--color-text-secondary);">Producto</th>
                <th class="px-4 py-3 text-left font-semibold hidden sm:table-cell" style="color: var(--color-text-secondary);">Categoría</th>
                <th class="px-4 py-3 text-left font-semibold hidden md:table-cell" style="color: var(--color-text-secondary);">Precio</th>
                <th class="px-4 py-3 text-left font-semibold hidden sm:table-cell" style="color: var(--color-text-secondary);">Activo</th>
                <th class="px-4 py-3 text-right font-semibold" style="color: var(--color-text-secondary);">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (snack of snacks(); track snack.id) {
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      @if (snack.image) {
                        <img [src]="snack.image" [alt]="snack.name"
                          class="h-10 w-10 flex-none rounded-lg object-cover" loading="lazy" />
                      } @else {
                        <div class="h-10 w-10 flex-none rounded-lg" style="background: var(--color-surface-raised);"></div>
                      }
                      <span class="font-medium" style="color: var(--color-text-primary);">{{ snack.name }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 hidden sm:table-cell" style="color: var(--color-text-secondary);">
                    {{ categoryLabel(snack.category) }}
                  </td>
                  <td class="px-4 py-3 hidden md:table-cell" style="color: var(--color-text-secondary);">S/ {{ snack.price }}</td>
                  <td class="px-4 py-3 hidden sm:table-cell">
                    <button type="button" (click)="toggleStatus(snack)" [disabled]="toggling() === snack.id">
                      @if (snack.status === 'active') {
                        <lucide-icon [img]="ToggleRight" [size]="22" style="color: var(--color-success);" />
                      } @else {
                        <lucide-icon [img]="ToggleLeft" [size]="22" style="color: var(--color-text-disabled);" />
                      }
                    </button>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button type="button" (click)="openEdit(snack)"
                      class="rounded-lg p-2 transition-colors" style="color: var(--color-text-secondary);">
                      <lucide-icon [img]="Pencil" [size]="14" />
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    @if (showForm()) {
      <app-admin-snack-form
        [snack]="editingSnack()"
        (saved)="onSaved($event)"
        (cancelled)="showForm.set(false)"
      />
    }
  `,
})
export class AdminSnacksPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly snacks = signal<Snack[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly showForm = signal(false);
  readonly editingSnack = signal<Snack | null>(null);
  readonly toggling = signal<string | null>(null);

  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly ToggleLeft = ToggleLeft;
  readonly ToggleRight = ToggleRight;
  readonly RefreshCw = RefreshCw;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.adminService.getAdminSnacks().subscribe({
      next: (s) => { this.snacks.set(s); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  openCreate(): void { this.editingSnack.set(null); this.showForm.set(true); }
  openEdit(s: Snack): void { this.editingSnack.set(s); this.showForm.set(true); }

  toggleStatus(snack: Snack): void {
    this.toggling.set(snack.id);
    this.adminService.toggleSnackStatus(snack.id).subscribe({
      next: (updated) => {
        this.snacks.update((list) => list.map((x) => (x.id === updated.id ? updated : x)));
        this.toggling.set(null);
      },
      error: () => this.toggling.set(null),
    });
  }

  onSaved(s: Snack): void {
    this.snacks.update((list) => {
      const idx = list.findIndex((x) => x.id === s.id);
      return idx >= 0 ? list.map((x) => (x.id === s.id ? s : x)) : [s, ...list];
    });
    this.showForm.set(false);
  }

  categoryLabel(cat: string): string {
    return CATEGORY_LABELS[cat] ?? cat;
  }
}
