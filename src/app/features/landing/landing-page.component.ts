import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, LogOut, Play, Ticket } from 'lucide-angular';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink, LucideAngularModule, NavbarComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  private readonly authService = inject(AuthService);

  readonly appName = environment.app.name;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly Play = Play;
  readonly Ticket = Ticket;
  readonly LogOut = LogOut;

  logout(): void {
    this.authService.logout();
  }
}
