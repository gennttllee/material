import moment from 'moment';
import { StoreContext } from 'context';
import React, { useContext } from 'react';
import { flexer } from 'constants/globalStyles';
import { dateFormat } from '../../../constants';
import { TExpenditure } from 'store/slices/financeSlice';

const Transaction = ({ title, amount, createdAt }: TExpenditure) => {
  const { selectedProject } = useContext(StoreContext);
  return (
    <div className="my-2 p-4 rounded-md bg-ashShade-0">
      <div className={flexer}>
        <p
          title={title}
          className="font-Medium capitalize text-base text-black truncate flex-[.95]">
          {title}
        </p>
        <p className="text-bblue font-Medium">
          {selectedProject.currency?.code} {amount.toLocaleString()}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-bash text-xs mt-1">Created At: {moment(createdAt).format(dateFormat)}</p>
      </div>
    </div>
  );
};

export default Transaction;
