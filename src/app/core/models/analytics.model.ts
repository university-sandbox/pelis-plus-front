export interface KpiOverview {
  totalRevenue: number;
  totalTicketsSold: number;
  averageOrderValue: number;
  totalRegisteredUsers: number;
  activeMemberships: number;
  averageOccupancyRate: number;
}

export interface RevenueSeries {
  label: string;
  revenue: number;
}

export interface RevenueBreakdown {
  ticketRevenue: number;
  snackRevenue: number;
  totalDiscount: number;
}

export interface TopMovie {
  movieTitle: string;
  ticketsSold: number;
  revenue: number;
}

export interface FormatDistribution {
  format: string;
  count: number;
}

export interface PeakDay {
  dayOfWeek: string;
  ticketsSold: number;
}

export interface OccupancyByVenue {
  venueName: string;
  occupancyRate: number;
}

export interface TopSnack {
  snackName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface SnackCategoryRevenue {
  category: string;
  revenue: number;
}

export interface MembershipPlanDistribution {
  planName: string;
  userCount: number;
}

export interface TimeSeries {
  label: string;
  count: number;
}

export type AnalyticsPeriod = 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR';
