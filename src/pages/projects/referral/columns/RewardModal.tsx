import { postForm } from 'apis/postForm';
import Button from 'components/shared/Button';
import InputField from 'components/shared/InputField';
import NumberInput from 'components/shared/NumberInput';
import SuperModal from 'components/shared/SuperModal';
import React, { useEffect, useState } from 'react';
import { Active_TReferral, ReferralContext } from '../types';
import { displayError, displaySuccess } from 'Utils';
import { useOutletContext } from 'react-router-dom';
import {
  E_Referral_Keys,
  useActiveUsers,
  useManagerDashboard,
  useReferralDashboard
} from 'Hooks/useReferrals';
import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { queryClient } from 'index';

interface RewardModalProps {
  closer: () => void;
  onSuccess?: () => void;
  data: Active_TReferral;
}

const RewardModal = ({ closer, onSuccess, data }: RewardModalProps) => {
  const [loading, setLoading] = useState(false);
  const { refetch: _refetch } = useManagerDashboard({ enabled: true });
  const queryClient = useQueryClient();
  const { refetch, allActiveUsers } = useActiveUsers({ enabled: true });
  const [value, setValue] = useState(0);


  const handleReward = async () => {
    setLoading(true);
    let _data = {
      userId: data.userId, //required
      referralId: data._id, //referrals[_id:]
      amount: value, //required
      currency: 'USD'
    };
    let { e, response } = await postForm('patch', 'referrals/offer-reward', _data, 'iam');
    if (e) displayError(e?.message || 'Could not add reward');
    if (response) {
      displaySuccess('Reward sent');
      _refetch();
      refetch();
      closer();
    }
    setLoading(false);
  };

  return (
    <SuperModal closer={closer}>
      <div className=" flex items-center justify-center w-full h-full bg-black bg-opacity-50">
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className=" p-6 bg-white w-2/3 lg:w-1/2 max-w-[500px] rounded-md">
          <div className="flex items-center justify-between">
            <span className="font-Medium text-black">Give Reward</span>
            <span onClick={closer} className=" text-borange hover:underline cursor-pointer">
              Close
            </span>
          </div>

          <InputField
            error={value < 1 ? 'Please enter a value' : undefined}
            value={value.toString()}
            onChange={(e) => {
              setValue(parseFloat(e.target.value));
            }}
            label="Amount"
            placeholder="USD 0"
            type="number"
          />
          <div className=" my-2 flex items-center justify-end">
            <Button
              text="Give Reward"
              className="mt-2"
              onClick={handleReward}
              isLoading={loading}
              type={value > 0 && !loading ? 'primary' : 'muted'}
            />
          </div>
        </div>
      </div>
    </SuperModal>
  );
};

export default RewardModal;

let one = {
  accountBalance: 2700,
  amountDisbursed: 0,
  totalReferrals: 14,
  _id: '660bf81207dc83dfc511a506',
  user: '63fe1c4dc2985df2b2758d49',
  referralCode: 'stDLABmp',
  referrals: [
    {
      invitedBy: '63fe1c4dc2985df2b2758d49',
      email: 'ay@mailinator.com',
      status: 'Project in-progress',
      invitedDate: '2024-04-16T16:45:13.751Z',
      updatedAt: '2024-04-16T16:45:13.751Z',
      amountDue: 0,
      _id: '6621157cfd4cf2dbc86b31d0',
      registeredDate: '2024-04-19T12:31:52.957Z',
      userId: '6622643876894e55102f398e',
      projectCreatedOn: '2024-04-19T12:41:21.765Z',
      projectStartedOn: '2024-04-19T13:09:36.144Z',
      rewardDue: true,
      user: {
        _id: '6622643876894e55102f398e',
        email: 'ay@mailinator.com',
        lastName: 'ay',
        firstName: 'ay',
        type: 'projectOwner',
        disabled: false,
        suspended: false,
        status: 'active',
        country: 'Nigeria',
        state: 'Abia State',
        city: 'Amaigbo',
        phoneNumber: '234849854698',
        referralCode: '',
        isVerified: {
          email: true
        },
        role: '636e08c0011dd2a22d3c53bc',
        unitOfMeasurement: 'metric',
        inactiveDays: [],
        createdAt: '2024-04-19T12:31:52.920Z',
        __v: 0,
        lastSeen: '2024-04-19T12:40:33.377Z'
      }
    },
    {
      invitedBy: '63fe1c4dc2985df2b2758d49',
      email: 'abb@mailinator.com',
      status: 'Project in-progress',
      invitedDate: '2024-04-16T16:45:13.751Z',
      updatedAt: '2024-04-16T16:45:13.751Z',
      amountDue: 0,
      _id: '6621157cfd4cf2dbc86b31e2',
      registeredDate: '2024-04-19T12:29:41.462Z',
      userId: '662263b576894e55102f3976',
      projectCreatedOn: '2024-04-19T12:40:05.870Z',
      projectStartedOn: '2024-04-19T13:13:40.392Z',
      rewardDue: true,
      user: {
        _id: '662263b576894e55102f3976',
        email: 'abb@mailinator.com',
        lastName: 'abb',
        firstName: 'abb',
        type: 'projectOwner',
        disabled: false,
        suspended: false,
        status: 'active',
        country: 'Nigeria',
        state: 'Adamawa State',
        city: 'Ganye',
        phoneNumber: '23481320365',
        referralCode: '',
        isVerified: {
          email: true
        },
        role: '636e08c0011dd2a22d3c53bc',
        unitOfMeasurement: 'metric',
        inactiveDays: [],
        createdAt: '2024-04-19T12:29:41.423Z',
        __v: 0,
        lastSeen: '2024-04-19T12:39:23.423Z'
      }
    },
    {
      invitedBy: '63fe1c4dc2985df2b2758d49',
      email: 'abcd@mailinator.com',
      status: 'Project in-progress',
      invitedDate: '2024-04-16T16:45:13.751Z',
      updatedAt: '2024-04-16T16:45:13.751Z',
      amountDue: 0,
      _id: '6621157dfd4cf2dbc86b31e8',
      registeredDate: '2024-04-19T12:30:44.573Z',
      userId: '662263f476894e55102f3982',
      projectCreatedOn: '2024-04-19T12:42:52.705Z',
      projectStartedOn: '2024-04-19T13:14:35.442Z',
      rewardDue: true,
      user: {
        _id: '662263f476894e55102f3982',
        email: 'abcd@mailinator.com',
        lastName: 'abcd',
        firstName: 'abcd',
        type: 'projectOwner',
        disabled: false,
        suspended: false,
        status: 'active',
        country: 'Nigeria',
        state: 'Abia State',
        city: 'Aba',
        phoneNumber: '23482123845',
        referralCode: '',
        isVerified: {
          email: true
        },
        role: '636e08c0011dd2a22d3c53bc',
        unitOfMeasurement: 'metric',
        inactiveDays: [],
        createdAt: '2024-04-19T12:30:44.553Z',
        __v: 0,
        lastSeen: '2024-04-19T12:42:05.458Z'
      }
    }
  ],
  owner: {
    _id: '63fe1c4dc2985df2b2758d49',
    email: 'olaitan@mailinator.com',
    lastName: 'Ayo',
    firstName: 'Timo',
    phoneNumber: '+2348132032607',
    isVerified: {
      email: true,
      account: false
    },
    role: '636e08c0011dd2a22d3c53bc',
    __v: 0,
    lastSeen: '2024-04-19T11:54:31.469Z',
    city: 'Aba',
    country: 'Nigeria',
    state: 'Abia State',
    logo: '2122e5d7-24a7-4bb0-8325-5a23306626c8.jpeg',
    referralCode: 'stDLABmp'
  }
};
let s = {
  _id: '661e885c00ce3f5effaaae12',
  user: '63fe3ca7c2985df2b2758dc2',
  referralCode: 'uzRKKGbx',
  amountEarned: 300,
  amountRedeemed: 0,
  accountBalance: 300,
  withdrawalRequest: [],
  referrals: [
    {
      invitedBy: '63fe3ca7c2985df2b2758dc2',
      email: 'bortepisto@gufum.com',
      status: 'Project in-progress',
      invitedDate: '2024-04-16T12:52:58.628Z',
      updatedAt: '2024-04-16T12:52:58.628Z',
      amountDue: 300,
      _id: '661e8dad00ce3f5effaabc68',
      registeredDate: '2024-04-16T14:41:03.467Z',
      userId: '661e8dff00ce3f5effaabcf6',
      projectCreatedOn: '2024-04-16T14:49:35.586Z',
      projectStartedOn: '2024-04-16T14:58:10.207Z',
      rewardDue: true,
      rewardOffered: true
    }
  ],
  createdAt: '2024-04-16T14:17:00.989Z',
  __v: 0,
  adminId: '63fdf4f4c2985df2b2758c7e'
};

export { one };
