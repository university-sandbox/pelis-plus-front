import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Crown, Check, Zap } from 'lucide-angular';

import { MembershipService } from '../../core/services/membership.service';
import { type MembershipPlan } from '../../core/models/membership.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-memberships-page',
  imports: [LucideAngularModule, NavbarComponent, SkeletonLoaderComponent, ErrorStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './memberships-page.component.html',
})
export class MembershipsPageComponent implements OnInit {
  private readonly membershipService = inject(MembershipService);
  private readonly router = inject(Router);

  readonly plans = signal<MembershipPlan[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly subscribing = signal<string | null>(null);

  readonly Crown = Crown;
  readonly Check = Check;
  readonly Zap = Zap;

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading.set(true);
    this.error.set(false);
    this.membershipService.getPlans().subscribe({
      next: (p) => { this.plans.set(p); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  subscribe(plan: MembershipPlan): void {
    this.subscribing.set(plan.id);
    this.membershipService.subscribe(plan.id).subscribe({
      next: (res) => {
        // Mock: confirm immediately, then redirect to profile
        this.membershipService.confirmSubscription({ mock: true }).subscribe({
          next: () => {
            this.subscribing.set(null);
            void this.router.navigate(['/profile'], { queryParams: { tab: 'membership' } });
          },
          error: () => this.subscribing.set(null),
        });
      },
      error: () => this.subscribing.set(null),
    });
  }
}
