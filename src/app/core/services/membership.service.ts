import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import { type ActiveMembership, type MembershipPlan } from '../models/membership.model';

export interface MembershipSubscriptionResponse {
  planId: string;
  checkoutSessionId: string;
  checkoutUrl: string;
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

  /** Subscribe to a plan — returns a Stripe Checkout sandbox URL. */
  subscribe(planId: string): Observable<MembershipSubscriptionResponse> {
    return this.http.post<MembershipSubscriptionResponse>(BACKEND.url(BACKEND.MEMBERSHIPS.SUBSCRIBE), {
      planId,
    });
  }

  /** Confirm membership after a legacy/manual payment. */
  confirmSubscription(planId: string): Observable<ActiveMembership> {
    return this.http.post<ActiveMembership>(BACKEND.url(BACKEND.MEMBERSHIPS.CONFIRM), {
      planId,
    });
  }

  /** Verify a Stripe Checkout Session server-side and activate the membership. */
  confirmStripeCheckout(sessionId: string): Observable<ActiveMembership> {
    return this.http.post<ActiveMembership>(BACKEND.url(BACKEND.MEMBERSHIPS.CONFIRM_STRIPE), {
      sessionId,
    });
  }

  /** Cancel membership */
  cancel(): Observable<void> {
    return this.http.patch<void>(BACKEND.url(BACKEND.MEMBERSHIPS.CANCEL), {});
  }
}
