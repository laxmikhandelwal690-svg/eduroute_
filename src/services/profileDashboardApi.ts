import { apiGetProfileDashboard } from '../utils/authApi';
import type { ProfileDashboardData } from '../data/profileMockData';

export const getProfileDashboardData = async (): Promise<ProfileDashboardData> => {
  const response = await apiGetProfileDashboard();
  return response.data as ProfileDashboardData;
};
