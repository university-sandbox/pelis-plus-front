import { Injectable, computed, signal } from '@angular/core';

import { type Cart, type CartTicket, type CartSnackItem, cartSubtotal, cartTotal } from '../models/cart.model';

const EMPTY_CART: Cart = { tickets: [], snacks: [], membershipDiscount: 0 };

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _cart = signal<Cart>(EMPTY_CART);

  readonly cart = this._cart.asReadonly();
  readonly subtotal = computed(() => cartSubtotal(this._cart()));
  readonly total = computed(() => cartTotal(this._cart()));
  readonly itemCount = computed(
    () => this._cart().tickets.length + this._cart().snacks.reduce((s, i) => s + i.quantity, 0),
  );
  readonly isOpen = signal(false);

  openSidebar(): void {
    this.isOpen.set(true);
  }

  closeSidebar(): void {
    this.isOpen.set(false);
  }

  addTicket(ticket: CartTicket): void {
    this._cart.update((c) => ({ ...c, tickets: [...c.tickets, ticket] }));
  }

  removeTicket(seatId: string): void {
    this._cart.update((c) => ({
      ...c,
      tickets: c.tickets.filter((t) => t.seat.id !== seatId),
    }));
  }

  addSnack(item: CartSnackItem): void {
    this._cart.update((c) => {
      const existing = c.snacks.find(
        (s) => s.snack.id === item.snack.id && optionsMatch(s.selectedOptions, item.selectedOptions),
      );
      if (existing) {
        return {
          ...c,
          snacks: c.snacks.map((s) =>
            s === existing ? { ...s, quantity: s.quantity + item.quantity } : s,
          ),
        };
      }
      return { ...c, snacks: [...c.snacks, item] };
    });
  }

  removeSnack(snackId: string, selectedOptions?: Record<string, string>): void {
    this._cart.update((c) => ({
      ...c,
      snacks: c.snacks.filter(
        (s) => !(s.snack.id === snackId && optionsMatch(s.selectedOptions, selectedOptions)),
      ),
    }));
  }

  updateSnackQuantity(snackId: string, quantity: number, selectedOptions?: Record<string, string>): void {
    if (quantity <= 0) {
      this.removeSnack(snackId, selectedOptions);
      return;
    }
    this._cart.update((c) => ({
      ...c,
      snacks: c.snacks.map((s) =>
        s.snack.id === snackId && optionsMatch(s.selectedOptions, selectedOptions)
          ? { ...s, quantity }
          : s,
      ),
    }));
  }

  applyMembershipDiscount(amount: number): void {
    this._cart.update((c) => ({ ...c, membershipDiscount: amount }));
  }

  clear(): void {
    this._cart.set(EMPTY_CART);
  }
}

function optionsMatch(
  a: Record<string, string> | undefined,
  b: Record<string, string> | undefined,
): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}
