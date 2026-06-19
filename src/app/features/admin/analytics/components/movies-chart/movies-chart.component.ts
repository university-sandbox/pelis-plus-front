import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import type { ApexAxisChartSeries, ApexChart, ApexNonAxisChartSeries, ApexOptions, ApexXAxis } from 'ngx-apexcharts';

import { AnalyticsService } from '../../../../../core/services/analytics.service';
import type { AnalyticsPeriod } from '../../../../../core/models/analytics.model';

const DAY_LABELS: Record<string, string> = {
  Sun: 'Dom', Mon: 'Lun', Tue: 'Mar', Wed: 'Mié',
  Thu: 'Jue', Fri: 'Vie', Sat: 'Sáb',
};

@Component({
  selector: 'app-movies-chart',
  imports: [NgxApexchartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movies-chart.component.html',
})
export class MoviesChartComponent {
  readonly period = input.required<AnalyticsPeriod>();

  private readonly svc = inject(AnalyticsService);

  readonly topMoviesResource    = this.svc.topMovies(this.period);
  readonly formatResource       = this.svc.formatDistribution(this.period);
  readonly peakDaysResource     = this.svc.peakDays(this.period);
  readonly occupancyResource    = this.svc.occupancyByVenue(this.period);

  readonly isLoading = computed(() =>
    this.topMoviesResource.isLoading() ||
    this.formatResource.isLoading() ||
    this.peakDaysResource.isLoading() ||
    this.occupancyResource.isLoading(),
  );

  readonly topMoviesOptions = computed<Partial<ApexOptions>>(() => {
    const data = this.topMoviesResource.value() ?? [];
    return {
      chart: { type: 'bar', height: Math.max(180, data.length * 36), background: 'transparent', toolbar: { show: false } } as ApexChart,
      theme: { mode: 'dark' },
      colors: ['#FF2E78'],
      plotOptions: { bar: { horizontal: true, borderRadius: 4, dataLabels: { position: 'top' } } },
      grid: { borderColor: '#26262B', strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
      xaxis: { labels: { style: { colors: '#9C988D', fontSize: '11px' } }, axisBorder: { show: false } } as ApexXAxis,
      yaxis: { labels: { style: { colors: '#D9D3C5', fontSize: '12px' } } },
      tooltip: { theme: 'dark', y: { formatter: (v: number) => `${v} entradas` } },
      dataLabels: { enabled: false },
      series: [{ name: 'Entradas', data: data.map(m => ({ x: m.movieTitle, y: m.ticketsSold })) }] as ApexAxisChartSeries,
    };
  });

  readonly formatOptions = computed<Partial<ApexOptions>>(() => {
    const data = this.formatResource.value() ?? [];
    return {
      chart: { type: 'donut', height: 220, background: 'transparent' } as ApexChart,
      theme: { mode: 'dark' },
      colors: ['#FF2E78', '#F5A524', '#00D6F5'],
      labels: data.map(d => d.format),
      legend: { position: 'bottom', labels: { colors: '#D9D3C5' } },
      tooltip: { theme: 'dark' },
      dataLabels: { style: { colors: ['#F6F1E7'] } },
      series: data.map(d => d.count) as ApexNonAxisChartSeries,
      plotOptions: { pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Total', color: '#9C988D', formatter: (w: { globals: { seriesTotals: number[] } }) => w.globals.seriesTotals.reduce((a, b) => a + b, 0).toString() } } } } },
    };
  });

  readonly peakDaysOptions = computed<Partial<ApexOptions>>(() => {
    const data = this.peakDaysResource.value() ?? [];
    return {
      chart: { type: 'bar', height: 200, background: 'transparent', toolbar: { show: false } } as ApexChart,
      theme: { mode: 'dark' },
      colors: ['#F5A524'],
      plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
      grid: { borderColor: '#26262B', strokeDashArray: 4 },
      xaxis: { categories: data.map(d => DAY_LABELS[d.dayOfWeek] ?? d.dayOfWeek), labels: { style: { colors: '#9C988D', fontSize: '11px' } }, axisBorder: { show: false } } as ApexXAxis,
      yaxis: { labels: { style: { colors: '#9C988D', fontSize: '11px' } } },
      tooltip: { theme: 'dark', y: { formatter: (v: number) => `${v} entradas` } },
      dataLabels: { enabled: false },
      series: [{ name: 'Entradas', data: data.map(d => d.ticketsSold) }] as ApexAxisChartSeries,
    };
  });
}
