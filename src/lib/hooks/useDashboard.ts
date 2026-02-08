import { useQuery } from '@tanstack/react-query';
import {
  getDashboardOverview,
  getUserGrowth,
  getActivityStatistics,
  getMostActiveParishes,
} from '../api/dashboard';

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: getDashboardOverview,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useUserGrowth(months: number = 12) {
  return useQuery({
    queryKey: ['dashboard', 'user-growth', months],
    queryFn: () => getUserGrowth(months),
  });
}

export function useActivityStatistics(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['dashboard', 'activity-statistics', startDate, endDate],
    queryFn: () => getActivityStatistics(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useMostActiveParishes(limit: number = 10) {
  return useQuery({
    queryKey: ['dashboard', 'most-active-parishes', limit],
    queryFn: () => getMostActiveParishes(limit),
  });
}
