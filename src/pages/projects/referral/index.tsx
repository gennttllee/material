import { createReferralInvite, userRequestWithdrawal } from 'apis/referrals';
import { centered, flexer, hoverFade } from 'constants/globalStyles';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useRole, { UserRoles } from 'Hooks/useRole';
import Button from 'components/shared/Button';
import Loader from 'components/shared/Loader';
import useFetch from 'Hooks/useFetch';
import Layout from '../Home/Layout';
import CompleteModal, { ChildComponentProps } from 'components/shared/CompleteModal/CompleteModal';
import { Controller, useForm } from 'react-hook-form';
import { redeemCashSchema } from 'validation/referral';
import { yupResolver } from '@hookform/resolvers/yup';
import NumericInput from 'components/shared/NumericInput';
import { formatNumberWithCommas, parseNumberWithoutCommas } from 'helpers';
import { useReferralDashboard } from 'Hooks/useReferrals';
import { ActiveTab } from './types';
import { displayError, displaySuccess } from 'Utils';
import SelectField from 'components/shared/SelectField';
import { currencies } from '../../../constants';

const Page = () => {
  const { isOfType } = useRole();
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState<ActiveTab>();
  const [modal, setModal] = useState(false);
  const { userDashboard, isLoading: isDashboardLoading, refetch, error } = useReferralDashboard();
  const modalRef = useRef<any>(null);
  const {
    load,
    isLoading: isSettingUp,
    usageCount: setupReferralCount
  } = useFetch({ onSuccess: refetch });

  useEffect(() => {
    if (error && !setupReferralCount) load(createReferralInvite());
  }, [error, setupReferralCount]);

  const { reset, control, handleSubmit } = useForm<{ amount: string; currency: string }>({
    reValidateMode: 'onChange',
    resolver: yupResolver(redeemCashSchema)
  });

  const {
    load: loadRedeemCash,
    isLoading: isCashRedeem,
    error: redeemError
  } = useFetch({
    onSuccess: refetch
  });

  const submitHandler = handleSubmit(({ amount, currency }) => {
    loadRedeemCash(userRequestWithdrawal({ amount: Number(amount) }))
      .then((res) => {
        displaySuccess('Withdrawal Request made successfully.');
        setModal(false);
      })
      .catch((e) => {
        displayError(e);
      });
  });

  const RedeemCash = (props: Partial<ChildComponentProps>) => (
    <form>
      <Controller
        name="currency"
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <SelectField
            disabled
            label="Currency"
            showSearch
            value={'USD'}
            data={currencies.map((one) => ({ ...one, label: `${one.label}  (${one.value})` }))}
            onChange={(val) => {
              const currency = currencies.find((one) => one.value === val);
              // if (currency) onChange(currency.value);
            }}
          />
        )}
      />
      <Controller
        name="amount"
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <NumericInput
            onBlur={onBlur}
            value={formatNumberWithCommas(value)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = parseNumberWithoutCommas(e.target.value);
              if (/^[0-9e]*$/.test(newValue)) {
                onChange(newValue);
              }
            }}
            error={error?.message || redeemError}
            placeholder="Enter amount"
            label="amount"
            type="text"
          />
        )}
      />

      <div className="flex justify-end items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <Button
          text="Cancel"
          btnType="button"
          type="secondary"
          onClick={() => {
            if (props.toggleModal) props.toggleModal();
            reset();
          }}
        />
        <Button
          text="Done"
          isLoading={isCashRedeem}
          onClick={(e) => {
            e?.stopPropagation();
            submitHandler();
          }}
          btnType="button"
        />
      </div>
    </form>
  );

  if (isDashboardLoading || isSettingUp) return <Loader />;

  return (
    <div className="h-full w-full pt-6 overflow-scroll">
      {!activeTab ? (
        <>
          <h1 className="font-Demibold text-xl text-black">Referral</h1>
          <div className="my-5" />
        </>
      ) : null}

      <div className={flexer}>
        {activeTab ? null : (
          <div className="border-b w-full flex items-center gap-5 my-5">
            {React.Children.toArray(
              (isOfType(UserRoles.PortfolioManager)
                ? [
                    { label: 'Refer to earn', path: 'earn' },
                    { label: 'Referral history', path: 'history' },
                    { label: 'Dashboard', path: 'admin' }
                  ]
                : [
                    { label: 'Refer to earn', path: 'earn' },
                    { label: 'Referral history', path: 'history' }
                  ]
              ).map(({ label, path }) => (
                <div className={centered + 'relative mr-4'}>
                  <NavLink
                    className={({ isActive }) =>
                      `text-base mb-2 font-Medium ${
                        isActive ? 'text-blue-500  capitalize ' : 'text-bash'
                      } ` + hoverFade
                    }
                    to={path}>
                    {label}
                  </NavLink>
                  {pathname.includes(path) ? (
                    <div className="bg-blue-500 h-[3px] w-2/5 absolute -bottom-[2px]" />
                  ) : null}
                </div>
              ))
            )}
          </div>
        )}

        {!isOfType(UserRoles.PortfolioManager) && (
          <CompleteModal
            toggler={() => setModal(!modal)}
            initialState={modal}
            title="Redeem cash"
            toggleButton={<Button text="Redeem cash" />}>
            <RedeemCash />
          </CompleteModal>
        )}
      </div>
      {!error && userDashboard ? (
        <Outlet
          context={{
            dashboard: userDashboard,
            setActiveTab,
            activeTab
          }}
        />
      ) : null}
    </div>
  );
};

const Referral = () => (
  <Layout path="referrals">
    <Page />
  </Layout>
);

export default Referral;
