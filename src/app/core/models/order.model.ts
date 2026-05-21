import { type CartSnackItem, type CartTicket } from './cart.model';

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'expired' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  tickets: OrderTicket[];
  snacks: OrderSnack[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string; // ISO datetime
}

export interface OrderTicket {
  id: string;
  screeningId: string;
  seatId: string;
  movieTitle: string;
  venueName: string;
  roomName: string;
  screeningDate: string;
  screeningTime: string;
  format: string;
  price: number;
  rowLabel: string;
  colNum: number;
}

export interface OrderSnack {
  id: string;
  snackId: string;
  snackName: string;
  quantity: number;
  unitPrice: number;
  selectedOptions: Record<string, string> | null;
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
