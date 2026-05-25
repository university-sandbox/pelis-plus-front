import { type CartSnackItem, type CartTicket } from './cart.model';
import { type ActiveMembership, type MembershipPlan } from './membership.model';
import { type SnackCategory } from './snack.model';

export interface MembershipDiscountSummary {
  discount: number;
  freeTicketsApplied: number;
  freeSnacksApplied: number;
  ticketDiscount: number;
  snackDiscount: number;
}

export function summarizeMembershipDiscount(
  tickets: readonly CartTicket[],
  snacks: readonly CartSnackItem[],
  membership: ActiveMembership | null,
  plan: MembershipPlan | null,
  now = Date.now(),
): MembershipDiscountSummary {
  if (!membership || !plan || !isActiveMembership(membership, now)) {
    return emptySummary();
  }

  const prices = tickets.map((ticket) => ticket.price).sort((a, b) => b - a);
  const freeTicketsApplied = Math.min(
    prices.length,
    Math.max(0, membership.ticketsTotal - membership.ticketsUsed),
  );
  const freeTicketDiscount = prices
    .slice(0, freeTicketsApplied)
    .reduce((sum, price) => sum + price, 0);
  const percentageDiscount = prices
    .slice(freeTicketsApplied)
    .reduce((sum, price) => sum + price * (plan.discountPercentage / 100), 0);
  const ticketDiscount = roundCurrency(freeTicketDiscount + percentageDiscount);
  const ticketTotal = prices.reduce((sum, price) => sum + price, 0);
  const snackBenefit = getSnackBenefit(plan);
  const snackPrices = getEligibleSnackUnitPrices(snacks, snackBenefit.categories);
  const freeSnacksApplied = Math.min(snackPrices.length, snackBenefit.quantity);
  const freeSnackDiscount = snackPrices
    .slice(0, freeSnacksApplied)
    .reduce((sum, price) => sum + price, 0);
  const snackPercentageBenefit = getSnackPercentageBenefit(plan);
  const snackPercentageDiscount = getEligibleSnackUnitPrices(
    snacks,
    snackPercentageBenefit.categories,
  ).reduce((sum, price) => sum + price * (snackPercentageBenefit.percentage / 100), 0);
  const snackDiscount = roundCurrency(freeSnackDiscount + snackPercentageDiscount);
  const snackTotal = snacks.reduce((sum, item) => sum + item.snack.price * item.quantity, 0);
  const cartSubtotal = ticketTotal + snackTotal;
  const discount = roundCurrency(Math.min(cartSubtotal, ticketDiscount + snackDiscount));

  return { discount, freeTicketsApplied, freeSnacksApplied, ticketDiscount, snackDiscount };
}

function isActiveMembership(membership: ActiveMembership, now: number): boolean {
  const expiresAt = Date.parse(membership.expiresAt);

  return Number.isFinite(expiresAt) && expiresAt > now;
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function emptySummary(): MembershipDiscountSummary {
  return {
    discount: 0,
    freeTicketsApplied: 0,
    freeSnacksApplied: 0,
    ticketDiscount: 0,
    snackDiscount: 0,
  };
}

function getSnackBenefit(plan: MembershipPlan): {
  categories: readonly SnackCategory[] | null;
  quantity: number;
} {
  const snackBenefits = plan.benefits
    .map((benefit) => normalizeText(`${benefit.label} ${benefit.description}`))
    .filter(
      (text) =>
        hasSnackKeyword(text) && /\b(gratis|incluid[oa]s?|free|sin costo|cortesia)\b/.test(text),
    );

  if (snackBenefits.length === 0) {
    return { categories: null, quantity: 0 };
  }

  const quantity = Math.max(...snackBenefits.map(getBenefitQuantity));
  const categories = getEligibleCategories(snackBenefits.join(' '));

  return { categories, quantity };
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function hasSnackKeyword(text: string): boolean {
  return /\b(snacks?|confiteria|combos?|popcorn|canchas?|bebidas?|gaseosas?|dulces?)\b/.test(text);
}

function getBenefitQuantity(text: string): number {
  const digitMatch = text.match(/\b(\d+)\b/);

  if (digitMatch) {
    return Number(digitMatch[1]);
  }

  const wordNumbers: Record<string, number> = {
    un: 1,
    una: 1,
    uno: 1,
    dos: 2,
    tres: 3,
    cuatro: 4,
    cinco: 5,
  };
  const wordMatch = text.match(/\b(un|una|uno|dos|tres|cuatro|cinco)\b/);

  return wordMatch ? wordNumbers[wordMatch[1]] : 1;
}

function getEligibleCategories(text: string): readonly SnackCategory[] | null {
  const categories = new Set<SnackCategory>();

  if (/\bcombos?\b/.test(text)) {
    categories.add('combos');
  }

  if (/\b(bebidas?|gaseosas?)\b/.test(text)) {
    categories.add('drinks');
  }

  if (/\b(popcorn|canchas?)\b/.test(text)) {
    categories.add('popcorn');
  }

  if (/\bdulces?\b/.test(text)) {
    categories.add('sweets');
  }

  return categories.size > 0 ? [...categories] : null;
}

function getSnackPercentageBenefit(plan: MembershipPlan): {
  categories: readonly SnackCategory[] | null;
  percentage: number;
} {
  const snackDiscounts = plan.benefits
    .map((benefit) => normalizeText(`${benefit.label} ${benefit.description}`))
    .filter((text) => hasSnackKeyword(text) && getPercentage(text) > 0);

  if (snackDiscounts.length === 0) {
    return { categories: null, percentage: 0 };
  }

  const percentage = Math.max(...snackDiscounts.map(getPercentage));
  const categories = getEligibleCategories(snackDiscounts.join(' '));

  return { categories, percentage };
}

function getPercentage(text: string): number {
  return Number(text.match(/\b(\d+(?:\.\d+)?)\s*%/)?.[1] ?? 0);
}

function getEligibleSnackUnitPrices(
  snacks: readonly CartSnackItem[],
  categories: readonly SnackCategory[] | null,
): number[] {
  return snacks
    .filter((item) => !categories || categories.includes(item.snack.category))
    .flatMap((item) => Array.from({ length: item.quantity }, () => item.snack.price))
    .sort((a, b) => b - a);
}
