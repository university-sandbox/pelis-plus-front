import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BACKEND } from '../api/endpoints';
import { type ActiveMembership, type MembershipPlan } from '../models/membership.model';
import { type CreateOrderResponse } from '../models/order.model';
import { MOCK_MEMBERSHIP_PLANS } from '../mocks/membership.mock';

@Injectable({ providedIn: 'root' })
export class MembershipService {
  private readonly http = inject(HttpClient);

  /** All available plans */
  getPlans(): Observable<MembershipPlan[]> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of(MOCK_MEMBERSHIP_PLANS).pipe(delay(400));
    }

    return this.http.get<MembershipPlan[]>(BACKEND.url(BACKEND.MEMBERSHIPS.PLANS));
  }

  /** Active membership for current user (null if none) */
  getMyPlan(): Observable<ActiveMembership | null> {
    // ⚠️ MOCK — remove this block when backend is ready (returns null = no active plan)
    if (environment.mock.enabled) {
      return of(null).pipe(delay(300));
    }

    return this.http.get<ActiveMembership | null>(BACKEND.url(BACKEND.MEMBERSHIPS.MY_PLAN));
  }

  /** Subscribe to a plan — returns Izipay formToken */
  subscribe(planId: string): Observable<CreateOrderResponse> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of({ orderId: `mock-mem-${planId}`, formToken: 'MOCK_TOKEN' }).pipe(delay(600));
    }

    return this.http.post<CreateOrderResponse>(BACKEND.url(BACKEND.MEMBERSHIPS.SUBSCRIBE), {
      planId,
    });
  }

  /** Confirm membership after Izipay payment */
  confirmSubscription(paymentResult: unknown): Observable<ActiveMembership> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      const plan = MOCK_MEMBERSHIP_PLANS[1]; // Oro
      const mock: ActiveMembership = {
        planId: plan.id,
        planName: plan.name,
        expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        ticketsUsed: 0,
        ticketsTotal: plan.ticketsPerMonth,
        discountUsed: 0,
      };
      return of(mock).pipe(delay(400));
    }

    return this.http.post<ActiveMembership>(BACKEND.url(BACKEND.MEMBERSHIPS.CONFIRM), {
      paymentResult,
    });
  }

  /** Cancel membership */
  cancel(): Observable<void> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of(undefined).pipe(delay(400));
    }

    return this.http.patch<void>(BACKEND.url(BACKEND.MEMBERSHIPS.CANCEL), {});
  }
}
