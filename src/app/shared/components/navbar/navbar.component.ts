import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  LogOut,
  Film,
  Popcorn,
  Star,
  Home,
} from 'lucide-angular';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
    '(document:keydown.escape)': 'closeMobileMenu()',
  },
  template: `
    <header
      class="fixed top-0 left-0 right-0 z-50 border-b"
      style="background: rgba(9,9,15,.88); backdrop-filter: blur(12px); border-color: var(--color-border);"
    >
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <!-- Logo -->
        <a
          routerLink="/catalog"
          class="flex items-center gap-2 text-xl font-extrabold tracking-tight"
          style="color: var(--color-accent);"
          aria-label="Pelis Plus — inicio"
        >
          <lucide-icon [img]="Film" [size]="22" aria-hidden="true" />
          PELIS<span style="color: var(--color-text-primary);">+</span>
        </a>

        <!-- Desktop nav -->
        <nav aria-label="Navegación principal" class="hidden items-center gap-1 md:flex">
          @for (link of navLinks; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="nav-active"
              class="nav-link flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              style="color: var(--color-text-secondary);"
            >
              <lucide-icon [img]="link.icon" [size]="16" aria-hidden="true" />
              {{ link.label }}
            </a>
          }
        </nav>

        <!-- Right actions -->
        <div class="flex items-center gap-2">
          <!-- Search -->
          <button
            type="button"
            class="icon-btn hidden rounded-full p-2 transition-colors sm:flex"
            aria-label="Buscar"
          >
            <lucide-icon [img]="Search" [size]="20" aria-hidden="true" />
          </button>

          <!-- Cart -->
          <button
            type="button"
            class="icon-btn relative rounded-full p-2 transition-colors"
            aria-label="Carrito de compras"
          >
            <lucide-icon [img]="ShoppingCart" [size]="20" aria-hidden="true" />
            <span
              class="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold"
              style="background: var(--color-accent); color: var(--color-text-inverse);"
              aria-label="0 artículos en el carrito"
            >0</span>
          </button>

          <!-- Auth -->
          @if (isAuthenticated()) {
            <button
              type="button"
              (click)="logout()"
              class="icon-btn hidden rounded-full p-2 transition-colors sm:flex"
              aria-label="Cerrar sesión"
            >
              <lucide-icon [img]="LogOut" [size]="20" aria-hidden="true" />
            </button>
            <div
              class="hidden h-8 w-8 items-center justify-center rounded-full sm:flex"
              style="background: var(--color-surface-raised); border: 1.5px solid var(--color-border-strong);"
              aria-label="Perfil de usuario"
            >
              <lucide-icon [img]="User" [size]="16" style="color: var(--color-text-secondary);" aria-hidden="true" />
            </div>
          } @else {
            <a
              routerLink="/login"
              class="hidden rounded-full px-4 py-1.5 text-sm font-semibold transition-colors sm:inline-flex items-center"
              style="background: var(--color-accent); color: var(--color-text-inverse);"
            >
              Ingresar
            </a>
          }

          <!-- Hamburger (mobile) -->
          <button
            type="button"
            class="icon-btn rounded-full p-2 transition-colors md:hidden"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-controls="mobile-menu"
            aria-label="Abrir menú"
          >
            @if (mobileMenuOpen()) {
              <lucide-icon [img]="X" [size]="22" aria-hidden="true" />
            } @else {
              <lucide-icon [img]="Menu" [size]="22" aria-hidden="true" />
            }
          </button>
        </div>
      </div>

      <!-- Mobile menu drawer -->
      @if (mobileMenuOpen()) {
        <nav
          id="mobile-menu"
          aria-label="Menú móvil"
          class="border-t md:hidden"
          style="border-color: var(--color-border); background: var(--color-surface);"
        >
          <ul class="flex flex-col gap-1 px-4 py-3" role="list">
            @for (link of navLinks; track link.path) {
              <li>
                <a
                  [routerLink]="link.path"
                  routerLinkActive="nav-active"
                  (click)="closeMobileMenu()"
                  class="nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                  style="color: var(--color-text-secondary);"
                >
                  <lucide-icon [img]="link.icon" [size]="18" aria-hidden="true" />
                  {{ link.label }}
                </a>
              </li>
            }
            <li class="mt-2 border-t pt-2" style="border-color: var(--color-border);">
              @if (isAuthenticated()) {
                <button
                  type="button"
                  (click)="logout()"
                  class="nav-link flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                  style="color: var(--color-text-secondary);"
                >
                  <lucide-icon [img]="LogOut" [size]="18" aria-hidden="true" />
                  Cerrar sesión
                </button>
              } @else {
                <a
                  routerLink="/login"
                  (click)="closeMobileMenu()"
                  class="flex items-center justify-center rounded-full py-2.5 text-sm font-semibold"
                  style="background: var(--color-accent); color: var(--color-text-inverse);"
                >
                  Ingresar
                </a>
              }
            </li>
          </ul>
        </nav>
      }
    </header>

    <!-- Spacer to push content below the fixed navbar -->
    <div class="h-16" aria-hidden="true"></div>
  `,
  styles: `
    .nav-link:hover,
    .nav-link:focus-visible {
      color: var(--color-text-primary) !important;
      background: var(--color-surface-raised);
    }

    .nav-link.nav-active {
      color: var(--color-accent) !important;
      position: relative;
    }

    .nav-link.nav-active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      border-radius: 1px;
      background: var(--color-accent);
    }

    .icon-btn {
      color: var(--color-text-secondary);
      transition: color 0.15s, background 0.15s;
    }

    .icon-btn:hover,
    .icon-btn:focus-visible {
      color: var(--color-text-primary);
      background: var(--color-surface-raised);
    }

    .icon-btn:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
  `,
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly mobileMenuOpen = signal(false);

  readonly Menu = Menu;
  readonly X = X;
  readonly Search = Search;
  readonly ShoppingCart = ShoppingCart;
  readonly User = User;
  readonly LogOut = LogOut;
  readonly Film = Film;

  readonly navLinks = [
    { label: 'Inicio', path: '/catalog', icon: Home },
    { label: 'Cartelera', path: '/catalog', icon: Film },
    { label: 'Snacks', path: '/snacks', icon: Popcorn },
    { label: 'Membresías', path: '/memberships', icon: Star },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
  }

}
