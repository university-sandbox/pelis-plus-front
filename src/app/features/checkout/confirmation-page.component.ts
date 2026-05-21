import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, CheckCircle, Home, User } from 'lucide-angular';

import { TicketService } from '../../core/services/ticket.service';
import { type Ticket } from '../../core/models/ticket.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { TicketComponent } from './ticket.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-confirmation-page',
  imports: [RouterLink, LucideAngularModule, NavbarComponent, TicketComponent, SkeletonLoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirmation-page.component.html',
})
export class ConfirmationPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ticketService = inject(TicketService);

  readonly tickets = signal<Ticket[]>([]);
  readonly loading = signal(true);

  readonly CheckCircle = CheckCircle;
  readonly Home = Home;
  readonly User = User;

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id') ?? 'unknown';
    this.ticketService.getMyTickets().subscribe({
      next: (list) => {
        this.tickets.set(list.filter((t) => t.orderId === orderId));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
