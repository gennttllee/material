import { Fetcher } from '../helpers/fetcher';

let Base_URL = process.env.REACT_APP_API_IAM;
Base_URL = Base_URL?.slice(0, Base_URL.length - 1);

export const getReferralDashboard = <T>() => {
  return Fetcher<T>(`${Base_URL}/referrals/dashboard`);
};

export const getManagerDashboard = <T>() => {
  return Fetcher<T>(`${Base_URL}/referrals/manager-dashboard`);
};

export const getActiveUsers = <T>() => {
  return Fetcher<T>(`${Base_URL}/referrals/active-users`);
};

export const createReferralInvite = <T>() => {
  return Fetcher<T>(`${Base_URL}/referrals/generate-code`, 'POST');
};

export const inviteReferralsEmail = <T>(users: { email: string }[]) => {
  return Fetcher<T>(`${Base_URL}/referrals/invite`, 'POST', { users });
};

export const getUserReferrals = <T>(userId: string) => {
  return Fetcher<T>(`${Base_URL}/referrals/user?userId=${userId}`);
};

export const getWithdrawalRequests = <T>() => {
  return Fetcher<T>(`${Base_URL}/referrals/withdrawal-requests`);
};

export const getConfirmedWithdrawals = <T>() => {
  return Fetcher<T>(`${Base_URL}/referrals/approved-withdrawals`);
};

export const getAllReferrals = <T>() => {
  return Fetcher<T>(`${Base_URL}/referrals/list`);
};

export const userRequestWithdrawal = <T>(payload: { amount: number; currency?: string }) => {
  return Fetcher<T>(`${Base_URL}/referrals/request-withdrawal`, 'POST', payload);
};

export const confirmWithdrawRequest = <T>(payload: {
  currency?: string;
  requestId: number; //Required
  referralCode: string; //Required
  status: 'approved' | 'declined'; //optional
  message?: string; //optional - required when status is declined
}) => {
  return Fetcher<T>(`${Base_URL}/referrals/confirm-payment`, 'POST', payload);
};
