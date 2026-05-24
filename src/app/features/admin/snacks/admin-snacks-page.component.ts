import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  type OnInit,
} from '@angular/core';
import {
  ChevronLeft,
  ChevronRight,
  LucideAngularModule,
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
} from 'lucide-angular';

import { AdminService } from '../../../core/services/admin.service';
import { type Snack } from '../../../core/models/snack.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { AdminSnackFormComponent } from './admin-snack-form.component';

const CATEGORY_LABELS: Record<string, string> = {
  popcorn: 'Canchitas',
  drinks: 'Bebidas',
  combos: 'Combos',
  sweets: 'Dulces',
  extras: 'Extras',
};

@Component({
  selector: 'app-admin-snacks-page',
  imports: [LucideAngularModule, SkeletonLoaderComponent, AdminSnackFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-snacks-page.component.html',
})
export class AdminSnacksPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly pageSize = 10;

  readonly snacks = signal<Snack[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly showForm = signal(false);
  readonly editingSnack = signal<Snack | null>(null);
  readonly toggling = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.snacks().length / this.pageSize)),
  );
  readonly pagedSnacks = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.snacks().slice(start, start + this.pageSize);
  });

  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly ToggleLeft = ToggleLeft;
  readonly ToggleRight = ToggleRight;
  readonly RefreshCw = RefreshCw;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.adminService.getAdminSnacks().subscribe({
      next: (s) => {
        this.snacks.set(s);
        this.ensureValidPage();
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  goPage(page: number): void {
    this.currentPage.set(Math.min(Math.max(page, 1), this.totalPages()));
  }

  openCreate(): void {
    this.editingSnack.set(null);
    this.showForm.set(true);
  }
  openEdit(s: Snack): void {
    this.editingSnack.set(s);
    this.showForm.set(true);
  }

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
    this.ensureValidPage();
    this.showForm.set(false);
  }

  categoryLabel(cat: string): string {
    return CATEGORY_LABELS[cat] ?? cat;
  }

  private ensureValidPage(): void {
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(this.totalPages());
    }
  }
}
