import { type CartTicket, type CartSnackItem } from './cart.model';

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'expired' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  tickets: CartTicket[];
  snacks: CartSnackItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string; // ISO datetime
}

export interface CreateOrderPayload {
  tickets: CartTicket[];
  snacks: CartSnackItem[];
  membershipDiscount: number;
}

export interface CreateOrderResponse {
  orderId: string;
  formToken: string; // Izipay payment form token
}
