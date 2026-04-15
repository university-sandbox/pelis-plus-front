export type MembershipTier = 'Plata' | 'Oro' | 'Black';

export interface MembershipBenefit {
  label: string;
  description: string;
}

export interface MembershipPlan {
  id: string;
  name: MembershipTier;
  price: number;      // monthly price in soles
  validity: string;   // e.g. '1 mes'
  benefits: MembershipBenefit[];
  discountPercentage: number; // % off ticket price
  ticketsPerMonth: number;    // free tickets included
  recommended: boolean;
  color: string; // CSS color for tier badge
}

export interface ActiveMembership {
  planId: string;
  planName: MembershipTier;
  expiresAt: string;       // ISO date
  ticketsUsed: number;
  ticketsTotal: number;
  discountUsed: number;    // soles saved this period
}
