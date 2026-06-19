import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import type { ApexAxisChartSeries, ApexChart, ApexNonAxisChartSeries, ApexOptions, ApexXAxis } from 'ngx-apexcharts';

import { AnalyticsService } from '../../../../../core/services/analytics.service';
import type { AnalyticsPeriod } from '../../../../../core/models/analytics.model';
import { AnalyticsKpiCardComponent } from '../analytics-kpi-card/analytics-kpi-card.component';
import { ShoppingBag } from 'lucide-angular';

const CATEGORY_LABELS: Record<string, string> = {
  popcorn: 'Popcorn', drinks: 'Bebidas', combos: 'Combos', sweets: 'Dulces', extras: 'Extras',
};

@Component({
  selector: 'app-snacks-chart',
  imports: [NgxApexchartsModule, AnalyticsKpiCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './snacks-chart.component.html',
})
export class SnacksChartComponent {
  readonly period = input.required<AnalyticsPeriod>();

  private readonly svc = inject(AnalyticsService);

  readonly topSnacksResource   = this.svc.topSnacks(this.period);
  readonly categoryResource    = this.svc.snackCategoryRevenue(this.period);
  readonly avgPerOrderResource = this.svc.avgSnackPerOrder(this.period);

  readonly ShoppingBag = ShoppingBag;

  readonly isLoading = computed(() =>
    this.topSnacksResource.isLoading() ||
    this.categoryResource.isLoading() ||
    this.avgPerOrderResource.isLoading(),
  );

  readonly topSnacksOptions = computed<Partial<ApexOptions>>(() => {
    const data = this.topSnacksResource.value() ?? [];
    return {
      chart: { type: 'bar', height: Math.max(160, data.length * 34), background: 'transparent', toolbar: { show: false } } as ApexChart,
      theme: { mode: 'dark' },
      colors: ['#00D6F5'],
      plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
      grid: { borderColor: '#26262B', strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
      xaxis: { labels: { style: { colors: '#9C988D', fontSize: '11px' } }, axisBorder: { show: false } } as ApexXAxis,
      yaxis: { labels: { style: { colors: '#D9D3C5', fontSize: '12px' } } },
      tooltip: { theme: 'dark', y: { formatter: (v: number) => `${v} uds` } },
      dataLabels: { enabled: false },
      series: [{ name: 'Cantidad', data: data.map(s => ({ x: s.snackName, y: s.totalQuantity })) }] as ApexAxisChartSeries,
    };
  });

  readonly categoryOptions = computed<Partial<ApexOptions>>(() => {
    const data = this.categoryResource.value() ?? [];
    return {
      chart: { type: 'donut', height: 220, background: 'transparent' } as ApexChart,
      theme: { mode: 'dark' },
      colors: ['#FF2E78', '#F5A524', '#00D6F5', '#4ADE80', '#9C988D'],
      labels: data.map(d => CATEGORY_LABELS[d.category] ?? d.category),
      legend: { position: 'bottom', labels: { colors: '#D9D3C5' } },
      tooltip: { theme: 'dark', y: { formatter: (v: number) => `S/ ${v.toFixed(2)}` } },
      dataLabels: { style: { colors: ['#F6F1E7'] } },
      series: data.map((d: { category: string; revenue: number }) => d.revenue) as ApexNonAxisChartSeries,
      plotOptions: { pie: { donut: { size: '65%' } } },
    };
  });
}
