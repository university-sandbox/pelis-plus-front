import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import type { ApexAxisChartSeries, ApexChart, ApexOptions, ApexXAxis, ApexYAxis } from 'ngx-apexcharts';

import { AnalyticsService } from '../../../../../core/services/analytics.service';
import type { AnalyticsPeriod } from '../../../../../core/models/analytics.model';
import { AnalyticsKpiCardComponent } from '../analytics-kpi-card/analytics-kpi-card.component';
import { TrendingUp, DollarSign, Percent } from 'lucide-angular';

@Component({
  selector: 'app-revenue-chart',
  imports: [NgxApexchartsModule, AnalyticsKpiCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './revenue-chart.component.html',
})
export class RevenueChartComponent {
  readonly period = input.required<AnalyticsPeriod>();

  private readonly svc = inject(AnalyticsService);

  readonly seriesResource = this.svc.revenueSeries(this.period);
  readonly breakdownResource = this.svc.revenueBreakdown(this.period);

  readonly TrendingUp = TrendingUp;
  readonly DollarSign = DollarSign;
  readonly Percent = Percent;

  readonly lineOptions = computed<Partial<ApexOptions>>(() => {
    const data = this.seriesResource.value() ?? [];
    return {
      chart: { type: 'area', height: 260, background: 'transparent', toolbar: { show: false }, sparkline: { enabled: false } } as ApexChart,
      theme: { mode: 'dark' },
      colors: ['#FF2E78'],
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.0 } },
      stroke: { curve: 'smooth', width: 2 },
      grid: { borderColor: '#26262B', strokeDashArray: 4 },
      xaxis: { categories: data.map(d => d.label), labels: { style: { colors: '#9C988D', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } } as ApexXAxis,
      yaxis: { labels: { style: { colors: '#9C988D', fontSize: '11px' }, formatter: (v: number) => `S/ ${v.toFixed(0)}` } } as ApexYAxis,
      tooltip: { theme: 'dark', y: { formatter: (v: number) => `S/ ${v.toFixed(2)}` } },
      dataLabels: { enabled: false },
      series: [{ name: 'Ingresos', data: data.map(d => d.revenue) }] as ApexAxisChartSeries,
    };
  });

  readonly stackedOptions = computed<Partial<ApexOptions>>(() => {
    const bd = this.breakdownResource.value();
    return {
      chart: { type: 'bar', height: 240, background: 'transparent', toolbar: { show: false }, stacked: true } as ApexChart,
      theme: { mode: 'dark' },
      colors: ['#FF2E78', '#F5A524'],
      plotOptions: { bar: { horizontal: false, borderRadius: 4, columnWidth: '50%' } },
      grid: { borderColor: '#26262B', strokeDashArray: 4 },
      xaxis: { categories: ['Ingresos'], labels: { style: { colors: '#9C988D' } }, axisBorder: { show: false } } as ApexXAxis,
      yaxis: { labels: { style: { colors: '#9C988D' }, formatter: (v: number) => `S/ ${v.toFixed(0)}` } } as ApexYAxis,
      tooltip: { theme: 'dark', y: { formatter: (v: number) => `S/ ${v.toFixed(2)}` } },
      legend: { labels: { colors: '#D9D3C5' } },
      dataLabels: { enabled: false },
      series: [
        { name: 'Entradas', data: [bd?.ticketRevenue ?? 0] },
        { name: 'Snacks', data: [bd?.snackRevenue ?? 0] },
      ] as ApexAxisChartSeries,
    };
  });

  readonly isLoading = computed(() =>
    this.seriesResource.isLoading() || this.breakdownResource.isLoading(),
  );

  readonly totalRevenue = computed(() => {
    const bd = this.breakdownResource.value();
    return bd ? (bd.ticketRevenue ?? 0) + (bd.snackRevenue ?? 0) : null;
  });

  readonly totalDiscount = computed(() => this.breakdownResource.value()?.totalDiscount ?? null);
}
