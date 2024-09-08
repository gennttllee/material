import React, { useEffect, useState } from 'react';
import { VscChecklist } from 'react-icons/vsc';
import Tranch from './Tranch';
import { TranchesProps } from './types';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { openModal } from 'store/slices/financeSlice';
import useRole from 'Hooks/useRole';
const Tranches = ({ modalToggler, tranches }: TranchesProps) => {
  let user = useAppSelector((m) => m.user);
  let { data, modal } = useAppSelector((m) => m.finance);
  let dispatch = useAppDispatch();
  let { canSeeSnapshot, canAddTranch } = useRole();
  useEffect(() => {
    if (tranches.length === 0 || !tranches) {
      dispatch(openModal({ name: 'tranch', isEditing: false }));
    }
  }, []);
  return (
    <div className="w-full max-h-[100%] pb-10">
      <div className=" bg-white max-h-[100%] overflow-y-auto pb-6 flex flex-col items-center  relative rounded-md lg:w-1/2">
        <div className="w-full mt-6 px-6 flex mb-3 items-center justify-between">
          <span className="text-xl font-Medium">Payment Tranches</span>
          {canAddTranch ? (
            <span
              onClick={() => {
                dispatch(openModal({ name: 'tranch', isEditing: false }));
              }}
              className="text-sm cursor-pointer hover:underline text-borange">
              + Add Tranch
            </span>
          ) : null}
        </div>
        <div className="flex-1  overflow-y-auto flex flex-col items-center px-6 scrollbar w-full">
          {tranches.length > 0 ? (
            tranches.map((m, i) => <Tranch key={i} {...m} />)
          ) : (
            <div className="flex-col items-center flex my-12">
              <VscChecklist size={32} color="#77828D" />
              <p className="text-bash mt-2">No items created yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tranches;
