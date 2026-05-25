import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { BACKEND } from '../api/endpoints';
import { type Ticket } from '../models/ticket.model';

interface PageResponse<T> {
  content?: readonly T[];
}

type TicketListResponse = Ticket[] | PageResponse<Ticket>;

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);

  /** All tickets belonging to current user */
  getMyTickets(): Observable<Ticket[]> {
    return this.http
      .get<TicketListResponse>(BACKEND.url(BACKEND.TICKETS.MY_TICKETS))
      .pipe(map(normalizeTicketList));
  }

  /** Single ticket detail */
  getTicket(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(BACKEND.url(BACKEND.TICKETS.DETAIL(id)));
  }
}

function normalizeTicketList(response: TicketListResponse): Ticket[] {
  if (Array.isArray(response)) {
    return response;
  }

  return response.content ? [...response.content] : [];
}
