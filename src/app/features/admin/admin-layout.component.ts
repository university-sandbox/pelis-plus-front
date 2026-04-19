import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideAngularModule,
  type LucideIconData,
  Film,
  Calendar,
  DoorOpen,
  ShoppingBag,
  ClipboardList,
  Users,
  Menu,
  X,
  Clapperboard,
} from 'lucide-angular';

interface NavItem {
  path: string;
  label: string;
  icon: LucideIconData;
}

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  readonly sidebarOpen = signal(false);

  readonly Clapperboard = Clapperboard;
  readonly Menu = Menu;
  readonly X = X;

  readonly navItems: NavItem[] = [
    { path: '/admin/movies', label: 'Películas', icon: Film },
    { path: '/admin/screenings', label: 'Funciones', icon: Calendar },
    { path: '/admin/rooms', label: 'Salas', icon: DoorOpen },
    { path: '/admin/snacks', label: 'Confitería', icon: ShoppingBag },
    { path: '/admin/orders', label: 'Pedidos', icon: ClipboardList },
    { path: '/admin/users', label: 'Usuarios', icon: Users },
  ];
}
