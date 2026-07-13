import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import {
  type CreateOrderPayload,
  type CreateOrderResponse,
  type Order,
} from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  /** Create order and receive a Stripe Checkout sandbox URL when payment is required. */
  createOrder(payload: CreateOrderPayload): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(BACKEND.url(BACKEND.ORDERS.CREATE), payload);
  }

  /** Confirm order after a legacy/manual payment callback. */
  confirmOrder(orderId: string, paymentResult: unknown): Observable<Order> {
    return this.http.post<Order>(BACKEND.url(BACKEND.ORDERS.CONFIRM(orderId)), { paymentResult });
  }

  /** Verify a Stripe Checkout Session server-side and issue tickets. */
  confirmStripeCheckout(sessionId: string): Observable<Order> {
    return this.http.post<Order>(BACKEND.url(BACKEND.ORDERS.CONFIRM_STRIPE), { sessionId });
  }

  /** Temporarily retry the confirmation email for an order owned by the current user. */
  resendConfirmationEmail(orderId: string): Observable<void> {
    return this.http.post<void>(BACKEND.url(BACKEND.ORDERS.RESEND_CONFIRMATION_EMAIL(orderId)), {});
  }

  /** Fetch order detail */
  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(BACKEND.url(BACKEND.ORDERS.DETAIL(orderId)));
  }

  /** Fetch all orders for current user */
  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(BACKEND.url(BACKEND.ORDERS.MY_ORDERS));
  }
}
