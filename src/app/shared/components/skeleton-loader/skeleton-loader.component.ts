import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Skeleton loader that matches the shape of real content.
 * Usage: <app-skeleton-loader width="100%" height="200px" radius="12px" />
 */
@Component({
  selector: 'app-skeleton-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="skeleton"
      [style.width]="width()"
      [style.height]="height()"
      [style.border-radius]="radius()"
      role="status"
      aria-label="Cargando..."
    ></div>
  `,
  styles: `
    .skeleton {
      background: var(--color-surface-raised);
      position: relative;
      overflow: hidden;
    }

    .skeleton::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.06) 50%,
        transparent 100%
      );
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    @media (prefers-reduced-motion: reduce) {
      .skeleton::after { animation: none; }
    }
  `,
})
export class SkeletonLoaderComponent {
  readonly width = input<string>('100%');
  readonly height = input<string>('1rem');
  readonly radius = input<string>('8px');
}
