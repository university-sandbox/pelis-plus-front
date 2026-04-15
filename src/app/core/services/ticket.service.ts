import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BACKEND } from '../api/endpoints';
import { type Ticket } from '../models/ticket.model';
import { MOCK_TICKETS } from '../mocks/ticket.mock';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);

  /** All tickets belonging to current user */
  getMyTickets(): Observable<Ticket[]> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of(MOCK_TICKETS).pipe(delay(400));
    }

    return this.http.get<Ticket[]>(BACKEND.url(BACKEND.TICKETS.MY_TICKETS));
  }

  /** Single ticket detail */
  getTicket(id: string): Observable<Ticket | null> {
    // ⚠️ MOCK — remove this block when backend is ready
    if (environment.mock.enabled) {
      return of(MOCK_TICKETS.find((t) => t.id === id) ?? null).pipe(delay(300));
    }

    return this.http.get<Ticket>(BACKEND.url(BACKEND.TICKETS.DETAIL(id)));
  }

  /**
   * Builds ticket data from a confirmed order for immediate display
   * on the ConfirmationPage (before backend issues the real ticket).
   */
  buildTicketsFromOrder(
    orderId: string,
    userName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    order: any,
  ): Ticket[] {
    // ⚠️ MOCK — returns tickets built from cart data
    return (order.tickets ?? []).map((t: any, i: number) => ({
      id: `tk-${orderId}-${i}`,
      orderId,
      bookingCode: `PLX-${orderId.toUpperCase()}-${String(i + 1).padStart(2, '0')}`,
      userName,
      movie: t.movieTitle ?? '',
      moviePosterPath: t.moviePosterPath ?? null,
      venue: t.venue ?? '',
      room: t.room ?? '',
      date: t.date ?? '',
      time: t.time ?? '',
      seat: `${t.seat?.row ?? ''}${t.seat?.col ?? ''}`,
      format: t.format ?? '',
      totalPaid: order.total ?? t.price ?? 0,
      qrData: `PLX-${orderId.toUpperCase()}-${String(i + 1).padStart(2, '0')}`,
      issuedAt: new Date().toISOString(),
    }));
  }
}
