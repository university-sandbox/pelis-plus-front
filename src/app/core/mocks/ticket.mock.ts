/**
 * Mock data for TicketService.
 * ⚠️ Used only when environment.mock.enabled === true.
 */

import { type Ticket } from '../models/ticket.model';

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'tk-001',
    orderId: 'mock-order-001',
    bookingCode: 'PLX-2024-001',
    userName: 'Usuario Demo',
    movie: 'Dune: Part Two',
    moviePosterPath: null,
    venue: 'PelisPlus Miraflores',
    room: 'Sala IMAX',
    date: '2024-04-20',
    time: '19:00',
    seat: 'D5',
    format: 'imax',
    totalPaid: 38,
    qrData: 'PLX-2024-001',
    issuedAt: new Date().toISOString(),
  },
];
