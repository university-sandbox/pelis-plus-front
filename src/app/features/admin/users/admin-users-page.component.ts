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
  templateUrl: './admin-users-page.component.html',
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
