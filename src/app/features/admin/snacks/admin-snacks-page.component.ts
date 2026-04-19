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
  templateUrl: './admin-snacks-page.component.html',
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
