import { type SeatType } from './seat.model';
import { type Snack } from './snack.model';
import { type ScreeningFormat } from './screening.model';

export interface CartSeat {
  id: string;
  row: string;
  col: number;
  type: SeatType;
}

export interface CartTicket {
  screeningId: string;
  movieId: number;
  movieTitle: string;
  moviePosterPath: string | null;
  date: string;
  time: string;
  venue: string;
  room: string;
  format: ScreeningFormat;
  seat: CartSeat;
  price: number;
}

export interface CartSnackItem {
  snack: Snack;
  quantity: number;
  selectedOptions?: Record<string, string>; // { 'Tamaño': 'Grande' }
}

export interface Cart {
  tickets: CartTicket[];
  snacks: CartSnackItem[];
  membershipDiscount: number; // amount subtracted due to membership
}

export function cartSubtotal(cart: Cart): number {
  const ticketTotal = cart.tickets.reduce((sum, t) => sum + t.price, 0);
  const snackTotal = cart.snacks.reduce((sum, s) => sum + s.snack.price * s.quantity, 0);
  return ticketTotal + snackTotal;
}

export function cartTotal(cart: Cart): number {
  return Math.max(0, cartSubtotal(cart) - cart.membershipDiscount);
}
