import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { AnalyticsPeriod } from '../../../../../core/models/analytics.model';

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: 'TODAY', label: 'Hoy' },
  { value: 'WEEK', label: 'Semana' },
  { value: 'MONTH', label: 'Mes' },
  { value: 'YEAR', label: 'Año' },
];

@Component({
  selector: 'app-analytics-period-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics-period-filter.component.html',
})
export class AnalyticsPeriodFilterComponent {
  readonly value = input.required<AnalyticsPeriod>();
  readonly periodChange = output<AnalyticsPeriod>();

  readonly periods = PERIODS;
}
