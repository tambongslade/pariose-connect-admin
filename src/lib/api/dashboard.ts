import { apiClient } from './client';

export interface DashboardOverview {
  overview: {
    totalUsers: number;
    totalEcclesiasticalUnits: number;
    totalCelebrations: number;
    totalActivities: number;
    totalAnnouncements: number;
    totalConfessions: number;
    totalHolyPlaces: number;
    totalSacredObjects: number;
  };
  recentActivity: {
    newUsersLast30Days: number;
    upcomingCelebrationsNext7Days: number;
    activeAnnouncements: number;
  };
  distributions: Record<string, any>;
}

export interface UserGrowthData {
  month: string;
  newUsers: number;
}

export interface ActivityStatistics {
  period: {
    start: string;
    end: string;
  };
  statistics: {
    celebrationsCreated: number;
    activitiesCreated: number;
    announcementsPublished: number;
    newUsers: number;
  };
}

export interface ActiveParish {
  code: number;
  libelle: string;
  subscribers: number;
  celebrations: number;
  activities: number;
  announcements: number;
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const { data } = await apiClient.get<DashboardOverview>('/dashboard/overview');
  return data;
}

export async function getUserGrowth(months: number = 12): Promise<UserGrowthData[]> {
  const { data } = await apiClient.get<UserGrowthData[]>(`/dashboard/user-growth?months=${months}`);
  return data;
}

export async function getActivityStatistics(
  startDate: string,
  endDate: string
): Promise<ActivityStatistics> {
  const { data } = await apiClient.get<ActivityStatistics>(
    `/dashboard/activity-statistics?startDate=${startDate}&endDate=${endDate}`
  );
  return data;
}

export async function getMostActiveParishes(limit: number = 10): Promise<ActiveParish[]> {
  const { data } = await apiClient.get<ActiveParish[]>(
    `/dashboard/most-active-parishes?limit=${limit}`
  );
  return data;
}
