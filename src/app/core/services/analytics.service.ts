import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';

import { BACKEND } from '../api/endpoints';
import type {
  AnalyticsPeriod,
  FormatDistribution,
  KpiOverview,
  MembershipPlanDistribution,
  OccupancyByVenue,
  PeakDay,
  RevenueBreakdown,
  RevenueSeries,
  SnackCategoryRevenue,
  TimeSeries,
  TopMovie,
  TopSnack,
} from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);

  kpis(period: Signal<AnalyticsPeriod>) {
    return httpResource<KpiOverview>(() => ({
      url: BACKEND.url(BACKEND.ADMIN.ANALYTICS.KPIS),
      params: { period: period() },
    }));
  }

  revenueSeries(period: Signal<AnalyticsPeriod>) {
    return httpResource<RevenueSeries[]>(() => ({
      url: BACKEND.url(BACKEND.ADMIN.ANALYTICS.REVENUE_SERIES),
      params: { period: period() },
    }));
  }

  revenueBreakdown(period: Signal<AnalyticsPeriod>) {
    return httpResource<RevenueBreakdown>(() => ({
      url: BACKEND.url(BACKEND.ADMIN.ANALYTICS.REVENUE_BREAKDOWN),
      params: { period: period() },
    }));
  }

  topMovies(period: Signal<AnalyticsPeriod>, limit = 10) {
    return httpResource<TopMovie[]>(() => ({
      url: BACKEND.url(BACKEND.ADMIN.ANALYTICS.TOP_MOVIES),
      params: { period: period(), limit },
    }));
  }

  formatDistribution(period: Signal<AnalyticsPeriod>) {
    return httpResource<FormatDistribution[]>(() => ({
      url: BACKEND.url(BACKEND.ADMIN.ANALYTICS.MOVIE_FORMATS),
      params: { period: period() },
    }));
  }

  peakDays(period: Signal<AnalyticsPeriod>) {
    return httpResource<PeakDay[]>(() => ({
      url: BACKEND.url(BACKEND.ADMIN.ANALYTICS.PEAK_DAYS),
      params: { period: period() },
    }));
  }

  occupancyByVenue(period: Signal<AnalyticsPeriod>) {
    return httpResource<OccupancyByVenue[]>(() => ({
      url: BACKEND.url(BACKEND.ADMIN.ANALYTICS.OCCUPANCY),
      params: { period: period() },
    }));
  }

  topSnacks(period: Signal<AnalyticsPeriod>, limit = 10) {
    return httpResource<TopSnack[]>(() => ({
      url: BACKEND.url(BACKEND.ADMIN.ANALYTICS.TOP_SNACKS),
      params: { period: period(), limit },
    }));
  }

  snackCategoryRevenue(period: Signal<AnalyticsPeriod>) {
    return httpResource<SnackCategoryRevenue[]>(() => ({
      url: BACKEND.url(BACKEND.ADMIN.ANALYTICS.SNACK_CATEGORIES),
      params: { period: period() },
    }));
  }

  avgSnackPerOrder(period: Signal<AnalyticsPeriod>) {
    return httpResource<number>(() => ({
      url: BACKEND.url(BACKEND.ADMIN.ANALYTICS.SNACK_AVG_PER_ORDER),
      params: { period: period() },
    }));
  }

  membershipDistribution() {
    return httpResource<MembershipPlanDistribution[]>(() =>
      BACKEND.url(BACKEND.ADMIN.ANALYTICS.MEMBERSHIP_DISTRIBUTION),
    );
  }

  userRegistrations(period: Signal<AnalyticsPeriod>) {
    return httpResource<TimeSeries[]>(() => ({
      url: BACKEND.url(BACKEND.ADMIN.ANALYTICS.USER_REGISTRATIONS),
      params: { period: period() },
    }));
  }

  userPurchaseRate() {
    return httpResource<number>(() =>
      BACKEND.url(BACKEND.ADMIN.ANALYTICS.USER_PURCHASE_RATE),
    );
  }
}
