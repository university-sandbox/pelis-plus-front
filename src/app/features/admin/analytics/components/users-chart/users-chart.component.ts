import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import type { ApexAxisChartSeries, ApexChart, ApexOptions, ApexXAxis, ApexYAxis } from 'ngx-apexcharts';

import { AnalyticsService } from '../../../../../core/services/analytics.service';
import type { AnalyticsPeriod } from '../../../../../core/models/analytics.model';
import { AnalyticsKpiCardComponent } from '../analytics-kpi-card/analytics-kpi-card.component';
import { Users, UserCheck } from 'lucide-angular';

@Component({
  selector: 'app-users-chart',
  imports: [NgxApexchartsModule, AnalyticsKpiCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users-chart.component.html',
})
export class UsersChartComponent {
  readonly period = input.required<AnalyticsPeriod>();

  private readonly svc = inject(AnalyticsService);

  readonly registrationsResource = this.svc.userRegistrations(this.period);
  readonly purchaseRateResource  = this.svc.userPurchaseRate();

  readonly Users = Users;
  readonly UserCheck = UserCheck;

  readonly totalNewUsers = computed(() => {
    const data = this.registrationsResource.value() ?? [];
    return data.reduce((sum: number, d: { label: string; count: number }) => sum + d.count, 0);
  });

  readonly lineOptions = computed<Partial<ApexOptions>>(() => {
    const data = this.registrationsResource.value() ?? [];
    return {
      chart: { type: 'area', height: 240, background: 'transparent', toolbar: { show: false } } as ApexChart,
      theme: { mode: 'dark' },
      colors: ['#4ADE80'],
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.0 } },
      stroke: { curve: 'smooth', width: 2 },
      grid: { borderColor: '#26262B', strokeDashArray: 4 },
      xaxis: { categories: data.map((d: { label: string; count: number }) => d.label), labels: { style: { colors: '#9C988D', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } } as ApexXAxis,
      yaxis: { labels: { style: { colors: '#9C988D', fontSize: '11px' }, formatter: (v: number) => Math.round(v).toString() } } as ApexYAxis,
      tooltip: { theme: 'dark', y: { formatter: (v: number) => `${v} usuarios` } },
      dataLabels: { enabled: false },
      series: [{ name: 'Nuevos usuarios', data: data.map((d: { label: string; count: number }) => d.count) }] as ApexAxisChartSeries,
    };
  });
}
