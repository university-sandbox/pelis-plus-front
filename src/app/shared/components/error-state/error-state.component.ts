import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-error-state',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-full"
        style="background: rgba(239,68,68,.12);"
        aria-hidden="true"
      >
        <lucide-icon [img]="AlertCircle" [size]="28" style="color: var(--color-error);" />
      </div>

      <div class="max-w-xs space-y-1">
        <p class="text-base font-semibold" style="color: var(--color-text-primary);">
          {{ title() }}
        </p>
        @if (description()) {
          <p class="text-sm" style="color: var(--color-text-secondary);">
            {{ description() }}
          </p>
        }
      </div>

      @if (retryLabel()) {
        <button
          type="button"
          (click)="retry.emit()"
          class="mt-2 rounded-full border px-5 py-2 text-sm font-semibold transition-colors"
          style="border-color: var(--color-accent); color: var(--color-accent);"
        >
          {{ retryLabel() }}
        </button>
      }
    </div>
  `,
})
export class ErrorStateComponent {
  readonly title = input('Algo salió mal');
  readonly description = input('Por favor, inténtalo de nuevo más tarde.');
  readonly retryLabel = input('Reintentar');

  readonly retry = output<void>();

  readonly AlertCircle = AlertCircle;
}
