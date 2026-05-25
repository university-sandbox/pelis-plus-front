import { summarizeMembershipDiscount } from './membership-discount';
import { type CartSnackItem, type CartTicket } from './cart.model';
import { type ActiveMembership, type MembershipPlan } from './membership.model';
import { type SnackCategory } from './snack.model';

const now = Date.parse('2026-05-24T12:00:00.000Z');

describe('summarizeMembershipDiscount', () => {
  it('returns no discount without an active membership', () => {
    expect(summarizeMembershipDiscount([ticket(24)], [], null, plan(), now)).toEqual({
      discount: 0,
      freeTicketsApplied: 0,
      freeSnacksApplied: 0,
      ticketDiscount: 0,
      snackDiscount: 0,
    });
  });

  it('returns no discount for expired memberships', () => {
    expect(
      summarizeMembershipDiscount(
        [ticket(24)],
        [],
        membership({ expiresAt: '2026-05-23T12:00:00.000Z' }),
        plan(),
        now,
      ),
    ).toEqual({
      discount: 0,
      freeTicketsApplied: 0,
      freeSnacksApplied: 0,
      ticketDiscount: 0,
      snackDiscount: 0,
    });
  });

  it('applies remaining free tickets before the plan percentage discount', () => {
    expect(
      summarizeMembershipDiscount(
        [ticket(30), ticket(24), ticket(20)],
        [],
        membership({ ticketsTotal: 2, ticketsUsed: 1 }),
        plan({ discountPercentage: 25 }),
        now,
      ),
    ).toEqual({
      discount: 41,
      freeTicketsApplied: 1,
      freeSnacksApplied: 0,
      ticketDiscount: 41,
      snackDiscount: 0,
    });
  });

  it('applies the plan percentage discount when no free tickets remain', () => {
    expect(
      summarizeMembershipDiscount(
        [ticket(23.5), ticket(18)],
        [],
        membership({ ticketsTotal: 2, ticketsUsed: 2 }),
        plan({ discountPercentage: 20 }),
        now,
      ),
    ).toEqual({
      discount: 8.3,
      freeTicketsApplied: 0,
      freeSnacksApplied: 0,
      ticketDiscount: 8.3,
      snackDiscount: 0,
    });
  });

  it('applies included snack benefits from the active plan', () => {
    expect(
      summarizeMembershipDiscount(
        [ticket(24)],
        [snack(12, 'popcorn'), snack(18, 'combos')],
        membership({ ticketsTotal: 0, ticketsUsed: 0 }),
        plan({
          discountPercentage: 20,
          benefits: [{ label: '1 snack gratis', description: 'Elige un snack incluido al mes' }],
        }),
        now,
      ),
    ).toEqual({
      discount: 22.8,
      freeTicketsApplied: 0,
      freeSnacksApplied: 1,
      ticketDiscount: 4.8,
      snackDiscount: 18,
    });
  });

  it('limits combo benefits to combo snacks', () => {
    expect(
      summarizeMembershipDiscount(
        [],
        [snack(12, 'popcorn'), snack(18, 'combos'), snack(9, 'drinks')],
        membership(),
        plan({
          discountPercentage: 20,
          benefits: [{ label: 'Un combo gratis', description: 'Combo incluido en tu compra' }],
        }),
        now,
      ),
    ).toEqual({
      discount: 18,
      freeTicketsApplied: 0,
      freeSnacksApplied: 1,
      ticketDiscount: 0,
      snackDiscount: 18,
    });
  });

  it('applies percentage discounts for all confiteria snacks', () => {
    expect(
      summarizeMembershipDiscount(
        [ticket(22)],
        [snack(18, 'extras', 3)],
        membership({ ticketsTotal: 1, ticketsUsed: 0 }),
        plan({
          discountPercentage: 35,
          benefits: [
            { label: '25% en snacks', description: '25% de descuento en toda la confitería' },
          ],
        }),
        now,
      ),
    ).toEqual({
      discount: 35.5,
      freeTicketsApplied: 1,
      freeSnacksApplied: 0,
      ticketDiscount: 22,
      snackDiscount: 13.5,
    });
  });

  it('limits percentage discounts to the snack categories described by the plan', () => {
    expect(
      summarizeMembershipDiscount(
        [],
        [snack(18, 'extras', 3), snack(10, 'drinks', 2)],
        membership(),
        plan({
          benefits: [
            { label: '15% en snacks', description: '15% de descuento en combos y bebidas' },
          ],
        }),
        now,
      ),
    ).toEqual({
      discount: 3,
      freeTicketsApplied: 0,
      freeSnacksApplied: 0,
      ticketDiscount: 0,
      snackDiscount: 3,
    });
  });
});

function ticket(price: number): CartTicket {
  return {
    screeningId: 'screening-1',
    movieId: 1,
    movieTitle: 'Pelis Plus Test',
    moviePosterPath: null,
    date: '2026-05-24',
    time: '19:00',
    venue: 'Lima',
    room: 'Sala 1',
    format: 'standard',
    seat: {
      id: `seat-${price}`,
      row: 'A',
      col: price,
      type: 'standard',
    },
    price,
  };
}

function snack(price: number, category: SnackCategory, quantity = 1): CartSnackItem {
  return {
    snack: {
      id: `${category}-${price}`,
      name: 'Snack de prueba',
      description: 'Snack usado en pruebas',
      category,
      price,
      image: null,
      status: 'active',
    },
    quantity,
  };
}

function membership(overrides: Partial<ActiveMembership> = {}): ActiveMembership {
  return {
    planId: 'oro',
    planName: 'Oro',
    expiresAt: '2026-06-24T12:00:00.000Z',
    ticketsUsed: 0,
    ticketsTotal: 0,
    discountUsed: 0,
    ...overrides,
  };
}

function plan(overrides: Partial<MembershipPlan> = {}): MembershipPlan {
  return {
    id: 'oro',
    name: 'Oro',
    price: 49,
    validity: '1 mes',
    benefits: [],
    discountPercentage: 20,
    ticketsPerMonth: 2,
    recommended: true,
    color: '#ff2e78',
    ...overrides,
  };
}
