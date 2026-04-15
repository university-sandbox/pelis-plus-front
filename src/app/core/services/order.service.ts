import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BACKEND } from '../api/endpoints';
import {
  type CreateOrderPayload,
  type CreateOrderResponse,
  type Order,
} from '../models/order.model';
import { MOCK_CREATE_ORDER_RESPONSE, MOCK_ORDER } from '../mocks/order.mock';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  /** Create order and receive Izipay formToken */
  createOrder(payload: CreateOrderPayload): Observable<CreateOrderResponse> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      const subtotal = payload.tickets.reduce((s, t) => s + t.price, 0) +
        payload.snacks.reduce((s, i) => s + i.snack.price * i.quantity, 0);
      return of({
        ...MOCK_CREATE_ORDER_RESPONSE,
        formToken: `MOCK_TOKEN_${Date.now()}`,
      } as CreateOrderResponse & { subtotal: number }).pipe(delay(600));
    }

    return this.http.post<CreateOrderResponse>(BACKEND.url(BACKEND.ORDERS.CREATE), payload);
  }

  /** Confirm order after Izipay payment callback */
  confirmOrder(orderId: string, paymentResult: unknown): Observable<Order> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of({ ...MOCK_ORDER, id: orderId } as Order).pipe(delay(400));
    }

    return this.http.post<Order>(BACKEND.url(BACKEND.ORDERS.CONFIRM(orderId)), { paymentResult });
  }

  /** Fetch order detail */
  getOrder(orderId: string): Observable<Order> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of({ ...MOCK_ORDER, id: orderId } as Order).pipe(delay(300));
    }

    return this.http.get<Order>(BACKEND.url(BACKEND.ORDERS.DETAIL(orderId)));
  }

  /** Fetch all orders for current user */
  getMyOrders(): Observable<Order[]> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of([MOCK_ORDER]).pipe(delay(400));
    }

    return this.http.get<Order[]>(BACKEND.url(BACKEND.ORDERS.MY_ORDERS));
  }
}
