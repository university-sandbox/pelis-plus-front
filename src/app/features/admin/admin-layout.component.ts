import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-dvh" style="background: var(--color-bg);">
      <main class="p-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {}
