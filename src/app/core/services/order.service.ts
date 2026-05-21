import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import {
  type CreateOrderPayload,
  type CreateOrderResponse,
  type Order,
} from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  /** Create order and receive Izipay formToken */
  createOrder(payload: CreateOrderPayload): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(BACKEND.url(BACKEND.ORDERS.CREATE), payload);
  }

  /** Confirm order after Izipay payment callback */
  confirmOrder(orderId: string, paymentResult: unknown): Observable<Order> {
    return this.http.post<Order>(BACKEND.url(BACKEND.ORDERS.CONFIRM(orderId)), { paymentResult });
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
