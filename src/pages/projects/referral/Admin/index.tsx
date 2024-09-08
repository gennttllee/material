import {
  useActiveUsers,
  useAllReferrals,
  useManagerDashboard,
  useWithDrawalRequests,
  useConfirmedWithDrawals,
  E_Referral_Keys,
  useUserReferrals
} from 'Hooks/useReferrals';
import { FiArrowRight, FiChevronDown, FiChevronLeft } from 'react-icons/fi';
import { flexer, hoverFade } from 'constants/globalStyles';
import SelectField from 'components/shared/SelectField';
import InputField from 'components/shared/InputField';
import {
  activeUsersColumns,
  confirmedWithdrawalColumns,
  managerReferralColumns,
  oneUserColumns,
  pendingWithdrawalColumns
} from '../columns/index';
import { useOutletContext } from 'react-router-dom';
import LineChart from 'components/shared/LineChart';
import useRole, { UserRoles } from 'Hooks/useRole';
import BarChart from 'components/shared/BarChart';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from 'components/shared/Button';
import Loader, { LoaderX } from 'components/shared/Loader';
import Table from 'components/shared/Table';
import {
  ActiveTabTypes,
  ActiveUsers,
  Active_TReferral,
  ReferralContext,
  TAllReferral,
  TMiniWithdrawalRequest,
  TReferral
} from '../types';
import { TbSearch } from 'react-icons/tb';
import { TOption } from 'components/shared/SelectField/SelectField';
import { DateRange } from 'react-day-picker';
import moment from 'moment';
import DatePeriodPicker from 'components/shared/DatePeriodPicker';
import { TPeriod } from 'components/shared/DatePeriodPicker/DatePeriodPicker';
import { subDays, isAfter, isBefore, subMonths, startOfDay, subQuarters, subYears } from 'date-fns';
import SuperModal from 'components/shared/SuperModal';
import Modal from 'components/shared/Modal';
import UserReferralsModal from './UserReferralsModal';
import { useQueryClient } from '@tanstack/react-query';
import { one } from '../columns/RewardModal';
import { isReferralConverted } from 'Utils';
import { postForm } from 'apis/postForm';

const initialFilters: IFilters = {
  status: '',
  earned: '',
  amount: '',
  period: 'today'
};

interface IFilters {
  date?: Date;
  status: string;
  earned: string;
  amount: string;
  period: TPeriod;
  range?: DateRange;
}

const AdminReferrals = () => {
  const queryClient = useQueryClient();
  const { isOfType } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUser, setActiveUser] = useState<ActiveUsers>();
  const [filters, setFilter] = useState<IFilters>(initialFilters);
  const { activeTab, setActiveTab } = useOutletContext<ReferralContext>();
  const [selectedRow, setSelectedRow] = useState<TAllReferral>();
  const { allActiveUsers } = useActiveUsers({
    enabled: isOfType(UserRoles.PortfolioManager)
  });
  const { managerDashboard, isLoading: isDashboardLoading } = useManagerDashboard({
    enabled: isOfType(UserRoles.PortfolioManager)
  });
  const { isLoading: isAllReferralsLoading, allReferrals } = useAllReferrals({
    enabled: isOfType(UserRoles.PortfolioManager)
  });

  const { withDrawalRequests } = useWithDrawalRequests({
    enabled: isOfType(UserRoles.PortfolioManager)
  });

  const { confirmedWithdrawals } = useConfirmedWithDrawals({
    enabled: isOfType(UserRoles.PortfolioManager)
  });

  useEffect(() => {
    setFilter(initialFilters);
  }, [activeTab]);

  useEffect(() => {
    let newValue: ActiveUsers | undefined;
    let all = allActiveUsers;
    if (activeUser && all.length > 0) {
      newValue = all.find((m) => m._id === activeUser._id);
      setActiveUser(newValue);
      if (newValue) {
        setActiveTab({
          type: ActiveTabTypes.USER_REFERRALS,
          title: `${newValue.owner.firstName || newValue.owner.name || 'Untitled'}’s referrals `,
          data: newValue.referrals
        });
      } else {
        setActiveUser(undefined);
        setActiveTab({
          type: ActiveTabTypes.ACTIVE_USERS,
          title: 'All active referrals',
          data: allActiveUsers
        });
      }
    } else {
      setActiveUser(undefined);
      setActiveTab(undefined);
    }
  }, [allActiveUsers]);

  const formattedWithdrawRequests = useMemo(() => {
    const data: Omit<TMiniWithdrawalRequest, 'completedOn'>[] = [];
    if (!withDrawalRequests) return data;

    for (const one of withDrawalRequests) {
      for (const oneRequest of one.withdrawals) {
        data.push({
          ...oneRequest,
          email: one.owner.email,
          referralCode: one.referralCode,
          name: one.owner.name || one.owner.firstName + ' ' + one.owner.lastName
        });
      }
    }

    return data;
  }, [withDrawalRequests]);

  const periodTimeStamp = (today: Date) => {
    switch (filters.period) {
      case 'week':
        return subDays(startOfDay(today), 7);
      case 'month':
        return subMonths(startOfDay(today), 1);
      case 'quarter':
        return subQuarters(startOfDay(today), 1);
      case 'year':
        return subYears(startOfDay(today), 1);
      default:
        break;
    }
  };
  const formattedConfirmedWithdrawals = useMemo(() => {
    const data: TMiniWithdrawalRequest[] = [];
    if (!confirmedWithdrawals) return data;

    for (const one of confirmedWithdrawals) {
      for (const oneRequest of one.withdrawals) {
        data.push({
          ...oneRequest,
          email: one.owner.email,
          referralCode: one.referralCode,
          name: one.owner.name || one.owner.firstName + ' ' + one.owner.lastName
        });
      }
    }

    return data;
  }, [confirmedWithdrawals]);

  useEffect(() => {
    if (!activeTab && activeUser) {
      setActiveUser(undefined);
    }
  }, [activeUser, activeTab]);

  const queryFilteredAllReferral = useMemo(() => {
    let data = [...allReferrals];
    return data.filter((user) => {
      let res =
        user.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.owner?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.owner?.firstName?.toLowerCase().includes(searchQuery.toLowerCase());

      return res;
    });
  }, [allReferrals, searchQuery, filters]);

  const queryFilteredActiveUsers = useMemo(() => {
    return allActiveUsers.filter(
      (user) =>
        user.owner?.email?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        user.owner?.firstName?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        user.owner?.lastName?.toLowerCase()?.includes(searchQuery.toLowerCase())
    );
  }, [allActiveUsers, searchQuery]);

  const queryFilteredUserReferrals = useMemo(() => {
    if (!activeTab || activeTab.type !== ActiveTabTypes.USER_REFERRALS) return [];
    const { data } = activeTab as { data: Active_TReferral[] };
    return data.filter((one) => one.email.includes(searchQuery) || one.name.includes(searchQuery));
  }, [activeTab, searchQuery, allActiveUsers, activeUser]);

  const queryFilteredPendingWithdraws = useMemo(() => {
    let data = [...formattedWithdrawRequests];
    // 0. use filters
    if (filters.date || filters.amount)
      data = formattedWithdrawRequests.filter(
        (one) =>
          moment(one.requestedOn).isSame(filters.date, 'day') ||
          String(one.amount) === filters.amount
      );
    // 1. filter period
    const endOfPeriod = new Date(filters.range?.to || new Date()).getTime();
    const startPeriod = new Date(filters.range?.from || new Date()).getTime();

    if (filters.range) {
      data = data.filter((one) => {
        let time = new Date(one.requestedOn).getTime();
        return startPeriod <= time && time <= endOfPeriod;
      });
    }
    // 2. filter search query
    return data.filter((one) => one.email.includes(searchQuery) || one.name.includes(searchQuery));
  }, [searchQuery, formattedWithdrawRequests, filters]);

  const queryFilteredConfirmedWithdraws = useMemo(() => {
    let data = [...formattedConfirmedWithdrawals];

    // 0. use filters data, amount
    if (filters.date || filters.amount)
      data = formattedConfirmedWithdrawals.filter(
        (one) =>
          moment(one.requestedOn).isSame(filters.date, 'day') ||
          moment(one.completedOn).isSame(filters.date, 'day') ||
          String(one.amount) === filters.amount
      );
    // 1. filter period
    const endOfPeriod = new Date(filters.range?.to || new Date()).getTime();
    const startPeriod = new Date(filters.range?.from || new Date()).getTime();

    if (filters.range) {
      data = data.filter((one) => {
        let time = new Date(one.requestedOn).getTime();
        return startPeriod <= time && time <= endOfPeriod;
      });
    }
    // 2. filter search query
    return data.filter((one) => one.email.includes(searchQuery) || one.name.includes(searchQuery));
  }, [searchQuery, formattedConfirmedWithdrawals, filters]);

  const ConditionalTablesView = useCallback(() => {
    switch (activeTab?.type) {
      case ActiveTabTypes.ACTIVE_USERS:
        return (
          <Table
            data={queryFilteredActiveUsers}
            columns={activeUsersColumns({
              onCellClick: (activeUser) => {
                setActiveTab({
                  title: `${
                    activeUser.owner.firstName || activeUser.owner.name || 'Untitled'
                  }’s referrals `,
                  type: ActiveTabTypes.USER_REFERRALS,
                  data: activeUser.referrals
                });
                setActiveUser(activeUser);
              }
            })}
            label=""
          />
        );
      case ActiveTabTypes.USER_REFERRALS:
        return <Table data={queryFilteredUserReferrals} columns={oneUserColumns} label="" />;
      case ActiveTabTypes.PENDING_WITHDRAWALS:
        return (
          <Table data={queryFilteredPendingWithdraws} columns={pendingWithdrawalColumns} label="" />
        );
      case ActiveTabTypes.CONFIRMED_WITHDRAWALS:
        return (
          <Table
            data={queryFilteredConfirmedWithdraws}
            columns={confirmedWithdrawalColumns}
            label=""
          />
        );
      default:
        return (
          <Table
            data={queryFilteredAllReferral}
            columns={managerReferralColumns({
              onCellClick: (x) => {
                setSelectedRow(x.original);
              }
            })}
            label=""
          />
        );
    }
  }, [
    queryFilteredActiveUsers,
    queryFilteredAllReferral,
    queryFilteredConfirmedWithdraws,
    queryFilteredUserReferrals,
    queryFilteredPendingWithdraws,
    allActiveUsers,
    activeUser
  ]);

  const pendingRequestsAmount = useMemo(() => {
    const initialData = formattedWithdrawRequests.map((one) => ({
      value: String(one.amount),
      label: '$ ' + one.amount
    }));
    //1. d=remove duplicates
    const finalData: TOption[] = [];

    for (const one of initialData) {
      const exists = finalData.find((el) => el.value === one.value);

      if (!exists) {
        finalData.push(one);
      }
    }

    return finalData;
  }, [formattedWithdrawRequests]);

  const confirmedRequestAmount = useMemo(() => {
    const initialData = formattedConfirmedWithdrawals.map((one) => ({
      value: String(one.amount),
      label: '$ ' + one.amount
    }));
    //1. d=remove duplicates
    const finalData: TOption[] = [];

    for (const one of initialData) {
      const exists = finalData.find((el) => el.value === one.value);

      if (!exists) {
        finalData.push(one);
      }
    }

    return finalData;
  }, [formattedConfirmedWithdrawals]);

  const amountDistributedOptions = useMemo(() => {
    const initialData = allReferrals.map((one) => ({
      value: String(one.amountRedeemed),
      label: `$ ${one.amountRedeemed || 0}`
    }));
    //1. d=remove duplicates
    const finalData: TOption[] = [];

    for (const one of initialData) {
      const exists = finalData.find((el) => el.value === one.value);

      if (!exists) {
        finalData.push(one);
      }
    }

    return finalData;
  }, [allReferrals]);

  const referralsOptions = useMemo(() => {
    const initialData = allReferrals.map((one) => ({
      value: String(one.referrals)
    }));
    //1. d=remove duplicates
    const finalData: TOption[] = [];

    for (const one of initialData) {
      const exists = finalData.find((el) => el.value === one.value);

      if (!exists) {
        finalData.push(one);
      }
    }
    return finalData;
  }, [allReferrals]);

  if (isDashboardLoading) return <Loader />;

  const handleFilters = (key: keyof IFilters, value: string | Date | DateRange) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-fit">
      {activeTab ? (
        <div className={hoverFade} onClick={() => setActiveTab(undefined)}>
          <div className="flex gap-2 items-center">
            <FiChevronLeft className="text-bash" />
            <p className="text-base text-bash font-Demibold">Back</p>
          </div>
          <p className="font-Demibold text-xl text-black mt-5">{activeTab.title}</p>
        </div>
      ) : (
        <div className={'flex flex-col md:flex-row items-center justify-between gap-5 w-full'}>
          <div className="bg-white rounded-md flex-1 p-5">
            <div className={flexer + 'mb-2'}>
              <p className="font-Medium">Referrals</p>
              <button className={flexer + 'gap-2' + hoverFade}>
                <p className="text-black text-sm">Yearly</p>
                <FiChevronDown className="text-bash text-sm" />
              </button>
            </div>
            <BarChart />
          </div>
          <div className="bg-white rounded-md flex-1 p-5">
            <div className={flexer + 'mb-2'}>
              <p className="font-Medium">Referrals converted</p>
              <button className={flexer + 'gap-2' + hoverFade}>
                <p className="text-black text-sm">Yearly</p>
                <FiChevronDown className="text-bash text-sm" />
              </button>
            </div>
            <LineChart />
          </div>
        </div>
      )}

      {!activeTab || activeTab?.type === ActiveTabTypes.USER_REFERRALS ? (
        <UserReferralStats activeUser={activeUser} managerDashboard={managerDashboard} />
      ) : null}

      {activeTab ? null : (
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 my-5">
          {React.Children.toArray(
            [
              { label: 'Qualified for Earnings', count: managerDashboard?.activeReferrals || 0 },
              {
                label: 'cash  withdraw requests',
                count: managerDashboard?.cashWithdrawalRequests || 0
              },
              {
                label: 'payment confirmation request',
                count: managerDashboard?.paymentConfirmations || 0
              }
            ].map(({ label, count }, index) => (
              <div
                onClick={() => {
                  if (!index && allActiveUsers) {
                    setActiveTab({
                      type: ActiveTabTypes.ACTIVE_USERS,
                      title: 'All active referrals',
                      data: allActiveUsers
                    });
                  } else if (index === 1) {
                    //pending withdrawal request
                    setActiveTab({
                      type: ActiveTabTypes.PENDING_WITHDRAWALS,
                      title: 'Cash withdrawal requests',
                      data: formattedWithdrawRequests
                    });
                  } else {
                    //confirmed withdrawal request
                    setActiveTab({
                      type: ActiveTabTypes.CONFIRMED_WITHDRAWALS,
                      title: 'Payment confirmation requests',
                      data: formattedConfirmedWithdrawals
                    });
                  }
                }}
                className={'p-5 rounded-md bg-white relative overflow-hidden' + hoverFade}>
                <p className="font-Medium text-base text-black capitalize">{label}</p>
                <p
                  className={` ${
                    label.includes('active') ? 'text-bblue' : 'text-bash'
                  } font-Demibold text-3xl`}>
                  {count}
                </p>
                <div className="absolute bottom-0 right-0 p-5 bg-gradient-to-br from-transparent via-transparent to-bblue ">
                  <div className="transform translate-y-3 flex items-center gap-2">
                    <p className="text-sm text-bash font-Medium">View</p>
                    <FiArrowRight className="text-base text-bash" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div>
        <div className={flexer}>
          <InputField
            label=""
            ContainerClassName="!w-fit"
            className="!bg-transparent"
            onChange={(el) => setSearchQuery(el.target.value)}
            placeholder="Search by name, location, type, ...etc"
            LeftIconProp={<TbSearch className="text-bash mr-2" />}
          />
          <Button
            type="secondary"
            text="Clear filter"
            textStyle="!text-bash"
            onClick={() => setFilter(initialFilters)}
            className="!px-4 !border-ashShade-4 md:px-8"
          />
        </div>
        {!activeTab
          ? null
          : activeTab?.type !== ActiveTabTypes.ACTIVE_USERS && (
              <div className={flexer + 'mt-3 bg-white p-4 gap-5 rounded-md'}>
                <ConditionalFilters
                  filters={filters}
                  handleFilters={handleFilters}
                  activeTab={activeTab}
                  setFilter={setFilter}
                  confirmedRequestAmount={confirmedRequestAmount}
                  pendingRequestsAmount={pendingRequestsAmount}
                  formattedWithdrawRequests={formattedWithdrawRequests}
                />
              </div>
            )}
      </div>
      <ConditionalTablesView />
      {selectedRow && (
        <UserReferralsModal
          data={selectedRow}
          closer={() => {
            setSelectedRow(undefined);
          }}
        />
      )}
    </div>
  );
};

interface ConditionalFiltersProps {
  activeTab?: any;
  filters?: any;
  pendingRequestsAmount?: any;
  formattedWithdrawRequests: any;
  confirmedRequestAmount: any;
  handleFilters: (key: any, value: any) => void;
  setFilter: any;
}
const ConditionalFilters = ({
  activeTab,
  filters,
  handleFilters,
  pendingRequestsAmount,
  formattedWithdrawRequests,
  confirmedRequestAmount,
  setFilter
}: ConditionalFiltersProps) => {
  switch (activeTab?.type) {
    case ActiveTabTypes.PENDING_WITHDRAWALS:
      return (
        <div className="  gap-x-2 w-full flex flex-row  ">
          <DatePeriodPicker
            classes=" mt-3"
            value={filters.range}
            label="Select"
            selectedDate={filters.date}
            selectedPeriod={filters.period}
            datePlaceHolder="Select a date range"
            periodPlaceHolder="select a period"
            onRangeChange={(x) => {
              // handleFilters('range', x as DateRange);
              setFilter({ ...filters, range: x });
            }}
            onPeriodChange={(period) => {
              // setFilter((prev) => {});
            }}
            onDateChange={(date) => {}}
          />

          <SelectField
            className=" flex-1"
            value={filters.amount}
            label="Amount withdrawn"
            placeholder="Select amount"
            data={pendingRequestsAmount}
            onChange={(amount) => {
              handleFilters('amount', amount);
            }}
          />
          <SelectField
            className=" flex-1"
            label="Status"
            value={filters.status}
            placeholder="Select amount"
            onChange={(val) => {
              handleFilters('status', val);
            }}
            data={formattedWithdrawRequests.map((one: any) => ({ value: one.status }))}
          />
        </div>
      );
    case ActiveTabTypes.CONFIRMED_WITHDRAWALS:
      return (
        <div className=" flex items-start   gap-x-2 w-full ">
          <DatePeriodPicker
            classes=" "
            label="Select"
            value={filters.range}
            selectedDate={filters.date}
            selectedPeriod={filters.period}
            datePlaceHolder="Select a date"
            periodPlaceHolder="select a period"
            onPeriodChange={(period) => {
              //   setFilter((prev: any) => ({ ...prev, period }));
            }}
            onDateChange={(date) => {
              //  setFilter((prev: any) => ({ ...prev, date, period: 'today' }));
            }}
            onRangeChange={(x) => {
              // handleFilters('range', x as DateRange);
              setFilter({ ...filters, range: x });
            }}
          />
          <SelectField
            className=" mt-0  flex-1"
            label="Amount paid"
            value={filters.amount}
            placeholder="Select amount"
            data={confirmedRequestAmount}
            onChange={(amount) => {
              handleFilters('amount', amount);
            }}
          />
        </div>
      );
    default:
      return (
        <>
          {/* <SelectField
            placeholder="Select"
            value={filters.amount}
            data={referralsOptions}
            label="Number of referrals"
            onChange={(amount) => {
              handleFilters('amount', amount);
            }}
          />
          <SelectField
            label="Amount earned"
            value={filters.earned}
            placeholder="Select amount"
            data={amountDistributedOptions}
            onChange={(amount) => {
              handleFilters('earned', amount);
            }}
          /> */}
        </>
      );
  }
};

interface UserReferralProps {
  activeUser: any;
  managerDashboard: any;
}
const UserReferralStats = ({ activeUser, managerDashboard }: UserReferralProps) => {
  let { userReferralResponse, isLoading } = useUserReferrals({ id: activeUser?.owner?._id ?? '' });
  return isLoading ? (
    <div className=" p-10 bg-white my-5 rounded-md flex w-full items-center justify-center">
      <LoaderX color="blue" />
    </div>
  ) : (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-5">
      {React.Children.toArray(
        [
          {
            label: 'total referrals',
            count: activeUser
              ? userReferralResponse && !isLoading
                ? userReferralResponse.referrals.length
                : 0
              : managerDashboard?.totalReferrals || 0
          },
          {
            label: 'referrals converted',
            count: activeUser
              ? userReferralResponse && !isLoading
                ? userReferralResponse?.referrals.filter((one: any) =>
                    isReferralConverted(one as TReferral)
                  ).length
                : 0
              : managerDashboard?.convertedReferrals || 0
          },
          {
            label: 'cash Earned',
            count:
              '$ ' +
              (activeUser
                ? userReferralResponse && !isLoading
                  ? userReferralResponse?.referrals.reduce(
                      (sum: any, el: any) => sum + el.amountDue,
                      0
                    ) || 0
                  : 0
                : managerDashboard?.cashEarned || 0)
          },
          {
            label: 'cash redeemed',
            count:
              '$ ' +
              (activeUser
                ? userReferralResponse && !isLoading
                  ? userReferralResponse?.withdrawalRequest?.reduce((sum: any, m: any) => {
                      if (m.completedOn) {
                        return sum + m.amount;
                      } else {
                        return sum;
                      }
                    }, 0) ?? 0
                  : activeUser.amountDisbursed || 0
                : managerDashboard?.cashRedeemed || 0)
          }
        ].map(({ label, count }) => (
          <div className="p-5 rounded-md bg-white">
            <p className="font-Medium text-base text-black capitalize">{label}</p>
            <p className="font-Demibold text-3xl text-bash">{count}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminReferrals;
