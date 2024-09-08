import {
  getActiveUsers,
  getAllReferrals,
  getConfirmedWithdrawals,
  getManagerDashboard,
  getReferralDashboard,
  getUserReferrals,
  getWithdrawalRequests
} from 'apis/referrals';
import { QUERY_CACHE_DURATION } from '../constants';
import { useQuery } from '@tanstack/react-query';
import {
  ActiveUsers,
  ManagerDashboard,
  ReferralDashboardRes,
  TAllReferral,
  TReferral,
  UserReferrals,
  WithdrawalResponse
} from 'pages/projects/referral/types';

export enum E_Referral_Keys {
  'All_Active_Referrals' = 'All_Active_Referrals',
  'Withdrawal_Requests' = 'Withdrawal_Requests',
  'Confirmed_Withdrawal' = 'Confirmed_Withdrawal',
  'Manager_Dashboard' = 'Manager_Dashboard',
  'User_Dashboard' = 'User_Dashboard',
  'User_Referrals' = 'User_Referrals',
  'All_Referrals' = 'All_Referrals'
}

export const useReferralDashboard = () => {
  const { data, ...props } = useQuery({
    enabled: true,
    staleTime: QUERY_CACHE_DURATION,
    queryKey: [E_Referral_Keys.User_Dashboard],
    queryFn: () => getReferralDashboard<ReferralDashboardRes>()
  });

  return { userDashboard: data?.data, ...props };
};

export const useManagerDashboard = ({ enabled }: { enabled: boolean }) => {
  const { data, ...props } = useQuery({
    enabled,
    staleTime: QUERY_CACHE_DURATION,
    queryKey: [E_Referral_Keys.Manager_Dashboard],
    queryFn: () => getManagerDashboard<ManagerDashboard>()
  });

  return { managerDashboard: data?.data, ...props };
};

export const useActiveUsers = ({ enabled }: { enabled: boolean }) => {
  const { data, ...props } = useQuery({
    enabled,
    staleTime: QUERY_CACHE_DURATION,
    queryFn: () => getActiveUsers<ActiveUsers[]>(),
    queryKey: [E_Referral_Keys.All_Active_Referrals]
  });

  return { allActiveUsers: data?.data || [], ...props };
};

export const useAllReferrals = ({ enabled }: { enabled: boolean }) => {
  const { data, ...props } = useQuery({
    enabled,
    staleTime: QUERY_CACHE_DURATION,
    queryKey: [E_Referral_Keys.All_Referrals],
    queryFn: () => getAllReferrals<TAllReferral[]>()
  });

  return { allReferrals: data?.data || [], ...props };
};

export const useUserReferrals = ({ id }: { id?: string }) => {
  const { data, ...props } = useQuery({
    enabled: !!id,
    staleTime: QUERY_CACHE_DURATION,
    queryKey: [E_Referral_Keys.User_Referrals, { id }],
    queryFn: () => getUserReferrals<UserReferrals>(id || '')
  });

  return { userReferralResponse: data?.data, ...props };
};

export const useWithDrawalRequests = ({ enabled }: { enabled: boolean }) => {
  const { data, ...props } = useQuery({
    enabled,
    staleTime: QUERY_CACHE_DURATION,
    queryFn: () => getWithdrawalRequests<WithdrawalResponse[]>(),
    queryKey: [E_Referral_Keys.Withdrawal_Requests]
  });

  return { withDrawalRequests: data?.data, ...props };
};

export const useConfirmedWithDrawals = ({ enabled }: { enabled: boolean }) => {
  const { data, ...props } = useQuery({
    enabled,
    staleTime: QUERY_CACHE_DURATION,
    queryFn: () => getConfirmedWithdrawals<WithdrawalResponse<Date>[]>(),
    queryKey: [E_Referral_Keys.Confirmed_Withdrawal]
  });

  return { confirmedWithdrawals: data?.data, ...props };
};

