/**
 * Mock data for MembershipService.
 * ⚠️ Used only when environment.mock.enabled === true.
 * - 3 static plans (Plata, Oro, Black)
 * - getMyPlan() returns null (no active plan for demo user)
 */

import { type MembershipPlan } from '../models/membership.model';

export const MOCK_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'plan-plata',
    name: 'Plata',
    price: 29,
    validity: '1 mes',
    discountPercentage: 10,
    ticketsPerMonth: 2,
    recommended: false,
    color: '#9090A8',
    benefits: [
      { label: '2 entradas al mes', description: 'Canjea hasta 2 entradas gratis por mes' },
      { label: '10% de descuento', description: '10% off en todas tus compras adicionales de entradas' },
      { label: 'Acceso prioritario', description: 'Reserva con 24 h de anticipación a usuarios normales' },
    ],
  },
  {
    id: 'plan-oro',
    name: 'Oro',
    price: 59,
    validity: '1 mes',
    discountPercentage: 20,
    ticketsPerMonth: 4,
    recommended: true,
    color: '#F59E0B',
    benefits: [
      { label: '4 entradas al mes', description: 'Canjea hasta 4 entradas gratis por mes' },
      { label: '20% de descuento', description: '20% off en todas tus compras adicionales de entradas' },
      { label: '15% en snacks', description: '15% de descuento en combos y bebidas' },
      { label: 'Acceso prioritario', description: 'Reserva con 48 h de anticipación' },
    ],
  },
  {
    id: 'plan-black',
    name: 'Black',
    price: 99,
    validity: '1 mes',
    discountPercentage: 35,
    ticketsPerMonth: 8,
    recommended: false,
    color: '#7C3AED',
    benefits: [
      { label: '8 entradas al mes', description: 'Canjea hasta 8 entradas gratis por mes' },
      { label: '35% de descuento', description: '35% off en entradas adicionales' },
      { label: '25% en snacks', description: '25% de descuento en toda la confitería' },
      { label: 'Acceso VIP', description: 'Reserva hasta 1 semana antes + sala VIP exclusiva' },
      { label: 'Acompañante gratis', description: '1 entrada de acompañante gratis por mes' },
    ],
  },
];
