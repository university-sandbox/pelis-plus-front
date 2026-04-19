import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Film, Home, Search } from 'lucide-angular';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex min-h-dvh flex-col items-center justify-center px-4 text-center"
      style="background: var(--color-bg);"
    >
      <!-- Animated film icon -->
      <div class="mb-6 flex h-24 w-24 items-center justify-center rounded-full"
        style="background: var(--color-surface-raised);">
        <lucide-icon [img]="Film" [size]="48" style="color: var(--color-accent);" aria-hidden="true" />
      </div>

      <p class="mb-2 text-6xl font-extrabold" style="color: var(--color-accent);">404</p>
      <h1 class="mb-3 text-2xl font-bold" style="color: var(--color-text-primary);">Página no encontrada</h1>
      <p class="mb-8 max-w-sm text-sm" style="color: var(--color-text-secondary);">
        La página que buscas no existe o fue movida. Vuelve al catálogo para encontrar lo que buscas.
      </p>

      <div class="flex flex-col gap-3 sm:flex-row">
        <a
          routerLink="/"
          class="flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
          style="background: var(--color-accent); color: var(--color-text-inverse);"
        >
          <lucide-icon [img]="Home" [size]="16" aria-hidden="true" />
          Ir al inicio
        </a>
        <a
          routerLink="/catalog"
          class="flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
          style="background: var(--color-surface-raised); border: 1px solid var(--color-border); color: var(--color-text-primary);"
        >
          <lucide-icon [img]="Search" [size]="16" aria-hidden="true" />
          Ver catálogo
        </a>
      </div>
    </div>
  `,
})
export class NotFoundPageComponent {
  readonly Film = Film;
  readonly Home = Home;
  readonly Search = Search;
}
