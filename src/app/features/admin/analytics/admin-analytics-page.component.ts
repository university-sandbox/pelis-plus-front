import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  LucideAngularModule,
  DollarSign,
  Ticket,
  ShoppingCart,
  Users,
  CreditCard,
  Activity,
} from 'lucide-angular';

import { AnalyticsService } from '../../../core/services/analytics.service';
import type { AnalyticsPeriod } from '../../../core/models/analytics.model';
import { AnalyticsPeriodFilterComponent } from './components/analytics-period-filter/analytics-period-filter.component';
import { AnalyticsKpiCardComponent } from './components/analytics-kpi-card/analytics-kpi-card.component';
import { RevenueChartComponent } from './components/revenue-chart/revenue-chart.component';
import { MoviesChartComponent } from './components/movies-chart/movies-chart.component';
import { SnacksChartComponent } from './components/snacks-chart/snacks-chart.component';
import { MembershipsChartComponent } from './components/memberships-chart/memberships-chart.component';
import { UsersChartComponent } from './components/users-chart/users-chart.component';

@Component({
  selector: 'app-admin-analytics-page',
  imports: [
    LucideAngularModule,
    AnalyticsPeriodFilterComponent,
    AnalyticsKpiCardComponent,
    RevenueChartComponent,
    MoviesChartComponent,
    SnacksChartComponent,
    MembershipsChartComponent,
    UsersChartComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-analytics-page.component.html',
})
export class AdminAnalyticsPageComponent {
  private readonly svc = inject(AnalyticsService);

  readonly period = signal<AnalyticsPeriod>('MONTH');

  readonly kpisResource = this.svc.kpis(this.period);

  readonly DollarSign = DollarSign;
  readonly Ticket = Ticket;
  readonly ShoppingCart = ShoppingCart;
  readonly Users = Users;
  readonly CreditCard = CreditCard;
  readonly Activity = Activity;
}
