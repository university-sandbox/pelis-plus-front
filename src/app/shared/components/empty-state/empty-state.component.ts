import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule, SearchX } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-full"
        style="background: var(--color-surface-raised);"
        aria-hidden="true"
      >
        <lucide-icon [img]="SearchX" [size]="28" style="color: var(--color-text-secondary);" />
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

      @if (actionLabel()) {
        <button
          type="button"
          (click)="action.emit()"
          class="mt-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors"
          style="background: var(--color-accent); color: var(--color-text-inverse);"
        >
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  readonly title = input('Sin resultados');
  readonly description = input('');
  readonly actionLabel = input('');

  readonly action = output<void>();

  readonly SearchX = SearchX;
}
