import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import type { ApexChart, ApexNonAxisChartSeries, ApexOptions } from 'ngx-apexcharts';

import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { AnalyticsKpiCardComponent } from '../analytics-kpi-card/analytics-kpi-card.component';
import { CreditCard } from 'lucide-angular';

@Component({
  selector: 'app-memberships-chart',
  imports: [NgxApexchartsModule, AnalyticsKpiCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './memberships-chart.component.html',
})
export class MembershipsChartComponent {
  private readonly svc = inject(AnalyticsService);

  readonly distributionResource = this.svc.membershipDistribution();

  readonly CreditCard = CreditCard;

  readonly totalActive = computed(() => {
    const data = this.distributionResource.value() ?? [];
    return data.reduce((sum, d) => sum + d.userCount, 0);
  });

  readonly donutOptions = computed<Partial<ApexOptions>>(() => {
    const data = this.distributionResource.value() ?? [];
    const planColors: Record<string, string> = { Plata: '#9C988D', Oro: '#F5A524', Black: '#FF2E78' };
    const colors = data.map(d => planColors[d.planName] ?? '#D9D3C5');
    return {
      chart: { type: 'donut', height: 260, background: 'transparent' } as ApexChart,
      theme: { mode: 'dark' },
      colors,
      labels: data.map(d => d.planName),
      legend: { position: 'bottom', labels: { colors: '#D9D3C5' } },
      tooltip: { theme: 'dark', y: { formatter: (v: number) => `${v} usuarios` } },
      dataLabels: { style: { colors: ['#F6F1E7'], fontSize: '13px' } },
      series: data.map(d => d.userCount) as ApexNonAxisChartSeries,
      plotOptions: { pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Activas', color: '#9C988D' } } } } },
    };
  });
}
