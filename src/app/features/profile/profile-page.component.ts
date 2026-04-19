import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LucideAngularModule, User, Shield, Ticket, History, Crown, Save, Eye, EyeOff } from 'lucide-angular';

import { UserService } from '../../core/services/user.service';
import { TicketService } from '../../core/services/ticket.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { type UserProfile } from '../../core/models/user.model';
import { type Ticket as TicketModel } from '../../core/models/ticket.model';
import { type Order } from '../../core/models/order.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { TicketComponent } from '../checkout/ticket.component';

type ProfileTab = 'personal' | 'security' | 'tickets' | 'history' | 'membership';

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, SlicePipe, ReactiveFormsModule, LucideAngularModule, NavbarComponent, SkeletonLoaderComponent, TicketComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly ticketService = inject(TicketService);
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly profile = signal<UserProfile | null>(null);
  readonly profileLoading = signal(true);
  readonly tickets = signal<TicketModel[]>([]);
  readonly ticketsLoading = signal(true);
  readonly orders = signal<Order[]>([]);
  readonly ordersLoading = signal(true);

  readonly activeTab = signal<ProfileTab>('personal');
  readonly savingProfile = signal(false);
  readonly profileSaved = signal(false);
  readonly savingPassword = signal(false);
  readonly passwordSaved = signal(false);
  readonly passwordError = signal('');
  readonly showCurrentPwd = signal(false);
  readonly showNewPwd = signal(false);

  readonly User = User;
  readonly Shield = Shield;
  readonly Ticket = Ticket;
  readonly History = History;
  readonly Crown = Crown;
  readonly Save = Save;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  readonly tabs = [
    { id: 'personal' as ProfileTab, label: 'Datos personales', icon: User },
    { id: 'security' as ProfileTab, label: 'Seguridad', icon: Shield },
    { id: 'tickets' as ProfileTab, label: 'Mis entradas', icon: Ticket },
    { id: 'history' as ProfileTab, label: 'Historial', icon: History },
    { id: 'membership' as ProfileTab, label: 'Membresía', icon: Crown },
  ];

  readonly profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  readonly passwordForm = this.fb.group({
    current: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  readonly userInitial = computed(() => {
    const name = this.profile()?.name ?? '';
    return name.charAt(0).toUpperCase() || 'U';
  });

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (p) => {
        this.profile.set(p);
        this.profileForm.patchValue({ name: p.name, email: p.email });
        this.profileLoading.set(false);
      },
      error: () => this.profileLoading.set(false),
    });
    this.ticketService.getMyTickets().subscribe({
      next: (t) => { this.tickets.set(t); this.ticketsLoading.set(false); },
      error: () => this.ticketsLoading.set(false),
    });
    this.orderService.getMyOrders().subscribe({
      next: (o) => { this.orders.set(o); this.ordersLoading.set(false); },
      error: () => this.ordersLoading.set(false),
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    const { name, email } = this.profileForm.value;
    this.savingProfile.set(true);
    this.userService.updateProfile({ name: name!, email: email! }).subscribe({
      next: (p) => {
        this.profile.set(p);
        this.savingProfile.set(false);
        this.profileSaved.set(true);
        setTimeout(() => this.profileSaved.set(false), 3000);
      },
      error: () => this.savingProfile.set(false),
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid) return;
    const { current, newPassword } = this.passwordForm.value;
    this.savingPassword.set(true);
    this.passwordError.set('');
    this.userService.changePassword(current!, newPassword!).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.passwordSaved.set(true);
        this.passwordForm.reset();
        setTimeout(() => this.passwordSaved.set(false), 3000);
      },
      error: () => {
        this.savingPassword.set(false);
        this.passwordError.set('No se pudo actualizar la contraseña. Verifica tu contraseña actual.');
      },
    });
  }
}
