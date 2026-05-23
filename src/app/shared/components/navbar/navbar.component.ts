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
  Popcorn,
  Star,
  Home,
  Aperture,
  Clapperboard,
} from 'lucide-angular';

import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

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
      style="background: rgba(5,5,6,.88); backdrop-filter: blur(14px); border-color: var(--color-border);"
    >
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <a
          routerLink="/catalog"
          class="brand-link flex items-center gap-2"
          style="color: var(--color-text-primary);"
          aria-label="Pelis Plus — inicio"
        >
          <span class="brand-mark flex h-8 w-8 items-center justify-center rounded-full" aria-hidden="true">
            <lucide-icon [img]="Aperture" [size]="18" />
          </span>
          <span class="brand-word">PELIS<span>PLUS</span></span>
        </a>

        <!-- Desktop nav -->
        <nav aria-label="Navegación principal" class="hidden items-center gap-1 md:flex">
          @for (link of navLinks; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="nav-active"
              class="nav-link flex items-center gap-1.5 rounded px-3 py-2 text-sm font-semibold transition-colors"
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
          @if (!isAdmin()) {
            <button
              type="button"
              (click)="cartService.openSidebar()"
              class="icon-btn relative rounded-full p-2 transition-colors"
              [attr.aria-label]="cartService.itemCount() + ' artículos en el carrito'"
            >
              <lucide-icon [img]="ShoppingCart" [size]="20" aria-hidden="true" />
              @if (cartService.itemCount() > 0) {
                <span
                  class="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold"
                  style="background: var(--color-accent); color: var(--color-text-primary);"
                  aria-hidden="true"
                >{{ cartService.itemCount() }}</span>
              }
            </button>
          }

          <!-- Auth -->
          @if (isAuthenticated()) {
            @if (isAdmin()) {
              <a
                routerLink="/admin"
                class="icon-btn hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors sm:flex"
                style="background: var(--color-surface-raised); border: 1.5px solid var(--color-border-strong); color: var(--color-text-secondary);"
                aria-label="Ir al panel de administración"
              >
                <lucide-icon [img]="Clapperboard" [size]="16" aria-hidden="true" />
                Admin
              </a>
            }
            <a
              routerLink="/profile"
              class="icon-btn hidden h-8 w-8 items-center justify-center rounded-full sm:flex"
              style="background: var(--color-surface-raised); border: 1.5px solid var(--color-border-strong);"
              aria-label="Mi perfil"
            >
              <lucide-icon [img]="User" [size]="16" style="color: var(--color-text-secondary);" aria-hidden="true" />
            </a>
            <button
              type="button"
              (click)="logout()"
              class="icon-btn hidden rounded-full p-2 transition-colors sm:flex"
              aria-label="Cerrar sesión"
            >
              <lucide-icon [img]="LogOut" [size]="20" aria-hidden="true" />
            </button>
          } @else {
            <a
              routerLink="/login"
              class="hidden rounded-full px-4 py-1.5 text-sm font-semibold transition-colors sm:inline-flex items-center"
              style="background: var(--color-accent); color: var(--color-text-primary); box-shadow: var(--shadow-glow);"
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
                  class="nav-link flex items-center gap-3 rounded px-3 py-2.5 text-sm font-semibold transition-colors"
                  style="color: var(--color-text-secondary);"
                >
                  <lucide-icon [img]="link.icon" [size]="18" aria-hidden="true" />
                  {{ link.label }}
                </a>
              </li>
            }
            <li class="mt-2 border-t pt-2" style="border-color: var(--color-border);">
              @if (isAuthenticated()) {
                @if (isAdmin()) {
                  <a
                    routerLink="/admin"
                    (click)="closeMobileMenu()"
                    class="nav-link mb-1 flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm font-semibold transition-colors"
                    style="color: var(--color-text-secondary);"
                  >
                    <lucide-icon [img]="Clapperboard" [size]="18" aria-hidden="true" />
                    Panel admin
                  </a>
                }
                <button
                  type="button"
                  (click)="logout()"
                  class="nav-link flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm font-semibold transition-colors"
                  style="color: var(--color-text-secondary);"
                >
                  <lucide-icon [img]="LogOut" [size]="18" aria-hidden="true" />
                  Cerrar sesión
                </button>
              } @else {
                <a
                  routerLink="/login"
                  (click)="closeMobileMenu()"
                  class="flex items-center justify-center rounded py-2.5 text-sm font-bold"
                  style="background: var(--color-accent); color: var(--color-text-primary);"
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
    .brand-mark {
      border: 1px solid rgba(255, 46, 120, 0.45);
      background: rgba(255, 46, 120, 0.13);
      color: var(--color-accent);
      box-shadow: var(--shadow-glow);
    }

    .brand-word {
      font-family: var(--font-display);
      font-size: 1.55rem;
      line-height: 0.9;
      letter-spacing: -0.02em;
    }

    .brand-word span {
      color: var(--color-accent);
    }

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
  readonly cartService = inject(CartService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isAdmin = this.authService.isAdmin;
  readonly mobileMenuOpen = signal(false);

  readonly Menu = Menu;
  readonly X = X;
  readonly Search = Search;
  readonly ShoppingCart = ShoppingCart;
  readonly User = User;
  readonly LogOut = LogOut;
  readonly Aperture = Aperture;
  readonly Clapperboard = Clapperboard;

  readonly navLinks = [
    { label: 'Inicio', path: '/catalog', icon: Home },
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
