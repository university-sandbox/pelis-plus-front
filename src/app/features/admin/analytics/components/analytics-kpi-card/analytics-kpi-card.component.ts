import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule, type LucideIconData } from 'lucide-angular';

export type KpiFormat = 'currency' | 'number' | 'percent';

@Component({
  selector: 'app-analytics-kpi-card',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics-kpi-card.component.html',
})
export class AnalyticsKpiCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number | null>();
  readonly format = input<KpiFormat>('number');
  readonly icon = input.required<LucideIconData>();
  readonly loading = input(false);

  readonly displayValue = computed(() => {
    const v = this.value();
    if (v === null || v === undefined) return '—';
    switch (this.format()) {
      case 'currency':
        return `S/ ${v.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percent':
        return `${(v * 100).toFixed(1)}%`;
      default:
        return v.toLocaleString('es-PE');
    }
  });
}
