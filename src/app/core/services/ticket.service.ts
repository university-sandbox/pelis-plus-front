import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import { type Ticket } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);

  /** All tickets belonging to current user */
  getMyTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(BACKEND.url(BACKEND.TICKETS.MY_TICKETS));
  }

  /** Single ticket detail */
  getTicket(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(BACKEND.url(BACKEND.TICKETS.DETAIL(id)));
  }
}
