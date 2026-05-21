import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import { type ActiveMembership, type MembershipPlan } from '../models/membership.model';

export interface MembershipSubscriptionResponse {
  formToken: string;
  planId: string;
}

@Injectable({ providedIn: 'root' })
export class MembershipService {
  private readonly http = inject(HttpClient);

  /** All available plans */
  getPlans(): Observable<MembershipPlan[]> {
    return this.http.get<MembershipPlan[]>(BACKEND.url(BACKEND.MEMBERSHIPS.PLANS));
  }

  /** Active membership for current user (null if none) */
  getMyPlan(): Observable<ActiveMembership | null> {
    return this.http.get<ActiveMembership | null>(BACKEND.url(BACKEND.MEMBERSHIPS.MY_PLAN));
  }

  /** Subscribe to a plan — returns Izipay formToken */
  subscribe(planId: string): Observable<MembershipSubscriptionResponse> {
    return this.http.post<MembershipSubscriptionResponse>(BACKEND.url(BACKEND.MEMBERSHIPS.SUBSCRIBE), {
      planId,
    });
  }

  /** Confirm membership after Izipay payment */
  confirmSubscription(planId: string): Observable<ActiveMembership> {
    return this.http.post<ActiveMembership>(BACKEND.url(BACKEND.MEMBERSHIPS.CONFIRM), {
      planId,
    });
  }

  /** Cancel membership */
  cancel(): Observable<void> {
    return this.http.patch<void>(BACKEND.url(BACKEND.MEMBERSHIPS.CANCEL), {});
  }
}
