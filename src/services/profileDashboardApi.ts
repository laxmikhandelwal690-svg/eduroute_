import { PROFILE_DASHBOARD_MOCK, type ProfileDashboardData } from '../data/profileMockData';

export const getProfileDashboardData = async (): Promise<ProfileDashboardData> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return PROFILE_DASHBOARD_MOCK;
};
