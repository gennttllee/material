import { User } from "types";

export interface TAllReferral {
  _id: string;
  user: string;
  referralCode: string;
  amountEarned: number;
  amountRedeemed: number;
  referrals: number;
  owner: Owner;
}

export interface ManagerDashboard {
  cashEarned: number;
  cashRedeemed: number;
  totalReferrals: number;
  activeReferrals: number;
  convertedReferrals: number;
  paymentConfirmations: number;
  cashWithdrawalRequests: number;
}

export interface TReferral {
  invitedBy: string;
  email: string;
  status: 'invited' | 'Signed up' | 'project created' | 'Project in-progress';
  invitedDate: Date;
  updatedAt: Date;
  name?: string;
  amountDue: number;
  _id: string;
  registeredDate: Date;
  userId: string;
  projectCreatedOn: Date;
  projectStartedOn: Date;
  rewardDue: boolean;
  rewardOffered: boolean;
  user?:User
}

export interface WithdrawalRequest {
  _id: string;
  amount: number;
  status: string;
  message: string;
  requestId: number;
  reviewedBy: string;
  name: string | undefined;
  email: string | undefined;
  requestedOn: string | Date;
  completedOn: string | Date;
}

export interface TMiniWithdrawalRequest {
  _id: string;
  name: string;
  email: string;
  amount: number;
  status: string;
  requestId: number;
  requestedOn: Date;
  completedOn: Date;
  referralCode?: string;
}

export type ReferralDashboardRes = {
  __v: 0;
  _id: string;
  link: string;
  user: string;
  referralCode: string;
  amountEarned: number;
  referrals: TReferral[];
  createdAt: string | Date;
  withdrawalRequest: WithdrawalRequest[];
};

export type ReferralContext = {
  hasWithdrawReq: boolean;
  dashboard: ReferralDashboardRes;
  activeTab: ActiveTab | undefined;
  setHasWithdrawReq: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveTab | undefined>>;
};

export interface ActiveUsers {
  _id: string;
  owner: Owner;
  user: string;
  referralCode: string;
  referrals: Active_TReferral[];
  accountBalance: number;
  amountDisbursed: number;
}

export interface Owner {
  _id: string;
  email: string;
  lastName: string;
  firstName: string;
  country: string;
  state: string;
  city: string;
  phoneNumber: string;
  isVerified: IsVerified;
  role: string;
  createdAt: Date;
  __v: number;
  lastSeen: Date;
  logo: string;
  name: string;
  unitOfMeasurement: string;
  inactiveDays: InactiveDay[];
  referralCode: string;
}

export interface InactiveDay {
  day: string;
  _id: string;
}

export interface Active_TReferral {
  invitedBy: string;
  email: string;
  name: string;
  status: 'invited' | 'Signed up' | 'project created' | 'Project in-progress';
  invitedDate: Date;
  updatedAt: Date;
  amountDue: number;
  _id: string;
  registeredDate: Date;
  userId: string;
  projectCreatedOn: Date;
  projectStartedOn: Date;
  rewardDue: boolean;
  user?:User
}

export enum ActiveTabTypes {
  'ACTIVE_USERS',
  'USER_REFERRALS',
  'PENDING_WITHDRAWALS',
  'CONFIRMED_WITHDRAWALS'
}

export type ActiveTab = {
  title: string;
  type: ActiveTabTypes;
  data:
    | Active_TReferral[]
    | ActiveUsers[]
    | TMiniWithdrawalRequest[]
    | Omit<TMiniWithdrawalRequest, 'completedOn'>[];
};

export interface UserReferrals {
  _id: string;
  user: string;
  referralCode: string;
  amountEarned: number;
  referrals: User_TReferral[];
  createdAt: Date;
  withdrawalRequest: WithdrawalRequest[];
  __v: number;
  link: string;
}

export interface User_TReferral {
  invitedBy: string;
  email: string;
  name: string;
  status: 'invited' | 'Signed up' | 'project created' | 'Project in-progress';
  invitedDate: Date;
  updatedAt: Date;
  _id: string;
}

export interface WithdrawalResponse<T = undefined> {
  _id: string;
  user: string;
  owner: Owner;
  referralCode: string;
  withdrawals: Withdrawal<T>[];
}

export interface IsVerified {
  account?: boolean;
  email: boolean;
}

export enum Status {
  Pending = 'pending'
}

export interface Withdrawal<T> {
  requestedOn: Date;
  requestId: number;
  completedOn: T;
  status: Status;
  amount: number;
  _id: string;
}
