import { TableHeaderText } from 'components/projects/management/POW/Components/Table/Columns';
import { ColumnDef, Row } from '@tanstack/react-table';
import {
  ActiveUsers,
  Active_TReferral,
  TAllReferral,
  TMiniWithdrawalRequest,
  TReferral
} from '../types';
import { centered, flexer, hoverFade } from 'constants/globalStyles';
import Moment from 'react-moment';
import Button from 'components/shared/Button';
import CompleteModal, { ChildComponentProps } from 'components/shared/CompleteModal/CompleteModal';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from 'components/shared/InputField';
import useFetch from 'Hooks/useFetch';
import { useQueryClient } from '@tanstack/react-query';
import { E_Referral_Keys } from 'Hooks/useReferrals';
import { confirmWithdrawRequest } from 'apis/referrals';
import { displayError } from 'Utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { messageSchema } from 'validation/task';
import RewardModal from './RewardModal';

const StatusBG = (status: TReferral['status']) => {
  switch (status) {
    case 'invited':
      return 'bg-green-100';
    case 'Signed up':
      return 'bg-blue-100';
    case 'project created':
      return 'bg-yellow-100';
    case 'Project in-progress':
      return 'bg-green-100';
  }
};

const StatusColor = (status: TReferral['status']) => {
  switch (status) {
    case 'invited':
      return 'text-green-500';
    case 'Signed up':
      return 'text-bblue';
    case 'project created':
      return 'text-yellow-500';
    case 'Project in-progress':
      return 'text-green-500';
  }
};

export const normalUserColumn: ColumnDef<TReferral>[] = [
  {
    accessorKey: 'name',
    footer: (props) => props.column.id,
    header: () => <TableHeaderText label="SN" isFirstColumn />,
    cell: ({ row }) => (
      <p className={'text-center text-bash px-2 py-3 transform -translate-x-4' + hoverFade}>
        {row.index + 1}
      </p>
    )
  },
  {
    accessorKey: 'name',
    header: () => <TableHeaderText label="Name" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => {
      let name =
        row.original?.name ||
        row.original?.user?.name ||
        `${row.original?.user?.firstName || ''} ${row.original?.user?.lastName || ''}`;
      return (
        <p
          className={` ${
            name ? 'text-black' : 'text-bash'
          } font-Medium text-sm flex-1 truncate capitalize px-2 py-3 ${hoverFade}`}>
          {name === ' ' ? 'Pending' : name}
        </p>
      );
    }
  },
  {
    accessorKey: 'name',
    header: () => <TableHeaderText label="Email" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p className={`font-Medium text-sm flex-1 truncate px-2 py-3` + hoverFade}>
        {row.original.email}
      </p>
    )
  },
  {
    accessorKey: 'schedule',
    header: () => <TableHeaderText label="Date Initiated" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div>
        <Moment
          className={'text-bash font-Medium text-sm flex-1 truncate px-2 py-3' + hoverFade}
          format="DD MMM YYYY">
          {row.original.invitedDate}
        </Moment>
      </div>
    )
  },
  {
    accessorKey: 'sched',
    header: () => <TableHeaderText label="Amount Earned" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p className={'text-bash font-Medium w-full text-sm flex-1 truncate px-2 py-3' + hoverFade}>
        $ {row.original.amountDue?.toLocaleString() || 0}
      </p>
    )
  },
  {
    accessorKey: 'sched',
    header: () => <TableHeaderText label="Status" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div className={` ${StatusBG(row.original.status)} rounded-full px-4 py-2 w-10/12 border`}>
        <p
          className={` ${StatusColor(
            row.original.status
          )} font-Medium w-full capitalize text-center text-sm flex-1 truncate ${hoverFade} `}>
          {row.original.status}
        </p>
      </div>
    )
  }
  // {
  //   accessorKey: 'sched',
  //   header: () => <TableHeaderText label="ACTIVE" />,
  //   footer: (props) => props.column.id,
  //   cell: ({ row }) => (
  //     <div className={'py-1' + hoverFade}>
  //       <Button
  //         text="Claim reward"
  //         className="!px-3 !py-1"
  //         type={row.original.status === 'Signed up' ? 'primary' : 'muted'}
  //       />
  //     </div>
  //   )
  // }
];

export const oneUserColumns: ColumnDef<Active_TReferral>[] = [
  {
    accessorKey: 'name',
    footer: (props) => props.column.id,
    header: () => <TableHeaderText label="SN" isFirstColumn />,
    cell: ({ row }) => (
      <p className={'text-center text-bash px-2 py-3 transform -translate-x-4' + hoverFade}>
        {row.index + 1}
      </p>
    )
  },
  {
    accessorKey: 'name',
    header: () => <TableHeaderText label="Name" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => {
      let name =
        row.original?.name ||
        row.original?.user?.name ||
        `${row.original?.user?.firstName || ''} ${row.original?.user?.lastName || ''}`;
      return (
        <p
          className={` ${
            name ? 'text-black' : 'text-bash'
          } font-Medium text-sm flex-1 truncate capitalize px-2 py-3 ${hoverFade}`}>
          {name === ' ' ? 'Pending' : name}
        </p>
      );
    }
  },
  {
    accessorKey: 'email',
    header: () => <TableHeaderText label="Email" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p className={`font-Medium text-sm flex-1 truncate px-2 py-3` + hoverFade}>
        {row.original.email}
      </p>
    )
  },
  {
    accessorKey: 'schedule',
    header: () => <TableHeaderText label="Date Initiated" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div>
        <Moment
          className={'text-bash font-Medium text-sm flex-1 truncate px-2 py-3' + hoverFade}
          format="DD MMM YYYY">
          {row.original.invitedDate}
        </Moment>
      </div>
    )
  },
  {
    accessorKey: 'sched',
    header: () => <TableHeaderText label="Amount Earned" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p className={'text-bash font-Medium w-full text-sm flex-1 truncate px-2 py-3' + hoverFade}>
        $ {row.original.amountDue?.toLocaleString() || 0}
      </p>
    )
  },
  {
    accessorKey: 'sched',
    header: () => <TableHeaderText label="Status" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => {
      let [modal, setModal] = useState(false);
      return (
        <>
          {modal && <RewardModal data={row.original} closer={() => setModal(false)} />}
          <div className={`flex items-center gap-5`}>
            <div
              className={`px-4 py-2 flex-1 rounded-full  border ${StatusBG(row.original.status)}`}>
              <p
                className={` ${StatusColor(
                  row.original.status
                )} font-Medium w-full capitalize text-center text-sm flex-1 truncate ${hoverFade} `}>
                {row.original.status}
              </p>
            </div>
            <Button
              onClick={() => {
                setModal(!modal);
              }}
              text="Add to referral wallet"
              type={row.original.status === 'Project in-progress' ? 'primary' : 'muted'}
            />
          </div>
        </>
      );
    }
  }
];

export const activeUsersColumns: (Props: {
  onCellClick: (arg: ActiveUsers) => void;
}) => ColumnDef<ActiveUsers>[] = ({ onCellClick }) => [
  {
    accessorKey: 'name',
    footer: (props) => props.column.id,
    header: () => <TableHeaderText label="SN" isFirstColumn />,
    cell: ({ row }) => (
      <p
        onClick={() => onCellClick(row.original)}
        className={'text-center text-bash px-2 py-3 transform -translate-x-4' + hoverFade}>
        {row.index + 1}
      </p>
    )
  },
  {
    accessorKey: 'name',
    header: () => <TableHeaderText label="Name" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => {
      let owner = row.original.owner;
      return (
        <p
          onClick={() => onCellClick(row.original)}
          className={` ${
            row.original.owner.firstName ? 'text-black' : 'text-bash'
          } font-Medium text-sm flex-1 truncate capitalize px-2 py-3 ${hoverFade}`}>
          {owner?.firstName
            ? owner.firstName + ' ' + owner.lastName
            : owner?.name
              ? owner.name
              : 'Pending'}
        </p>
      );
    }
  },
  {
    accessorKey: 'email',
    header: () => <TableHeaderText label="Email" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p
        onClick={() => onCellClick(row.original)}
        className={`font-Medium text-sm flex-1 truncate px-2 py-3` + hoverFade}>
        {row.original.owner.email}
      </p>
    )
  },
  {
    accessorKey: 'referrals',
    header: () => <TableHeaderText label="Number of Referrals" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p
        onClick={() => onCellClick(row.original)}
        className={'text-bash font-Medium text-sm flex-1 truncate px-2 py-3' + hoverFade}>
        {row.original.referrals.length}
      </p>
    )
  },
  {
    accessorKey: 'sched',
    header: () => <TableHeaderText label="Cash Disbursed" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p
        onClick={() => onCellClick(row.original)}
        className={'text-bash font-Medium w-full text-sm flex-1 truncate px-2 py-3' + hoverFade}>
        $ {row.original.amountDisbursed || 0}
      </p>
    )
  }
];

export const managerReferralColumns: (Props: {
  onCellClick: (user: Row<TAllReferral>) => void;
}) => ColumnDef<TAllReferral>[] = ({ onCellClick }) => [
  {
    accessorKey: 'name',
    footer: (props) => props.column.id,
    header: () => <TableHeaderText label="SN" isFirstColumn />,
    cell: ({ row }) => {
      return (
        <p
          onClick={() => onCellClick(row)}
          className={'text-center text-bash px-2 py-3 transform -translate-x-4' + hoverFade}>
          {row.index + 1}
        </p>
      );
    }
  },
  {
    accessorKey: 'name',
    header: () => <TableHeaderText label="Name" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p
        onClick={() => onCellClick(row)}
        className={`text-black font-Medium text-sm flex-1 truncate capitalize px-2 py-3 ${hoverFade}`}>
        {row.original.owner.name ||
          row.original.owner.firstName + ' ' + row.original.owner.lastName}
      </p>
    )
  },
  {
    accessorKey: 'email',
    header: () => <TableHeaderText label="Email" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p
        onClick={() => onCellClick(row)}
        className={`font-Medium text-sm flex-1 truncate px-2 py-3` + hoverFade}>
        {row.original.owner.email}
      </p>
    )
  },
  {
    accessorKey: 'referrals',
    header: () => <TableHeaderText label="Number of referrals" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p
        onClick={() => onCellClick(row)}
        className={'text-bash font-Medium text-sm flex-1 truncate px-2 py-3' + hoverFade}>
        {row.original.referrals}
      </p>
    )
  },
  {
    accessorKey: 'sched',
    header: () => <TableHeaderText label="Cash Disbursed" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p
        onClick={() => onCellClick(row)}
        className={'text-bash font-Medium w-full text-sm flex-1 truncate px-2 py-3' + hoverFade}>
        $ {row.original.amountRedeemed || 0}
      </p>
    )
  }
];

export const confirmedWithdrawalColumns: ColumnDef<TMiniWithdrawalRequest>[] = [
  {
    accessorKey: 'name',
    footer: (props) => props.column.id,
    header: () => <TableHeaderText label="SN" isFirstColumn />,
    cell: ({ row }) => (
      <p className={'text-center text-bash px-2 py-3 transform -translate-x-4'}>{row.index + 1}</p>
    )
  },
  {
    accessorKey: 'name',
    header: () => <TableHeaderText label="Name" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p
        className={` ${
          row.original.name ? 'text-black' : 'text-bash'
        } font-Medium text-sm flex-1 truncate capitalize px-2 py-3 ${hoverFade}`}>
        {row.original.name || 'Pending'}
      </p>
    )
  },
  {
    accessorKey: 'email',
    header: () => <TableHeaderText label="Email" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p className={`font-Medium text-sm flex-1 truncate px-2 py-3`}>{row.original.email}</p>
    )
  },
  {
    accessorKey: 'referrals',
    header: () => <TableHeaderText label="Amount Withdrawn" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p className={'text-bash font-Medium text-sm flex-1 truncate px-2 py-3'}>
        $ {row.original.amount}
      </p>
    )
  },
  {
    accessorKey: 'status',
    header: () => <TableHeaderText label="Status" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p
        className={` ${
          row.original.status === 'approved' ? 'text-bblue' : 'text-bred'
        } capitalize font-Medium text-base flex-1 truncate px-2 py-3`}>
        {row.original.status}
      </p>
    )
  },
  {
    accessorKey: 'requestedOn',
    header: () => <TableHeaderText label="Date Requested" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div>
        <Moment
          className={'text-bash font-Medium text-sm flex-1 truncate px-2 py-3'}
          format="DD MMM YYYY, HH:mm">
          {row.original.requestedOn}
        </Moment>
      </div>
    )
  },
  {
    accessorKey: 'completeOn',
    header: () => <TableHeaderText label="Date Completed" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div>
        <Moment
          className={'text-bash font-Medium text-sm flex-1 truncate px-2 py-3'}
          format="DD MMM YYYY, HH:mm">
          {row.original.completedOn}
        </Moment>
      </div>
    )
  }
];

export const pendingWithdrawalColumns: ColumnDef<Omit<TMiniWithdrawalRequest, 'completedOn'>>[] = [
  {
    accessorKey: 'name',
    footer: (props) => props.column.id,
    header: () => <TableHeaderText label="SN" isFirstColumn />,
    cell: ({ row }) => (
      <p className={'text-center text-bash px-2 py-3 transform -translate-x-4' + hoverFade}>
        {row.index + 1}
      </p>
    )
  },
  {
    accessorKey: 'name',
    header: () => <TableHeaderText label="Name" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p
        className={` ${
          row.original.name ? 'text-black' : 'text-bash'
        } font-Medium text-sm flex-1 truncate capitalize px-2 py-3 ${hoverFade}`}>
        {row.original.name || 'Pending'}
      </p>
    )
  },
  {
    accessorKey: 'email',
    header: () => <TableHeaderText label="Email" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p className={`font-Medium text-sm flex-1 truncate px-2 py-3` + hoverFade}>
        {row.original.email}
      </p>
    )
  },
  {
    accessorKey: 'referrals',
    header: () => <TableHeaderText label="Amount Withdrawn" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <p className={'text-bash font-Medium text-sm flex-1 truncate px-2 py-3' + hoverFade}>
        $ {row.original.amount}
      </p>
    )
  },
  {
    accessorKey: 'requestedOn',
    header: () => <TableHeaderText label="Date Requested" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div>
        <Moment
          className={'text-bash font-Medium text-sm flex-1 truncate px-2 py-3' + hoverFade}
          format="DD MMM YYYY, HH:mm">
          {row.original.requestedOn}
        </Moment>
      </div>
    )
  },
  {
    accessorKey: 'confirm',
    header: () => <TableHeaderText label="Action" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div>
        <CompleteModal
          title="Cash withdrawal request"
          toggleButton={<Button text="Confirm payment" />}>
          <ConfirmPaymentModal request={row.original} />
        </CompleteModal>
      </div>
    )
  }
];

interface IConfirmPaymentModal extends Partial<ChildComponentProps> {
  request: Omit<TMiniWithdrawalRequest, 'completedOn'>;
}

const ConfirmPaymentModal = ({ request, ...props }: IConfirmPaymentModal) => {
  const [status, setStatus] = useState<'approved' | 'declined'>();
  const [showMessageInput, setShowMessageInput] = useState(false);
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<{ message: string }>({
    reValidateMode: 'onChange',
    defaultValues: { message: '' },
    resolver: yupResolver(messageSchema(showMessageInput))
  });

  useEffect(() => {
    if (status) {
      submitHandler();
    }
  }, [status]);

  const { load, isLoading } = useFetch({
    onSuccess: () => {
      // refetch confirmed and pending requests
      queryClient.invalidateQueries({
        queryKey: [E_Referral_Keys.Withdrawal_Requests]
      });
      queryClient.invalidateQueries({
        queryKey: [E_Referral_Keys.Confirmed_Withdrawal]
      });
      // close modal
      if (props.toggleModal) props.toggleModal();
    }
  });

  const submitHandler = handleSubmit(({ message }) => {
    if (!request.referralCode || !status) return displayError('Missing referral code');

    load(
      confirmWithdrawRequest({
        status,
        requestId: request.requestId,
        referralCode: request.referralCode,
        message: status === 'approved' ? undefined : message
      })
    );
  });

  return (
    <Fragment>
      {showMessageInput ? (
        <InputField
          label="Message"
          placeholder="Enter here..."
          register={register('message')}
          error={errors.message?.message}
        />
      ) : (
        <p className="text-center text-base text-bash">
          Be advised this is an irreversible actions
        </p>
      )}
      <div className={flexer + 'mt-5'}>
        <Button text="Cancel" type="secondary" onClick={props.toggleModal} />
        <div className="flex items-center gap-3">
          {!showMessageInput && (
            <Button
              text="Confirm"
              isLoading={isLoading && status === 'approved'}
              onClick={() => {
                setStatus('approved');
              }}
            />
          )}
          <Button
            text="Decline"
            type="danger"
            isLoading={isLoading && status === 'declined'}
            onClick={() => {
              if (showMessageInput) {
                setStatus('declined');
              } else {
                setShowMessageInput(true);
              }
            }}
          />
        </div>
      </div>
    </Fragment>
  );
};
