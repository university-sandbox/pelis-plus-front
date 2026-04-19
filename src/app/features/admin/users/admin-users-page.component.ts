import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { LucideAngularModule, RefreshCw, ChevronLeft, ChevronRight, UserCheck, UserX } from 'lucide-angular';

import { AdminService, type AdminUser, type PageResponse } from '../../../core/services/admin.service';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-admin-users-page',
  imports: [SlicePipe, LucideAngularModule, SkeletonLoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-xl font-bold" style="color: var(--color-text-primary);">Usuarios</h1>
        <p class="text-sm" style="color: var(--color-text-secondary);">{{ page()?.totalElements ?? 0 }} usuarios registrados</p>
      </div>

      @if (loading()) {
        <div class="space-y-3">@for (n of [1,2,3,4,5]; track n) { <app-skeleton-loader height="56px" radius="8px" /> }</div>
      } @else if (error()) {
        <div class="rounded-xl p-6 text-center" style="background: var(--color-surface); border: 1px solid var(--color-border);">
          <p class="mb-3 text-sm" style="color: var(--color-text-secondary);">Error al cargar usuarios.</p>
          <button type="button" (click)="load()" class="text-sm" style="color: var(--color-accent);">
            <lucide-icon [img]="RefreshCw" [size]="14" class="inline mr-1" />Reintentar</button>
        </div>
      } @else {
        <div class="overflow-hidden rounded-xl" style="border: 1px solid var(--color-border); background: var(--color-surface);">
          <table class="w-full text-sm">
            <thead>
              <tr style="border-bottom: 1px solid var(--color-border); background: var(--color-surface-raised);">
                <th class="px-4 py-3 text-left font-semibold" style="color: var(--color-text-secondary);">Nombre</th>
                <th class="px-4 py-3 text-left font-semibold hidden sm:table-cell" style="color: var(--color-text-secondary);">Email</th>
                <th class="px-4 py-3 text-left font-semibold hidden md:table-cell" style="color: var(--color-text-secondary);">Membresía</th>
                <th class="px-4 py-3 text-left font-semibold hidden lg:table-cell" style="color: var(--color-text-secondary);">Registro</th>
                <th class="px-4 py-3 text-right font-semibold" style="color: var(--color-text-secondary);">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <div class="flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-bold"
                        style="background: rgba(0,201,167,0.15); color: var(--color-accent);">
                        {{ (user.name ?? '?').charAt(0).toUpperCase() }}
                      </div>
                      <span class="font-medium" style="color: var(--color-text-primary);">{{ user.name }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 hidden sm:table-cell" style="color: var(--color-text-secondary);">{{ user.email }}</td>
                  <td class="px-4 py-3 hidden md:table-cell">
                    @if (user.membership) {
                      <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style="background: rgba(0,201,167,0.15); color: var(--color-accent);">
                        {{ getMembershipName(user.membership) }}
                      </span>
                    } @else {
                      <span class="text-xs" style="color: var(--color-text-disabled);">Sin membresía</span>
                    }
                  </td>
                  <td class="px-4 py-3 hidden lg:table-cell text-xs" style="color: var(--color-text-secondary);">
                    {{ user.createdAt | slice:0:10 }}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button
                      type="button"
                      (click)="toggleUserStatus(user)"
                      [disabled]="toggling() === user.id"
                      class="rounded-lg p-2 transition-colors disabled:opacity-50"
                      style="color: var(--color-text-secondary);"
                      [title]="userActive(user) ? 'Desactivar usuario' : 'Activar usuario'"
                    >
                      @if (userActive(user)) {
                        <lucide-icon [img]="UserX" [size]="15" style="color: var(--color-error);" />
                      } @else {
                        <lucide-icon [img]="UserCheck" [size]="15" style="color: var(--color-accent);" />
                      }
                    </button>
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
export class AdminUsersPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly users = signal<AdminUser[]>([]);
  readonly page = signal<PageResponse<AdminUser> | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly currentPage = signal(1);
  readonly toggling = signal<string | null>(null);
  // Track local active status overrides (API doesn't return active field yet)
  private readonly activeStatus = new Map<string, boolean>();

  readonly RefreshCw = RefreshCw;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly UserCheck = UserCheck;
  readonly UserX = UserX;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.adminService.getUsers(this.currentPage()).subscribe({
      next: (p) => { this.page.set(p); this.users.set(p.content); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  goPage(p: number): void { this.currentPage.set(p); this.load(); }

  userActive(user: AdminUser): boolean {
    return this.activeStatus.get(user.id) ?? true;
  }

  toggleUserStatus(user: AdminUser): void {
    const currentActive = this.userActive(user);
    const newStatus = currentActive ? 'inactive' : 'active';
    this.toggling.set(user.id);
    this.adminService.toggleUserStatus(user.id, newStatus).subscribe({
      next: () => {
        this.activeStatus.set(user.id, !currentActive);
        // Trigger signal update
        this.users.update((list) => [...list]);
        this.toggling.set(null);
      },
      error: () => this.toggling.set(null),
    });
  }

  getMembershipName(membership: unknown): string {
    if (membership && typeof membership === 'object' && 'planName' in membership) {
      return String((membership as { planName: string }).planName);
    }
    return 'Activa';
  }
}
