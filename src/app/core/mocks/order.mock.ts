/**
 * Mock data for OrderService / PaymentService.
 * ⚠️ Used only when environment.mock.enabled === true.
 */

import { type CreateOrderResponse, type Order } from '../models/order.model';

export const MOCK_CREATE_ORDER_RESPONSE: CreateOrderResponse = {
  orderId: 'mock-order-001',
  formToken: 'MOCK_IZIPAY_FORM_TOKEN',
};

export const MOCK_ORDER: Order = {
  id: 'mock-order-001',
  userId: 'mock-user-1',
  tickets: [],
  snacks: [],
  subtotal: 0,
  discount: 0,
  total: 0,
  status: 'confirmed',
  paymentStatus: 'approved',
  createdAt: new Date().toISOString(),
};
