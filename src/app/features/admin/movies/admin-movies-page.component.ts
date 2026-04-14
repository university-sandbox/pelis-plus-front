import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-movies-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="color: var(--color-text-primary);">
      <h1 class="text-2xl font-bold mb-4">Gestión de películas</h1>
      <p style="color: var(--color-text-secondary);">Próximamente — Fase 12</p>
    </div>
  `,
})
export class AdminMoviesPageComponent {}
