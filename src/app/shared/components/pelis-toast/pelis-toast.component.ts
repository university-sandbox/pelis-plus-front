import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { AlertTriangle, CheckCircle2, Info, LucideAngularModule, X } from 'lucide-angular';

export type PelisToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface PelisToastData {
  message: string;
  variant: PelisToastVariant;
}

@Component({
  selector: 'app-pelis-toast',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pelis-toast',
    '[class.pelis-toast--info]': 'data.variant === "info"',
    '[class.pelis-toast--success]': 'data.variant === "success"',
    '[class.pelis-toast--warning]': 'data.variant === "warning"',
    '[class.pelis-toast--error]': 'data.variant === "error"',
  },
  template: `
    <span class="pelis-toast__accent" aria-hidden="true"></span>
    <span class="pelis-toast__icon" aria-hidden="true">
      <lucide-icon [img]="icon()" [size]="18" [strokeWidth]="1.75" />
    </span>
    <span class="pelis-toast__body">
      <span class="pelis-toast__label">{{ label() }}</span>
      <span class="pelis-toast__message">{{ data.message }}</span>
    </span>
    <button type="button" class="pelis-toast__close" aria-label="Cerrar aviso" (click)="close()">
      <lucide-icon [img]="X" [size]="16" [strokeWidth]="1.75" aria-hidden="true" />
    </button>
  `,
  styles: `
    :host {
      --toast-accent: var(--cyan-400);
      position: relative;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      width: min(420px, calc(100vw - 32px));
      min-height: 76px;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--toast-accent) 36%, transparent);
      border-radius: 8px;
      background:
        linear-gradient(90deg, color-mix(in srgb, var(--toast-accent) 13%, transparent), transparent 42%),
        var(--ink-2);
      box-shadow:
        0 18px 52px rgba(0, 0, 0, 0.56),
        0 0 0 1px color-mix(in srgb, var(--toast-accent) 13%, transparent);
      color: var(--ivory-1);
      font-family: var(--font-body);
      padding: 14px 12px 14px 18px;
    }

    :host.pelis-toast--success {
      --toast-accent: var(--color-success);
    }

    :host.pelis-toast--warning {
      --toast-accent: var(--amber-400);
    }

    :host.pelis-toast--error {
      --toast-accent: var(--color-error);
    }

    .pelis-toast__accent {
      position: absolute;
      inset: 0 auto 0 0;
      width: 4px;
      background: var(--toast-accent);
      box-shadow: 0 0 24px color-mix(in srgb, var(--toast-accent) 44%, transparent);
    }

    .pelis-toast__icon {
      display: grid;
      width: 34px;
      height: 34px;
      place-items: center;
      border: 1px solid color-mix(in srgb, var(--toast-accent) 35%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--toast-accent) 14%, transparent);
      color: var(--toast-accent);
    }

    .pelis-toast__body {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .pelis-toast__label {
      color: var(--toast-accent);
      font-family: var(--font-display);
      font-size: 0.82rem;
      letter-spacing: 0.04em;
      line-height: 1;
      text-transform: uppercase;
    }

    .pelis-toast__message {
      color: var(--ivory-1);
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.35;
    }

    .pelis-toast__close {
      display: grid;
      width: 32px;
      height: 32px;
      flex: none;
      place-items: center;
      border: 1px solid transparent;
      border-radius: 999px;
      color: var(--ivory-2);
    }

    .pelis-toast__close:hover,
    .pelis-toast__close:focus-visible {
      border-color: var(--ink-5);
      background: var(--ink-3);
      color: var(--ivory-1);
    }
  `,
})
export class PelisToastComponent {
  private readonly snackBarRef = inject(MatSnackBarRef<PelisToastComponent>);
  readonly data = inject<PelisToastData>(MAT_SNACK_BAR_DATA);

  readonly X = X;
  readonly icon = computed(() => {
    if (this.data.variant === 'success') return CheckCircle2;
    if (this.data.variant === 'warning') return AlertTriangle;
    if (this.data.variant === 'error') return AlertTriangle;
    return Info;
  });
  readonly label = computed(() => {
    if (this.data.variant === 'success') return 'Listo';
    if (this.data.variant === 'warning') return 'Atención';
    if (this.data.variant === 'error') return 'Error';
    return 'Info';
  });

  close(): void {
    this.snackBarRef.dismiss();
  }
}
